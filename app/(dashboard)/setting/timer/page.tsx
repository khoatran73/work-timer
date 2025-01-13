'use client';

import { HomeTwoTone } from '@ant-design/icons';
import { Button, FloatButton, Input, TimePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { motion } from 'framer-motion';
import _ from 'lodash';
import { redirect } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import FormBase, { FormBaseRef } from '~/components/FormBase';
import { DateTimeConstant } from '~/constants/DateTimeConstant';
import { LocalStorageConstant } from '~/constants/LocalStorageConstant';
import { NotificationConstant } from '~/constants/NotificationConstant';
import useLocalStorage from '~/hooks/useLocalStorage';
import Container from '~/layouts/Container';
import requestApi from '~/lib/requestApi';
import { DEFAULT_TIMER_SETTING, TimerSetting } from '~/types/timer-setting';
import { nameof } from '~/utils/nameof';
import NotifyUtil from '~/utils/NotifyUtil';

dayjs.extend(customParseFormat);

interface Props {}

const TimerSettingPage: React.FC<Props> = props => {
    const formRef = useRef<FormBaseRef>(null);
    const [timerSetting, setTimerSetting] = useLocalStorage<TimerSetting>(
        LocalStorageConstant.TIMER_SETTING,
        DEFAULT_TIMER_SETTING,
    );
    const [domLoaded, setDomLoaded] = useState(false);

    const handleSave = async () => {
        const isValidForm = await formRef.current?.isFieldsValidate();

        if (!isValidForm) return;

        const params = formRef.current?.getFieldsValue();
        if (_.isEmpty(params)) return;

        const setting: TimerSetting = {
            checkingTime: params.checkingTime.format(DateTimeConstant.HH_MM),
            startWorkingTime: params.startWorkingTime.format(DateTimeConstant.HH_MM),
            lunchTime: {
                startTime: params.lunchTime[0].format(DateTimeConstant.HH_MM),
                endTime: params.lunchTime[1].format(DateTimeConstant.HH_MM),
            },
            workingHours: _.toNumber(params.workingHours),
        };

        try {
            const response = await requestApi('/api/timer-setting', 'post', {
                ...setting,
                startWorkingTime: {
                    start: setting.startWorkingTime,
                    end: setting.startWorkingTime,
                },
                lunchTime: {
                    start: setting.lunchTime.startTime,
                    end: setting.lunchTime.endTime,
                },
            });
            console.log(response);
        } catch (err) {
            console.log('err: ', err);
            NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.SOME_THING_WENT_WRONG);
        }

        setTimerSetting(setting);

        redirect('/');
    };

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    if (!domLoaded) return <></>;
    return (
        <Container>
            <div className="w-80">
                <h1 className="mb-6">Timer Setting</h1>
                <FormBase
                    ref={formRef}
                    initialValues={{
                        checkingTime: dayjs(timerSetting.checkingTime, DateTimeConstant.HH_MM),
                        startWorkingTime: dayjs(timerSetting.startWorkingTime, DateTimeConstant.HH_MM),
                        workingHours: timerSetting.workingHours,
                        lunchTime: [
                            dayjs(timerSetting.lunchTime.startTime, DateTimeConstant.HH_MM),
                            dayjs(timerSetting.lunchTime.endTime, DateTimeConstant.HH_MM),
                        ],
                    }}
                    formBaseItems={[
                        {
                            name: nameof.full<TimerSetting>(x => x.checkingTime),
                            children: (
                                <TimePicker type="time" placeholder="Checking Time" format={DateTimeConstant.HH_MM} />
                            ),
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            label: 'Checking Time',
                        },
                        {
                            name: nameof.full<TimerSetting>(x => x.startWorkingTime),
                            children: (
                                <TimePicker
                                    type="time"
                                    placeholder="Start Working Time"
                                    format={DateTimeConstant.HH_MM}
                                />
                            ),
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            label: 'Start Working Time',
                        },
                        {
                            name: nameof.full<TimerSetting>(x => x.workingHours),
                            children: <Input type="number" placeholder="Working hours" className="w-16" />,
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            label: 'Working Hours',
                        },
                        {
                            name: nameof<TimerSetting>(x => x.lunchTime),
                            children: (
                                <TimePicker.RangePicker
                                    type="time"
                                    format={DateTimeConstant.HH_MM}
                                    placeholder={['Lunch start time', 'Lunch end time']}
                                />
                            ),
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            label: 'Lunch Time',
                        },
                    ]}
                    layout="vertical"
                    labelCol={12}
                    className={'w-full flex items-center justify-center flex-col'}
                    width={'100%'}
                    renderBtnBottom={() => {
                        return (
                            <div className="w-full mt-4 flex gap-x-2">
                                <Button type="primary" onClick={() => handleSave()}>
                                    Save Setting
                                </Button>
                                {/* <Button type="default" onClick={() => handleReset()}>
                                        Reset
                                    </Button> */}
                            </div>
                        );
                    }}
                />
            </div>
            {!_.isEqual(timerSetting, DEFAULT_TIMER_SETTING) && (
                <FloatButton
                    href="/"
                    tooltip={<div>Home</div>}
                    type="default"
                    shape="circle"
                    icon={
                        <motion.div
                            initial={{ '--scale': 0.8 }}
                            animate={{ '--scale': 1.2 }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0, ease: 'easeInOut' }}
                        >
                            <HomeTwoTone style={{ transform: 'scale(var(--scale))' }} twoToneColor="#637381" />
                        </motion.div>
                    }
                />
            )}
        </Container>
    );
};

export default TimerSettingPage;
