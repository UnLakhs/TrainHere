# TrainHere Roadmap

## Goal

Build TrainHere in small, usable increments. Each phase should leave the project in a working state, with enough structure to support the next feature without large rewrites.

## Phase 0: Project Foundation (Complete)

Purpose: create the base application structure.

Deliverables:

* Backend project with Spring Boot, Maven, and basic health endpoint
* Frontend project with React, TypeScript, and Vite
* Shared development documentation
* Local environment setup notes
* Basic Git hygiene: `.gitignore`, clear folder structure, and repeatable run commands

Suggested first implementation step:

* Create `backend` and `frontend` folders.
* Add a minimal Spring Boot API.
* Add a minimal React app.
* Verify both can run locally.

## Phase 1: Domain And Database (Complete)

Purpose: define the core TrainHere data model before building complex UI.

Deliverables:

* PostgreSQL setup
* PostGIS extension enabled
* Initial database migrations
* Core entities:
  * User
  * Location
  * Location type
  * Gym details
  * Calisthenics park details
  * Review
  * Favorite
  * Photo metadata
* Seed data for local development

Suggested first implementation step:

* Model locations first, because the map and search experience depend on it.

## Phase 2: Authentication And User Profiles(complete)

Purpose: allow real users to own contributions, reviews, and favorites.

Deliverables:

* User registration
* Login
* JWT authentication
* Refresh token flow
* Basic profile endpoint
* Protected frontend routes
* User profile page

Suggested first implementation step:

* Start with email/password auth and keep social login out of the MVP.

## Phase 3: Location Management(complete)

Purpose: make the platform useful by allowing locations to be created and viewed.

Deliverables:

* Create location API
* Update location API
* Location details API
* Location list API
* Location details page
* Add-location form
* Separate fields for gyms and calisthenics parks
* Basic moderation status: pending, approved, rejected

Suggested first implementation step:

* Let authenticated users submit locations, but show only approved locations publicly.

## Phase 4: Map Experience

Purpose: build the main discovery workflow.

Deliverables:

* MapLibre GL JS integration
* OpenFreeMap style configuration
* Location markers
* Map marker popups
* Nearby locations endpoint
* Bounding-box map search endpoint
* Browser geolocation support
* Open directions in an external maps app or browser

Suggested first implementation step:

* Load approved locations as markers on the map, then add nearby and bounding-box queries.

## Phase 5: Search And Filters

Purpose: help users find useful training spots quickly.

Deliverables:

* Search by city, country, area, or location name
* Filter by location type
* Filter by rating
* Filter by distance
* Gym-specific filters:
  * Day pass available
  * Monthly cost range
  * 24/7 access
  * Equipment availability
* Calisthenics-specific filters:
  * Pull-up bars
  * Dip bars
  * Rings
  * Lighting
  * Water access

Suggested first implementation step:

* Build type, distance, and rating filters before adding detailed equipment filters.

## Phase 6: Reviews, Ratings, Favorites, And Photos

Purpose: add the community layer that makes locations trustworthy.

Deliverables:

* Add review
* Edit own review
* Delete own review
* Location average rating
* Favorite and unfavorite location
* Favorites page
* Photo upload
* Photo gallery on location details
* Local storage implementation behind a storage interface

Suggested first implementation step:

* Build reviews and favorites first, then photos.

## Phase 7: Admin Dashboard

Purpose: keep community content clean and reliable.

Deliverables:

* Admin role
* Pending locations queue
* Approve or reject locations
* Review moderation
* User management basics
* Report handling
* Basic platform statistics

Suggested first implementation step:

* Start with approving or rejecting submitted locations.

## Phase 8: MVP Hardening

Purpose: make the first public version stable enough for real users.

Deliverables:

* Validation on backend and frontend
* Error handling and user-friendly messages
* Loading and empty states
* Pagination
* Basic rate limiting
* Security review of auth-protected endpoints
* Integration tests for critical backend flows
* Production configuration profiles
* Simple deployment documentation

Suggested first implementation step:

* Focus tests on authentication, location creation, location discovery, reviews, and admin approval.

## Phase 9: Public MVP Launch

Purpose: release a small but useful version and collect feedback.

Deliverables:

* Public deployment
* Admin user bootstrap process
* Basic analytics or server logs
* Feedback channel
* Initial seed locations for one target city or region
* Known limitations documented

Suggested first implementation step:

* Launch with one local region first instead of trying to cover the whole world on day one.

## Phase 10: Post-MVP Growth

Purpose: add features only after the discovery and contribution loops work.

Potential features:

* Events and group workouts
* Contribution points and badges
* Helpful review likes
* AI recommendations
* Self-hosted Nominatim for geocoding
* Self-hosted OSRM for in-app directions
* Self-hosted OpenFreeMap tiles if traffic or reliability requires it
* Mobile app with MapLibre Native

## Immediate Next Step

make "Near me" fuctionality for map 

1. Add a "Use my Location" button.
2. Add a backend endpoint to find nearby locations.
3. Add a sorting mechanism to sort results based on distance.
4. Add a distance field in the location cards.
