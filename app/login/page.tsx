'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const LoginPage: React.FC = () => {
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            redirect('/');
        }
    }, [session]);

    const handleSignIn = () => {
        signIn('google'); 
    };

    if (session) return null;

    return (
        <div>
            <h1>Sign In</h1>
            <button onClick={handleSignIn}>Sign in with Google</button>
        </div>
    );
};

export default LoginPage;
