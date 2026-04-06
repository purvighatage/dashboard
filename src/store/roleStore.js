import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRoleStore = create(
  persist(
    (set) => ({
      role: 'Admin',
      setRole: (role) => set({ role }),
    }),
    {
      name: 'role-storage'
    }
  )
);

export default useRoleStore;
