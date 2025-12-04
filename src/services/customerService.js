import api from "./api";

const customerService = {
  async getAll() {
    try {
      const { data } = await api.get("/customers");
      return data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar clientes";
      throw errorMessage;
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/customers/${id}`);
      return data.customer;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar cliente";
      throw errorMessage;
    }
  },

  async create(customerData) {
    try {
      const { data } = await api.post("/customers", customerData);
      return data.customer;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao criar cliente";

      throw errorMessage;
    }
  },

  async update(id, customerData) {
    try {
      const { data } = await api.put(`/customers/${id}`, customerData);
      return data.customer;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao atualizar cliente";

      throw errorMessage;
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/customers/${id}`);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao deletar cliente";
      throw errorMessage;
    }
  },
};

export default customerService;
