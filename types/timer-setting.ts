import { DateTime } from './date-time';

export interface TimerSetting {
    checkingTime: DateTime;
    lunchTime: TimeRange;
    workingHours: number;
}

export interface TimeRange {
    startTime: DateTime;
    endTime: DateTime;
}

export const DEFAULT_TIMER_SETTING: TimerSetting = {
    checkingTime: '00:00',
    lunchTime: {
        startTime: '00:00',
        endTime: '00:00',
    },
    workingHours: 0,
};
