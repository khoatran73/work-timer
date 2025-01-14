import { Identity, IdentityUpsert } from './identity';
import { TimerDto, TimerUpsertDto } from './timer';

export interface TimerSettingDto extends Identity {
    workingHours: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    startWorkingTimeId: string;
    endWorkingTimeId: string;
    lunchTimeId: string;

    startWorkingTime: TimerDto;
    endWorkingTime: TimerDto;
    lunchTime: TimerDto;
}

export interface TimerSettingUpsertDto extends Pick<TimerSettingDto, 'workingHours'>, IdentityUpsert {
    startWorkingTime: TimerUpsertDto;
    lunchTime: TimerUpsertDto;
}
