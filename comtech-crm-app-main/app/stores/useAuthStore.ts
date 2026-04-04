import { defineStore } from 'pinia';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => state.user?.name || '',
    userRole: (state) => state.user?.role || '',
    userInitials: (state) => state.user?.initials || '',
  },

  actions: {
    async login() {
      const nuxtApp = useNuxtApp();
      const keycloak = nuxtApp.$keycloak as any;

      if (keycloak?.authenticated) {
        this.isAuthenticated = true;
        return true;
      }

      if (typeof keycloak?.login === 'function') {
        await keycloak.login({
          redirectUri: window.location.origin + '/auth/login',
        });
      }
      return false;
    },

    async logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      if (import.meta.client) {
        localStorage.removeItem('kc_user');
        localStorage.removeItem('portal_data');
      }

      const nuxtApp = useNuxtApp();
      const keycloak = nuxtApp.$keycloak as any;

      if (keycloak && typeof keycloak.logout === 'function') {
        await keycloak.logout({ redirectUri: window.location.origin });
      }
    },

    setUser(user: User) {
      this.user = user;
      this.isAuthenticated = true;
    },

    setToken(token: string) {
      this.token = token;
    },

    clearAuth() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
    },
  },
});
