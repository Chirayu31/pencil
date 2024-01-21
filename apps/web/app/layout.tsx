import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import RecoilProvider from "./recoilProvider";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pencil",
  description: "Collaborative Drawing App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilProvider>
          {children}
        </RecoilProvider>
      </body>
    </html>
  );
}
