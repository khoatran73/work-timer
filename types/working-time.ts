import { DateTime } from './date-time';
import { Identity } from './identity';

export interface WorkingTimeDto extends Identity {
    userId: string;
    checkInTime: string;
    checkOutTime: string;
    date: DateTime;
}

export interface WorkingTimeUpsertDto extends Pick<WorkingTimeDto, 'checkInTime'> {}
