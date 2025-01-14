'use client';

import _ from 'lodash';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';
import useCurrentUser from '~/store/useCurrentUser';

interface Props extends React.PropsWithChildren {}

const AuthProvider: React.FC<Props> = ({ children }) => {
    const { user, loading } = useCurrentUser();

    useEffect(() => {
        if (loading) return;
        if (_.isEmpty(user)) {
            redirect('/login');
        }
    }, [loading]);

    if (loading) return null;
    return <>{children}</>;
};

export default AuthProvider;
