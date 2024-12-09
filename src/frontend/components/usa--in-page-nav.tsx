import * as React from "react";
import { FieldLogo } from './field--logo';

// TODO: Add scrollTo code for long pages when using in page navigation.

export function USAInPageNav({links, logo, logoAbove = true}) {
  return (
    <aside
      className="usa-in-page-nav"
      aria-label="On this page"
      data-scroll-offset="-120"
      data-root-margin="48px 0px -90% 0px"
      data-threshold="1"
      data-main-content-selector="#main-content"
    >
      {(logo && logoAbove) && (
        <FieldLogo field_logo={logo} />
      )}
      <nav aria-label="On this page" className="usa-in-page-nav__nav">
        <h4 className="usa-in-page-nav__heading" tabIndex={0}>
          On this page
        </h4>
        
        <ul className="usa-in-page-nav__list">
          {links.map((link) => (
            <li key={link.href} className={`usa-in-page-nav__item${link.primary ? " usa-in-page-nav__item--primary" : ""}`}>
              <a
                href={link.href}
                className="usa-in-page-nav__link"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {(logo && !logoAbove) && (
        <FieldLogo field_logo={logo} />
      )}
    </aside>
  );
}



