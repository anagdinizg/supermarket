import { useState } from "react";
import { X } from "lucide-react";

const Modal = ({ type, item, onClose, onSave }) => {
  const [formData, setFormData] = useState(item || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = type.includes("Product")
      ? ["name", "price", "type", "description", "expirationDate"]
      : ["name", "email", "cpf", "role"];

    if (type === "addUser") requiredFields.push("password");

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const isView = type === "viewUser";
  const isProduct = type.includes("Product");
  const title = isView
    ? "Detalhes do Usuário"
    : type === "addProduct"
    ? "Adicionar Produto"
    : type === "editProduct"
    ? "Editar Produto"
    : type === "addUser"
    ? "Adicionar Usuário"
    : "Editar Usuário";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200">
        <div className="flex justify-between items-center p-6 border-b border-zinc-200">
          <h2 className="text-2xl font-light text-zinc-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {isProduct ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                  placeholder="Ex: Chocolate Nestlé"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price || ""}
                    onChange={(e) =>
                      handleChange("price", parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Tipo *
                  </label>
                  <input
                    type="text"
                    value={formData.type || ""}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                    placeholder="Ex: Doces, Grãos"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm resize-none"
                  rows="3"
                  placeholder="Descreva o produto..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Data de Validade *
                </label>
                <input
                  type="date"
                  value={formData.expirationDate || ""}
                  onChange={(e) =>
                    handleChange("expirationDate", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                  disabled={isView}
                  placeholder="Ex: João Silva"
                  required={!isView}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                  disabled={isView}
                  placeholder="exemplo@email.com"
                  required={!isView}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  value={formData.cpf || ""}
                  onChange={(e) => handleChange("cpf", e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                  disabled={isView}
                  placeholder="000.000.000-00"
                  required={!isView}
                />
              </div>
              {!isView && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Senha{" "}
                    {type === "addUser" ? "*" : "(deixe vazio para manter)"}
                  </label>
                  <input
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                    placeholder="••••••••"
                    required={type === "addUser"}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Cargo *
                </label>
                <select
                  value={formData.role || ""}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                  disabled={isView}
                  required={!isView}
                >
                  <option value="">Selecione...</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Estoquista">Estoquista</option>
                  <option value="Caixa">Caixa</option>
                </select>
              </div>
            </div>
          )}
          {!isView && (
            <div className="flex space-x-3 mt-6">
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
          {isView && (
            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium py-3 rounded-xl transition text-sm"
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
