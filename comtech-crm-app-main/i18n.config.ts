export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      welcome: 'Welcome',
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Business overview and key metrics',
        overview: 'Overview',
        hcp: 'HCP',
        executive: 'Executive',
      },
    },
    th: {
      welcome: 'ยินดีต้อนรับ',
      dashboard: {
        title: 'แดชบอร์ด',
        subtitle: 'ภาพรวมธุรกิจและตัวชี้วัดสำคัญ',
        overview: 'ภาพรวม',
        hcp: 'HCP',
        executive: 'ผู้บริหาร',
      },
    },
  },
}))
