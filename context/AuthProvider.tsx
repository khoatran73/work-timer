'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';

interface Props extends React.PropsWithChildren {}

const AuthProvider: React.FC<Props> = ({ children }) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            redirect('/login');
        }
    }, [session, status]);

    if (status === 'loading') return null;

    return <>{children}</>;
};

export default AuthProvider;
