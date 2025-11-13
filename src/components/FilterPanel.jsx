import { useState, useEffect } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ data, onFilterChange }) => {
  const [filters, setFilters] = useState({
    model: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    minMileage: '',
    maxMileage: '',
  });

  // Get unique models from data
  const models = [...new Set(data.map((v) => v.Model).filter(Boolean))].sort();

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    // Convert string values to numbers where appropriate
    const processedFilters = {
      model: filters.model,
      minYear: filters.minYear ? parseInt(filters.minYear) : null,
      maxYear: filters.maxYear ? parseInt(filters.maxYear) : null,
      minPrice: filters.minPrice ? parseFloat(filters.minPrice) : null,
      maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : null,
      minMileage: filters.minMileage ? parseFloat(filters.minMileage) : null,
      maxMileage: filters.maxMileage ? parseFloat(filters.maxMileage) : null,
    };

    onFilterChange(processedFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      model: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      minMileage: '',
      maxMileage: '',
    };
    setFilters(resetFilters);
    onFilterChange({});
  };

  // Apply filters when Enter is pressed
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <div className="filter-panel">
      <h3>Filter Options</h3>

      <div className="filter-grid">
        <div className="filter-group">
          <label>Model</label>
          <select
            value={filters.model}
            onChange={(e) => handleFilterChange('model', e.target.value)}
          >
            <option value="">All Models</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Year Range</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min Year"
              value={filters.minYear}
              onChange={(e) => handleFilterChange('minYear', e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max Year"
              value={filters.maxYear}
              onChange={(e) => handleFilterChange('maxYear', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Price Range ($)</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Mileage Range</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min Mileage"
              value={filters.minMileage}
              onChange={(e) => handleFilterChange('minMileage', e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max Mileage"
              value={filters.maxMileage}
              onChange={(e) => handleFilterChange('maxMileage', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
      </div>

      <div className="filter-actions">
        <button onClick={handleApplyFilters} className="btn btn-primary">
          Apply Filters
        </button>
        <button onClick={handleResetFilters} className="btn btn-secondary">
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
