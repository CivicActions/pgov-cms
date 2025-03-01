import { useState, FormEvent, useCallback } from "react";
import { Button } from "@trussworks/react-uswds";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { NodeGoalProps, NodePlanProps, ViewFilter } from "lib/types";
import { NodeGoalCard } from "./node--goal--card";
import { NodePlanCard } from "./node--plan--card";
import { StorageIndicatorCard } from "./storage--indicator--card";
import { ViewGoalSearchFulltext } from "./view--goal-search--fulltext";
import ViewGoalFacets from "./view--goal-facets";
import CustomButton from "./button--custom";

interface ViewGoalSearch {
  goals: Array<NodeGoalProps | NodePlanProps>,
  description: string,
  filters: Array<ViewFilter>,
  total: number
}

const renderCard = (goal: any) => {
  if(goal.goalType) {
    return <NodeGoalCard key={goal.id} goal={goal} />;
  } else if(goal.agency) {
    return <NodePlanCard key={goal.id} goal={goal} />;
  } else if(goal.objective?.indicators) {
    return <StorageIndicatorCard key={goal.id} goal={goal} />;
  } else {
    return <p>Error</p>
  }
}

export default function GoalsSearchView({ filters, goals, total, description }: ViewGoalSearch) {
  const offsetAmount = 15;
  const [fulltext, setFulltext] = useState(filters[0]?.value ? filters[0].value : "");
  const [administration, setAdministration] = useState("53");
  const [totalResults, setTotalResults] = useState(total)
  const [displayGoals, setDisplayGoals] = useState(goals);
  const [viewType, setViewType] = useState([]);
  const [facets, setFacets] = useState(filters[1]?.options ? filters[1].options : [])
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [offset, setOffset] = useState(offsetAmount);

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };
  const handleSearch = useCallback(async (e: FormEvent, facets: Array<string> = []) => {
    if (e) {
      e.preventDefault();
    }
    const cleanFacets = facets.map((f) => encodeURIComponent(f));
    const url = `/api/goal-search?fulltext=${fulltext}&facets=${cleanFacets}&administration=${administration}&type=${viewType}`;
    setOffset(offsetAmount)
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const { data } = await response.json();
      setDisplayGoals(data?.goalsGraphql1?.results ?? []);
      setTotalResults(data?.goalsGraphql1?.pageInfo.total);
      setFacets(data?.goalsGraphql1?.filters[1].options)
    } catch (error) {
      console.error(error.message);
    }
  }, [fulltext, administration, viewType])



  const masonryBP = filtersOpen ? {350: 1, 750: 2, 1400: 3} : {350: 1, 750: 2, 1060: 3, 1400: 4};
  return (
    <div>
      <div className="grid-row flex-column flex-align-center hero text-white padding-y-5">
        <h1 className="font-heading-2xl">{description}</h1>
        <p className="font-sans-lg margin-y-0">Smart Strategy. Strong Execution.</p>
        <p className="font-sans-lg margin-top-0">Data-Driven Updates on America’s Strategic Goals.</p>
      </div>
      <div className={`position-relative ${filtersOpen ? "container-open" : ""}`}> 
        <div className="grid-row flex-row flex-align-center padding-x-205 padding-y-105 bg-white search-goals--container">
          <div className={`side-bar filter-bar position-absolute ${filtersOpen ? "" : "filters-closed"}`}>
            <ViewGoalFacets handleSearch={handleSearch} handleClose={toggleFilters} />
          </div>
          {!filtersOpen && (
            <div className="grid-col flex-auto">
              <CustomButton
                text="Filter by topic"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`search-goals--filter ${filtersOpen ? `button--is-open` : ``}`}
              />
            </div>
          )}
          <div className="grid-col flex-fill">
            <ViewGoalSearchFulltext
              fulltext={fulltext}
              setFulltext={setFulltext}
              handleSearch={handleSearch}
            />
          </div>
          <div className="grid-col flex-auto">
            <form className="usa-form">
              <label className="usa-sr-only" htmlFor="options">Dropdown label</label>
              <select className="search-goals--administration padding-left-105 padding-right-3 padding-y-1 text-bold"
                      name="options" id="options" value={administration} onChange={e => setAdministration(e.target.value)}>
                <option value="53">Trump 47</option>
                <option value="55">Trump 45</option>
              </select>
            </form>
          </div>
        </div>
        <div className="grid-row margin-y-3 padding-x-205 padding-y-105 overflow-hidden">
          <ul className="add-list-reset search-goals--toggle hr-lines">
            <li>
              <CustomButton
                onClick={() => setViewType([])}
                className={`radius-pill ${viewType.length === 0 ? "active" : ""}`}
                text={"Everything"}
              />
            </li>
            <li>
              <CustomButton
                onClick={() => setViewType(["plan"])}
                className={`radius-pill ${(viewType.length > 0 && viewType[0]) === "plan" ? "active" : ""}`}
                text={"Plans"}
                />
            </li>
            <li>
              <CustomButton
                onClick={() => setViewType(["goal"])}
                className={`radius-pill ${(viewType.length > 0 && viewType[0]) === "goal" ? "active" : ""}`}
                text={"Goals"}
              />
            </li>
            <li>
              <CustomButton
                onClick={() => setViewType(["indicator"])}
                className={`radius-pill ${(viewType.length > 0 && viewType[0]) === "indicator" ? "active" : ""}`}
                text={"Indicators"}
              />
            </li>
          </ul>
        </div>

        <div className="grid-row">
          <div className="content-area">
            {displayGoals?.length ? (
              <ResponsiveMasonry
                columnsCountBreakPoints={masonryBP}
                gutterBreakpoints={{350: "12px", 750: "16px", 900: "24px"}}
            >
                <Masonry>
                  {displayGoals.slice(0, offset).map((goal) => {
                    return renderCard(goal)
                  })}
                </Masonry>
            </ResponsiveMasonry>

          ) : (
              <div className="usa-alert usa-alert--warning usa-alert--slim">
                <div className="usa-alert__body">
                  <p className="usa-alert__text">
                    No matching results.
                  </p>
                </div>
              </div>
            )}

          <div className="grid-row flex-justify-center margin-bottom-205">
            {offset < totalResults &&
              <Button
                type="button"
                onClick={() => setOffset(offset + offsetAmount)}
              >
                Show more
              </Button>
            }
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}