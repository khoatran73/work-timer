import React, { PropsWithChildren } from 'react';
import AuthProvider from '~/context/AuthProvider';
import DashboardBody from './DashboardBody';
import DashboardHeader from './DashboardHeader';
import MenuSide from './MenuSide';

interface Props extends PropsWithChildren {}

const Dashboard: React.FC<Props> = props => {
    return (
        <AuthProvider>
            <div className="w-screen h-screen" style={{ background: 'var(--background)' }}>
                <div className="w-full h-full overflow-hidden flex">
                    <MenuSide />
                    <div className="flex-1 flex flex-col">
                        <DashboardHeader />
                        <DashboardBody>{props.children}</DashboardBody>
                    </div>
                </div>
            </div>
        </AuthProvider>
    );
};

export default Dashboard;
