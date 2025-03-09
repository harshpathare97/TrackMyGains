import "./globals.css";
import Footer from "./components/Footer";
import Head from "next/head";
import { MyProvider } from './context/MyContext';
import ShowNavbar from "./components/ShowNavbar";
import Offline from './components/Offline'; 
import InstallPrompt from './components/InstallPrompt';

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
        <link rel="manifest" href="/manifest.json" />
        </Head>
      <body>
        <MyProvider>
        <div className="flex flex-col min-h-screen">
          <ShowNavbar/>
          <Offline />
          <InstallPrompt /> 
          {children}
          <Footer />
        </div>
        </MyProvider>
      </body>
    </html>
  );
}
