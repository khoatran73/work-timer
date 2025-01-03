import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    className?: string;
    wrapperClassName?: string;
}

const PageContainer: React.FC<Props> = ({ children, className, wrapperClassName }) => {
    return (
        <div className={clsx('w-screen h-screen', wrapperClassName)}>
            <div className={clsx('w-full h-full overflow-x-hidden overflow-y-auto', className)}>
                {children}
            </div>
        </div>
    );
};

export default PageContainer;
