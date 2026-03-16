import type { Metadata } from "next";
import "@/ui/styles/globals.css";
import StoreProvider from "@/ui/components/StoreProvider";

export const metadata: Metadata = {
  title: "Collaborative Markdown Editor",
  description: "A collaborative markdown editor built with Next.js and CodeMirror",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-dvh">
      <body className="h-dvh transition-all duration-200 ease-in-out">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
