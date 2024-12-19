import { useEffect } from "react";
import Head from "next/head";
import { drupal } from "lib/drupal";
import { Layout } from "components/layout";
import GoalsSearchView from "components/view--goal-search";
import { NodeGoalProps, ViewFilter } from "lib/types";
import { graphqlQueries } from "lib/graphqlQueries";

interface IndexPageProps {
  goals: Array<NodeGoalProps>,
  description: string,
  filters: Array<ViewFilter>,
  total: number,
}

export const getStaticProps = async () => {
  const graphqlUrl = drupal.buildUrl("/graphql");
  // Fetch all goals from goals search view, with filters.
  const response = await drupal.fetch(graphqlUrl.toString(), {
    method: "POST",
    withAuth: true, // Make authenticated requests using OAuth.
    body: JSON.stringify({
      query: graphqlQueries.goalsView("", []),
    }),
  });
  const { data } = await response.json();
  return {
    props: {
      goals: data?.goalsGraphql1?.results ?? [],
      filters: data?.goalsGraphql1?.filters ?? [],
      total: data?.goalsGraphql1?.pageInfo?.total ?? 0,
      description: data?.goalsGraphql1?.description ?? "",
    },
  };
};

export default function IndexPage(props: IndexPageProps) {
  console.log(props)
  return (
    <Layout>
      <Head>
        <title>Performance.gov</title>
        <meta
          name="description"
          content="Track the U.S. Government's goals."
        />
      </Head>
      <div className="grid-container">
        <GoalsSearchView
          filters={props.filters}
          goals={props.goals}
          total={props.total}
          description={props.description}
        />
      </div>
    </Layout>
  );
}
