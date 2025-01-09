import { useState, useEffect, FormEvent } from "react";
import { Button } from "@trussworks/react-uswds";
import { NodeGoalProps, ViewFilter } from "lib/types";
import { NodeGoalCard } from "./node--goal--card";
import { ViewGoalSearchFacet } from "./view--goal-search--facet";
import { ViewGoalSearchFulltext } from "./view--goal-search--fulltext";
import { ViewGoalSearchResults } from "./view--goal-search--results";

interface ViewGoalSearch {
  goals: Array<NodeGoalProps>,
  description: string,
  filters: Array<ViewFilter>,
  total: number
}

async function getData(fulltext: string) {
  const url = `/api/goal-search?fulltext=${fulltext}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    
    const { data } = await response.json();
    console.log(data);
    return {
      goals: data?.goalsGraphql1?.results ?? [],
      filters: data?.goalsGraphql1?.filters ?? [],
      total: data?.goalsGraphql1?.pageInfo?.total ?? 0,
      description: data?.goalsGraphql1?.description ?? "",
    };
  } catch (error) {
    console.error(error.message);
  }
  
}

export default function GoalsSearchView({ filters, goals, total, description }: ViewGoalSearch) {
  const [fulltext, setFulltext] = useState(filters[0]?.value ? filters[0].value : "")
  const [displayGoals, setDisplayGoals] = useState(goals)
  const [facets] = useState(filters[1] ? [...Object.keys(filters[1]?.options)] : [])
  const [search, setSearch] = useState(false);
  const [offset, setOffset] = useState(9);
  const [activeTopics, setActiveTopics] = useState([])
  const [notDisabledTopics, setNotDisabledTopics] = useState([])
  const [filteredGoals, setFilteredGoals] = useState([...goals])
  const [filteredGoalsCount, setFilteredGoalsCount] = useState(total)

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    const url = `/api/goal-search?fulltext=${fulltext}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    
      const { data } = await response.json();
      console.log(data)
      setDisplayGoals(data?.goalsGraphql1?.results ?? [])
      setFilteredGoalsCount(data?.goalsGraphql1?.pageInfo?.total ?? 0)
      // console.log(data);
      // return {
      //   goals: data?.goalsGraphql1?.results ?? [],
      //   filters: data?.goalsGraphql1?.filters ?? [],
      //   total: data?.goalsGraphql1?.pageInfo?.total ?? 0,
      //   description: data?.goalsGraphql1?.description ?? "",
      // };
    } catch (error) {
      console.error(error.message);
    }
  }

  function updateTopicFilters(topic) {
    let currentFilters = [...activeTopics];
    const topicIndex = currentFilters.indexOf(topic);
    if (topicIndex > -1) {
      currentFilters.splice(topicIndex, 1);
    } else {
      currentFilters.push(topic)
    }
    setActiveTopics(currentFilters)
  }

  // function filterGoals(resetOffset = false) {
  //   console.log("dg", displayGoals)
  //   let currentGoals = [...displayGoals];
  //   let notDisabled = []
  //   // if(fulltext.length > 0) {
  //   //   currentGoals = currentGoals.filter((goal) => {
  //   //     let hasFulltext = false;
  //   //     const searchFields = [goal?.body?.value, goal.title];
  //   //     searchFields.forEach((field) => {
  //   //       if(field && field.toLowerCase().includes(fulltext.toLowerCase())) {
  //   //         hasFulltext = true
  //   //         if (goal.topics?.length) {
  //   //           goal.topics.forEach((topic) => {
  //   //             if(!notDisabled.includes(topic.name)) {
  //   //               notDisabled.push(topic.name)
  //   //             }
  //   //           })
  //   //         }
  //   //       }
  //   //     })

  //   //     if(hasFulltext ) {
          
  //   //       return goal
  //   //     } else {
  //   //       return null
  //   //     }
  //   //   })
      
  //   // }

  //   if (activeTopics.length > 0) {
  //     currentGoals = currentGoals.filter((goal) => {
  //       let hasActiveTopic = false
  //       if (!goal.topics) {
  //         return null;
  //       }
  //       goal.topics.forEach((topic) => {
  //         if(activeTopics.indexOf(topic.name) > -1) {
  //           hasActiveTopic = true
  //         }
  //       })
  //       if(hasActiveTopic) {
  //         return goal
  //       } else {
  //         return null
  //       }
  //     })
  //   }

  //   setNotDisabledTopics(notDisabled)
  //   setFilteredGoalsCount(currentGoals.length)
    
  //   if (resetOffset) {
  //     currentGoals = currentGoals.slice(0, 9);
  //     setOffset(9)
  //   } else {
  //     currentGoals = currentGoals.slice(0, offset);
  //   }
  //   setFilteredGoals(currentGoals)
  //   setSearch(false)
  // }

  // useEffect(() => {
  //   if(search) {
  //     filterGoals(true)
  //   }
  // }, [search])

  // useEffect(() => {
  //   filterGoals(true)
  // }, [activeTopics])

  // useEffect(() => {
  //   filterGoals()
  // }, [offset])

  // useEffect(() => {
  //   filterGoals()
  // }, [displayGoals])

  return (
    <div>
      <div className="grid-row flex-justify-center">
        <h1 className="font-heading-2xl">{description}</h1>
      </div>
      <ViewGoalSearchFulltext
        fulltext={fulltext}
        setFulltext={setFulltext}
        handleSearch={handleSearch}
      />
      <ul className="add-list-reset grid-row flex-justify-center margin-bottom-205">
        {facets.length ? (
          facets.map((topic) => (
            <li
              className="margin-bottom-05"
              key={topic.replace( /\s/g, '')}
            >
              <ViewGoalSearchFacet
                topic={topic}
                notDisabledTopics={notDisabledTopics}
                activeTopics={activeTopics}
                updateTopicFilters={updateTopicFilters}
              />
            </li>
          ))
        ) : (
          <div className="usa-alert usa-alert--warning usa-alert--slim">
            <div className="usa-alert__body">
              <p className="usa-alert__text">
                No facets found.
              </p>
            </div>
          </div>
        )}
      </ul>
      <ViewGoalSearchResults />
      {/* {displayGoals?.length ? (
        <ul className="usa-card-group">
          {displayGoals && displayGoals.map((goal) => (
            <li
              key={goal.id}
              className="usa-card tablet-lg:grid-col-6 desktop:grid-col-4"
            >
              <NodeGoalCard goal={goal} />
            </li>
          ))}
        </ul>
      ) : (
          <div className="usa-alert usa-alert--warning usa-alert--slim">
            <div className="usa-alert__body">
              <p className="usa-alert__text">
                No matching goals.
              </p>
            </div>
          </div>
        )}

      <div className="grid-row flex-justify-center margin-bottom-205">
        {offset < filteredGoalsCount &&
          <Button
            type="button"
            onClick={() => setOffset(offset + 9)}
          >
            Show more
          </Button>
        }
      </div> */}
    </div>
  );
}
