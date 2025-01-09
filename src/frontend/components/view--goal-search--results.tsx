import { FormEvent } from "react";
import { Search } from "@trussworks/react-uswds";

interface ViewGoalSearchResultsProps {
  
}

export function ViewGoalSearchResults({}: ViewGoalSearchResultsProps) {

  return (
    <div>
      results
    </div>
  );
}

// {/* {displayGoals?.length ? (
//         <ul className="usa-card-group">
//           {displayGoals && displayGoals.map((goal) => (
//             <li
//               key={goal.id}
//               className="usa-card tablet-lg:grid-col-6 desktop:grid-col-4"
//             >
//               <NodeGoalCard goal={goal} />
//             </li>
//           ))}
//         </ul>
//       ) : (
//           <div className="usa-alert usa-alert--warning usa-alert--slim">
//             <div className="usa-alert__body">
//               <p className="usa-alert__text">
//                 No matching goals.
//               </p>
//             </div>
//           </div>
//         )}

//       <div className="grid-row flex-justify-center margin-bottom-205">
//         {offset < filteredGoalsCount &&
//           <Button
//             type="button"
//             onClick={() => setOffset(offset + 9)}
//           >
//             Show more
//           </Button>
//         }
//       </div> */}