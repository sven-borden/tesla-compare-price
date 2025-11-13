import Airtable from 'airtable';

const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

// Initialize Airtable
const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);

/**
 * Fetch all Tesla records from Airtable
 * @returns {Promise<Array>} Array of Tesla vehicle records
 */
export const fetchTeslaData = async () => {
  try {
    const records = [];

    await base(TABLE_NAME)
      .select({
        // You can add specific view, filters, or sort here if needed
        // view: 'Grid view',
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach((record) => {
          records.push({
            id: record.id,
            ...record.fields,
          });
        });
        fetchNextPage();
      });

    return records;
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    throw new Error('Failed to fetch Tesla data from Airtable');
  }
};

/**
 * Fetch a single record by ID
 * @param {string} recordId - The Airtable record ID
 * @returns {Promise<Object>} Single Tesla vehicle record
 */
export const fetchRecordById = async (recordId) => {
  try {
    const record = await base(TABLE_NAME).find(recordId);
    return {
      id: record.id,
      ...record.fields,
    };
  } catch (error) {
    console.error('Error fetching record:', error);
    throw new Error('Failed to fetch record from Airtable');
  }
};

/**
 * Create a new record in Airtable
 * @param {Object} fields - The fields for the new record
 * @returns {Promise<Object>} Created record
 */
export const createRecord = async (fields) => {
  try {
    const record = await base(TABLE_NAME).create([{ fields }]);
    return {
      id: record[0].id,
      ...record[0].fields,
    };
  } catch (error) {
    console.error('Error creating record:', error);
    throw new Error('Failed to create record in Airtable');
  }
};

/**
 * Update an existing record
 * @param {string} recordId - The Airtable record ID
 * @param {Object} fields - The fields to update
 * @returns {Promise<Object>} Updated record
 */
export const updateRecord = async (recordId, fields) => {
  try {
    const record = await base(TABLE_NAME).update([
      {
        id: recordId,
        fields,
      },
    ]);
    return {
      id: record[0].id,
      ...record[0].fields,
    };
  } catch (error) {
    console.error('Error updating record:', error);
    throw new Error('Failed to update record in Airtable');
  }
};

/**
 * Delete a record
 * @param {string} recordId - The Airtable record ID
 * @returns {Promise<string>} Deleted record ID
 */
export const deleteRecord = async (recordId) => {
  try {
    const deletedRecord = await base(TABLE_NAME).destroy([recordId]);
    return deletedRecord[0].id;
  } catch (error) {
    console.error('Error deleting record:', error);
    throw new Error('Failed to delete record from Airtable');
  }
};
