import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { WhatsAppWidget } from "@/components/ui/WhatsAppWidget";
import { ExitIntentModal } from "@/components/ui/ExitIntentModal";
import { GoogleOAuthProvider } from "@react-oauth/google";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Binary Craft — Premium IT Solutions",
  description:
    "Binary Craft is a premium IT solutions provider. Explore our curated marketplace of templates, hosting solutions, and digital services designed to accelerate your workflow.",
  keywords: ["IT solutions", "web development", "digital products", "templates", "hosting"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <AuthProvider>
            <ToastProvider>
              <div className="bg-noise flex flex-col min-h-screen">
                {children}
                <WhatsAppWidget />
                <ExitIntentModal />
              </div>
            </ToastProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

