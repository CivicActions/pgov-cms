import Image from "next/image";
import Link from "next/link";
import { DrupalNode } from "next-drupal";

import { absoluteUrl, formatDate } from "lib/utils";

interface NodeAgencyCardProps {
  node: DrupalNode;
}

export function NodeAgencyCard({ node, ...props }: NodeAgencyCardProps) {
  return (
    <article {...props}>
      <Link href={node.path.alias} className="no-underline hover:text-blue-600">
        <h2 className="font-heading-2xl">{node.title}</h2>
      </Link>
      <div className="mb-4 text-gray-600">
        {node.uid?.display_name ? (
          <span>
            Posted by{" "}
            <span className="font-semibold">{node.uid?.display_name}</span>
          </span>
        ) : null}
        <span> - {formatDate(node.created)}</span>
      </div>
      {node.field_image && (
        <figure className="">
          <Image
            src={absoluteUrl(node.field_image.uri.url)}
            width={768}
            height={480}
            alt={node.field_image.resourceIdObjMeta.alt}
          />
        </figure>
      )}
      <Link href={node.path.alias} className="">
        Read article
      </Link>
    </article>
  );
}
