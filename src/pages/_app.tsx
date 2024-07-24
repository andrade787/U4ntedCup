import { AppProps } from "next/app";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/menus/Header";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

function MyApp({ Component, pageProps }: AppProps) {
  const is404 = Component.name === "NotFound";

  return (
    <UserProvider>
      <main>
        <Toaster />
        {!is404 && <Header />}
        <Component {...pageProps} />
      </main>
    </UserProvider>
  );
}

export default MyApp;
