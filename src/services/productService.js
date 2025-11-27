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
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description || "");
      formData.append("price", productData.price);

      if (productData.promotionalPrice) {
        formData.append("promotionalPrice", productData.promotionalPrice);
      }

      formData.append("stock", productData.stock || 0);
      formData.append("category", productData.category || "");

      if (productData.image) {
        formData.append("image", productData.image);
      }

      const { data } = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
      const formData = new FormData();

      if (productData.name) formData.append("name", productData.name);
      if (productData.description !== undefined)
        formData.append("description", productData.description);
      if (productData.price) formData.append("price", productData.price);

      if (
        productData.promotionalPrice !== undefined &&
        productData.promotionalPrice !== null
      ) {
        if (
          productData.promotionalPrice === "" ||
          productData.promotionalPrice === 0
        ) {
          formData.append("promotionalPrice", "");
        } else {
          formData.append("promotionalPrice", productData.promotionalPrice);
        }
      }

      if (productData.stock !== undefined)
        formData.append("stock", productData.stock);
      if (productData.category !== undefined)
        formData.append("category", productData.category);
      if (productData.active !== undefined)
        formData.append("active", productData.active);

      if (productData.image) {
        formData.append("image", productData.image);
      }

      const { data } = await api.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
