'use client';

import clsx from 'clsx';
import { SessionProvider } from 'next-auth/react';
import { Public_Sans } from 'next/font/google';
import './globals.css';

const publicSans = Public_Sans({
    variable: '--font-public-sans',
    subsets: ['latin', 'vietnamese'],
});

export default function RootLayout({
    children,
    session,
}: Readonly<{
    children: React.ReactNode;
    session: any;
}>) {
    return (
        <html lang="en">
            <body className={clsx(publicSans.variable, publicSans.className, 'antialiased')}>
                <SessionProvider session={session}>{children}</SessionProvider>
            </body>
        </html>
    );
}
