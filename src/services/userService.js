import api from "./api";

const userService = {
  async getAll() {
    try {
      const { data } = await api.get("/users");
      return data.data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao buscar usuários";
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/users/${id}`);
      return data.data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao buscar usuário";
    }
  },

  async updateProfile(userData) {
    try {
      const route = userData._id ? `/users/${userData._id}` : "/users/me";
      const { data } = await api.put(route, userData);

      if (!userData._id) {
        const user = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify({ ...user, ...data.data }));
      }

      return data.data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao atualizar perfil";
    }
  },

  async update(id, userData) {
    try {
      const { data } = await api.put(`/users/${id}`, userData);

      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && currentUser.id === id) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...currentUser, ...data.data })
        );
      }

      return data.data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao atualizar usuário";
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/users/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao deletar usuário";
    }
  },

  async uploadProfileImage(file) {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const { data } = await api.post("/users/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const user = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, profileImage: data.data.profileImage })
      );

      return data.data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao fazer upload da imagem";
    }
  },

  async deleteProfileImage() {
    try {
      const { data } = await api.delete("/users/profile-image");

      const user = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, profileImage: null })
      );

      return data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao deletar imagem";
    }
  },
};

export default userService;
