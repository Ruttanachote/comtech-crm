// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  vite: {
    define: {
      global: 'globalThis',
    },
    resolve: {
      alias: {
        buffer: 'buffer',
      },
    },
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    ...(process.env.NODE_ENV === 'production' ? ['@vite-pwa/nuxt'] : []),
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Cosmic CRM',
      short_name: 'Cosmic CRM',
      description: 'Cosmic CRM Application',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
      screenshots: [
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          form_factor: 'wide',
          label: 'Cosmic CRM Desktop',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          form_factor: 'narrow',
          label: 'Cosmic CRM Mobile',
        },
      ],
    },
    workbox: {
      navigateFallback: '/index.html',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
      cleanupOutdatedCaches: true,
      navigateFallbackDenylist: [/^\/api\//], // Don't serve fallback for API routes
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Cache images
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30, // <== 30 days
            },
          },
        },
        // Cache API calls (optional, adjust pattern as needed)
        // {
        //   urlPattern: /\/api\/.*/i,
        //   handler: 'NetworkFirst',
        //   options: {
        //     cacheName: 'api-cache',
        //     networkTimeoutSeconds: 10,
        //     expiration: {
        //       maxEntries: 50,
        //       maxAgeSeconds: 60 * 60 * 24, // <== 1 day
        //     },
        //     cacheableResponse: {
        //       statuses: [0, 200],
        //     },
        //   },
        // },
      ],
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600, // Check for updates every hour
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', files: ['en.json', 'en.dashboard.json', 'en.approval.json'] },
      { code: 'th', name: 'Thai', files: ['th.json', 'th.dashboard.json', 'th.approval.json'] },
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      cookieSecure: false, // Ensure cookies work locally
    },
    vueI18n: './i18n.config.ts',
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'info',
        'warning',
        'error',
        'success',
        'orange',
        'matcha',
        'purple',
      ],
    },
  },
  devServer: {
    port: 3000,
  },
  app: {},
  runtimeConfig: {
    public: {
      keycloakUrl: process.env.KEYCLOAK_URL,
      keycloakRealm: process.env.KEYCLOAK_REALM,
      keycloakClientId: process.env.KEYCLOAK_CLIENT_ID,
    },
  },
  components: true,
});
