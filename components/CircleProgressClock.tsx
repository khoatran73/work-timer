import { Progress, ProgressProps } from 'antd';
import localFont from 'next/font/local';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const digital7Font = localFont({ src: '../static/font/digital-7.ttf' });

interface Props {
    time: { hour: number; minute: number };
    total: { hour: number; minute: number };
}

const strokeColor: ProgressProps['strokeColor'] = {
    '0%': '#FFF5D5',
    '40%': '#E79E11',
    '60%': '#9AE4C2',
    '100%': '#0D9F73',
};

const CircleProgressClock: React.FC<Props> = ({ time, total }) => {
    const formatTime = ({ time }: Pick<Props, 'time'>) => {
        const hourStr = String(time.hour).padStart(2, '0');
        const minuteStr = String(time.minute).padStart(2, '0');
        return `${hourStr}:${minuteStr}`;
    };

    const calcPercent = () => {
        var totalMinutes = total.minute + total.hour * 60;
        var minute = time.minute + time.hour * 60;

        return ((totalMinutes - minute) / totalMinutes) * 100;
    };

    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    if (!domLoaded) return <></>;
    return (
        <div className={twMerge(digital7Font.className, 'select-none')}>
            <Progress
                percent={calcPercent()}
                type="circle"
                size={200}
                format={percent => {
                    const isSuccess = (percent ?? 0) >= 100;

                    return (
                        <div
                            className={twMerge(digital7Font.className, 'text-4xl select-none')}
                            style={{
                                color: isSuccess ? '#0D9F73' : '#E79E11',
                            }}
                        >
                            {formatTime({ time })}
                        </div>
                    );
                }}
                strokeColor={strokeColor}
                strokeWidth={12}
            />
        </div>
    );
};

export default React.memo(CircleProgressClock);
