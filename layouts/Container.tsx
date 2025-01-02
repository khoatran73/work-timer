import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface Props extends PropsWithChildren {
    className?: string;
    wrapperClassName?: string;
}

const Container: React.FC<Props> = ({ children, wrapperClassName, className }) => {
    return (
        <div className={clsx('w-full h-full flex items-center justify-center', wrapperClassName)}>
            <div className={clsx('w-[1200px] px-4', className)}>{children}</div>
        </div>
    );
};

export default Container;
