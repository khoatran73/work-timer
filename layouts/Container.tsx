import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    className?: string;
}

const Container: React.FC<Props> = ({ children, className }) => {
    return (
        <div
            className={clsx(
                'w-full h-full overflow-x-hidden overflow-y-auto',
                className,
            )}
        >
            {children}
        </div>
    );
};

export default Container;
