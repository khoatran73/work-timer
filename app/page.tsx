'use client';

import { FloatButton } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import _ from 'lodash';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Box from '~/components/Box';
import CircleProgressClock from '~/components/CircleProgressClock';
import DigitalClock from '~/components/DigitalClock';
import { DateTimeConstant } from '~/constants/DateTimeConstant';
import { LocalStorageConstant } from '~/constants/LocalStorageConstant';
import useLocalStorage from '~/hooks/useLocalStorage';
import Container from '~/layouts/Container';
import PageContainer from '~/layouts/PageContainer';
import { DEFAULT_TIMER_SETTING, TimerSetting } from '~/types/timer-setting';
import { SettingTwoTone } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { DateTime } from '~/types/date-time';
import clsx from 'clsx';

dayjs.extend(customParseFormat);

interface Props {}

interface State {
    remainingToLunchTime: TimeDisplay;
    remainingToCheckoutTime: TimeDisplay;
    workedDuration: TimeDisplay;
    checkoutTime: TimeDisplay;
}

interface TimeDisplay {
    minute: number;
    hour: number;
}

const ONE_MINUTE_TO_MS = 60000;
const ONE_SECOND_TO_MS = 1000;

const HomePage: React.FC<Props> = props => {
    const [timerSetting, setTimerSetting] = useLocalStorage<TimerSetting>(
        LocalStorageConstant.TIMER_SETTING,
        DEFAULT_TIMER_SETTING,
    );
    const [domLoaded, setDomLoaded] = useState(false);
    const [state, setState] = useState<State>({
        remainingToLunchTime: {
            hour: 0,
            minute: 0,
        },
        remainingToCheckoutTime: {
            hour: 0,
            minute: 0,
        },
        workedDuration: {
            hour: 0,
            minute: 0,
        },
        checkoutTime: {
            hour: 0,
            minute: 0,
        },
    });

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    useEffect(() => {
        if (_.isEqual(timerSetting, DEFAULT_TIMER_SETTING)) {
            redirect('/timer-setting');
            return;
        }

        const interval = setInterval(() => {
            calcTime(dayjs());
        }, ONE_SECOND_TO_MS);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkReset = () => {
            const now = new Date();
            // Reset Checking Time at 00:01 every day
            if (now.getHours() === 11 && now.getMinutes() === 3) {
                setTimerSetting(setting => ({
                    ...setting,
                    checkingTime: '00:00',
                }));
                redirect('/timer-setting');
            }
        };

        const interval = setInterval(checkReset, ONE_MINUTE_TO_MS);

        return () => clearInterval(interval);
    }, []);

    const calculateRemainingTime = (current: dayjs.Dayjs, target: dayjs.Dayjs) => {
        const remainingMinutes = target.diff(current, 'm');
        return {
            hour: Math.floor(remainingMinutes / 60),
            minute: remainingMinutes % 60,
        };
    };

    const calculateWorkedDuration = (
        now: dayjs.Dayjs,
        checkingTime: dayjs.Dayjs,
        lunchTime: { start: dayjs.Dayjs; end: dayjs.Dayjs },
        lunchDuration: number,
    ) => {
        if (now.isAfter(lunchTime.end)) {
            return now.diff(checkingTime, 'm') - lunchDuration;
        } else if (now.isBefore(lunchTime.start)) {
            return now.diff(checkingTime, 'm');
        } else {
            return now.diff(checkingTime, 'm') - now.diff(lunchTime.start, 'm');
        }
    };

    const formatTime = (time: DateTime) => dayjs(time, DateTimeConstant.HH_MM);

    const calcTime = (now: dayjs.Dayjs) => {
        const checkingTime = formatTime(timerSetting.checkingTime).isAfter(formatTime(timerSetting.startWorkingTime))
            ? formatTime(timerSetting.checkingTime)
            : formatTime(timerSetting.startWorkingTime);

        const lunchTime = {
            start: formatTime(timerSetting.lunchTime.startTime),
            end: formatTime(timerSetting.lunchTime.endTime),
        };

        const lunchDuration = lunchTime.end.diff(lunchTime.start, 'm');
        const toLunch = calculateRemainingTime(now, lunchTime.start);
        const checkoutTime = checkingTime.add(timerSetting.workingHours, 'hour').add(lunchDuration, 'm');
        const toCheckout = calculateRemainingTime(now, checkoutTime);

        const workedDuration = calculateWorkedDuration(now, checkingTime, lunchTime, lunchDuration);

        setState({
            remainingToLunchTime: toLunch,
            remainingToCheckoutTime: toCheckout,
            workedDuration: {
                hour: Math.floor(workedDuration / 60),
                minute: workedDuration % 60,
            },
            checkoutTime: {
                hour: checkoutTime.hour(),
                minute: checkoutTime.minute(),
            },
        });
    };

    if (!domLoaded) return <></>;
    return (
        <PageContainer>
            <Container className="flex items-center justify-center">
                <div className={clsx('w-full h-full grid gap-4 grid-cols-12')}>
                    <Box
                        header={{
                            title: 'Remaining To Lunch Time',
                            subTitle: 'Thời gian còn lại đến giờ Nghỉ trưa',
                        }}
                        className="flex items-center justify-center h-[220px]"
                        wrapperClassName="lg:col-span-4 sm:col-span-12"
                    >
                        <CircleProgressClock
                            time={state.remainingToLunchTime}
                            total={calculateRemainingTime(
                                formatTime(timerSetting.checkingTime),
                                formatTime(timerSetting.lunchTime.startTime),
                            )}
                        />
                    </Box>
                    <Box
                        header={{
                            title: 'Worked Duration',
                            subTitle: 'Thời gian Đã làm việc',
                        }}
                        className="flex items-center justify-center h-[220px]"
                        wrapperClassName="lg:col-span-8 sm:col-span-12"
                    >
                        <DigitalClock time={state.workedDuration} className="text-[#00B8D9]" />
                    </Box>
                    <Box
                        header={{
                            title: 'Remaining To Checkout Time',
                            subTitle: 'Thời gian còn lại đến giờ Checkout',
                        }}
                        className="flex items-center justify-center h-[220px]"
                        wrapperClassName="lg:col-span-4 sm:col-span-12"
                    >
                        <CircleProgressClock
                            time={state.remainingToCheckoutTime}
                            total={{
                                hour: 0,
                                minute: timerSetting.workingHours * 60,
                            }}
                        />
                    </Box>
                    <Box
                        header={{
                            title: 'Checkout Time',
                            subTitle: 'Có thể checkout khi đến thời gian này',
                        }}
                        className="flex items-center justify-center h-[220px]"
                        wrapperClassName="lg:col-span-8 sm:col-span-12"
                    >
                        <DigitalClock time={state.checkoutTime} className="text-[#FF5630]" />
                    </Box>
                </div>
            </Container>
            <FloatButton
                href="/timer-setting"
                tooltip={<div>Setting</div>}
                type="default"
                shape="circle"
                icon={
                    <motion.div
                        initial={{ '--rotate': '0deg' }}
                        animate={{ '--rotate': '360deg' }}
                        transition={{ duration: 5, repeat: Infinity, delay: 0, ease: 'linear' }}
                    >
                        <SettingTwoTone style={{ transform: 'rotate(var(--rotate))' }} twoToneColor="#637381" />
                    </motion.div>
                }
            />
        </PageContainer>
    );
};

export default HomePage;
