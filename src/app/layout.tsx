import type { Metadata } from "next";
import { Inter, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/components/providers/session-provider";
import { validateRequest } from "@/lib/auth/lucia";
import { Toaster } from "@/components/ui/toaster";
// import { validateRequest } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });
const josefinSans = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AnLibrary",
  description: "A simple anime library",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${josefinSans.className} overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
