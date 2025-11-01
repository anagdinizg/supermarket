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
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

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
