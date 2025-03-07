import "./globals.css";
import Footer from "./components/Footer";
import Head from "next/head";
import { MyProvider } from './context/MyContext';
import ShowNavbar from "./components/ShowNavbar";

export const metadata = {
  title: "TrackMyGains",
  description: "TrackMyGains is a simple app to track your fitness progress.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
        </Head>
      <body>
        <MyProvider>
        <div className="flex flex-col min-h-screen">
          <ShowNavbar/>
          {children}
          <Footer />
        </div>
        </MyProvider>
      </body>
    </html>
  );
}
