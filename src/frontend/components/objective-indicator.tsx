import { formatDate } from "lib/utils";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useState } from "react";
import { Icon } from "@trussworks/react-uswds";
import IndicatorChart from "./indicator-chart";

const ObjectiveIndicator = ({indicator, borders}) => {
  const [open, setOpen] = useState(false)
  const { name, measurements } = indicator;
  return(
    <div className={`objective-indicator text-no-underline font-sans-md text-base-darkest ${borders}`}>
      <button 
        onClick={() => setOpen(!open)}
        className="padding-2 grid-row objective-indicator-button"
      >
        <span className="objective-name flex-1">{name}</span>
        {indicator.progress
          && (
            <div className="grid-row margin-right-2">
              <progress className="margin-right-2" value={indicator.progress} max={100} />
              <span>{indicator.progress}%</span>
            </div>
          )
        }
        {open
        ? <Icon.ExpandLess aria-hidden={true} size={3} />
        : <Icon.ExpandMore aria-hidden={true} size={3} />
        }
      </button>
      {open &&
        <div className="grid-row padding-2">
         <div>
          {(measurements && measurements.length > 0) && (
            <table className="usa-table usa-table--stacked width-full">
              <caption className="usa-sr-only">
                Date and result measurements for the {name} performance indicator.
              </caption>
              <thead>
                <tr>
                  <th>Start date</th>
                  <th>End date</th>  
                  <th>Actual result</th>
                  <th>Target result</th>
                </tr>
              </thead>
              <tbody>
                {measurements?.map((measurement) => (
                  <tr key={measurement.id}>
                    <td>{formatDate(measurement.period?.dateRange?.start.time)}</td>
                    <td>{formatDate(measurement.period?.dateRange?.end.time)}</td>
                    <td>{measurement.value ? measurement.value : "N/A"}</td>
                    <td>{measurement.targetValue ? measurement.targetValue : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
          <IndicatorChart
            names={indicator.names}
            values={indicator.values}
            targetValues={indicator.targetValues}
            size={"large"}
          />
          {indicator.notes?.processed && (
            <div dangerouslySetInnerHTML={{ __html: indicator.notes?.processed }} />
          )}
        </div>
      }
    </div>
  );
}

export default ObjectiveIndicator;