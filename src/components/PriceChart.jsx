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
  const { scatterData, trendLineData } = useMemo(() => {
    if (!data || data.length === 0) return { scatterData: [], trendLineData: [] };

    const scatter = data
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
      }));

    // Calculate linear regression for trend line
    const n = scatter.length;
    if (n === 0) return { scatterData: [], trendLineData: [] };

    const sumX = scatter.reduce((sum, point) => sum + point.mileage, 0);
    const sumY = scatter.reduce((sum, point) => sum + point.price, 0);
    const sumXY = scatter.reduce((sum, point) => sum + point.mileage * point.price, 0);
    const sumXX = scatter.reduce((sum, point) => sum + point.mileage * point.mileage, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Find min and max mileage for trend line
    const minMileage = Math.min(...scatter.map(p => p.mileage));
    const maxMileage = Math.max(...scatter.map(p => p.mileage));

    const trendLine = [
      {
        mileage: minMileage,
        price: slope * minMileage + intercept,
        trendPrice: slope * minMileage + intercept,
      },
      {
        mileage: maxMileage,
        price: slope * maxMileage + intercept,
        trendPrice: slope * maxMileage + intercept,
      },
    ];

    return {
      scatterData: scatter.slice(0, 100), // Limit to 100 points for performance
      trendLineData: trendLine,
    };
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
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              domain={['auto', 'auto']}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="average" fill="#667eea" name="Average Price" />
            <Bar yAxisId="right" dataKey="count" fill="#43e97b" name="Listings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Average Price by Year</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yearPriceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              domain={['auto', 'auto']}
            />
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
              domain={['auto', 'auto']}
            />
            <YAxis
              type="number"
              dataKey="price"
              name="Price"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              domain={['auto', 'auto']}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) =>
                name === 'price'
                  ? [formatPrice(value), 'Price']
                  : [value.toLocaleString(), 'Mileage']
              }
            />
            <Legend />
            <Scatter data={scatterData} fill="#4facfe" name="Vehicles" />
            <Line
              data={trendLineData}
              type="linear"
              dataKey="trendPrice"
              stroke="#ff6b6b"
              strokeWidth={3}
              dot={false}
              name="Trend Line"
              strokeDasharray="5 5"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
