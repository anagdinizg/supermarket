import api from "./api";

const productService = {
  async getAll() {
    try {
      const { data } = await api.get("/products");
      return data.data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao buscar produtos";
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    } catch (error) {
      throw error.response?.data?.message || "Erro ao buscar produto";
    }
  },

  async create(productData) {
    try {
      const payload = {
        name: productData.name,
        description: productData.description || "",
        price: productData.price,
        stock: productData.stock || 0,
        category: productData.category || "",
      };

      if (productData.promotionalPrice) {
        payload.promotionalPrice = productData.promotionalPrice;
      }

      const { data } = await api.post("/products", payload);

      return data.product;
    } catch (error) {
      throw (
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro ao criar produto"
      );
    }
  },

  async update(id, productData) {
    try {
      const payload = {};

      if (productData.name) payload.name = productData.name;
      if (productData.description !== undefined)
        payload.description = productData.description;
      if (productData.price) payload.price = productData.price;

      if (
        productData.promotionalPrice !== undefined &&
        productData.promotionalPrice !== null
      ) {
        payload.promotionalPrice = productData.promotionalPrice;
      }

      if (productData.stock !== undefined) payload.stock = productData.stock;
      if (productData.category !== undefined)
        payload.category = productData.category;
      if (productData.active !== undefined) payload.active = productData.active;

      const { data } = await api.put(`/products/${id}, payload`);

      return data.product;
    } catch (error) {
      throw (
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro ao atualizar produto"
      );
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/products/${id}`);
      return data;
    } catch (error) {
      throw (
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro ao deletar produto"
      );
    }
  },
};

export default productService;
