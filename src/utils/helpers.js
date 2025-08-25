/**
 * Valida se uma URL é válida
 * @param {string} url - URL para validar
 * @returns {boolean} - Retorna true se a URL for válida
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Formata a data no padrão brasileiro
 * @param {Date} date - Data para formatar
 * @returns {string} - Data formatada
 */
export const formatDateToBR = (date) => {
  return date.toLocaleDateString('pt-BR');
};

/**
 * Gera uma URL de placeholder para capa de livro
 * @param {string} title - Título do livro
 * @returns {string} - URL do placeholder
 */
export const generateBookCoverPlaceholder = (title = 'Sem Capa') => {
  const encodedTitle = encodeURIComponent(title);
  return `https://via.placeholder.com/200x300/6366f1/white?text=${encodedTitle}`;
};

/**
 * Debounce function para otimizar pesquisas
 * @param {Function} func - Função para fazer debounce
 * @param {number} wait - Tempo de espera em millisegundos
 * @returns {Function} - Função com debounce aplicado
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
