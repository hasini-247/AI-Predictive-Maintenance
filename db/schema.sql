-- ============================================================================
-- PREDICTX INDUSTRIAL PREDICTIVE MAINTENANCE PLATFORM
-- Relational Database Schema (PostgreSQL / SQLite / MySQL Compatible)
-- Compliant with ISO 10816-3 Mechanical Vibration & ISO 13374 Condition Monitoring
-- ============================================================================

-- 1. ASSET FLEET: INDUSTRIAL MACHINES TABLE
CREATE TABLE IF NOT EXISTS machines (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    type VARCHAR(64) NOT NULL, -- 'cnc_milling', 'centrifugal_pump', 'hydraulic_press', 'wind_turbine'
    plant_location VARCHAR(128) NOT NULL,
    model_number VARCHAR(64) NOT NULL,
    serial_number VARCHAR(64) UNIQUE NOT NULL,
    installation_date DATE NOT NULL,
    last_service_date DATE NOT NULL,
    rated_rpm NUMERIC(8, 2) NOT NULL DEFAULT 1800.00,
    rated_kw NUMERIC(8, 2) NOT NULL DEFAULT 45.00,
    status VARCHAR(32) NOT NULL DEFAULT 'optimal', -- 'optimal', 'warning', 'critical', 'maintenance'
    health_score NUMERIC(5, 2) NOT NULL DEFAULT 95.00, -- 0.00 to 100.00
    rul_days INTEGER NOT NULL DEFAULT 120, -- Remaining Useful Life in days
    failure_risk VARCHAR(32) NOT NULL DEFAULT 'Low', -- 'Low', 'Medium', 'High', 'Critical'
    predicted_failure_mode VARCHAR(128) DEFAULT 'Nominal Baseline',
    anomaly_detected BOOLEAN NOT NULL DEFAULT FALSE,
    anomaly_score NUMERIC(5, 4) NOT NULL DEFAULT 0.0500, -- 0.0000 to 1.0000
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_machines_status ON machines(status);
CREATE INDEX IF NOT EXISTS idx_machines_type ON machines(type);
CREATE INDEX IF NOT EXISTS idx_machines_health ON machines(health_score);

-- 2. IOT SENSOR METADATA & CALIBRATION
CREATE TABLE IF NOT EXISTS sensor_channels (
    id VARCHAR(32) PRIMARY KEY,
    machine_id VARCHAR(32) NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    sensor_type VARCHAR(64) NOT NULL, -- 'accelerometer_triaxial', 'thermocouple_pt100', 'current_ct', 'tachometer', 'acoustic_piezo'
    measurement_unit VARCHAR(16) NOT NULL, -- 'mm/s', '°C', 'A', 'RPM', 'dB'
    iso_standard_ref VARCHAR(64) DEFAULT 'ISO 10816-3',
    nominal_baseline NUMERIC(10, 3) NOT NULL,
    warning_threshold NUMERIC(10, 3) NOT NULL,
    critical_threshold NUMERIC(10, 3) NOT NULL,
    sampling_rate_hz INTEGER NOT NULL DEFAULT 1000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sensor_machine ON sensor_channels(machine_id);

-- 3. HIGH-FREQUENCY TELEMETRY TIME-SERIES TABLE
CREATE TABLE IF NOT EXISTS telemetry_readings (
    id BIGSERIAL PRIMARY KEY,
    machine_id VARCHAR(32) NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    vibration_velocity_rms NUMERIC(8, 3) NOT NULL, -- mm/s RMS (ISO standard metric)
    vibration_peak_acceleration NUMERIC(8, 3) NOT NULL DEFAULT 0.000, -- g (crest factor)
    temperature_celsius NUMERIC(6, 2) NOT NULL, -- °C
    motor_phase_current_amps NUMERIC(6, 2) NOT NULL, -- A
    rotational_speed_rpm NUMERIC(8, 2) NOT NULL, -- RPM
    acoustic_emission_db NUMERIC(6, 2) NOT NULL DEFAULT 65.00, -- dB
    iso_zone VARCHAR(8) NOT NULL, -- 'A', 'B', 'C', 'D'
    anomaly_flag BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_telemetry_machine_time ON telemetry_readings(machine_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_iso_zone ON telemetry_readings(iso_zone);

-- 4. MACHINE LEARNING INFERENCE AUDIT & RUL FORECASTS
CREATE TABLE IF NOT EXISTS ml_failure_predictions (
    id BIGSERIAL PRIMARY KEY,
    machine_id VARCHAR(32) NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    inference_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(32) NOT NULL DEFAULT 'v2.4-xgboost-ensemble',
    predicted_failure_mode VARCHAR(128) NOT NULL,
    confidence_score NUMERIC(5, 4) NOT NULL, -- e.g. 0.9640 (96.4%)
    remaining_useful_life_hours NUMERIC(10, 2) NOT NULL,
    failure_probability_30d NUMERIC(5, 4) NOT NULL,
    primary_root_cause TEXT NOT NULL,
    recommended_mitigation TEXT NOT NULL,
    feature_importance_json JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_predictions_machine ON ml_failure_predictions(machine_id, inference_timestamp DESC);

-- 5. MAINTENANCE ALERTS & DISPATCH WORK ORDERS
CREATE TABLE IF NOT EXISTS maintenance_alerts (
    id VARCHAR(32) PRIMARY KEY,
    machine_id VARCHAR(32) NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    risk_level VARCHAR(16) NOT NULL, -- 'Nominal', 'Warning', 'Critical'
    detected_issue VARCHAR(255) NOT NULL,
    recommended_action TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'investigating', 'resolved'
    assigned_technician VARCHAR(128) DEFAULT 'Unassigned',
    estimated_downtime_hours NUMERIC(5, 1) DEFAULT 2.0,
    cost_impact_usd NUMERIC(10, 2) DEFAULT 4500.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_alerts_status ON maintenance_alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_risk ON maintenance_alerts(risk_level);

-- 6. ISO AUDIT MAINTENANCE COMPLIANCE LOGS
CREATE TABLE IF NOT EXISTS maintenance_audit_logs (
    id VARCHAR(32) PRIMARY KEY,
    machine_id VARCHAR(32) NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    action_type VARCHAR(64) NOT NULL, -- 'bearing_replacement', 'laser_shaft_alignment', 'lube_topup', 'vibration_recertification'
    technician_name VARCHAR(128) NOT NULL,
    technician_role VARCHAR(64) NOT NULL DEFAULT 'Senior Reliability Tech',
    post_repair_vibration NUMERIC(6, 3) NOT NULL, -- mm/s RMS (must be in Zone A < 1.8 mm/s)
    iso_cert_status VARCHAR(32) NOT NULL DEFAULT 'ISO 10816-3 Certified',
    notes TEXT NOT NULL,
    parts_replaced TEXT[],
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_machine ON maintenance_audit_logs(machine_id);

-- 7. VIBRATION FREQUENCY SPECTRUM (FFT PEAKS)
CREATE TABLE IF NOT EXISTS vibration_fft_spectra (
    id BIGSERIAL PRIMARY KEY,
    machine_id VARCHAR(32) NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    peak_1x_freq_hz NUMERIC(8, 2) NOT NULL, -- 1X Running Speed Frequency
    peak_1x_amplitude NUMERIC(8, 3) NOT NULL,
    peak_2x_freq_hz NUMERIC(8, 2) NOT NULL, -- 2X Misalignment Harmonic
    peak_2x_amplitude NUMERIC(8, 3) NOT NULL,
    bpfo_bearing_fault_hz NUMERIC(8, 2) NOT NULL, -- Ball Pass Outer Race Frequency
    bpfo_amplitude NUMERIC(8, 3) NOT NULL,
    spectral_crest_factor NUMERIC(6, 2) NOT NULL
);

-- ============================================================================
-- VIEW: FLEET RELIABILITY KPI SUMMARY
-- ============================================================================
CREATE OR REPLACE VIEW view_fleet_kpi_summary AS
SELECT 
    COUNT(*) AS total_machines,
    COUNT(*) FILTER (WHERE status = 'optimal') AS healthy_machines,
    COUNT(*) FILTER (WHERE status = 'warning') AS warning_machines,
    COUNT(*) FILTER (WHERE status = 'critical') AS critical_machines,
    ROUND(AVG(health_score), 2) AS average_fleet_health,
    ROUND(AVG(rul_days), 1) AS average_rul_days,
    ROUND(MIN(rul_days), 1) AS minimum_rul_days
FROM machines;
