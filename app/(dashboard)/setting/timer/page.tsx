'use client';

import { Button, Input, TimePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import _ from 'lodash';
import React, { useRef } from 'react';
import FormBase, { FormBaseRef } from '~/components/FormBase';
import Loading from '~/components/Loading';
import { DateTimeConstant } from '~/constants/DateTimeConstant';
import { NotificationConstant } from '~/constants/NotificationConstant';
import useDetail from '~/hooks/useDetail';
import Container from '~/layouts/Container';
import requestApi from '~/lib/requestApi';
import { TimerSettingDto, TimerSettingUpsertDto } from '~/types/timer-setting';
import { nameof } from '~/utils/nameof';
import NotifyUtil from '~/utils/NotifyUtil';

dayjs.extend(customParseFormat);

interface Props {}

const TimerSettingPage: React.FC<Props> = props => {
    const formRef = useRef<FormBaseRef>(null);
    const { isInitialLoading, entity: timerSetting, refetch } = useDetail<TimerSettingDto>('/api/timer-setting');

    const handleSave = async () => {
        const isValidForm = await formRef.current?.isFieldsValidate();

        if (!isValidForm) return;

        const params = formRef.current?.getFieldsValue();
        if (_.isEmpty(params)) return;

        const setting: TimerSettingUpsertDto = {
            startWorkingTime: {
                start: params.startWorkingTime[0].format(DateTimeConstant.HH_MM),
                end: params.startWorkingTime[1].format(DateTimeConstant.HH_MM),
            },
            lunchTime: {
                start: params.lunchTime[0].format(DateTimeConstant.HH_MM),
                end: params.lunchTime[1].format(DateTimeConstant.HH_MM),
            },
            workingHours: _.toNumber(params.workingHours),
        };

        try {
            await requestApi<TimerSettingUpsertDto, TimerSettingDto>('/api/timer-setting', 'post', setting);
            await refetch();
            NotifyUtil.success(NotificationConstant.TITLE, NotificationConstant.SAVE_SUCCESS);
        } catch (err) {
            console.log('err: ', err);
            NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.SOME_THING_WENT_WRONG);
        }
    };

    if (isInitialLoading) return <Loading />;
    return (
        <Container>
            <div className="w-80">
                <h1 className="mb-6">Timer Setting</h1>
                <FormBase
                    ref={formRef}
                    initialValues={
                        timerSetting
                            ? {
                                  lunchTime: [
                                      dayjs(timerSetting?.lunchTime.start, DateTimeConstant.HH_MM),
                                      dayjs(timerSetting?.lunchTime.end, DateTimeConstant.HH_MM),
                                  ],
                                  startWorkingTime: [
                                      dayjs(timerSetting?.startWorkingTime.start, DateTimeConstant.HH_MM),
                                      dayjs(timerSetting?.startWorkingTime.end, DateTimeConstant.HH_MM),
                                  ],
                              }
                            : undefined
                    }
                    formBaseItems={[
                        {
                            name: nameof.full<TimerSettingDto>(x => x.workingHours),
                            children: <Input type="number" placeholder="Working hours" className="w-16" />,
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            label: 'Working Hours',
                            initialValue: timerSetting?.workingHours
                        },
                        {
                            name: nameof<TimerSettingDto>(x => x.startWorkingTime),
                            children: (
                                <TimePicker.RangePicker
                                    type="time"
                                    format={DateTimeConstant.HH_MM}
                                    placeholder={['Start working time start', 'Start working time end']}
                                />
                            ),
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            label: 'Start Working Time',
                        },
                        {
                            name: nameof<TimerSettingDto>(x => x.lunchTime),
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
                    className={'w-full flex items-center justify-center flex-col'}
                    width={'100%'}
                    renderBtnBottom={() => {
                        return (
                            <div className="w-full mt-4 flex gap-x-2">
                                <Button type="primary" onClick={() => handleSave()}>
                                    Save Setting
                                </Button>
                            </div>
                        );
                    }}
                />
            </div>
        </Container>
    );
};

export default TimerSettingPage;
