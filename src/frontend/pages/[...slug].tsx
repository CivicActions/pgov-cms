import { GetStaticPathsResult, GetStaticPropsResult } from "next";
import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import Head from "next/head";
import { DrupalNode } from "next-drupal";
import { drupal } from "lib/drupal";
import { NodeArticle } from "components/node--article";
import { NodeBasicPage } from "components/node--basic-page";
import { NodeAgency } from "../components/node--agency";
import { NodeGoal } from "components/node--goal";
import { Layout } from "components/layout";
import { graphqlQueries } from "../lib/graphqlQueries";

const RESOURCE_TYPES = ["node--page", "node--article", "node--agency", "node--goal"];

interface NodePageProps {
  resource: DrupalNode;
  storageData: any;
  planData: any;
}

export default function NodePage({ resource, storageData, planData }: NodePageProps) {
  if (!resource) return null;

  return (
    <Layout>
      <Head>
        <title>{resource.title}</title>
        <meta name="description" content="A Next.js site powered by Drupal." />
      </Head>
      {resource.type === "node--page" && <NodeBasicPage node={resource} />}
      {resource.type === "node--article" && <NodeArticle node={resource} />}
      {resource.type === "node--agency" && <NodeAgency node={resource} planData={planData} />}
      {resource.type === "node--goal" && <NodeGoal node={resource} storageData={storageData} />}
    </Layout>
  );
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  return {
    paths: await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context),
    fallback: "blocking",
  };
}

export async function getStaticProps(
  context,
): Promise<GetStaticPropsResult<NodePageProps>> {
  const path = await drupal.translatePathFromContext(context);

  if (!path) {
    return {
      notFound: true,
    };
  }

  const type = path.jsonapi.resourceName;
  const params = new DrupalJsonApiParams();

  if (type === "node--article") {
    params.addInclude(["field_image, uid"]);
  } else if (type === "node--agency") {
    params.addInclude(["field_logo.field_media_image"]);//missing field topics
  } else if (type === "node--goal") {
    params.addInclude([
      "field_topics",
      "field_objectives",
      // Can't pull storage entities via JS module.
      // "field_objectives.field_indicators",
      // "field_objectives.field_indicators.field_measurements",
      "field_plan",
      "field_plan.field_agency",
      "field_plan.field_agency.field_logo",
      "field_plan.field_agency.field_logo.field_media_image"
    ]);
    params.addFields("node--plan", ["field_agency", "title"]);
    params.addFields("node--objective", ["title", "body", "field_indicators"]);
  }

  const resource = await drupal.getResourceFromContext<DrupalNode>(
    path,
    context,
    {
      params: params.getQueryObject(),
    },
  );

  // At this point, we know the path exists and it points to a resource.
  // If we receive an error, it means something went wrong on Drupal.
  // We throw an error to tell revalidation to skip this for now.
  // Revalidation can try again on next request.
  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && resource?.status === false) {
    return {
      notFound: true,
    };
  }

  let storageData = {};
  let planData = {}

  if (type === "node--goal") {
    const graphqlUrl = drupal.buildUrl("/graphql");
    const response = await drupal.fetch(graphqlUrl.toString(), {
      method: "POST",
      withAuth: true, // Make authenticated requests using OAuth.
      body: JSON.stringify({
        query: graphqlQueries.nodeGoal(path?.entity?.path),
      }),
    });
    const { data } = await response.json();
    storageData = data?.route?.entity;
  } else if (type === "node--agency") {
    const agencyId = parseInt(path?.entity?.id);
    const graphqlUrl = drupal.buildUrl("/graphql");
    const response = await drupal.fetch(graphqlUrl.toString(), {
      method: "POST",
      withAuth: true, // Make authenticated requests using OAuth.
      body: JSON.stringify({
        query: graphqlQueries.planNodeByAgency(agencyId),
      }),
    });
    const { data } = await response.json();
    planData = data.strategicPlansByAgencyGraphql1.results;
  }

  return {
    props: {
      resource,
      storageData,
      planData
    },
  };
}
