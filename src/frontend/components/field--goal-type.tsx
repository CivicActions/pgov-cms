export function FieldGoalType({field_goal_type}) {
  let goalTypeName = "";
  let goalTypeClasses = "";
  switch (field_goal_type) {
    case "apg":
      goalTypeName = "Agency priority goal";
      goalTypeClasses = "bg-primary-vivid";
      break;
    case "strategic":
      goalTypeName = "Strategic goal";
      goalTypeClasses = "bg-base-darkest";
      break;
    default:
      goalTypeClasses = "bg-base";
      break;
  }

  return (
    <div className={`goal-type goal-type--${field_goal_type}`}>
      <span className={`usa-tag ${goalTypeClasses} text-white`}>
        {goalTypeName}
      </span>
    </div>
  );
}



