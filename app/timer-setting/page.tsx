'use client';

import { Button, Input, TimePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import _ from 'lodash';
import { redirect } from 'next/navigation';
import React, { useRef } from 'react';
import FormBase, { FormBaseRef } from '~/components/FormBase';
import { DateTimeConstant } from '~/constants/DateTimeConstant';
import { LocalStorageConstant } from '~/constants/LocalStorageConstant';
import { NotificationConstant } from '~/constants/NotificationConstant';
import useLocalStorage from '~/hooks/useLocalStorage';
import Container from '~/layouts/Container';
import PageContainer from '~/layouts/PageContainer';
import { DEFAULT_TIMER_SETTING, TimerSetting } from '~/types/timer-setting';
import { nameof } from '~/utils/nameof';

dayjs.extend(customParseFormat);

interface Props {}

const TimerSettingPage: React.FC<Props> = props => {
    const formRef = useRef<FormBaseRef>(null);
    const [timerSetting, setTimerSetting] = useLocalStorage<TimerSetting>(
        LocalStorageConstant.TIMER_SETTING,
        DEFAULT_TIMER_SETTING,
    );

    const handleSave = async () => {
        const isValidForm = await formRef.current?.isFieldsValidate();

        if (!isValidForm) return;

        const params = formRef.current?.getFieldsValue();
        if (_.isEmpty(params)) return;

        const setting: TimerSetting = {
            checkingTime: params.checkingTime.format(DateTimeConstant.HH_MM),
            lunchTime: {
                startTime: params.lunchTime[0].format(DateTimeConstant.HH_MM),
                endTime: params.lunchTime[1].format(DateTimeConstant.HH_MM),
            },
            workingHours: _.toNumber(params.workingHours),
        };

        setTimerSetting(setting);

        redirect('/');
    };

    const handleReset = () => {
        formRef.current?.resetFields();
    };

    return (
        <PageContainer>
            <Container className="flex items-center justify-center">
                <div className="w-[500px] rounded-xl p-4 bg-white shadow">
                    <div className="mb-6">
                        <div className="text-2xl font-bold">Timer Setting</div>
                    </div>
                    <FormBase
                        ref={formRef}
                        initialValues={{
                            checkingTime: dayjs(timerSetting.checkingTime, DateTimeConstant.HH_MM),
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
                                    <TimePicker
                                        type="time"
                                        placeholder="Checking Time"
                                        format={DateTimeConstant.HH_MM}
                                    />
                                ),
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                                label: 'Checking Time',
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
                        labelAlign="left"
                        labelCol={7}
                        className={'w-full flex items-center justify-center flex-col'}
                        width={'100%'}
                        renderBtnBottom={() => {
                            return (
                                <div className="w-full mt-4 flex gap-x-2">
                                    <Button type="primary" onClick={() => handleSave()}>
                                        Save Setting
                                    </Button>
                                    <Button type="default" onClick={() => handleReset()}>
                                        Reset
                                    </Button>
                                </div>
                            );
                        }}
                    />
                </div>
            </Container>
        </PageContainer>
    );
};

export default TimerSettingPage;
