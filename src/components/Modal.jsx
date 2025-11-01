import { useState, useEffect } from "react";
import { X, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import {
  maskCPF,
  isValidCPF,
  isValidEmail,
  isStrongPassword,
  getPasswordStrengthMessage,
} from "../utils/validation";

const Modal = ({ type, item, onClose, onSave }) => {
  const [formData, setFormData] = useState(item || {});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(getPasswordStrengthMessage(formData.password));
    } else {
      setPasswordStrength("");
    }
  }, [formData.password]);

  const validateForm = () => {
    const newErrors = {};
    const isProduct = type.includes("Product");
    const isCustomer = type.includes("Customer");

    if (isProduct) {
      if (!formData.name?.trim()) newErrors.name = "Nome é obrigatório";
      if (!formData.price || formData.price <= 0)
        newErrors.price = "Preço deve ser maior que zero";
      if (!formData.type?.trim()) newErrors.type = "Tipo é obrigatório";
      if (!formData.description?.trim())
        newErrors.description = "Descrição é obrigatória";
      if (!formData.expirationDate)
        newErrors.expirationDate = "Data de validade é obrigatória";
    } else {
      // Validações para Usuário e Cliente
      if (!formData.name?.trim()) newErrors.name = "Nome é obrigatório";

      // Validação de Email
      if (!formData.email?.trim()) {
        newErrors.email = "Email é obrigatório";
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = "Email inválido";
      }

      // Validação de CPF
      if (!formData.cpf?.trim()) {
        newErrors.cpf = "CPF é obrigatório";
      } else if (!isValidCPF(formData.cpf)) {
        newErrors.cpf = "CPF inválido";
      }

      // Validação de Senha (apenas para usuários, não para clientes)
      if (!isCustomer) {
        if (type === "addUser") {
          if (!formData.password?.trim()) {
            newErrors.password = "Senha é obrigatória";
          } else if (!isStrongPassword(formData.password).isValid) {
            newErrors.password = "Senha não atende aos requisitos de segurança";
          }
        } else if (type === "editUser" && formData.password) {
          if (!isStrongPassword(formData.password).isValid) {
            newErrors.password = "Senha não atende aos requisitos de segurança";
          }
        }
      }

      // Validações específicas para usuário
      if (!isCustomer && !formData.role) {
        newErrors.role = "Cargo é obrigatório";
      }

      // Validações específicas para cliente
      if (isCustomer) {
        if (!formData.age || formData.age < 1) {
          newErrors.age = "Idade deve ser maior que zero";
        }
        if (!formData.customerSince) {
          newErrors.customerSince = "Data de cadastro é obrigatória";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleChange = (field, value) => {
    // Aplica máscara de CPF
    if (field === "cpf") {
      value = maskCPF(value);
    }

    setFormData({ ...formData, [field]: value });

    // Remove o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const isView = type === "viewUser" || type === "viewCustomer";
  const isProduct = type.includes("Product");
  const isCustomer = type.includes("Customer");

  const title = isView
    ? isCustomer
      ? "Detalhes do Cliente"
      : "Detalhes do Usuário"
    : type === "addProduct"
    ? "Adicionar Produto"
    : type === "editProduct"
    ? "Editar Produto"
    : type === "addCustomer"
    ? "Adicionar Cliente"
    : type === "editCustomer"
    ? "Editar Cliente"
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
                    errors.name ? "border-red-300 bg-red-50" : "border-zinc-200"
                  }`}
                  placeholder="Ex: Chocolate Nestlé"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.name}</span>
                  </p>
                )}
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
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
                      errors.price
                        ? "border-red-300 bg-red-50"
                        : "border-zinc-200"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.price}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Tipo *
                  </label>
                  <input
                    type="text"
                    value={formData.type || ""}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
                      errors.type
                        ? "border-red-300 bg-red-50"
                        : "border-zinc-200"
                    }`}
                    placeholder="Ex: Doces, Grãos"
                  />
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.type}</span>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm resize-none ${
                    errors.description
                      ? "border-red-300 bg-red-50"
                      : "border-zinc-200"
                  }`}
                  rows="3"
                  placeholder="Descreva o produto..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.description}</span>
                  </p>
                )}
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
                    errors.expirationDate
                      ? "border-red-300 bg-red-50"
                      : "border-zinc-200"
                  }`}
                />
                {errors.expirationDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.expirationDate}</span>
                  </p>
                )}
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
                    errors.name ? "border-red-300 bg-red-50" : "border-zinc-200"
                  }`}
                  disabled={isView}
                  placeholder="Ex: João Silva"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-zinc-200"
                  }`}
                  disabled={isView}
                  placeholder="exemplo@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  value={formData.cpf || ""}
                  onChange={(e) => handleChange("cpf", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
                    errors.cpf ? "border-red-300 bg-red-50" : "border-zinc-200"
                  }`}
                  disabled={isView}
                  placeholder="000.000.000-00"
                  maxLength="14"
                />
                {errors.cpf && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.cpf}</span>
                  </p>
                )}
              </div>

              {isCustomer && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Idade *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.age || ""}
                      onChange={(e) =>
                        handleChange("age", parseInt(e.target.value))
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
                        errors.age
                          ? "border-red-300 bg-red-50"
                          : "border-zinc-200"
                      }`}
                      disabled={isView}
                      placeholder="Ex: 25"
                    />
                    {errors.age && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle size={14} />
                        <span>{errors.age}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Cliente Desde *
                    </label>
                    <input
                      type="date"
                      value={formData.customerSince || ""}
                      onChange={(e) =>
                        handleChange("customerSince", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
                        errors.customerSince
                          ? "border-red-300 bg-red-50"
                          : "border-zinc-200"
                      }`}
                      disabled={isView}
                    />
                    {errors.customerSince && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle size={14} />
                        <span>{errors.customerSince}</span>
                      </p>
                    )}
                  </div>
                </>
              )}

              {!isCustomer && !isView && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Senha{" "}
                    {type === "addUser" ? "*" : "(deixe vazio para manter)"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password || ""}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-zinc-200"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={1.5} />
                      ) : (
                        <Eye size={18} strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <p
                      className={`mt-1 text-xs flex items-center space-x-1 ${
                        isStrongPassword(formData.password).isValid
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {isStrongPassword(formData.password).isValid ? (
                        <CheckCircle size={14} />
                      ) : (
                        <AlertCircle size={14} />
                      )}
                      <span>{passwordStrength}</span>
                    </p>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>
              )}

              {!isCustomer && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Cargo *
                  </label>
                  <select
                    value={formData.role || ""}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
                      errors.role
                        ? "border-red-300 bg-red-50"
                        : "border-zinc-200"
                    }`}
                    disabled={isView}
                  >
                    <option value="">Selecione...</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Estoquista">Estoquista</option>
                    <option value="Caixa">Caixa</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.role}</span>
                    </p>
                  )}
                </div>
              )}
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
