import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],
  
  addToast: (message, type = 'success', action = null) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, action }]
    }));

    // Auto dismiss after 5s unless it has an action (like Undo)
    if (!action) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, 4000);
    }
    
    // Actions are removed after a bit longer to give user time to click
    if (action) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, 6000);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));

export default useToastStore;
