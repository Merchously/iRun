import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Poppins, Roboto } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "iRun — Runner Operating System",
    template: "%s | iRun",
  },
  description:
    "Media, training, community, and commerce for Canadian runners.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("irun-theme")?.value;
  const initialClass = themeCookie === "dark" ? "dark" : "light";

  return (
    <html lang="en" className={initialClass} suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${roboto.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
