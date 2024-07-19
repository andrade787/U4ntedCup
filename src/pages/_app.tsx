import { AppProps } from "next/app";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/menus/Header";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <main>
        <Toaster />
        <Header />
        <Component {...pageProps} />
      </main>
    </UserProvider>
  );
}

export default MyApp;
