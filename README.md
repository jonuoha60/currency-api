## Currency Conversion API
Convert amounts between world currencies using up‑to‑date exchange rates, backed by a MySQL database.


MySQL for durable storage of currencies and exchange rates

REST endpoints for conversion, rates, and currency metadata

Optional API key auth, caching, and rate limiting

Designed for scheduled rate refresh from external providers

### 1. Clone & install
cd currencyapi

### 2. Configure environment
PORT=4000
CORS_ORIGIN=http://localhost:5500
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=""
DB_NAME=database-name

### 3. Initialize database
Run migrations or the schema script:

### 4. Run the API
node server.js

The API will start on PORT 4000
