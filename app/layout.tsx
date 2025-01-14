'use client';

import '@ant-design/v5-patch-for-react-19';
import clsx from 'clsx';
import { Public_Sans } from 'next/font/google';
import ZustandProvider from '~/context/ZustandProvider';
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
                <ZustandProvider>{children}</ZustandProvider>
            </body>
        </html>
    );
}
