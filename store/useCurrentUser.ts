import { create } from 'zustand';
import { UserDto } from '~/types/user';

interface UseCurrentUser {
    user: UserDto;
    loading: boolean;
    setUser: (user: UserDto) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
}

const useCurrentUser = create<UseCurrentUser>(set => ({
    user: {} as UserDto,
    loading: true,
    setUser: user => set({ user }),
    clearUser: () => set({ user: {} as UserDto }),
    setLoading: loading => set({ loading }),
}));

export default useCurrentUser;
