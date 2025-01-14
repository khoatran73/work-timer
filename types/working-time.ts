import { DateTime } from './date-time';
import { Identity } from './identity';

export interface WorkingTimeDto extends Identity {
    checkingTime: string;
    checkoutTime: string;
    date: DateTime;
}
