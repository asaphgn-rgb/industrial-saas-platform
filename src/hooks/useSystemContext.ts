import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SystemSegment = 'HABITACIONAL' | 'CARTAO';

interface SystemContextState {
  currentSegment: SystemSegment;
  setSegment: (segment: SystemSegment) => void;
  toggleSegment: () => void;
}

export const useSystemContext = create<SystemContextState>()(
  persist(
    (set) => ({
      currentSegment: 'HABITACIONAL',
      setSegment: (segment) => set({ currentSegment: segment }),
      toggleSegment: () =>
        set((state) => ({
          currentSegment: state.currentSegment === 'HABITACIONAL' ? 'CARTAO' : 'HABITACIONAL',
        })),
    }),
    {
      name: 'diamond_system_segment',
    }
  )
);
