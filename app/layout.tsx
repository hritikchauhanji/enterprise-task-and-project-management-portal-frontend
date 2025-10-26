"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import dynamic from "next/dynamic";
const Toaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Provider store={store}>{children}</Provider>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
