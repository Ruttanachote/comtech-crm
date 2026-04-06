import { defineStore } from 'pinia';

export interface SystemState {
  isMenuOpen: boolean;
  isDrawerOpen: boolean;
  showLogoutModal: boolean;
  isLoading: boolean;
}

export const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
    isMenuOpen: true,
    isDrawerOpen: false,
    showLogoutModal: false,
    isLoading: false,
  }),

  actions: {
    setIsMenuOpen(value: boolean) {
      this.isMenuOpen = value;
    },

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    setIsDrawerOpen(value: boolean) {
      this.isDrawerOpen = value;
    },

    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
    },

    setShowLogoutModal(value: boolean) {
      this.showLogoutModal = value;
    },

    setLoading(value: boolean) {
      this.isLoading = value;
    },
  },
});
