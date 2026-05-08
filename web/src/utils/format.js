export const formatPriceXOF = (value) => {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPriceRange = (from, to) => {
  if (!from && !to) return 'Sur étude';
  if (from && !to) return `À partir de ${formatPriceXOF(from)}`;
  if (!from && to) return `Jusqu'à ${formatPriceXOF(to)}`;
  return `${formatPriceXOF(from)} – ${formatPriceXOF(to)}`;
};

export const whatsappLink = (number, message = '') => {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const text = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}${text ? `?text=${text}` : ''}`;
};
