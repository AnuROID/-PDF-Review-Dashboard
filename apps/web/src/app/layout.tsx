// apps/web/src/app/layout.tsx
import "@/styles/globals.css";

export const metadata = {
  title: "PDF Invoice Dashboard",
  description: "Upload, view, extract and manage invoices",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}
