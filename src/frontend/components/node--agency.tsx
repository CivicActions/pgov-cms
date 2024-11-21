import Image from "next/image";
import { DrupalNode } from "next-drupal";
import { absoluteUrl, formatDate } from "lib/utils";

interface NodeAgencyProps {
  node: DrupalNode;
}

export function NodeAgency({ node, ...props }: NodeAgencyProps) {
  return (
    <>
      <div className="grid-row">
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
          <aside
            className="usa-in-page-nav"
            aria-label="On this page"
            data-scroll-offset="-120"
            data-root-margin="48px 0px -90% 0px"
            data-threshold="1"
            data-heading-elements=""
          >
            <nav aria-label="On this page" className="usa-in-page-nav__nav">
              <h4 className="usa-in-page-nav__heading" tabIndex="0">
                On this page
              </h4>
              <ul className="usa-in-page-nav__list">
                <li className="usa-in-page-nav__item usa-in-page-nav__item--primary usa-current">
                  <a href="#mission" className="usa-in-page-nav__link">
                    Mission
                  </a>
                </li>
                <li className="usa-in-page-nav__item usa-in-page-nav__item--primary">
                  <a
                    href="#component-preview"
                    className="usa-in-page-nav__link"
                  >
                    Admin
                  </a>
                </li>
                <li className="usa-in-page-nav__item usa-in-page-nav__item--primary">
                  <a href="#component-code" className="usa-in-page-nav__link">
                    Fiscal period
                  </a>
                </li>
                <li className="usa-in-page-nav__item usa-in-page-nav__item--primary">
                  <a
                    href="#related-resources"
                    className="usa-in-page-nav__link"
                  >
                    Related Resources
                  </a>
                </li>
              </ul>
            </nav>
          </aside>
        </div>
        <div className="desktop:grid-col-9">
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
