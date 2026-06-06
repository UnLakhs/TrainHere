INSERT INTO app_users (id, email, display_name, role)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin@trainhere.local', 'TrainHere Admin', 'ADMIN'),
    ('00000000-0000-0000-0000-000000000002', 'demo@trainhere.local', 'Demo Athlete', 'USER')
ON CONFLICT (email) DO NOTHING;

INSERT INTO locations (
    id,
    owner_id,
    name,
    type,
    status,
    description,
    country,
    city,
    address,
    latitude,
    longitude
)
VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        'Athens Outdoor Calisthenics Park',
        'CALISTHENICS_PARK',
        'APPROVED',
        'Demo calisthenics park for local development.',
        'Greece',
        'Athens',
        'Demo address near central Athens',
        37.983810,
        23.727539
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000002',
        'TrainHere Demo Gym',
        'GYM',
        'APPROVED',
        'Demo gym for local development.',
        'Greece',
        'Athens',
        'Demo gym address',
        37.975500,
        23.734800
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO calisthenics_park_details (
    location_id,
    has_pull_up_bars,
    has_dip_bars,
    has_parallel_bars,
    has_lighting,
    has_water_access,
    has_shade,
    ground_type,
    accessible,
    maintenance_status
)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    true,
    true,
    true,
    true,
    true,
    false,
    'RUBBER',
    true,
    'Good'
)
ON CONFLICT (location_id) DO NOTHING;

INSERT INTO gym_details (
    location_id,
    day_pass_available,
    day_pass_cost,
    monthly_membership_cost,
    has_free_weights,
    has_machines,
    has_cardio_equipment,
    has_functional_training_area,
    has_locker_rooms,
    has_showers,
    parking_available,
    personal_training_available
)
VALUES (
    '10000000-0000-0000-0000-000000000002',
    true,
    8.00,
    45.00,
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    true
)
ON CONFLICT (location_id) DO NOTHING;
