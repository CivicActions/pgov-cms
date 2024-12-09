import { useEffect } from "react";
import Head from "next/head";
import { drupal } from "lib/drupal";
import { Layout } from "components/layout";
import GoalsSearchView from "components/view--goal-search";
import { NodeGoalProps, ViewFilter } from "lib/types";

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
      query: `query GoalsQuery {
        goalsGraphql1 {
          pageInfo {
            total
          }
          filters {
            options
            value
          }
          description
          results {
            ... on NodeGoal {
              id
              title
              path
              body {
                value
              }
              
              topics {
                ... on TermTopic {
                  id
                  name
                }
              }
            }
          }
        }
      }`,
    }),
  });

  // agencies {
  //   ... on NodeAgency {
  //     id
  //     title
  //     path
  //   }
  // }

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
  // useEffect(() => {
  //   async function fetchjsonapi() {
  //     const url = "https://performance.ddev.site/jsonapi/storage/indicator"
  //     try {
  //       const response = await fetch(url);
  //       if (!response.ok) {
  //         throw new Error(`Response status: ${response.status}`);
  //       }
    
  //       const json = await response.json();
  //       console.log(json);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   }
  //   fetchjsonapi()
  // }, [])


  return (
    <Layout>
      <Head>
        <title>Performance.gov</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
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
