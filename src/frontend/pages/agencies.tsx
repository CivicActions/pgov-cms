import { Layout } from "components/layout";
import { NodeAgencyCard } from "../components/node--agency--card";
import { drupal } from "lib/drupal";

export const getStaticProps = async () => {
  const graphqlUrl = drupal.buildUrl("/graphql");

  // Fetch the first 50 agencies
  const response = await drupal.fetch(graphqlUrl.toString(), {
    method: "POST",
    withAuth: true, // Make authenticated requests using OAuth.
    body: JSON.stringify({
      query: `query AgencyQuery {
  nodeAgencies(first: 50) {
    nodes {
      id
      title
      logo {
        ... on MediaImage {
          mediaImage {
            alt
            url
            title
          }
        }
      }
      path
    }
  }
}`,
    }),
  });

  const { data } = await response.json();

  return {
    props: {
      agencies: data?.nodeAgencies?.nodes ?? [],
    },
  };
};

export default function AgenciesPage({ agencies }) {
  return (
    <Layout>
      <div>
        <h1 className="font-sans-3xl">Explore federal goals</h1>
        <ul className="usa-card-group">
          {agencies?.length ? (
            agencies.map((node) => (
              <li
                key={node.id}
                className="usa-card tablet-lg:grid-col-6 desktop:grid-col-4"
              >
                <NodeAgencyCard node={node} />
              </li>
            ))
          ) : (
            <p className="">No agencies found</p>
          )}
        </ul>
      </div>
    </Layout>
  );
}
