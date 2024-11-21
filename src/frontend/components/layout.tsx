import Link from "next/link"

import { PreviewAlert } from "components/preview-alert"
import { GovBanner } from "@trussworks/react-uswds";

export function Layout({ children }) {
  return (
    <>
      <PreviewAlert />
      <div className="max-w-screen-md px-6 mx-auto">
        <header>
          <GovBanner />
        </header>
        <main className="grid-container">{children}</main>
      </div>
    </>
  )
}
