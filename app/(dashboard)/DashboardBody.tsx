import React, { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {}

const DashboardBody: React.FC<Props> = ({ children }) => {
    return <div className="w-full flex-1 bg-transparent px-10 py-4">{children}</div>;
};

export default DashboardBody;
