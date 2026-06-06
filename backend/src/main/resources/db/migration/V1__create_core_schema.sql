CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE app_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(320) NOT NULL UNIQUE,
    display_name varchar(120) NOT NULL,
    avatar_url text,
    role varchar(30) NOT NULL DEFAULT 'USER',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT app_users_role_check CHECK (role IN ('USER', 'ADMIN'))
);

CREATE TABLE locations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
    name varchar(180) NOT NULL,
    type varchar(30) NOT NULL,
    status varchar(30) NOT NULL DEFAULT 'PENDING',
    description text,
    country varchar(120) NOT NULL,
    city varchar(120) NOT NULL,
    address varchar(255),
    latitude numeric(9, 6) NOT NULL,
    longitude numeric(9, 6) NOT NULL,
    coordinates geography(Point, 4326)
        GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography) STORED,
    average_rating numeric(3, 2) NOT NULL DEFAULT 0,
    review_count integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT locations_type_check CHECK (type IN ('GYM', 'CALISTHENICS_PARK')),
    CONSTRAINT locations_status_check CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT locations_latitude_check CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT locations_longitude_check CHECK (longitude >= -180 AND longitude <= 180),
    CONSTRAINT locations_rating_check CHECK (average_rating >= 0 AND average_rating <= 5),
    CONSTRAINT locations_review_count_check CHECK (review_count >= 0)
);

CREATE INDEX locations_coordinates_idx ON locations USING gist (coordinates);
CREATE INDEX locations_type_status_idx ON locations (type, status);
CREATE INDEX locations_city_country_idx ON locations (city, country);

CREATE TABLE gym_details (
    location_id uuid PRIMARY KEY REFERENCES locations(id) ON DELETE CASCADE,
    day_pass_available boolean NOT NULL DEFAULT false,
    day_pass_cost numeric(8, 2),
    monthly_membership_cost numeric(8, 2),
    has_free_weights boolean NOT NULL DEFAULT false,
    has_machines boolean NOT NULL DEFAULT false,
    has_cardio_equipment boolean NOT NULL DEFAULT false,
    has_functional_training_area boolean NOT NULL DEFAULT false,
    has_calisthenics_area boolean NOT NULL DEFAULT false,
    has_locker_rooms boolean NOT NULL DEFAULT false,
    has_showers boolean NOT NULL DEFAULT false,
    open_24_hours boolean NOT NULL DEFAULT false,
    opening_hours text,
    peak_hours text,
    parking_available boolean NOT NULL DEFAULT false,
    personal_training_available boolean NOT NULL DEFAULT false
);

CREATE TABLE calisthenics_park_details (
    location_id uuid PRIMARY KEY REFERENCES locations(id) ON DELETE CASCADE,
    has_pull_up_bars boolean NOT NULL DEFAULT false,
    has_dip_bars boolean NOT NULL DEFAULT false,
    has_parallel_bars boolean NOT NULL DEFAULT false,
    has_monkey_bars boolean NOT NULL DEFAULT false,
    has_rings boolean NOT NULL DEFAULT false,
    has_push_up_stations boolean NOT NULL DEFAULT false,
    has_climbing_structures boolean NOT NULL DEFAULT false,
    has_lighting boolean NOT NULL DEFAULT false,
    has_water_access boolean NOT NULL DEFAULT false,
    has_shade boolean NOT NULL DEFAULT false,
    ground_type varchar(40),
    accessible boolean NOT NULL DEFAULT false,
    maintenance_status varchar(120)
);

CREATE TABLE reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    rating smallint NOT NULL,
    title varchar(160),
    comment text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT reviews_location_user_unique UNIQUE (location_id, user_id)
);

CREATE INDEX reviews_location_idx ON reviews (location_id);
CREATE INDEX reviews_user_idx ON reviews (user_id);

CREATE TABLE favorites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT favorites_location_user_unique UNIQUE (location_id, user_id)
);

CREATE INDEX favorites_user_idx ON favorites (user_id);
CREATE INDEX favorites_location_idx ON favorites (location_id);

CREATE TABLE location_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    uploaded_by_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
    storage_key varchar(500) NOT NULL,
    public_url text,
    caption varchar(255),
    content_type varchar(120),
    size_bytes bigint,
    status varchar(30) NOT NULL DEFAULT 'PENDING',
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT location_photos_status_check CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT location_photos_size_check CHECK (size_bytes IS NULL OR size_bytes >= 0)
);

CREATE INDEX location_photos_location_idx ON location_photos (location_id);
CREATE INDEX location_photos_uploaded_by_idx ON location_photos (uploaded_by_id);
