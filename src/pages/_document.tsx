import { Html, Head, Main, NextScript } from "next/document";
import Footer from "@/components/menus/Footer";
export default function Document() {
  return (
    <Html lang="pt-br">
      <Head />
      <body className="dark">
        <Main />
        <Footer />
        <NextScript />
      </body>
    </Html>
  );
}
