import { AppProps } from "next/app";

import "@trussworks/react-uswds/lib/uswds.css";
import "@trussworks/react-uswds/lib/index.css";
import "styles/style.scss";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
