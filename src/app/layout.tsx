import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CustomAlertProvider } from "@/components/ui/custom-alert-dialog";
import { ThemeProvider } from "@/lib/theme-context";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinOne",
  description: "Your personal financial planning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  if (theme === 'system') {
                    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    root.classList.add(dark ? 'dark' : 'light');
                  } else {
                    root.classList.add(theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <CustomAlertProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </CustomAlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

