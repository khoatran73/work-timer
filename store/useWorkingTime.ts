import { create } from 'zustand';
import { WorkingTimeDto } from '~/types/working-time';

interface UseWorkingTime {
    workingTime: WorkingTimeDto | null;
    loading: boolean;
    setWorkingTime: (workingTime: WorkingTimeDto | null) => void;
    clearWorkingTime: () => void;
    setLoading: (loading: boolean) => void;
}

const useWorkingTime = create<UseWorkingTime>(set => ({
    workingTime: null,
    loading: true,
    setWorkingTime: workingTime => set({ workingTime }),
    clearWorkingTime: () => set({ workingTime: null }),
    setLoading: loading => set({ loading }),
}));

export default useWorkingTime;
