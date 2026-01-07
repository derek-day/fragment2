import "./globals.css";
import BackgroundMusic from "../components/BackgroundMusic";

export const metadata = {
  title: "The Gatebreaker Protocol",
  description: "A choose your own adventure story by Andrew Akers, Derek Day, and Tye Sheets",
};

const PLAYLIST = [
  { title: "Test", src: "/assets/music/andor.m4a" },
];

export default function RootLayout({ children }) {
  return (
    // <html lang="en">
    <html lang="en" style={{backgroundImage: "url('../assets/portal.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      <body>
        {children}

        <BackgroundMusic 
         tracks={PLAYLIST} 
         initialVolume={0.3}
       />
      </body>
    </html>
  );
}
