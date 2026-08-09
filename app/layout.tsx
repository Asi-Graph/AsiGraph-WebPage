import type { Metadata } from "next";
import { Rubik, Heebo } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["100", "300", "400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "אסיגרף | בית דפוס בנווה צדק",
  description: "בית דפוס בוטיק המתמחה בהפקות דפוס יוקרתיות, מיתוג עסקי ופתרונות אריזה מתקדמים. אנחנו מביאים את החזון שלכם לחיים עם הדיוק הגבוה ביותר.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${rubik.variable} ${heebo.variable} dark scroll-smooth`}
    >
      <body className="bg-[#121414] text-[#e3e2e2] font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

