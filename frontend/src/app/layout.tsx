import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { WhatsAppWidget } from "@/components/ui/WhatsAppWidget";
import { ExitIntentModal } from "@/components/ui/ExitIntentModal";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Suspense } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://binarynexa4u.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "BinaryNexa — Premium IT Solutions",
    template: "%s | BinaryNexa",
  },
  description:
    "BinaryNexa is a premium IT solutions provider. Explore our curated marketplace of templates, hosting solutions, and digital services designed to accelerate your workflow.",
  keywords: ["IT solutions", "web development", "digital products", "templates", "hosting", "Bangladesh", "SaaS"],
  authors: [{ name: "BinaryNexa", url: baseUrl }],
  creator: "BinaryNexa",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "BinaryNexa",
    title: "BinaryNexa — Premium IT Solutions",
    description: "BinaryNexa is a premium IT solutions provider based in Bangladesh. Explore our curated marketplace of templates, hosting solutions, and digital services.",
    images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: "BinaryNexa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BinaryNexa — Premium IT Solutions",
    description: "BinaryNexa is a premium IT solutions provider based in Bangladesh.",
    images: [`${baseUrl}/og-image.png`],
    creator: "@binarynexa",
  },
  alternates: {
    canonical: baseUrl,
  },
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
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.variable} antialiased`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <AuthProvider>
            <ToastProvider>
              <ErrorBoundary>
                <Suspense fallback={null}>
                  <ProgressBar />
                </Suspense>
                <div className="bg-noise flex flex-col min-h-screen">
                  {children}
                  <WhatsAppWidget />
                  <ExitIntentModal />
                </div>
              </ErrorBoundary>
            </ToastProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
