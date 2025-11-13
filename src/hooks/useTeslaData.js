import { useState, useEffect } from 'react';
import { fetchTeslaData } from '../services/airtable';

/**
 * Custom hook to fetch and manage Tesla data from Airtable
 * @returns {Object} { data, loading, error, refetch }
 */
export const useTeslaData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    console.log('useTeslaData: Starting data fetch...');
    try {
      setLoading(true);
      setError(null);
      const records = await fetchTeslaData();
      console.log('useTeslaData: Received records:', records.length);
      setData(records);
    } catch (err) {
      console.error('useTeslaData: Error occurred:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('useTeslaData: Fetch completed');
    }
  };

  useEffect(() => {
    console.log('useTeslaData: useEffect running, fetching data...');
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
