import { Layout } from "components/layout";
import { NodeAgencyCard } from "../components/node--agency--card";
import { drupal } from "lib/drupal";

export async function getStaticProps() {
  const graphqlUrl = drupal.buildUrl("/graphql");

  // Fetch the first 50 agencies
  const response = await drupal.fetch(graphqlUrl.toString(), {
    method: "POST",
    withAuth: true, // Make authenticated requests using OAuth.
    body: JSON.stringify({
      query: `
        query {
  nodeAgencies(first: 50) {
    edges {
      node {
        id
        title
        logo {
          ... on MediaImage {
            id
            name
            mediaImage {
              alt
              title
              url
            }
          }
        }
        body {
          value
        }
        link {
          url
        }
        path
      }
    }
  }
}
      `,
    }),
  });

  const { data } = await response.json();

  return {
    props: {
      agencies: data?.nodeAgencies?.edges ?? [],
    },
  };
}

export default function AgenciesPage({ agencies }) {
  return (
    <Layout>
      <div>
        <h1 className="font-sans-3xl">Explore federal goals</h1>
        {agencies?.length ? (
          agencies.map((node) => (
            <div key={node.id}>
              <NodeAgencyCard node={node} />
            </div>
          ))
        ) : (
          <p className="">No agencies found</p>
        )}
      </div>
    </Layout>
  );
}
