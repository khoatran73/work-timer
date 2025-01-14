import { create } from 'zustand';
import { WorkingTimeDto } from '~/types/working-time';

interface UseWorkingTime {
    workingTime: WorkingTimeDto | null;
    setWorkingTime: (workingTime: WorkingTimeDto | null) => void;
    clearWorkingTime: () => void;
}

const useWorkingTime = create<UseWorkingTime>(set => ({
    workingTime: null,
    setWorkingTime: workingTime => set({ workingTime }),
    clearWorkingTime: () => set({ workingTime: null }),
}));

export default useWorkingTime;
