import { useState, useMemo } from 'react';
import { formatPrice, formatNumber } from '../utils/priceAnalysis';
import './PriceTable.css';

const PriceTable = ({ data }) => {
  const [sortField, setSortField] = useState('Price');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Sort data
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle numeric fields
      const numericFields = ['Price', 'Year', 'Mileage'];
      if (numericFields.includes(sortField)) {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  }, [data, sortField, sortOrder]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!data || data.length === 0) {
    return <div className="no-data">No data available</div>;
  }

  // Get all field names from the first record
  const fields = Object.keys(data[0]).filter((key) => key !== 'id');

  return (
    <div className="price-table-container">
      <div className="table-header">
        <h2>Tesla Listings ({sortedData.length} vehicles)</h2>
      </div>

      <div className="table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field} onClick={() => handleSort(field)} className="sortable">
                  {field}
                  {sortField === field && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((vehicle) => (
              <tr key={vehicle.id}>
                {fields.map((field) => (
                  <td key={field}>
                    {field === 'Price'
                      ? formatPrice(vehicle[field])
                      : field === 'Mileage'
                      ? formatNumber(vehicle[field])
                      : vehicle[field] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          <div className="page-numbers">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 3 || page === currentPage + 3) {
                return <span key={page}>...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceTable;
