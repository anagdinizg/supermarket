import { useState, useEffect } from "react";
import { X, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import {
  maskCPF,
  isValidCPF,
  isValidEmail,
  isStrongPassword,
  getPasswordStrengthMessage,
} from "../utils/validation";
import AvatarUpload from "./AvatarUpload";


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


  const isUser = type.toLowerCase().includes("user");
  const isCustomer = type.toLowerCase().includes("customer");
  const isProduct = type.toLowerCase().includes("product");
  const isView = type.toLowerCase().startsWith("view");


  const validateForm = () => {
    const newErrors = {};


    if (isProduct) {
      if (!formData.name?.trim()) newErrors.name = "Nome é obrigatório";
      if (!formData.price || formData.price <= 0)
        newErrors.price = "Preço deve ser maior que zero";
      if (!formData.type?.trim()) newErrors.type = "Tipo é obrigatório";
      if (!formData.description?.trim())
        newErrors.description = "Descrição é obrigatória";
      if (!formData.expirationDate)
        newErrors.expirationDate = "Data de validade é obrigatória";
    }


    if (isUser || isCustomer) {
      if (!formData.name?.trim()) newErrors.name = "Nome é obrigatório";


      if (!formData.email?.trim()) newErrors.email = "Email é obrigatório";
      else if (!isValidEmail(formData.email))
        newErrors.email = "Email inválido";


      if (!formData.cpf?.trim()) newErrors.cpf = "CPF é obrigatório";
      else if (!isValidCPF(formData.cpf)) newErrors.cpf = "CPF inválido";


      if (isUser) {
        if (
          (type === "addUser" || type === "AddUser") &&
          !formData.password?.trim()
        )
          newErrors.password = "Senha é obrigatória";
        else if (
          formData.password &&
          !isStrongPassword(formData.password).isValid
        )
          newErrors.password = "Senha não atende aos requisitos de segurança";


        if (!formData.role) newErrors.role = "Cargo é obrigatório";
      }


      if (isCustomer) {
        if (!formData.age || formData.age < 1)
          newErrors.age = "Idade deve ser maior que zero";
        if (!formData.customerSince)
          newErrors.customerSince = "Data de cadastro é obrigatória";
      }
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
  };


  const handleChange = (field, value) => {
    if (field === "cpf") value = maskCPF(value);
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };


  const handleAvatarChange = (avatar) => {
    setFormData({ ...formData, avatar });
  };


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
    : type === "editUser"
    ? "Editar Usuário"
    : "Modal";


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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isProduct && (
            <>
              <InputField
                label="Nome do Produto *"
                value={formData.name}
                onChange={(v) => handleChange("name", v)}
                error={errors.name}
                placeholder="Ex: Chocolate Nestlé"
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Preço (R$) *"
                  value={formData.price}
                  type="number"
                  onChange={(v) => handleChange("price", parseFloat(v))}
                  error={errors.price}
                  placeholder="0.00"
                />
                <InputField
                  label="Tipo *"
                  value={formData.type}
                  onChange={(v) => handleChange("type", v)}
                  error={errors.type}
                  placeholder="Ex: Doces, Grãos"
                />
              </div>
              <InputField
                label="Descrição *"
                value={formData.description}
                onChange={(v) => handleChange("description", v)}
                error={errors.description}
                textarea
                placeholder="Descreva o produto..."
              />
              <InputField
                label="Data de Validade *"
                value={formData.expirationDate}
                onChange={(v) => handleChange("expirationDate", v)}
                type="date"
                error={errors.expirationDate}
              />
            </>
          )}


          {(isUser || isCustomer) && (
            <>
              {isUser && (
                <div className="flex justify-center pb-4 border-b border-zinc-200">
                  <AvatarUpload
                    currentAvatar={formData.avatar || null}
                    onAvatarChange={handleAvatarChange}
                    userName={formData.name || "Usuário"}
                    isView={isView}
                  />
                </div>
              )}
              <InputField
                label="Nome Completo *"
                value={formData.name}
                onChange={(v) => handleChange("name", v)}
                error={errors.name}
                disabled={isView}
              />
              <InputField
                label="Email *"
                value={formData.email}
                onChange={(v) => handleChange("email", v)}
                error={errors.email}
                disabled={isView}
              />
              <InputField
                label="CPF *"
                value={formData.cpf}
                onChange={(v) => handleChange("cpf", v)}
                error={errors.cpf}
                disabled={isView}
                maxLength={14}
              />
              {isCustomer && (
                <>
                  <InputField
                    label="Idade *"
                    type="number"
                    value={formData.age}
                    onChange={(v) => handleChange("age", parseInt(v))}
                    error={errors.age}
                    disabled={isView}
                  />
                  <InputField
                    label="Cliente Desde *"
                    type="date"
                    value={formData.customerSince}
                    onChange={(v) => handleChange("customerSince", v)}
                    error={errors.customerSince}
                    disabled={isView}
                  />
                </>
              )}
              {isUser && !isView && (
                <PasswordField
                  label={
                    type === "addUser"
                      ? "Senha *"
                      : "Senha (deixe vazio para manter)"
                  }
                  value={formData.password}
                  onChange={(v) => handleChange("password", v)}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  error={errors.password}
                  strength={passwordStrength}
                />
              )}
              {isUser && (
                <SelectField
                  label="Cargo *"
                  value={formData.role}
                  onChange={(v) => handleChange("role", v)}
                  options={["Gerente", "Vendedor", "Estoquista", "Caixa"]}
                  error={errors.role}
                  disabled={isView}
                />
              )}
            </>
          )}


          {!isView ? (
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
          ) : (
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


const InputField = ({
  label,
  value,
  onChange,
  error,
  type = "text",
  textarea = false,
  disabled = false,
  maxLength,
}) => (
  <div>
    <label className="block text-sm font-medium text-zinc-700 mb-2">
      {label}
    </label>
    {textarea ? (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm resize-none ${
          error ? "border-red-300 bg-red-50" : "border-zinc-200"
        }`}
        rows="3"
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
          error ? "border-red-300 bg-red-50" : "border-zinc-200"
        }`}
        disabled={disabled}
        maxLength={maxLength}
      />
    )}
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
        <AlertCircle size={14} />
        <span>{error}</span>
      </p>
    )}
  </div>
);


const PasswordField = ({
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
  error,
  strength,
}) => (
  <div>
    <label className="block text-sm font-medium text-zinc-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
          error ? "border-red-300 bg-red-50" : "border-zinc-200"
        }`}
        placeholder="••••••••"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {value && (
      <p
        className={`mt-1 text-xs flex items-center space-x-1 ${
          isStrongPassword(value).isValid
            ? "text-emerald-600"
            : "text-amber-600"
        }`}
      >
        {isStrongPassword(value).isValid ? (
          <CheckCircle size={14} />
        ) : (
          <AlertCircle size={14} />
        )}
        <span>{strength}</span>
      </p>
    )}
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
        <AlertCircle size={14} />
        <span>{error}</span>
      </p>
    )}
  </div>
);


const SelectField = ({ label, value, onChange, options, error, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-zinc-700 mb-2">
      {label}
    </label>
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm ${
        error ? "border-red-300 bg-red-50" : "border-zinc-200"
      }`}
      disabled={disabled}
    >
      <option value="">Selecione...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
        <AlertCircle size={14} />
        <span>{error}</span>
      </p>
    )}
  </div>
);


export default Modal;
