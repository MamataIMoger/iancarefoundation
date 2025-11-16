// app/layout.tsx (for public pages)
import "../styles/globals.css";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <main className="pt-[80px]">{children}</main>
      </body>
    </html>
  );
}
