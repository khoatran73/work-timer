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
