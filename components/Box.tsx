import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends PropsWithChildren {
    header?: {
        title: string;
        subTitle?: string;
        className?: string;
    };
    className?: string;
    wrapperClassName?: string;
}

const Box: React.FC<Props> = ({ header, className, wrapperClassName, children }) => {
    const renderHeader = () => {
        if (!header) return <></>;

        return (
            <div className={twMerge('p-6 pb-0', header.className)}>
                <div className="text-xl font-semibold">{header.title}</div>
                <div
                    className="text-sm"
                    style={{
                        color: 'var(--text-secondary)',
                    }}
                >
                    {header.subTitle}
                </div>
            </div>
        );
    };

    const renderBody = () => {
        return <div className={twMerge('p-6', className)}>{children}</div>;
    };

    return (
        <div
            className={twMerge('overflow-hidden rounded-2xl bg-white', wrapperClassName)}
            style={{
                boxShadow: '0 0 2px 0 rgba(145 158 171 / 0.2),0 12px 24px -4px rgba(145 158 171 / 0.12)',
            }}
        >
            {renderHeader()}
            {renderBody()}
        </div>
    );
};

export default Box;
