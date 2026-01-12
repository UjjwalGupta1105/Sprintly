import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/app/components/Header";
import  Footer  from "@/app/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/app/components/ui/theme-provider"
import { shadesOfPurple } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner"

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const inter=Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sprintly",
  description: "An project Management Application",
};




export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} dotted-background`}
      >
       <ClerkProvider
          appearance={{
            baseTheme: shadesOfPurple,
            variables: {
              colorPrimary: "#3b82f6",
              colorBackground: "#1a202c",
              colorInputBackground: "#2D3748",
              colorInputText: "#F3F4F6",
            },
            elements: {
              formButtonPrimary: "text-white",
              card: "bg-gray-800",
              buttonPrimary: "text-white",
            },
          }}
        >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <main className="min-h-screen">
            <Header/>
              {children}
              <Toaster richColours/>
            <Footer/>
          </main>
          
        </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
