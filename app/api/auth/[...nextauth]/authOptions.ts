import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import prismadb from '~/lib/prismadb';

export const authOptions: AuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    adapter: PrismaAdapter(prismadb),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
};
