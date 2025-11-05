export const maskCPF = (value) => {
  if (!value) return "";

  value = value.replace(/\D/g, "");

  value = value.slice(0, 11);

  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  return value;
};

export const isValidCPF = (cpf) => {
  if (!cpf) return false;

  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  return true;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid:
      minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
  };
};

export const getPasswordStrengthMessage = (password) => {
  if (!password) return "";

  const validation = isStrongPassword(password);
  const messages = [];

  if (!validation.minLength) messages.push("mínimo 8 caracteres");
  if (!validation.hasUpperCase) messages.push("uma letra maiúscula");
  if (!validation.hasLowerCase) messages.push("uma letra minúscula");
  if (!validation.hasNumber) messages.push("um número");
  if (!validation.hasSpecialChar)
    messages.push("um caractere especial (!@#$%^&*)");

  if (messages.length === 0) return "Senha forte ✓";

  return `Falta: ${messages.join(", ")}`;
};
