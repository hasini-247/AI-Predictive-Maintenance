-- ============================================================================
-- PREDICTX INDUSTRIAL SEED DATA (ISO 10816-3 REFERENCE BENCHMARKS)
-- Seed machines, sensor channels, telemetry logs, ML diagnostics, and alerts
-- ============================================================================

-- 1. SEED MACHINES
INSERT INTO machines (id, name, type, plant_location, model_number, serial_number, installation_date, last_service_date, rated_rpm, rated_kw, status, health_score, rul_days, failure_risk, predicted_failure_mode, anomaly_detected, anomaly_score)
VALUES 
('CNC-402', 'High-Speed 5-Axis CNC Milling Center', 'cnc_milling', 'Bay 1 - Precision Machining', 'Haas VF-4SS', 'SN-HAAS-2023-8819', '2023-04-15', '2026-09-10', 12000.00, 22.40, 'warning', 78.40, 24, 'Medium', 'Bearing Outer-Race Micro-Spalling', TRUE, 0.4210),
('PMP-108', 'Heavy Slurry Centrifugal Feed Pump', 'centrifugal_pump', 'Bay 4 - Fluid Circulation', 'Sulzer Ahlstar-A32', 'SN-SULZ-2022-4412', '2022-08-20', '2026-10-02', 2950.00, 75.00, 'optimal', 94.20, 185, 'Low', 'Nominal Baseline', FALSE, 0.0450),
('HYD-305', 'Automotive Deep-Draw Hydraulic Press', 'hydraulic_press', 'Bay 2 - Heavy Stamping', 'Schuler SH-800T', 'SN-SCHU-2021-9921', '2021-02-11', '2026-08-14', 1450.00, 160.00, 'optimal', 91.50, 142, 'Low', 'Nominal Baseline', FALSE, 0.0620),
('TRB-019', 'Combined Cycle Gas Turbine Generator', 'wind_turbine', 'Turbine Hall B', 'Siemens SGT-400', 'SN-SIEM-2020-1123', '2020-11-05', '2026-07-28', 3600.00, 12900.00, 'optimal', 96.80, 210, 'Low', 'Nominal Baseline', FALSE, 0.0210),
('ROB-601', 'Heavy Payload 6-Axis Spot Welding Robot', 'cnc_milling', 'Bay 3 - Assembly Cell A', 'KUKA KR-300', 'SN-KUKA-2024-0041', '2024-01-18', '2026-10-15', 3000.00, 15.00, 'optimal', 97.50, 240, 'Low', 'Nominal Baseline', FALSE, 0.0150),
('PMP-204', 'High-Pressure Boiler Feed Pump 2', 'centrifugal_pump', 'Bay 4 - Power Auxiliaries', 'KSB HGC-6', 'SN-KSB-2019-3381', '2019-06-30', '2026-06-12', 4500.00, 110.00, 'critical', 48.00, 6, 'Critical', 'Severe Cavitation & Shaft Misalignment', TRUE, 0.8920)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED SENSOR CHANNELS
INSERT INTO sensor_channels (id, machine_id, sensor_type, measurement_unit, iso_standard_ref, nominal_baseline, warning_threshold, critical_threshold, sampling_rate_hz)
VALUES
('SEN-VIB-402', 'CNC-402', 'accelerometer_triaxial', 'mm/s', 'ISO 10816-3 Class II', 1.800, 4.500, 7.100, 1000),
('SEN-TMP-402', 'CNC-402', 'thermocouple_pt100', '°C', 'OEM Spec Table 4', 45.000, 75.000, 85.000, 10),
('SEN-CUR-402', 'CNC-402', 'current_ct', 'A', 'NEMA MG-1', 28.000, 42.000, 50.000, 100),
('SEN-VIB-108', 'PMP-108', 'accelerometer_triaxial', 'mm/s', 'ISO 10816-3 Class III', 2.200, 4.500, 7.100, 1000),
('SEN-TMP-108', 'PMP-108', 'thermocouple_pt100', '°C', 'OEM Spec Table 4', 52.000, 80.000, 92.000, 10),
('SEN-VIB-204', 'PMP-204', 'accelerometer_triaxial', 'mm/s', 'ISO 10816-3 Class III', 2.300, 4.500, 7.100, 1000)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED INITIAL MAINTENANCE ALERTS
INSERT INTO maintenance_alerts (id, machine_id, risk_level, detected_issue, recommended_action, status, assigned_technician, estimated_downtime_hours, cost_impact_usd)
VALUES
('ALT-9041', 'PMP-204', 'Critical', 'ISO Zone D Vibration Surge (7.82 mm/s RMS) with Stator Cavitation', 'Immediate shutdown and emergency impeller inspection required to prevent bearing destruction.', 'active', 'Markus Vance (Lead Mech Tech)', 4.5, 18500.00),
('ALT-9038', 'CNC-402', 'Warning', 'Elevated BPFO 142 Hz Harmonic Spike Indicating Outer-Race Bearing Wear', 'Schedule lubrication purge and replacement of SKF 6208 deep-groove bearing within 14 days.', 'investigating', 'Elena Rostova (Vibration Analyst)', 2.0, 4200.00)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED ISO AUDIT MAINTENANCE LOGS
INSERT INTO maintenance_audit_logs (id, machine_id, action_type, technician_name, technician_role, post_repair_vibration, iso_cert_status, notes, parts_replaced)
VALUES
('LOG-2026-118', 'PMP-108', 'laser_shaft_alignment', 'Dr. Michael Chen', 'Lead Reliability Engineer', 1.450, 'ISO 10816-3 Certified - Zone A', 'Completed 4-axis laser alignment using Easy-Laser XT770. Parallel offset reduced from 0.18mm to 0.02mm.', ARRAY['Mechanical Seal John Crane Type 1', 'Elastomeric Coupler Insert']),
('LOG-2026-092', 'HYD-305', 'lube_topup', 'Marcus Vance', 'Senior Reliability Tech', 1.620, 'ISO 10816-3 Certified - Zone A', 'Hydraulic fluid sampled and filtered. ISO 4406 cleanliness improved to 16/14/11.', ARRAY['Shell Tellus S2 VX 46 Filter Cartridge'])
ON CONFLICT (id) DO NOTHING;
