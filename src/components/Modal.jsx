import { useState, useEffect } from "react";
import { X, Tag } from "lucide-react";
import authService from "../services/authService";
import { maskCPF, maskPhone, removeMask } from "../utils/validation";

const Modal = ({ type, item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    description: "",
    price: "",
    promotionalPrice: "",
    stock: "",
    category: "",
    phone: "",
    cpf: "",
    address: "",
  });

  const loggedUser = authService.getUser();
  const canEditPromotion =
    loggedUser &&
    (loggedUser.role === "admin" || loggedUser.role === "manager");
  const canEditRole =
    loggedUser &&
    (loggedUser.role === "admin" || loggedUser.role === "manager");

  useEffect(() => {
    if (item) {
      setFormData({
        ...formData,
        ...item,
        password: "",
        promotionalPrice: item.promotionalPrice || "",
        phone: maskPhone(item.phone || ""),
        cpf: maskCPF(item.cpf || ""),
        role: item.role
          ? item.role.charAt(0).toUpperCase() + item.role.slice(1)
          : "Employee",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: maskPhone(value) }));
    } else if (name === "cpf") {
      setFormData((prev) => ({ ...prev, [name]: maskCPF(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let dataToSave = {
      ...formData,
      phone: removeMask(formData.phone),
      cpf: removeMask(formData.cpf),
    };

    if (type === "editProduct") {
      if (!canEditPromotion) {
        delete dataToSave.promotionalPrice;
      } else {
        if (!formData.promotionalPrice || formData.promotionalPrice === "") {
          dataToSave.promotionalPrice = null;
        }
      }
    }

    if (type === "addProduct") {
      if (!canEditPromotion) {
        delete dataToSave.promotionalPrice;
      } else if (
        !formData.promotionalPrice ||
        formData.promotionalPrice === ""
      ) {
        delete dataToSave.promotionalPrice;
      }
    }

    onSave(dataToSave);
  };

  const isViewMode = type?.startsWith("view");
  const isAddMode = type?.startsWith("add");
  const isEditMode = type?.startsWith("edit");

  const getTitle = () => {
    if (type === "addUser") return "Adicionar Usuário";
    if (type === "editUser") return "Editar Usuário";
    if (type === "viewUser") return "Detalhes do Usuário";
    if (type === "addCustomer") return "Adicionar Cliente";
    if (type === "editCustomer") return "Editar Cliente";
    if (type === "viewCustomer") return "Detalhes do Cliente";
    if (type === "addProduct") return "Adicionar Produto";
    if (type === "editProduct") return "Editar Produto";
    return "Modal";
  };

  const renderProductForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Nome do Produto
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Descrição
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Preço Normal (R$)
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2 flex items-center space-x-2">
            <span>Preço Promocional (R$)</span>
            <Tag size={14} className="text-emerald-600" />
          </label>
          <input
            type="number"
            name="promotionalPrice"
            step="0.01"
            min="0"
            value={formData.promotionalPrice}
            onChange={handleChange}
            placeholder={canEditPromotion ? "Opcional" : "Sem permissão"}
            disabled={!canEditPromotion}
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm disabled:bg-zinc-100 disabled:cursor-not-allowed"
          />
          {!canEditPromotion && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ Apenas admin e manager podem gerenciar promoções
            </p>
          )}
          {canEditPromotion &&
            formData.promotionalPrice &&
            formData.price &&
            parseFloat(formData.promotionalPrice) >=
              parseFloat(formData.price) && (
              <p className="text-xs text-red-600 mt-1">
                Preço promocional deve ser menor que o preço normal
              </p>
            )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Estoque
          </label>
          <input
            type="number"
            name="stock"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Categoria
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
          />
        </div>
      </div>

      {canEditPromotion &&
        formData.promotionalPrice &&
        formData.price &&
        parseFloat(formData.promotionalPrice) < parseFloat(formData.price) && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Tag size={16} className="text-emerald-600" />
              <span className="text-sm font-medium text-emerald-900">
                Produto em Promoção
              </span>
            </div>
            <div className="text-xs text-emerald-700 space-y-1">
              <p>Preço Normal: R$ {parseFloat(formData.price).toFixed(2)}</p>
              <p>
                Preço Promocional: R${" "}
                {parseFloat(formData.promotionalPrice).toFixed(2)}
              </p>
              <p className="font-medium">
                Economia: R${" "}
                {(
                  parseFloat(formData.price) -
                  parseFloat(formData.promotionalPrice)
                ).toFixed(2)}
                (
                {(
                  ((parseFloat(formData.price) -
                    parseFloat(formData.promotionalPrice)) /
                    parseFloat(formData.price)) *
                  100
                ).toFixed(0)}
                % OFF)
              </p>
            </div>
          </div>
        )}
    </>
  );

  const renderUserForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Nome
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isViewMode}
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm disabled:bg-zinc-50"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isViewMode}
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm disabled:bg-zinc-50"
          required
        />
      </div>

      {isAddMode && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Senha
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Função
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={isViewMode || (isEditMode && !canEditRole)}
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm disabled:bg-zinc-50 disabled:cursor-not-allowed"
          required
        >
          <option value="Employee">Funcionário</option>
          <option value="Manager">Gerente</option>
          {loggedUser?.role === "admin" && (
            <option value="Admin">Administrador</option>
          )}
        </select>
        {isEditMode && !canEditRole && (
          <p className="text-xs text-zinc-500 mt-1">
            Apenas admin e manager podem alterar função
          </p>
        )}
      </div>
    </>
  );

  const renderCustomerForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Nome
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isViewMode}
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm disabled:bg-zinc-50"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isViewMode}
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm disabled:bg-zinc-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Telefone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isViewMode}
            placeholder="(00) 00000-0000"
            maxLength="15"
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm disabled:bg-zinc-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            CPF
          </label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            disabled={isViewMode}
            placeholder="000.000.000-00"
            maxLength="14"
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm disabled:bg-zinc-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Endereço
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isViewMode}
          rows={3}
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm resize-none disabled:bg-zinc-50"
        />
      </div>
    </>
  );

  const renderForm = () => {
    if (type?.includes("Product")) return renderProductForm();
    if (type?.includes("User")) return renderUserForm();
    if (type?.includes("Customer")) return renderCustomerForm();
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-zinc-200 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <h2 className="text-xl font-light text-zinc-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">{renderForm()}</div>

          {!isViewMode && (
            <div className="p-6 border-t border-zinc-200 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium py-3 rounded-xl transition text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 rounded-xl transition text-sm"
              >
                Salvar
              </button>
            </div>
          )}

          {isViewMode && (
            <div className="p-6 border-t border-zinc-200">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 rounded-xl transition text-sm"
              >
                Fechar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Modal;
