import "./globals.css";

export const metadata = {
  title: "Photocard Template",
  description: "Inventory for photocard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
