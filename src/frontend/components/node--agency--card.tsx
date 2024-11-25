import Image from "next/image";
import Link from 'next/link';
import { DrupalNode } from "next-drupal";

interface NodeAgencyCardProps {
  node: DrupalNode;
}

export function NodeAgencyCard({ node, ...props }: NodeAgencyCardProps) {
  return (
    <div className="usa-card__container radius-0" {...props}>
      <div className="usa-card__body text-center">
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
        <Link href={{
          pathname: `/agencies/${node.acronym.toLowerCase()}`
        }} className="usa-button">
          Explore agency goals
        </Link>
      </div>
    </div>
  );
}
