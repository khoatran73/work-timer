'use client';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import _ from 'lodash';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DateTimeConstant } from '~/constants/DateTimeConstant';
import { LocalStorageConstant } from '~/constants/LocalStorageConstant';
import useLocalStorage from '~/hooks/useLocalStorage';
import Container from '~/layouts/Container';
import PageContainer from '~/layouts/PageContainer';
import { DEFAULT_TIMER_SETTING, TimerSetting } from '~/types/timer-setting';

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

    const calculateRemainingTime = (now: dayjs.Dayjs, target: dayjs.Dayjs) => {
        const remainingMinutes = target.diff(now, 'minute');
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
            <Container className="flex items-center justify-center text-white">
                <div className="w-full h-full">
                    {state.remainingToLunchTime.hour > 0 && (
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
                    )}
                </div>
            </Container>
        </PageContainer>
    );
};

export default HomePage;
