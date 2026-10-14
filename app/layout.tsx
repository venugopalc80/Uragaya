import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "URAGAYA | Indian Pickles for the World",
  description:
    "Discover the bold, regional flavours of Indian pickles. Rooted in Andhra Pradesh, made for tables around the world.",
  metadataBase: new URL("https://uragaya.com"),
  openGraph: {
    title: "URAGAYA | Indian Pickles for the World",
    description: "Timeless flavours. Global tables.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}