import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '~/app/api/auth/[...nextauth]/authOptions';
import prismadb from '~/lib/prismadb';

const serverAuth = async (): Promise<{ currentUser: User }> => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error('Not signed in');
    }

    const currentUser = await prismadb.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    if (!currentUser) {
        throw new Error('Not signed in');
    }

    return { currentUser };
};

export default serverAuth;
