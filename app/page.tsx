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

const HomePage: React.FC<Props> = props => {
    const [timerSetting, setTimerSetting] = useLocalStorage<TimerSetting>(
        LocalStorageConstant.TIMER_SETTING,
        DEFAULT_TIMER_SETTING,
    );
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
        if (_.isEqual(timerSetting, DEFAULT_TIMER_SETTING)) {
            redirect('/timer-setting');
            return;
        }

        const interval = setInterval(() => {
            calcTime(dayjs());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const calculateRemainingTime = (current: dayjs.Dayjs, target: dayjs.Dayjs) => {
        const remainingMinutes = target.diff(current, 'minute');
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
            return now.diff(checkingTime, 'minute') - lunchDuration;
        } else if (now.isBefore(lunchTime.start)) {
            return now.diff(checkingTime, 'minute');
        } else {
            return now.diff(checkingTime, 'minute') - now.diff(lunchTime.start, 'minute');
        }
    };

    const calcTime = (now: dayjs.Dayjs) => {
        const checkingTime = dayjs(timerSetting.checkingTime, DateTimeConstant.HH_MM);

        const lunchTime = {
            start: dayjs(timerSetting.lunchTime.startTime, DateTimeConstant.HH_MM),
            end: dayjs(timerSetting.lunchTime.endTime, DateTimeConstant.HH_MM),
        };

        const lunchDuration = lunchTime.end.diff(lunchTime.start, 'minute');
        const toLunch = calculateRemainingTime(now, lunchTime.start);
        const checkoutTime = checkingTime.add(timerSetting.workingHours, 'hour').add(lunchDuration, 'minute');
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

    const formatTime = (time: TimeDisplay) => {
        return `${time.hour} giờ` + (time.minute > 0 ? ` ${time.minute} phút` : '');
    };

    return (
        <PageContainer>
            <Container className="flex items-center justify-center">
                <div className="w-full h-full grid grid-cols-2 gap-4">
                    <Box
                        header={{
                            title: 'Remaining To Lunch Time',
                            subTitle: 'Thời gian còn lại đến giờ Nghỉ trưa',
                        }}
                        className="flex items-center justify-center h-[220px]"
                    >
                        <CircleProgressClock
                            time={state.remainingToLunchTime}
                            total={calculateRemainingTime(
                                dayjs(timerSetting.checkingTime, DateTimeConstant.HH_MM),
                                dayjs(timerSetting.lunchTime.startTime, DateTimeConstant.HH_MM),
                            )}
                        />
                    </Box>
                    <Box
                        header={{
                            title: 'Remaining To Checkout Time',
                            subTitle: 'Thời gian còn lại đến giờ Checkout',
                        }}
                        className="flex items-center justify-center h-[220px]"
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
                            title: 'Worked Duration',
                            subTitle: 'Thời gian Đã làm việc',
                        }}
                        className="flex items-center justify-center h-[220px]"
                    >
                        <DigitalClock time={state.workedDuration} className="text-[#00B8D9]" />
                    </Box>
                    <Box
                        header={{
                            title: 'Checkout Time',
                            subTitle: 'Có thể checkout khi đến thời gian này',
                        }}
                        className="flex items-center justify-center h-[220px]"
                    >
                        <DigitalClock time={state.checkoutTime} className="text-[#FF5630]" />
                    </Box>
                    {/* {state.remainingToLunchTime.hour > 0 && (
                        <div>{formatTime(state.remainingToLunchTime)} nữa là đến giờ ăn trưa rùi nà</div>
                    )}
                    {state.remainingToCheckoutTime.hour > 0 && (
                        <div>Còn {formatTime(state.remainingToCheckoutTime)} nữa là đi dìa được rùi nà</div>
                    )}
                    {state.workedDuration.hour > 0 && (
                        <div>Đã làm việc được {formatTime(state.workedDuration)} rùi nà</div>
                    )}
                    {state.checkoutTime.hour > 0 && (
                        <div>Giờ kết thúc làm việc của bạn là {formatTime(state.checkoutTime)} nà</div>
                    )} */}
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
