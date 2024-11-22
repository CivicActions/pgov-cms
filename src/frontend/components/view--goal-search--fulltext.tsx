import { FormEvent } from "react";
import { Search } from "@trussworks/react-uswds";

interface ViewGoalSearchFulltextProps {
  fulltext: string;
  setFulltext: (value: string) => void;
  handleSearch: (e: FormEvent) => void;
}

export function ViewGoalSearchFulltext({
  fulltext, setFulltext, handleSearch
}: ViewGoalSearchFulltextProps) {

  return (
    <form className="grid-row flex-justify-center usa-search usa-search--big margin-bottom-205" onSubmit={(e: FormEvent) => {handleSearch(e)}}>
      
      <label className="usa-sr-only" htmlFor="search-goals">Search goals</label>
      <input 
        id="search-goals"
        className="usa-input"
        name="search"
        type="search"
        value={fulltext}
        onChange={(e) => setFulltext(e.target.value)}
      />
      <button
        className="usa-button"
        type="submit"
      >
        Search goals
      </button>
    </form>
  );
}
