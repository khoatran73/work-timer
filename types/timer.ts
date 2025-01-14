import { Identity, IdentityUpsert } from './identity';

export interface TimerDto extends Identity {
    start: string;
    end: string;
    duration: number;
}

export interface TimerUpsertDto extends Omit<TimerDto, 'id' | 'duration'>, IdentityUpsert {}
