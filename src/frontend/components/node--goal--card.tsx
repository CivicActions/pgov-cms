import Link from 'next/link'
import { NodeGoalProps } from "lib/types";
import { truncateString } from "lib/utils";

interface NodeGoalCardProps {
  goal: NodeGoalProps
}

export function NodeGoalCard({ goal, ...props }: NodeGoalCardProps) {
  const { title, body, path } = goal;
  return (
    <div className="usa-card__container radius-0" >
      <div className="usa-card__header">
        <h4 className="usa-card__heading">{truncateString(title, 30)}</h4>
      </div>
      {body?.value &&
        <div className="usa-card__body">
          <div dangerouslySetInnerHTML={{__html: truncateString(body?.value, 60)}} />
        </div>
      }
      <div className="usa-card__footer">
        <Link href={path} className="usa-button">
          Explore goal
        </Link>
      </div>
    </div>
  );
}
