"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}
