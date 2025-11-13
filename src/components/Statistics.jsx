import { useMemo } from 'react';
import { calculatePriceStats, groupBy, formatPrice, formatNumber } from '../utils/priceAnalysis';
import './Statistics.css';

const Statistics = ({ data }) => {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const priceStats = calculatePriceStats(data);
    const groupedByModel = groupBy(data, 'Model');

    // Calculate average price by model
    const modelStats = Object.entries(groupedByModel).map(([model, vehicles]) => {
      const modelPriceStats = calculatePriceStats(vehicles);
      return {
        model,
        count: vehicles.length,
        averagePrice: modelPriceStats.average,
      };
    });

    return {
      overall: priceStats,
      byModel: modelStats.sort((a, b) => b.count - a.count),
    };
  }, [data]);

  if (!stats) {
    return <div className="statistics">No statistics available</div>;
  }

  return (
    <div className="statistics">
      <h2>Market Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Listings</div>
          <div className="stat-value">{stats.overall.count}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Average Price</div>
          <div className="stat-value">{formatPrice(stats.overall.average)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Median Price</div>
          <div className="stat-value">{formatPrice(stats.overall.median)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Price Range</div>
          <div className="stat-value stat-range">
            <span className="min">{formatPrice(stats.overall.min)}</span>
            <span className="separator">-</span>
            <span className="max">{formatPrice(stats.overall.max)}</span>
          </div>
        </div>
      </div>

      <div className="model-stats">
        <h3>By Model</h3>
        <div className="model-grid">
          {stats.byModel.map((modelStat) => (
            <div key={modelStat.model} className="model-card">
              <div className="model-name">{modelStat.model}</div>
              <div className="model-details">
                <div className="model-count">{modelStat.count} listings</div>
                <div className="model-price">
                  Avg: {formatPrice(modelStat.averagePrice)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
