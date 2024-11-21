import Image from "next/image"
import { DrupalNode } from "next-drupal"
import { InPageNavigation } from "@trussworks/react-uswds";
import { absoluteUrl, formatDate } from "lib/utils"

interface NodeAgencyProps {
  node: DrupalNode
}

export function NodeAgency({ node, ...props }: NodeAgencyProps) {
  console.log(node);
  return (
    <>
      <div className="grid-row">
        <div className="desktop:grid-col-9">
          <h1 className="font-sans-3xl">{node.title}</h1>
        </div>
        <div className="desktop:grid-col-3">
          {node.field_logo && (
              <Image
                src={absoluteUrl(node.field_logo.field_media_image.uri.url)}
                width={150}
                height={150}
                alt={node.field_logo.name}
                priority
                className="margin-top-3"
              />
          )}
        </div>
      </div>
      <InPageNavigation content={
        <main id="main-content" className="main-content">
          <h2 className="font-sans-2xl">Mission</h2>
          {node.body?.processed && (
            <div
              dangerouslySetInnerHTML={{__html: node.body?.processed}}
              className="font-body-md"
            />
          )}
          <h2 className="font-sans-2xl">Related Resources</h2>
          <ul>
            <li>
              <a href={node.field_link.uri} target="_blank">Visit
                the {node.field_acronym} website</a>
            </li>
          </ul>
        </main>
      }/>
    </>
  )
}
