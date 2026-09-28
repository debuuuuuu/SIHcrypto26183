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
    <html lang="en" className="dark h-full">
      <body className="bg-[#090d16] text-slate-100 antialiased selection:bg-sky-500 selection:text-white h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
