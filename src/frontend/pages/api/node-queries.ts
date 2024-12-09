export const nodeQueries = {
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
}
