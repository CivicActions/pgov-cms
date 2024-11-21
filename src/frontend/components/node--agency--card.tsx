import Image from "next/image";
import Link from "next/link";
import { DrupalNode } from "next-drupal";

import { absoluteUrl, formatDate } from "lib/utils";

interface NodeAgencyCardProps {
  node: DrupalNode;
}

export function NodeAgencyCard({ node, ...props }: NodeAgencyCardProps) {
  console.log(node);
  return (
    <div className="usa-card__container" {...props}>
      <div className="usa-card__body">
        {node.logo && (
          <Image
            src={node.logo.mediaImage.url}
            width={150}
            height={150}
            alt={node.logo.mediaImage.alt}
            priority
            className="margin-top-3"
          />
        )}
      </div>
      <div className="usa-card__header">
        <h4 className="usa-card__heading">{node.title}</h4>
      </div>
      <div className="usa-card__footer">
        <a href={node.path} className="usa-button">Explore agency goals</a>
      </div>
    </div>
  );
}
