import { create } from 'zustand';

const useUIStore = create((set) => ({
  isAddModalOpen: false,
  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),
  toggleAddModal: () => set((state) => ({ isAddModalOpen: !state.isAddModalOpen })),
}));

export default useUIStore;
