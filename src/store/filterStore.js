import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFilterStore = create(
  persist(
    (set) => ({
      searchQuery: '',
      filterType: 'All',
      filterCategory: 'All',
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterType: (type) => set({ filterType: type }),
      setFilterCategory: (category) => set({ filterCategory: category }),
    }),
    {
      name: 'filter-storage'
    }
  )
);

export default useFilterStore;
