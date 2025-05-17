
// CPF and date validation functions
export const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

export const validateCPF = (cpf: string) => {
  // Remove non-numeric characters
  const numbers = cpf.replace(/[^\d]/g, "");
  
  // Check if it has 11 digits
  if (numbers.length !== 11) return false;
  
  // Check if all digits are the same
  if (numbers.split("").every(char => char === numbers[0])) return false;
  
  // Validate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(9))) return false;
  
  // Validate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(10))) return false;
  
  return true;
};

export const isValidDateFormat = (dateString: string) => {
  // Check the format first
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false;
  
  const [day, month, year] = dateString.split('/').map(Number);
  
  // Check if the date is valid
  const date = new Date(year, month - 1, day);
  return (
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year &&
    year >= 1900 && 
    year <= new Date().getFullYear()
  );
};

// Formatters for input fields
export const formatCPF = (value: string) => {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

export const formatDate = (value: string) => {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};
