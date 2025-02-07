import { FormEvent } from "react";
import { Icon } from "@trussworks/react-uswds";


interface ViewGoalSearchFulltextProps {
  fulltext: string;
  setFulltext: (value: string) => void;
  handleSearch: (e: FormEvent) => void;
}

export function ViewGoalSearchFulltext({
  fulltext, setFulltext, handleSearch
}: ViewGoalSearchFulltextProps) {

  return (
    <form onSubmit={(e: FormEvent) => {handleSearch(e)}}>
      <div className="search-goals--wrapper padding-x-1">
        <label className="usa-sr-only" htmlFor="search-goals">Search goals</label>
        <input
          id="search-goals"
          className="radius-pill"
          name="Search goals"
          type="search"
          placeholder="Search the U.S. government at work"
          value={fulltext}
          onChange={(e) => setFulltext(e.target.value)}
        />
        <button
          className="text-bold padding-left-3 padding-y-1"
          type="submit"
        >
          <Icon.Search size={3} className="search-icon"/>
        </button>
      </div>
    </form>
  );
}
