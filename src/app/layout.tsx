import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title: "X1 Avatar Studio | Strategic Minds AI",
 description: "Independent avatar creation studio and governed X1 engineering control plane.",
 robots: { index: false, follow: false }
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
 return <html lang="en"><body>{children}</body></html>;
}
