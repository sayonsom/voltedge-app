import RootProviders from '@/components/providers/RootProviders';
import "./globals.css";

export const metadata = {
  title: "VoltEdge - Power Grid Management",
  description: "Professional power grid management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RootProviders>
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
