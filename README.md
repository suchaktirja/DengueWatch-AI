# DengueWatch AI — Frontend Prototype

Static multi-page frontend built with HTML, CSS and vanilla JavaScript. It follows the supplied Figma/PDF dashboard design and includes responsive desktop/mobile layouts.

## Pages
- `index.html` — Overview dashboard
- `risk-prediction.html` — Ward-level risk prediction view
- `weather-analytics.html` — Weather signals and rainfall lags
- `dengue-history.html` — Historical case trends
- `ward-comparison.html` — Searchable/filterable ward table
- `help.html` — Prototype notes

## Run locally
Open `index.html` in a browser, or use VS Code Live Server. No Node.js installation is required for this frontend-only prototype.

## Working interactions
- Sidebar navigation between pages
- City, ward and prediction-period selectors
- Risk display updates based on selected sample city
- Ward table filters and search
- Ward row action opens Risk Prediction
- CSV export for the sample ward table
- Weekly/monthly/yearly history view selector
- Responsive mobile sidebar
- Charts using Chart.js CDN

## Important data note
The UI currently uses illustrative sample values, not live values from the Excel dataset and not real ML predictions. Chart.js and Google Fonts load from external CDNs. Replace sample data in `js/app.js` with backend API responses when your API is ready. This prototype does not connect to Supabase or implement the prediction model.
