import { GovBanner } from "@trussworks/react-uswds";
import { PreviewAlert } from "components/preview-alert";
import { USAHeader } from "./usa--header";

export function Layout({ children }) {
  return (
    <>
      <GovBanner />
      <PreviewAlert />
      <div className="max-w-screen-md px-6 mx-auto">
        <USAHeader />
        <main className="grid-container margin-bottom-4">{children}</main>
      </div>
      <footer className="width-full display-block height-8 bg-black"></footer>
    </>
  );
}
