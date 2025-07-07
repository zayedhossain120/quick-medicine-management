import { authApi } from "./api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  phone?: string;
  joinDate: string;
  image?: string;
  status: string;
  occupation?: string;
  address?: string;
}

export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      // Store token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("userRole", response.user.role);

      return response.user;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },

  isAdmin: (): boolean => {
    const user = auth.getCurrentUser();
    return user?.role === "admin";
  },

  isMember: (): boolean => {
    const user = auth.getCurrentUser();
    return user?.role === "member";
  },
};
