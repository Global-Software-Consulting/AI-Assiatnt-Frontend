import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <link
        rel="stylesheet"
        href="../node_modules/@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
      />
      <Script
        crossorigin
        src="https://unpkg.com/react@16/umd/react.development.js"
      ></Script>

      <Head></Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
