export const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === 'production') {
    throw new Error("NEXT_PUBLIC_API_URL is missing in production environment");
  }
  return 'http://localhost:3333';
};
