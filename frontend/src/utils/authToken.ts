export const authToken = {
  get: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt_token');
    }
    return null;
  },

  save: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_token', token);
    }
  },

  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
    }
  },

  getAuthHeader: (): Record<string, string> => {
    const token = authToken.get();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
