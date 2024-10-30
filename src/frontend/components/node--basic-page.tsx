import { DrupalNode } from "next-drupal"

interface NodeBasicPageProps {
  node: DrupalNode
}

export function NodeBasicPage({ node, ...props }: NodeBasicPageProps) {
  return (
    <article {...props}>
      <h1 className="">{node.title}</h1>
      {node.body?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: node.body?.processed }}
          className=""
        />
      )}
    </article>
  )
}
