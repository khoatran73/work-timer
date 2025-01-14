import { Identity } from './identity';

export interface UserDto extends Identity {
    name: string;
    email: string;
    image?: string;
}
