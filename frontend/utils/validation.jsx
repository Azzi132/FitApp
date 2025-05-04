export const isValidNumber = (value) =>
  !isNaN(value) && isFinite(value) && value >= 0;
