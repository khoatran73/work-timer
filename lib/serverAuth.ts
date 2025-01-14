import { User } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/authOptions';
import prismadb from '~/lib/prismadb';

const serverAuth = async (): Promise<{ currentUser: User | null }> => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { currentUser: null };
    }

    const currentUser = await prismadb.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    if (!currentUser) {
        return { currentUser: null };
    }

    return { currentUser };
};

export default serverAuth;
