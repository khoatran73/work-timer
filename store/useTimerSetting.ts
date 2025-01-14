import { create } from 'zustand';
import { TimerSettingDto } from '~/types/timer-setting';

interface UseTimerSetting {
    timerSetting: TimerSettingDto | null;
    setTimerSetting: (timerSetting: TimerSettingDto | null) => void;
    clearTimerSetting: () => void;
}

const useTimerSetting = create<UseTimerSetting>(set => ({
    timerSetting: null,
    setTimerSetting: timerSetting => set({ timerSetting }),
    clearTimerSetting: () => set({ timerSetting: null }),
}));

export default useTimerSetting;
