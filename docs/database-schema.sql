-- =====================================================
-- VoltEdge Data Center Land Analysis Database Schema
-- =====================================================
-- This schema supports the comprehensive datacenter-report
-- with real data instead of mock generators
-- =====================================================

-- =====================================================
-- 1. CORE PARCEL TABLE
-- =====================================================

CREATE TABLE parcels (
    id SERIAL PRIMARY KEY,
    parcel_number VARCHAR(100) UNIQUE NOT NULL, -- ULPIN or unique identifier

    -- Location
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    site_address VARCHAR(255),
    site_city VARCHAR(100),
    site_state VARCHAR(2),
    site_zip VARCHAR(10),
    county VARCHAR(100),

    -- Land details
    gis_acres DECIMAL(10, 2) NOT NULL,
    zoning VARCHAR(50),
    land_use_current VARCHAR(100),

    -- Ownership
    owner_name VARCHAR(255),
    owner_type VARCHAR(50), -- government, private, corporate

    -- Status
    status VARCHAR(50) DEFAULT 'available', -- available, under_review, reserved, sold
    listed_date DATE,
    price_per_acre DECIMAL(12, 2),
    total_price DECIMAL(15, 2),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Scoring (pre-calculated for search)
    power_score INTEGER CHECK (power_score >= 0 AND power_score <= 100),
    connectivity_score INTEGER CHECK (connectivity_score >= 0 AND connectivity_score <= 100),
    location_score INTEGER CHECK (location_score >= 0 AND location_score <= 100),
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100)
);

CREATE INDEX idx_parcels_location ON parcels(latitude, longitude);
CREATE INDEX idx_parcels_state_city ON parcels(site_state, site_city);
CREATE INDEX idx_parcels_status ON parcels(status);
CREATE INDEX idx_parcels_scores ON parcels(power_score, connectivity_score, overall_score);

-- =====================================================
-- 2. INFRASTRUCTURE DATA
-- =====================================================

CREATE TABLE parcel_substations (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    distance_km DECIMAL(6, 2) NOT NULL, -- kilometers
    voltage VARCHAR(20) NOT NULL, -- e.g., '345kV', '138kV'
    capacity VARCHAR(50) NOT NULL, -- e.g., '1200 MVA'
    operator VARCHAR(255) NOT NULL, -- utility company name

    -- Substation location
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Priority (1 = nearest/primary)
    priority INTEGER DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_substations_parcel ON parcel_substations(parcel_id);

CREATE TABLE parcel_transmission_lines (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    voltage VARCHAR(20) NOT NULL,
    distance_km DECIMAL(6, 2) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    capacity_mw INTEGER, -- megawatts available

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transmission_parcel ON parcel_transmission_lines(parcel_id);

CREATE TABLE parcel_utility_info (
    parcel_id INTEGER PRIMARY KEY REFERENCES parcels(id) ON DELETE CASCADE,

    utility_provider VARCHAR(255) NOT NULL,
    iso_rto VARCHAR(100), -- e.g., 'PJM', 'MISO', 'ERCOT'
    service_territory VARCHAR(255),

    -- Power availability
    available_capacity_mw INTEGER,
    estimated_connection_cost DECIMAL(15, 2),
    estimated_connection_time_months INTEGER,

    -- Utility contact
    utility_contact_name VARCHAR(255),
    utility_contact_email VARCHAR(255),
    utility_contact_phone VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. RISK ASSESSMENTS
-- =====================================================

CREATE TABLE parcel_risk_scores (
    parcel_id INTEGER PRIMARY KEY REFERENCES parcels(id) ON DELETE CASCADE,

    -- Political Risk (0-100, higher is better)
    political_risk_score INTEGER CHECK (political_risk_score >= 0 AND political_risk_score <= 100),
    political_risk_rating VARCHAR(50), -- 'Low', 'Moderate', 'High'
    permitting_climate_score INTEGER,
    tax_incentives_score INTEGER,
    local_support_score INTEGER,
    regulatory_stability_score INTEGER,

    -- Seismic Risk
    seismic_risk_score INTEGER CHECK (seismic_risk_score >= 0 AND seismic_risk_score <= 100),
    seismic_zone INTEGER, -- 1-4
    earthquake_frequency_score INTEGER,
    soil_stability_score INTEGER,
    fault_line_proximity_km DECIMAL(8, 2),

    -- Environmental Risk
    environmental_risk_score INTEGER CHECK (environmental_risk_score >= 0 AND environmental_risk_score <= 100),
    wetlands_risk_score INTEGER,
    endangered_species_risk_score INTEGER,
    flood_zone_risk_score INTEGER,
    air_quality_score INTEGER,
    in_flood_zone BOOLEAN DEFAULT FALSE,

    -- Transport Access
    transport_access_score INTEGER CHECK (transport_access_score >= 0 AND transport_access_score <= 100),
    highway_distance_km DECIMAL(6, 2),
    rail_distance_km DECIMAL(6, 2),
    airport_distance_km DECIMAL(6, 2),
    port_distance_km DECIMAL(8, 2),

    -- Water Availability (aggregate score)
    water_availability_score INTEGER CHECK (water_availability_score >= 0 AND water_availability_score <= 100),
    municipal_supply_score INTEGER,
    groundwater_score INTEGER,
    surface_water_score INTEGER,
    water_rights_score INTEGER,

    -- Climate Risk
    climate_risk_score INTEGER CHECK (climate_risk_score >= 0 AND climate_risk_score <= 100),
    climate_risk_rating VARCHAR(50),
    wildfire_risk VARCHAR(20),
    extreme_weather_frequency VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parcel_risk_details (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,
    risk_category VARCHAR(50) NOT NULL, -- 'political', 'seismic', 'environmental', etc.
    detail_text TEXT NOT NULL,
    severity VARCHAR(20), -- 'low', 'medium', 'high'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_details_parcel ON parcel_risk_details(parcel_id, risk_category);

-- =====================================================
-- 4. WATER SOURCES
-- =====================================================

CREATE TABLE parcel_water_sources (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,

    source_name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'municipal', 'reservoir', 'groundwater', 'reclaimed'

    distance_km DECIMAL(6, 2) NOT NULL,
    capacity VARCHAR(50), -- 'High', 'Medium-High', 'Medium', 'Low'
    reliability_percentage INTEGER CHECK (reliability_percentage >= 0 AND reliability_percentage <= 100),

    usage_type VARCHAR(50), -- 'Primary', 'Secondary', 'Backup', 'Supplemental'
    connection_feasibility VARCHAR(100), -- 'Direct', 'Feasible', 'Pipeline required', 'On-site drilling'
    cost_per_1000_gallons DECIMAL(8, 2),

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_water_sources_parcel ON parcel_water_sources(parcel_id);

CREATE TABLE water_availability_history (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,

    year INTEGER NOT NULL,
    availability_percentage INTEGER CHECK (availability_percentage >= 0 AND availability_percentage <= 100),

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(parcel_id, year)
);

-- =====================================================
-- 5. COST BREAKDOWN
-- =====================================================

CREATE TABLE parcel_cost_estimates (
    parcel_id INTEGER PRIMARY KEY REFERENCES parcels(id) ON DELETE CASCADE,

    -- Land Acquisition
    land_price_per_acre DECIMAL(12, 2),
    land_total_cost DECIMAL(15, 2),
    land_closing_costs DECIMAL(12, 2),
    land_legal_fees DECIMAL(12, 2),

    -- Site Preparation (per acre estimates)
    site_prep_grading_per_acre DECIMAL(10, 2),
    site_prep_clearing_per_acre DECIMAL(10, 2),
    site_prep_drainage_per_acre DECIMAL(10, 2),
    site_prep_roads_per_acre DECIMAL(10, 2),
    site_prep_utilities_per_acre DECIMAL(10, 2),

    -- Permitting
    permit_land_use DECIMAL(10, 2),
    permit_environmental DECIMAL(10, 2),
    permit_building DECIMAL(10, 2),
    permit_electrical DECIMAL(10, 2),
    permit_water_sewer DECIMAL(10, 2),

    -- Environmental
    env_phase1_assessment DECIMAL(10, 2),
    env_phase2_assessment DECIMAL(10, 2),
    env_wetland_delineation DECIMAL(10, 2),
    env_habitat_survey DECIMAL(10, 2),
    env_stormwater_plan DECIMAL(10, 2),

    -- Engineering
    eng_civil DECIMAL(12, 2),
    eng_electrical DECIMAL(12, 2),
    eng_structural DECIMAL(12, 2),
    eng_geotechnical DECIMAL(10, 2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. TERRAIN & TOPOGRAPHY
-- =====================================================

CREATE TABLE parcel_terrain (
    parcel_id INTEGER PRIMARY KEY REFERENCES parcels(id) ON DELETE CASCADE,

    average_slope_degrees DECIMAL(4, 2),
    max_slope_degrees DECIMAL(4, 2),
    slope_suitability VARCHAR(100), -- 'Excellent for hyperscale', 'Good for enterprise', etc.

    elevation_min_feet INTEGER,
    elevation_max_feet INTEGER,

    soil_type VARCHAR(100),
    bedrock_depth_feet INTEGER,
    drainage_condition VARCHAR(50), -- 'Excellent', 'Good', 'Fair', 'Poor'

    terrain_analysis_notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. PERMITTING AUTHORITIES (Reference Data)
-- =====================================================

CREATE TABLE permitting_authorities (
    id SERIAL PRIMARY KEY,

    authority_name VARCHAR(255) NOT NULL,
    authority_type VARCHAR(50), -- 'county', 'state', 'federal'
    jurisdiction_state VARCHAR(2),
    jurisdiction_county VARCHAR(100),

    requirement_type VARCHAR(100) NOT NULL,
    typical_timeline_weeks INTEGER,

    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parcel_permitting_requirements (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,
    authority_id INTEGER REFERENCES permitting_authorities(id),

    estimated_time_weeks INTEGER,
    negotiated_time_weeks INTEGER, -- VoltEdge's expedited timeline
    estimated_cost_min DECIMAL(12, 2),
    estimated_cost_max DECIMAL(12, 2),

    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'approved', 'denied'

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parcel_permits ON parcel_permitting_requirements(parcel_id);

-- =====================================================
-- 8. CONSULTANT FIRMS (Reference Data)
-- =====================================================

CREATE TABLE consultant_firms (
    id SERIAL PRIMARY KEY,

    firm_name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL, -- 'Civil & Site Engineering', 'Environmental Compliance', etc.

    industry_avg_time_weeks INTEGER,
    negotiated_time_weeks INTEGER, -- VoltEdge's pre-negotiated timeline

    estimated_cost_min DECIMAL(12, 2),
    estimated_cost_max DECIMAL(12, 2),

    experience_description VARCHAR(500),
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),

    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parcel_consultant_assignments (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,
    consultant_id INTEGER REFERENCES consultant_firms(id),

    assignment_status VARCHAR(50) DEFAULT 'recommended', -- 'recommended', 'engaged', 'completed'

    actual_cost DECIMAL(12, 2),
    actual_completion_weeks INTEGER,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parcel_consultants ON parcel_consultant_assignments(parcel_id);

-- =====================================================
-- 9. POWER PHASES (Phased Power Procurement)
-- =====================================================

CREATE TABLE parcel_power_phases (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,

    phase_number INTEGER NOT NULL,
    phase_name VARCHAR(255) NOT NULL,
    description TEXT,

    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    duration_years INTEGER NOT NULL,

    capacity_low_mw INTEGER NOT NULL, -- Minimum MW available
    capacity_high_mw INTEGER NOT NULL, -- Maximum MW possible

    infrastructure_type VARCHAR(100), -- 'Existing Distribution', 'BESS', 'New Transmission'

    estimated_cost DECIMAL(15, 2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(parcel_id, phase_number)
);

CREATE INDEX idx_power_phases_parcel ON parcel_power_phases(parcel_id);

-- =====================================================
-- 10. DATA CENTER SIZE CONFIGURATIONS (Reference Data)
-- =====================================================

CREATE TABLE datacenter_sizes (
    id SERIAL PRIMARY KEY,
    size_key VARCHAR(20) UNIQUE NOT NULL, -- 'edge', 'enterprise', 'midscale', 'hyperscale'
    size_name VARCHAR(100) NOT NULL,

    power_min_mw INTEGER NOT NULL,
    power_max_mw INTEGER NOT NULL,

    sqft INTEGER NOT NULL,

    acres_required_min INTEGER NOT NULL,
    acres_required_max INTEGER NOT NULL,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pre-populate datacenter sizes
INSERT INTO datacenter_sizes (size_key, size_name, power_min_mw, power_max_mw, sqft, acres_required_min, acres_required_max, description) VALUES
('edge', 'Edge Data Center', 1, 5, 10000, 5, 10, 'Small-scale facilities for edge computing and local content delivery'),
('enterprise', 'Enterprise Data Center', 5, 20, 50000, 15, 30, 'Mid-sized facilities for corporate workloads and applications'),
('midscale', 'Midscale Data Center', 20, 100, 200000, 40, 80, 'Regional facilities for colocation and cloud services'),
('hyperscale', 'Hyperscale Data Center', 100, 500, 500000, 100, 200, 'Large-scale facilities for cloud providers and hyperscale operators');

-- =====================================================
-- 11. EQUIPMENT CATEGORIES (Reference Data)
-- =====================================================

CREATE TABLE equipment_categories (
    id SERIAL PRIMARY KEY,

    category_name VARCHAR(255) NOT NULL,
    vendors TEXT[], -- Array of vendor names

    industry_avg_lead_time_weeks INTEGER NOT NULL,
    negotiated_lead_time_weeks INTEGER NOT NULL,

    -- Unit costs by datacenter size
    unit_cost_edge DECIMAL(12, 2),
    unit_cost_enterprise DECIMAL(12, 2),
    unit_cost_midscale DECIMAL(12, 2),
    unit_cost_hyperscale DECIMAL(12, 2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pre-populate equipment categories
INSERT INTO equipment_categories (category_name, vendors, industry_avg_lead_time_weeks, negotiated_lead_time_weeks, unit_cost_edge, unit_cost_enterprise, unit_cost_midscale, unit_cost_hyperscale) VALUES
('Diesel Generators', ARRAY['Caterpillar', 'Cummins', 'MTU'], 24, 16, 150000, 250000, 450000, 800000),
('Cooling Systems (CRAC/CRAH)', ARRAY['Vertiv', 'Schneider Electric', 'Stulz'], 32, 20, 200000, 450000, 850000, 1500000),
('UPS Systems', ARRAY['Eaton', 'Schneider Electric', 'Vertiv'], 28, 18, 180000, 400000, 750000, 1300000),
('Power Transformers', ARRAY['ABB', 'Siemens', 'Schneider Electric'], 40, 26, 120000, 280000, 550000, 950000),
('Switchgear & Distribution', ARRAY['ABB', 'Eaton', 'GE'], 36, 22, 100000, 220000, 420000, 750000),
('Backup Battery Systems', ARRAY['Tesla', 'Fluence', 'AES'], 20, 14, 90000, 180000, 350000, 650000),
('Fire Suppression Systems', ARRAY['Kidde', 'Fike', 'Tyco'], 16, 12, 75000, 150000, 280000, 500000),
('Security Systems', ARRAY['Honeywell', 'Siemens', 'Johnson Controls'], 14, 10, 50000, 120000, 220000, 400000);

-- =====================================================
-- 12. FINANCIAL PROJECTIONS
-- =====================================================

CREATE TABLE parcel_financial_projections (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,
    datacenter_size_id INTEGER REFERENCES datacenter_sizes(id),

    initial_investment DECIMAL(15, 2) NOT NULL,
    annual_revenue DECIMAL(15, 2) NOT NULL,

    discount_rate DECIMAL(5, 2) DEFAULT 8.0, -- percentage

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(parcel_id, datacenter_size_id)
);

CREATE TABLE npv_projections (
    id SERIAL PRIMARY KEY,
    financial_projection_id INTEGER REFERENCES parcel_financial_projections(id) ON DELETE CASCADE,

    year INTEGER NOT NULL,
    npv DECIMAL(15, 2) NOT NULL,

    UNIQUE(financial_projection_id, year)
);

CREATE TABLE irr_analysis (
    id SERIAL PRIMARY KEY,
    financial_projection_id INTEGER REFERENCES parcel_financial_projections(id) ON DELETE CASCADE,

    year INTEGER NOT NULL,
    irr DECIMAL(5, 2) NOT NULL, -- percentage

    UNIQUE(financial_projection_id, year)
);

CREATE TABLE tco_analysis (
    id SERIAL PRIMARY KEY,
    financial_projection_id INTEGER REFERENCES parcel_financial_projections(id) ON DELETE CASCADE,

    year INTEGER NOT NULL,
    cumulative_tco DECIMAL(15, 2) NOT NULL,
    annual_opex DECIMAL(15, 2) NOT NULL,

    UNIQUE(financial_projection_id, year)
);

CREATE TABLE returns_analysis (
    id SERIAL PRIMARY KEY,
    financial_projection_id INTEGER REFERENCES parcel_financial_projections(id) ON DELETE CASCADE,

    year INTEGER NOT NULL,
    revenue DECIMAL(15, 2) NOT NULL,
    opex DECIMAL(15, 2) NOT NULL,
    profit DECIMAL(15, 2) NOT NULL,

    UNIQUE(financial_projection_id, year)
);

-- =====================================================
-- 13. MARKET RISK ANALYSIS
-- =====================================================

CREATE TABLE parcel_market_risks (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,
    datacenter_size_id INTEGER REFERENCES datacenter_sizes(id),

    -- Overall success probability
    overall_success_probability INTEGER CHECK (overall_success_probability >= 0 AND overall_success_probability <= 100),
    confidence_level VARCHAR(50), -- 'High', 'Medium', 'Low'

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(parcel_id, datacenter_size_id)
);

CREATE TABLE market_risk_factors (
    id SERIAL PRIMARY KEY,
    market_risk_id INTEGER REFERENCES parcel_market_risks(id) ON DELETE CASCADE,

    risk_category VARCHAR(50) NOT NULL, -- 'market', 'power', 'integration'
    risk_name VARCHAR(255) NOT NULL,

    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    probability VARCHAR(50), -- 'Low (10-30%)', 'Medium (30-60%)', 'High (60%+)'
    impact VARCHAR(50), -- 'Low', 'Moderate', 'High', 'Critical'

    mitigation_strategy TEXT,
    success_probability INTEGER CHECK (success_probability >= 0 AND success_probability <= 100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_market_risk_factors ON market_risk_factors(market_risk_id, risk_category);

CREATE TABLE market_risk_key_drivers (
    id SERIAL PRIMARY KEY,
    market_risk_id INTEGER REFERENCES parcel_market_risks(id) ON DELETE CASCADE,

    driver_text VARCHAR(500) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 14. COMPARISON METRICS (Traditional vs Our Approach)
-- =====================================================

CREATE TABLE parcel_comparison_metrics (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,
    datacenter_size_id INTEGER REFERENCES datacenter_sizes(id),

    -- Traditional approach
    traditional_development_time_months INTEGER,
    traditional_risk_score INTEGER,
    traditional_irr DECIMAL(5, 2),
    traditional_time_to_operation_months INTEGER,
    traditional_total_cost DECIMAL(15, 2),

    -- VoltEdge approach
    voltedge_development_time_months INTEGER,
    voltedge_risk_score INTEGER,
    voltedge_irr DECIMAL(5, 2),
    voltedge_time_to_operation_months INTEGER,
    voltedge_total_cost DECIMAL(15, 2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(parcel_id, datacenter_size_id)
);

-- =====================================================
-- 15. DESIGN LAYOUTS (Auto-generated images)
-- =====================================================

CREATE TABLE parcel_design_layouts (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,
    datacenter_size_id INTEGER REFERENCES datacenter_sizes(id),

    layout_image_url VARCHAR(500), -- S3/CDN URL to PNG image
    layout_version INTEGER DEFAULT 1,

    generation_metadata JSONB, -- AI generation parameters, timestamp, etc.

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(parcel_id, datacenter_size_id, layout_version)
);

-- =====================================================
-- 16. USER SAVED PARCELS ("My List")
-- =====================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE user_saved_parcels (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    parcel_id INTEGER REFERENCES parcels(id) ON DELETE CASCADE,

    notes TEXT,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, parcel_id)
);

CREATE INDEX idx_user_saved_parcels ON user_saved_parcels(user_id);

-- =====================================================
-- VIEWS FOR API ENDPOINTS
-- =====================================================

-- Complete datacenter analysis view
CREATE VIEW v_datacenter_analysis AS
SELECT
    p.*,
    pt.average_slope_degrees,
    pt.max_slope_degrees,
    pt.slope_suitability,
    prs.political_risk_score,
    prs.seismic_risk_score,
    prs.environmental_risk_score,
    prs.transport_access_score,
    prs.water_availability_score,
    pui.utility_provider,
    pui.iso_rto,
    pui.available_capacity_mw
FROM parcels p
LEFT JOIN parcel_terrain pt ON p.id = pt.parcel_id
LEFT JOIN parcel_risk_scores prs ON p.id = prs.parcel_id
LEFT JOIN parcel_utility_info pui ON p.id = pui.parcel_id;

-- =====================================================
-- SAMPLE API QUERY EXAMPLES
-- =====================================================

-- Query for complete datacenter analysis for a parcel (would be in API endpoint)
/*
WITH parcel_data AS (
    SELECT * FROM parcels WHERE id = $1
),
infrastructure AS (
    SELECT json_agg(s) as substations FROM parcel_substations s WHERE s.parcel_id = $1
),
transmission AS (
    SELECT json_agg(t) as transmission_lines FROM parcel_transmission_lines t WHERE t.parcel_id = $1
),
water_sources AS (
    SELECT json_agg(w) as sources FROM parcel_water_sources w WHERE w.parcel_id = $1
),
power_phases AS (
    SELECT json_agg(pp ORDER BY pp.phase_number) as phases FROM parcel_power_phases pp WHERE pp.parcel_id = $1
)
SELECT
    p.*,
    i.substations,
    t.transmission_lines,
    w.sources as water_sources,
    pp.phases as power_phases,
    -- ... additional joins for all related data
FROM parcel_data p
CROSS JOIN infrastructure i
CROSS JOIN transmission t
CROSS JOIN water_sources w
CROSS JOIN power_phases pp;
*/
