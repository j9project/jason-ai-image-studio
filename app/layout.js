import "./globals.css";

export const metadata = {
  title: "Jason AI Image Studio",
  description: "AI image generation and editing studio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
