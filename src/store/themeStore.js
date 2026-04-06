import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem('theme') === 'dark',
  toggleTheme: () => set((state) => {
    const newMode = !state.isDarkMode;
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
    // Automatically toggle the class on the body to instantly switch theme
    if (newMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    return { isDarkMode: newMode };
  }),
}));

export default useThemeStore;
