# Tesla Second-Hand Market Analysis

A React application that loads and analyzes Tesla vehicle prices from an Airtable database, helping you understand the second-hand market trends.

## Features

- **Real-time Data Loading**: Fetches Tesla listings directly from Airtable
- **Advanced Filtering**: Filter by model, year range, price range, and mileage
- **Statistical Analysis**: View average, median, min, and max prices
- **Data Visualization**:
  - Average price by model (bar chart)
  - Price trends by year (line chart)
  - Price vs mileage scatter plot
- **Interactive Table**: Sortable, paginated table of all listings
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Airtable.js** - Airtable SDK for data fetching
- **Recharts** - Data visualization library

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- An Airtable account with a base containing Tesla data

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tesla-compare-price
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory (or copy from `.env.example`):
```env
VITE_AIRTABLE_API_KEY=your_airtable_api_key
VITE_AIRTABLE_BASE_ID=your_base_id
VITE_AIRTABLE_TABLE_NAME=your_table_name
```

**Getting your Airtable credentials:**
- API Key: Go to [Airtable Account](https://airtable.com/account) → Generate API key
- Base ID: Found in your Airtable API documentation or URL (starts with `app`)
- Table Name: The name of your table or table ID (starts with `tbl`)

## Airtable Schema

Your Airtable table should have the following fields (at minimum):

| Field Name | Type | Description |
|------------|------|-------------|
| Model | Single line text | Tesla model (e.g., Model 3, Model S, Model X, Model Y) |
| Year | Number | Year of manufacture |
| Price | Currency/Number | Listing price |
| Mileage | Number | Vehicle mileage |

**Optional fields** for enhanced functionality:
- Location
- Condition
- Color
- Battery capacity
- Autopilot features
- Date listed

## Usage

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
tesla-compare-price/
├── src/
│   ├── components/          # React components
│   │   ├── FilterPanel.jsx  # Filtering UI
│   │   ├── PriceTable.jsx   # Data table with sorting/pagination
│   │   ├── Statistics.jsx   # Statistical overview cards
│   │   └── PriceChart.jsx   # Data visualization charts
│   ├── services/
│   │   └── airtable.js      # Airtable API integration
│   ├── hooks/
│   │   └── useTeslaData.js  # Custom hook for data fetching
│   ├── utils/
│   │   └── priceAnalysis.js # Data analysis utilities
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   └── main.jsx             # Entry point
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment variables template
├── package.json
└── vite.config.js
```

## Features Walkthrough

### Filter Panel
- Select specific Tesla models
- Set year range (min/max)
- Set price range
- Set mileage range
- Apply or reset filters

### Statistics Dashboard
- Total listings count
- Average price across all listings
- Median price
- Price range (min to max)
- Breakdown by model with listing counts

### Price Charts
1. **Average Price by Model**: Compare average prices across different Tesla models
2. **Price Trends by Year**: See how prices vary by vehicle year
3. **Price vs Mileage**: Scatter plot showing the relationship between price and mileage

### Data Table
- View all listings in a sortable table
- Click column headers to sort
- Pagination for large datasets (20 items per page)
- Formatted prices and numbers for readability

## Customization

### Changing Data Visualization
Edit `src/components/PriceChart.jsx` to modify charts or add new ones.

### Adding New Filters
Update `src/components/FilterPanel.jsx` and `src/utils/priceAnalysis.js` to add new filter options.

### Styling
- Global styles: `src/index.css` and `src/App.css`
- Component-specific styles: Each component has its own CSS file

## Troubleshooting

### Data Not Loading
1. Check your `.env` file has correct Airtable credentials
2. Verify your Airtable API key has read permissions
3. Check browser console for error messages

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### API Rate Limiting
Airtable has rate limits (5 requests per second). The app handles pagination automatically, but if you have a very large dataset, you might need to implement caching or reduce refresh frequency.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue in the GitHub repository.

---

Built with React + Vite | Data powered by Airtable
