import api from "./api";

const authService = {
  async login(email, password) {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      return data.data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao fazer login";
    }
  },

  async register(userData) {
    try {
      const { data } = await api.post("/auth/register", userData);

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      return data.data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao registrar";
    }
  },

  async getMe() {
    try {
      const { data } = await api.get("/auth/me");
      return data.data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao buscar dados do usuário";
    }
  },

  async updatePassword(currentPassword, newPassword) {
    try {
      const { data } = await api.put("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      localStorage.setItem("token", data.data.token);

      return data.data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao atualizar senha";
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};

export default authService;
