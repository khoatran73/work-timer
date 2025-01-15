import _ from 'lodash';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import requestApi from '~/lib/requestApi';
import useTimerSetting from '~/store/useTimerSetting';
import useWorkingTime from '~/store/useWorkingTime';
import { TimerSettingDto } from '~/types/timer-setting';
import { UserDto } from '~/types/user';
import { WorkingTimeDto } from '~/types/working-time';
import useCurrentUser from '../store/useCurrentUser';

interface Props extends PropsWithChildren {}

const ZustandProvider: React.FC<Props> = ({ children }) => {
    const { setUser, clearUser, setLoading: setLoadingUser } = useCurrentUser();
    const { setWorkingTime, clearWorkingTime, setLoading: setLoadingWorkingTime } = useWorkingTime();
    const { setTimerSetting, clearTimerSetting, setLoading: setLoadingTimerSetting } = useTimerSetting();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            setIsLoading(true);
            Promise.allSettled([
                requestApi<any, UserDto>('/api/user/current-user', 'get'),
                requestApi<any, WorkingTimeDto | null>('/api/working-time/today', 'get'),
                requestApi<any, TimerSettingDto | null>('/api/timer-setting', 'get'),
            ])
                .then(async ([resUser, resWorkingTime, resTimerSetting]) => {
                    if (resUser.status === 'fulfilled') {
                        setUser({
                            id: resUser.value.data.id,
                            name: resUser.value.data.name,
                            email: resUser.value.data.email,
                            image: resUser.value.data.image,
                        });
                    } else {
                        clearUser();
                    }

                    if (resWorkingTime.status === 'fulfilled' && !_.isEmpty(resWorkingTime.value.data)) {
                        setWorkingTime({
                            id: resWorkingTime.value.data.id,
                            checkInTime: resWorkingTime.value.data.checkInTime,
                            checkOutTime: resWorkingTime.value.data.checkOutTime,
                            userId: resWorkingTime.value.data.userId,
                            date: resWorkingTime.value.data.date,
                        });
                    } else {
                        clearWorkingTime();
                    }

                    if (resTimerSetting.status === 'fulfilled' && !_.isEmpty(resTimerSetting.value.data)) {
                        setTimerSetting({
                            ...resTimerSetting.value.data,
                        });
                    } else {
                        clearTimerSetting();
                    }
                })
                .catch(error => {
                    clearUser();
                    clearWorkingTime();
                })
                .finally(() => {
                    setLoadingUser(false);
                    setLoadingWorkingTime(false);
                    setLoadingTimerSetting(false);
                    setIsLoading(false);
                });
        };

        fetchData();
    }, [setUser, setWorkingTime, setTimerSetting]);

    if (isLoading) return <></>;
    return <>{children}</>;
};

export default ZustandProvider;
