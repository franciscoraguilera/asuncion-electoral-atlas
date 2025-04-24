# Electoral Map of Asunción, Paraguay

An interactive electoral map application to visualize voting data by neighborhood for Asunción, Paraguay. The application is built using the PERN stack (PostgreSQL, Express, React, Node.js) with Leaflet for map visualization.

## Features

- Interactive choropleth map of Asunción neighborhoods
- Color-coded visualization of voting data
- Filtering by election year with comparative analysis
- Detailed popup information for each neighborhood
- Data export capabilities (CSV, GeoJSON)
- Authentication system
- Responsive design for desktop and mobile

## Technology Stack

- **Database**: PostgreSQL 15+ with PostGIS extension
- **Backend**: Node.js 18+, Express 4.18+
- **Frontend**: React 18+, Leaflet 1.9+, Tailwind CSS
- **Map Tiles**: OpenStreetMap
- **Geospatial Processing**: Shapefile.js, Turf.js
- **Authentication**: JWT-based auth system

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 15+ with PostGIS extension
- Git (optional)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd electoral-map-asuncion
   ```

2. Install dependencies:
   ```
   npm run install:all
   ```

3. Configure environment variables:
   ```
   cp server/.env.example server/.env
   ```
   Edit the `.env` file with your database credentials and JWT secret.

4. Set up the database:
   - Create a PostgreSQL database
   - Install PostGIS extension in the database
   - The application will automatically create the tables on first run

5. Start the development server:
   ```
   npm run dev
   ```

### Shapefile Import

1. Place your shapefiles in a directory
2. Log in as an admin user
3. Use the shapefile import feature to upload and process the files

## Project Structure

```
/electoral-map-asuncion
  /client              # React frontend
  /server              # Express backend
  /shapefiles          # Directory for shapefile storage
  /uploads             # Uploaded files directory
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Electoral Data
- `GET /api/electoral/data` - Get electoral data with filters
- `GET /api/electoral/years` - Get available election years
- `GET /api/electoral/neighborhood/:id` - Get neighborhood details
- `GET /api/electoral/export/:format` - Export data in specified format

### Shapefiles
- `POST /api/shapefiles/upload` - Upload shapefile
- `POST /api/shapefiles/process/:id` - Process uploaded shapefile
- `GET /api/shapefiles/status/:id` - Get processing status

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
