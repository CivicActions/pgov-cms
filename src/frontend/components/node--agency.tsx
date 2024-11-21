import Image from "next/image"
import { DrupalNode } from "next-drupal"

import { absoluteUrl, formatDate } from "lib/utils"

interface NodeAgencyProps {
  node: DrupalNode
}

export function NodeAgency({ node, ...props }: NodeAgencyProps) {
  console.log(node);
  return (
    <article {...props} className="grid-container">
      <div className="usa-in-page-nav-container">
        <aside className="usa-in-page-nav">
          {node.field_image && (
            <figure>
              <Image
                src={absoluteUrl(node.field_logo.uri.url)}
                width={768}
                height={400}
                alt={node.field_logo.resourceIdObjMeta.alt}
                priority
              />
              {node.field_logo.resourceIdObjMeta.title && (
                <figcaption className="py-2 text-sm text-center text-gray-600">
                  {node.field_logo.resourceIdObjMeta.title}
                </figcaption>
              )}
            </figure>
          )}
        </aside>
        <main id="main-content" className="main-content">
          <h1 className="font-heading-3xl">{node.title}</h1>
          <h2 className="font-heading-2xl">Mission</h2>
          {node.body?.processed && (
            <div
              dangerouslySetInnerHTML={{__html: node.body?.processed}}
              className="mt-6 font-serif text-xl leading-loose prose"
            />
          )}
          <h2 className="font-heading-2xl">Related Resources</h2>
          <ul>
            <li>
              <a href={node.field_link.uri} target="_blank">Visit the {node.field_acronym} website</a>
            </li>
          </ul>
        </main>
      </div>
    </article>
  )
}
