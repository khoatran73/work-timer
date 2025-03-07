'use client';

import { Button, Divider, Popover, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { signOut } from 'next-auth/react';
import React from 'react';
import { MdOutlineLogout } from 'react-icons/md';
import { DateTimeConstant } from '~/constants/DateTimeConstant';
import { NotificationConstant } from '~/constants/NotificationConstant';
import requestApi from '~/lib/requestApi';
import useCurrentUser from '~/store/useCurrentUser';
import useWorkingTime from '~/store/useWorkingTime';
import { WorkingTimeDto, WorkingTimeUpsertDto } from '~/types/working-time';
import NotifyUtil from '~/utils/NotifyUtil';

interface Props {}

const DashboardHeader: React.FC<Props> = props => {
    const { user } = useCurrentUser();
    const { workingTime, setWorkingTime } = useWorkingTime();

    const renderAvatar = (size: number, padding: number) => {
        return (
            <div
                className="rounded-full flex items-center justify-center overflow-hidden"
                style={{
                    backgroundColor: '#0d9f73',
                    backgroundImage: 'linear-gradient(160deg, #0d9f73 0%, #e79e11 33%, #9ae4c2 66%, #fff5d5 100%)',
                    width: size,
                    height: size,
                    padding,
                }}
            >
                <img src={user.image || ''} alt="avatar" className="w-full h-full rounded-full" />
            </div>
        );
    };

    const handleCheckInTimeChange = async (date: dayjs.Dayjs) => {
        const checkInTime = date.format(DateTimeConstant.HH_MM);

        try {
            const response = await requestApi<WorkingTimeUpsertDto, WorkingTimeDto>('/api/working-time', 'post', {
                checkInTime,
            });
            setWorkingTime(response.data);
        } catch (err) {
            console.log('err: ', err);
            NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.SOME_THING_WENT_WRONG);
        }
    };

    return (
        <div className="w-full h-16 bg-white px-10 flex items-center justify-between">
            <div>Today: {dayjs().format(DateTimeConstant.DD_MM_YYYY)}</div>
            <div>
                <TimePicker
                    key={workingTime?.checkInTime}
                    type="time"
                    placeholder="Checking Time"
                    format={DateTimeConstant.HH_MM}
                    onChange={handleCheckInTimeChange}
                    allowClear={false}
                    defaultValue={workingTime ? dayjs(workingTime?.checkInTime, DateTimeConstant.HH_MM) : undefined}
                />
            </div>
            <div className="h-full flex items-center justify-center">
                <Popover
                    content={
                        <div className="w-64">
                            <div className="p-8 pb-0 w-full flex flex-col items-center justify-center">
                                {renderAvatar(100, 4)}
                                <div
                                    style={{
                                        color: 'var(--text-main)',
                                    }}
                                    className="mt-6 text-lg font-bold"
                                >
                                    {user.name}
                                </div>
                                <div
                                    style={{
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    {user.email}
                                </div>
                            </div>
                            <Divider />
                            <div className="w-full">
                                <Button
                                    icon={<MdOutlineLogout />}
                                    iconPosition="start"
                                    onClick={() => signOut()}
                                    danger
                                    block
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    }
                    trigger="click"
                    placement="bottomRight"
                    className="cursor-pointer"
                >
                    {renderAvatar(40, 2)}
                </Popover>
            </div>
        </div>
    );
};

export default DashboardHeader;
