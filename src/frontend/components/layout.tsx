import Link from "next/link";
import { GovBanner } from "@trussworks/react-uswds";
import { PreviewAlert } from "components/preview-alert";


export function Layout({ children }) {
  return (
    <>
      <PreviewAlert />
      <div className="max-w-screen-md px-6 mx-auto">
        <header>
          <GovBanner />
        </header>
        <main className="grid-container margin-bottom-4">{children}</main>
      </div>
      <footer className="width-full display-block height-8 bg-black"></footer>
    </>
  );
}
