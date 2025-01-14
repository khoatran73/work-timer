'use client';

import '@ant-design/v5-patch-for-react-19';
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
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={clsx(publicSans.variable, publicSans.className, 'antialiased')}>
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    );
}
