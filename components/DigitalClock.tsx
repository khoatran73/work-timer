import localFont from 'next/font/local';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const digital7Font = localFont({ src: '../static/font/digital-7.ttf' });

interface Props {
    time: { hour: number; minute: number } | string;
    className?: string;
}

const DigitalClock: React.FC<Props> = ({ time, className }) => {
    const formatTime = ({ time }: Pick<Props, 'time'>) => {
        if (typeof time === 'string') return time;

        const hourStr = String(time.hour).padStart(2, '0');
        const minuteStr = String(time.minute).padStart(2, '0');
        return `${hourStr}:${minuteStr}`;
    };

    return (
        <div className={twMerge(digital7Font.className, 'text-9xl select-none', className)}>{formatTime({ time })}</div>
    );
};

export default DigitalClock;
