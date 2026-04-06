export const t = (key: string, values?: Record<string, any> | Array<any>) => {
  const { $i18n } = useNuxtApp();
  return $i18n.t(key, values as any);
};
