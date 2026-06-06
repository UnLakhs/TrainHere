# TrainHere Technology Stack

## Guiding Principle

TrainHere should avoid paid, quota-heavy third-party APIs wherever possible. For map features, the safest long-term strategy is to use open-source clients, OpenStreetMap-based data, and services that can be self-hosted when traffic grows.

No public third-party service should be treated as truly unlimited forever. If a hosted service is used during the MVP, the code should keep provider URLs configurable so we can swap to self-hosted infrastructure without rewriting the app.

## Recommended MVP Stack

### Frontend

* React
* TypeScript
* Vite
* MapLibre GL JS

MapLibre GL JS is a good fit because it is open source, TypeScript-friendly, and renders vector maps in the browser. It avoids tying the app to Google Maps or Mapbox SDK licensing.

### Map Tiles

* OpenFreeMap public instance for MVP
* OpenFreeMap self-hosting as the scale-up path

OpenFreeMap is the best MVP choice found so far because its public instance currently advertises free usage with no map-view/request limits, no registration, no API keys, and commercial usage allowed. Because it has no SLA, TrainHere should keep the tile/style URL configurable and be ready to self-host OpenFreeMap tiles later.

Avoid using `tile.openstreetmap.org` as the production tile provider. OpenStreetMap data is free, but the official OSM tile servers are donation-funded, capacity-limited, best-effort services and may block inappropriate or heavy usage.

### Backend

* Spring Boot
* Java
* REST API
* Maven

Spring Boot is a solid choice for the backend because the application has structured domain logic: users, roles, locations, reviews, photos, favorites, reports, and admin moderation.

### Database

* PostgreSQL
* PostGIS

PostGIS is important for geospatial features such as nearby search, distance filtering, bounding-box map queries, and future location analytics.

### Authentication

* Spring Security
* JWT access tokens
* Refresh tokens stored server-side or in the database

This keeps the MVP independent from hosted auth vendors. If the project later needs social login or enterprise identity, we can add OAuth providers without replacing the core user model.

### File Storage

* Local filesystem storage for development
* S3-compatible storage abstraction for production

The app should define a storage interface early. This allows local development now and later migration to MinIO, Cloudflare R2, AWS S3, or another compatible object store.

## Map And Location APIs

### Geolocation

Use the browser Geolocation API for "near me" behavior. It does not require a paid map provider API.

### Geocoding

Recommended MVP approach:

* Prefer map click, current location, and manually entered address fields first.
* If search-by-address is needed early, use Nominatim carefully behind a backend rate limiter.
* For production scale, self-host Nominatim or replace it with another self-hosted geocoder.

The public OSM Nominatim service has an acceptable-use policy with a strict maximum of 1 request per second and is not suitable for unrestricted production autocomplete.

### Directions

Recommended MVP approach:

* For the first version, open directions in the user's installed map app or browser using a coordinates URL.
* Later, add self-hosted OSRM if TrainHere needs in-app routing.

OpenRouteService has a useful free tier, but it has daily and per-minute limits. OSRM is open source and can be self-hosted with OpenStreetMap data when we need more control.

## Initial Decision

Start with:

* React + TypeScript + Vite
* MapLibre GL JS
* OpenFreeMap public styles/tiles
* Spring Boot REST API
* PostgreSQL + PostGIS
* Spring Security + JWT
* Local file storage behind a storage abstraction

Defer:

* Self-hosted OpenFreeMap tiles until traffic or reliability requires it
* Self-hosted Nominatim until address search/autocomplete becomes important
* Self-hosted OSRM until in-app directions become important
