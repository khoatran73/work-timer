import clsx from 'clsx';
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
            <body className={clsx(publicSans.variable, publicSans.className, 'antialiased')}>{children}</body>
        </html>
    );
}
