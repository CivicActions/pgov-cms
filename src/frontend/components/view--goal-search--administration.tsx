import { FormEvent } from "react";


export function ViewGoalSearchAdministration() {
  return (
    <form className="usa-form">
      <label className="usa-sr-only" htmlFor="options">Dropdown label</label>
      <select className="search-goals--administration padding-x-2 padding-y-1 text-bold" name="options" id="options">
        <option value>- Select -</option>
        <option value="value1">Option A</option>
        <option value="value2">Option B</option>
        <option value="value3">Option C</option>
      </select>
    </form>
  );
}
