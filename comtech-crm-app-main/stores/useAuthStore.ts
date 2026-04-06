import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
    token: null as string | null,
  }),
  actions: {
    async login() {
      try {
        const nuxtApp = useNuxtApp();

        // Wait for nextTick to ensure everything is ready
        await nextTick();

        // Check if we have portal_data (portal user)
        if (import.meta.client) {
          const portalData = localStorage.getItem('portal_data');
          if (portalData) {
            // Portal user, already handled by plugin or elsewhere, redirect to home
            return true;
          }
        }

        // Check Keycloak instance
        const keycloak = nuxtApp.$keycloak as any;
        if (!keycloak) {
          return false;
        }

        // If Keycloak is authenticated, we're good
        if (keycloak.authenticated) {
          return true;
        }

        // Initiate Keycloak login if not authenticated
        if (typeof keycloak.login === 'function') {
          await keycloak.login({
            redirectUri: window.location.origin + '/auth/login',
          });
        }
        return false;
      } catch (error) {
        console.error('Failed to initiate login:', error);
        throw error;
      }
    },
    async logout() {
      // Clear state
      this.user = null;
      this.token = null;

      // Clear local storage
      if (import.meta.client) {
        localStorage.removeItem('kc_user');
        localStorage.removeItem('portal_data');
      }

      // Handle Keycloak logout
      try {
        const nuxtApp = useNuxtApp();
        const keycloak = nuxtApp.$keycloak as any;

        if (keycloak && typeof keycloak.logout === 'function') {
          await keycloak.logout({ redirectUri: window.location.origin });
        } else {
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/';
      }
    },
  },
});
