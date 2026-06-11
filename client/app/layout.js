import "../styles/globals.css";

export const metadata = {
  title: "AI Recruitment Organization",
  description: "Spec-driven multi-agent recruitment platform"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
