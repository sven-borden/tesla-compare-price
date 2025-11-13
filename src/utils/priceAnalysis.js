/**
 * Calculate average price for a given set of vehicles
 * @param {Array} vehicles - Array of vehicle records
 * @param {string} priceField - The field name for price (default: 'Price')
 * @returns {number} Average price
 */
export const calculateAveragePrice = (vehicles, priceField = 'Price') => {
  if (!vehicles || vehicles.length === 0) return 0;

  const validPrices = vehicles
    .map((v) => parseFloat(v[priceField]))
    .filter((price) => !isNaN(price) && price > 0);

  if (validPrices.length === 0) return 0;

  const sum = validPrices.reduce((acc, price) => acc + price, 0);
  return sum / validPrices.length;
};

/**
 * Group vehicles by a specific field
 * @param {Array} vehicles - Array of vehicle records
 * @param {string} field - The field to group by
 * @returns {Object} Grouped vehicles
 */
export const groupBy = (vehicles, field) => {
  if (!vehicles || vehicles.length === 0) return {};

  return vehicles.reduce((groups, vehicle) => {
    const key = vehicle[field] || 'Unknown';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(vehicle);
    return groups;
  }, {});
};

/**
 * Calculate price statistics for vehicles
 * @param {Array} vehicles - Array of vehicle records
 * @param {string} priceField - The field name for price
 * @returns {Object} Statistics object
 */
export const calculatePriceStats = (vehicles, priceField = 'Price') => {
  if (!vehicles || vehicles.length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0,
      median: 0,
      count: 0,
    };
  }

  const validPrices = vehicles
    .map((v) => parseFloat(v[priceField]))
    .filter((price) => !isNaN(price) && price > 0)
    .sort((a, b) => a - b);

  if (validPrices.length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0,
      median: 0,
      count: 0,
    };
  }

  const min = validPrices[0];
  const max = validPrices[validPrices.length - 1];
  const average = validPrices.reduce((a, b) => a + b, 0) / validPrices.length;
  const median =
    validPrices.length % 2 === 0
      ? (validPrices[validPrices.length / 2 - 1] + validPrices[validPrices.length / 2]) / 2
      : validPrices[Math.floor(validPrices.length / 2)];

  return {
    min,
    max,
    average,
    median,
    count: validPrices.length,
  };
};

/**
 * Filter vehicles by criteria
 * @param {Array} vehicles - Array of vehicle records
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered vehicles
 */
export const filterVehicles = (vehicles, filters) => {
  if (!vehicles || vehicles.length === 0) return [];

  return vehicles.filter((vehicle) => {
    // Model filter
    if (filters.model && vehicle.Model !== filters.model) {
      return false;
    }

    // Year range filter
    if (filters.minYear && vehicle.Year < filters.minYear) {
      return false;
    }
    if (filters.maxYear && vehicle.Year > filters.maxYear) {
      return false;
    }

    // Price range filter
    const price = parseFloat(vehicle.Price);
    if (filters.minPrice && price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && price > filters.maxPrice) {
      return false;
    }

    // Mileage range filter
    const mileage = parseFloat(vehicle.Mileage);
    if (filters.minMileage && mileage < filters.minMileage) {
      return false;
    }
    if (filters.maxMileage && mileage > filters.maxMileage) {
      return false;
    }

    return true;
  });
};

/**
 * Sort vehicles by a field
 * @param {Array} vehicles - Array of vehicle records
 * @param {string} field - Field to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted vehicles
 */
export const sortVehicles = (vehicles, field, order = 'asc') => {
  if (!vehicles || vehicles.length === 0) return [];

  return [...vehicles].sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];

    // Handle numeric fields
    if (typeof aVal === 'string' && !isNaN(parseFloat(aVal))) {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }

    if (order === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
};

/**
 * Format price as currency
 * @param {number} price - Price value
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted price
 */
export const formatPrice = (price, currency = 'USD') => {
  if (isNaN(price)) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('en-US').format(num);
};
