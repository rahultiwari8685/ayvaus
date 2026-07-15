import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/context/SocketContext";
import { Toaster } from "react-hot-toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Flirta",
  description:
    "Flirta is a free random video chat platform where you can meet new people from around the world instantly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* {children} */}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: "#18181b",
              color: "#fff",
              border: "1px solid #ec4899",
            },
          }}
        />

        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
