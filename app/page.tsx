'use client';

import _ from 'lodash';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { LocalStorageConstant } from '~/constants/LocalStorageConstant';
import useLocalStorage from '~/hooks/useLocalStorage';
import Container from '~/layouts/Container';
import PageContainer from '~/layouts/PageContainer';
import { TimerSetting } from '~/types/timer-setting';

interface Props {}

const HomePage: React.FC<Props> = props => {
    const [timerSetting, setTimerSetting] = useLocalStorage<TimerSetting>(
        LocalStorageConstant.TIMER_SETTING,
        {} as TimerSetting,
    );

    useEffect(() => {
        if (!_.isEmpty(timerSetting)) return;

        redirect('/timer-setting');
    }, []);

    return (
        <PageContainer>
            <Container className="flex items-center justify-center text-white">
                <div className='w-full h-full'>

                </div>
            </Container>
        </PageContainer>
    );
};

export default HomePage;
