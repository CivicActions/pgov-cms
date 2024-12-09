import { DrupalNode } from "next-drupal";
import { USABreadcrumb } from "./usa--breadcrumb";
import { USAInPageNav } from "./usa--in-page-nav";

interface NodeAgencyProps {
  node: DrupalNode;
}

export function NodeAgency({ node, ...props }: NodeAgencyProps) {
  const breadcrumbLinks = [
    {label: "Agencies", href: "/agencies"},
  ];
  return (
    <>
      <USABreadcrumb links={breadcrumbLinks} activeItem={node.field_acronym} />
      <div className="grid-row">
        <div className="desktop:grid-col-4">
          <USAInPageNav
            logo={node.field_logo ? node.field_logo : null}
            links={[
              {href: "#mission", label: `Mission`},
              {href: "#component-preview", label: `Admin`},
              {href: "#component-code", label: `Fiscal period`},
              {href: "#related-resources", label: `Related Resources`},
            ]}
          />
        </div>
        <div className="desktop:grid-col-8">
          <h1 className="font-sans-3xl">{node.title}</h1>
          <main id="main-content" className="main-content">
            <h2 className="font-sans-2xl" id="mission">
              Mission
            </h2>
            {node.body?.processed && (
              <div
                dangerouslySetInnerHTML={{ __html: node.body?.processed }}
                className="font-body-md"
              />
            )}
            <h2 className="font-sans-2xl" id="related-resources">
              Related Resources
            </h2>
            <ul>
              <li>
                <a href={node.field_link.uri} target="_blank">
                  Visit the {node.field_acronym} website
                </a>
              </li>
            </ul>
          </main>
        </div>
      </div>
    </>
  );
}
