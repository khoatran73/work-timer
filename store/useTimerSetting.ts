import { create } from 'zustand';
import { TimerSettingDto } from '~/types/timer-setting';

interface UseTimerSetting {
    timerSetting: TimerSettingDto | null;
    loading: boolean;
    setTimerSetting: (timerSetting: TimerSettingDto | null) => void;
    clearTimerSetting: () => void;
    setLoading: (loading: boolean) => void;
}

const useTimerSetting = create<UseTimerSetting>(set => ({
    timerSetting: null,
    loading: true,
    setTimerSetting: timerSetting => set({ timerSetting }),
    clearTimerSetting: () => set({ timerSetting: null }),
    setLoading: loading => set({ loading }),
}));

export default useTimerSetting;
