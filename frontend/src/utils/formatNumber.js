// frontend/src/utils/formatNumber.js
export const formatPrice = (price) => {
  if (price === undefined || price === null) return '₿0';
  return `₿${Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatQuantity = (qty) => {
  if (qty === undefined || qty === null) return '0';
  return Number(qty).toLocaleString('en-US');
};