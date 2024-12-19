export const graphqlQueries = {
  nodeGoal: (path: string) => (
    `query NodeGoalQuery {
      route(path: "${path}") {
        ... on RouteInternal {
          entity {
            __typename
            ... on NodeGoal {
              objectives {
                ... on NodeObjective {
                  id
                  title
                  indicators {
                    ... on StorageIndicator {
                      id
                      name
                      notes {
                        processed
                      }
                      measurements {
                        ... on StorageMeasurement {
                          id
                          name
                          targetValue
                          value
                          status
                          period {
                            ... on StoragePeriod {
                              id
                              name
                              duration
                              dateRange {
                                end {
                                  time
                                }
                                start {
                                  time
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`
  ),
  planNodeByAgency: (id: number) => (
    `query StrategicPlansByAgency {
   strategicPlansByAgencyGraphql1(filter: {field_agency_target_id: ${id}}) {
     pageInfo {
       total
     }
     results {
       ... on NodePlan {
         id
         title
         link {
           url
         }
         goals {
           ... on NodeGoal {
             id
             fieldId
             title
             goalType
             path
           }
         }
       }
     }
   }
 }`
  ),
  goalsView: (fulltext: string, facets: Array<string>) => (
    `query GoalsQuery {
        goalsGraphql1(filter: {
          aggregated_field: "${fulltext}",
          Topics: [${facets}],
        }) {
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
      }`
  ),
}
