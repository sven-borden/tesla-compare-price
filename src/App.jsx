import { useState, useMemo } from 'react';
import { useTeslaData } from './hooks/useTeslaData';
import { filterVehicles } from './utils/priceAnalysis';
import FilterPanel from './components/FilterPanel';
import Statistics from './components/Statistics';
import PriceChart from './components/PriceChart';
import PriceTable from './components/PriceTable';
import './App.css';

function App() {
  const { data, loading, error, refetch } = useTeslaData();
  const [filters, setFilters] = useState({});

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (Object.keys(filters).length === 0) return data;
    return filterVehicles(data, filters);
  }, [data, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Tesla Second-Hand Market Analysis</h1>
          <p>Powered by Airtable</p>
        </header>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading Tesla data from Airtable...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Tesla Second-Hand Market Analysis</h1>
          <p>Powered by Airtable</p>
        </header>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={refetch} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Tesla Second-Hand Market Analysis</h1>
          <p>Powered by Airtable</p>
        </header>
        <div className="empty-container">
          <div className="empty-icon">📊</div>
          <h2>No Data Available</h2>
          <p>There are no Tesla listings in the Airtable database yet.</p>
          <button onClick={refetch} className="retry-btn">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tesla Second-Hand Market Analysis</h1>
        <p>Powered by Airtable</p>
        <button onClick={refetch} className="refresh-btn" title="Refresh data">
          🔄 Refresh
        </button>
      </header>

      <main className="app-main">
        <FilterPanel data={data} onFilterChange={handleFilterChange} />

        <Statistics data={filteredData} />

        <PriceChart data={filteredData} />

        <PriceTable data={filteredData} />
      </main>

      <footer className="app-footer">
        <p>
          Built with React + Vite | Data from Airtable | Total listings:{' '}
          {data.length}
          {filteredData.length !== data.length &&
            ` | Filtered: ${filteredData.length}`}
        </p>
      </footer>
    </div>
  );
}

export default App;
