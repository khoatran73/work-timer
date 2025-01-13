'use client';

import { signOut } from 'next-auth/react';
import React from 'react';

interface Props {}

const DashboardHeader: React.FC<Props> = props => {
    return (
        <div className="w-full h-16 bg-white px-10 flex items-center justify-end">
            <button
                onClick={() => {
                    signOut();
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default DashboardHeader;
