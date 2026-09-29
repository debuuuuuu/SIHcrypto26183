import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MONOMER — Evidence-Driven Cryptocurrency Investigation Platform',
  description:
    'Advanced evidence-driven cryptocurrency intelligence, fund tracing, and forensic network reconstruction platform.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark min-h-full">
      <body className="bg-[#050505] text-[#F5F5F5] antialiased selection:bg-[#F5F5F5] selection:text-[#050505] min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
