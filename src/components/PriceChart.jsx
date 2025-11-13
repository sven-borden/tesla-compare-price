import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
} from 'recharts';
import { groupBy, calculatePriceStats, formatPrice } from '../utils/priceAnalysis';
import './PriceChart.css';

const PriceChart = ({ data }) => {
  // Prepare data for average price by model chart
  const modelPriceData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const groupedByModel = groupBy(data, 'Model');
    return Object.entries(groupedByModel)
      .map(([model, vehicles]) => {
        const stats = calculatePriceStats(vehicles);
        return {
          model,
          average: Math.round(stats.average),
          count: vehicles.length,
        };
      })
      .sort((a, b) => b.average - a.average);
  }, [data]);

  // Prepare data for price by year chart
  const yearPriceData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const groupedByYear = groupBy(data, 'Year');
    return Object.entries(groupedByYear)
      .map(([year, vehicles]) => {
        const stats = calculatePriceStats(vehicles);
        return {
          year: parseInt(year) || 0,
          average: Math.round(stats.average),
          count: vehicles.length,
        };
      })
      .filter((item) => item.year > 0)
      .sort((a, b) => a.year - b.year);
  }, [data]);

  // Prepare data for price vs mileage scatter plot
  const scatterData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data
      .filter(
        (vehicle) =>
          vehicle.Price &&
          vehicle.Mileage &&
          !isNaN(parseFloat(vehicle.Price)) &&
          !isNaN(parseFloat(vehicle.Mileage))
      )
      .map((vehicle) => ({
        mileage: parseFloat(vehicle.Mileage),
        price: parseFloat(vehicle.Price),
        model: vehicle.Model || 'Unknown',
      }))
      .slice(0, 100); // Limit to 100 points for performance
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          {payload.map((item, index) => (
            <div key={index}>
              <strong>{item.name}:</strong>{' '}
              {item.name.toLowerCase().includes('price')
                ? formatPrice(item.value)
                : item.value.toLocaleString()}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return <div className="no-chart-data">No data available for charts</div>;
  }

  return (
    <div className="price-chart-container">
      <h2>Price Analysis</h2>

      <div className="chart-section">
        <h3>Average Price by Model</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={modelPriceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="model" />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="average" fill="#667eea" name="Average Price" />
            <Bar dataKey="count" fill="#43e97b" name="Listings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Average Price by Year</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yearPriceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="average"
              stroke="#f5576c"
              strokeWidth={2}
              name="Average Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Price vs Mileage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="mileage"
              name="Mileage"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="number"
              dataKey="price"
              name="Price"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) =>
                name === 'price'
                  ? [formatPrice(value), 'Price']
                  : [value.toLocaleString(), 'Mileage']
              }
            />
            <Scatter data={scatterData} fill="#4facfe" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
