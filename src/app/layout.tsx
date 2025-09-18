import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/components/organisms/NotificationContainer";
import LoadingScreen from "@/components/atoms/LoadingScreen";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Football Book",
  description:
    "Football book made simple and trustworthy through community football in Jakarta",
  keywords: [
    "football",
    "minisoccer",
    "community",
    "jakarta",
    "bola",
    "main bola",
    "mabol",
  ],
  authors: [{ name: "DamnSans Team" }],
  openGraph: {
    title: "FootballBook",
    description: "Football Book made simple and trustworthy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<LoadingScreen message="Loading application..." />}>
          <AuthProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
