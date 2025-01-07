import React, { PropsWithChildren } from 'react';
import DashboardBody from './DashboardBody';
import DashboardHeader from './DashboardHeader';
import MenuSide from './MenuSide';

interface Props extends PropsWithChildren {}

const Dashboard: React.FC<Props> = props => {
    return (
        <div className="w-screen h-screen" style={{ background: 'var(--background)' }}>
            <div className="w-full h-full overflow-hidden flex">
                <MenuSide />
                <div className="flex-1 flex flex-col">
                    <DashboardHeader />
                    <DashboardBody>{props.children}</DashboardBody>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
