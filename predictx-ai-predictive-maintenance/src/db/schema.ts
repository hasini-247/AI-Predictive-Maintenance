// ============================================================================
// TypeScript Database Entity Definitions & Query Templates
// Matches db/schema.sql relational structure
// ============================================================================

export interface MachineRecord {
  id: string;
  name: string;
  type: 'cnc_milling' | 'centrifugal_pump' | 'hydraulic_press' | 'wind_turbine';
  plant_location: string;
  model_number: string;
  serial_number: string;
  installation_date: string;
  last_service_date: string;
  rated_rpm: number;
  rated_kw: number;
  status: 'healthy' | 'optimal' | 'warning' | 'critical' | 'maintenance';
  health_score: number;
  rul_days: number;
  failure_risk: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  predicted_failure_mode: string;
  anomaly_detected: boolean;
  anomaly_score: number;
  created_at?: string;
  updated_at?: string;
}

export interface SensorChannelRecord {
  id: string;
  machine_id: string;
  sensor_type: string;
  measurement_unit: string;
  iso_standard_ref: string;
  nominal_baseline: number;
  warning_threshold: number;
  critical_threshold: number;
  sampling_rate_hz: number;
  is_active: boolean;
}

export interface TelemetryReadingRecord {
  id?: number;
  machine_id: string;
  timestamp: string;
  vibration_velocity_rms: number; // mm/s
  vibration_peak_acceleration: number; // g
  temperature_celsius: number; // °C
  motor_phase_current_amps: number; // A
  rotational_speed_rpm: number; // RPM
  acoustic_emission_db: number; // dB
  iso_zone: 'A' | 'B' | 'C' | 'D';
  anomaly_flag: boolean;
}

export interface MLPredictionRecord {
  id?: number;
  machine_id: string;
  inference_timestamp: string;
  model_version: string;
  predicted_failure_mode: string;
  confidence_score: number;
  remaining_useful_life_hours: number;
  failure_probability_30d: number;
  primary_root_cause: string;
  recommended_mitigation: string;
  feature_importance_json?: Record<string, number>;
}

export interface MaintenanceAlertRecord {
  id: string;
  machine_id: string;
  risk_level: 'Nominal' | 'Warning' | 'Critical';
  detected_issue: string;
  recommended_action: string;
  status: 'active' | 'investigating' | 'resolved';
  assigned_technician: string;
  estimated_downtime_hours: number;
  cost_impact_usd: number;
  created_at: string;
  resolved_at?: string | null;
  resolution_notes?: string | null;
}

export interface MaintenanceAuditRecord {
  id: string;
  machine_id: string;
  action_type: string;
  technician_name: string;
  technician_role: string;
  post_repair_vibration: number;
  iso_cert_status: string;
  notes: string;
  parts_replaced: string[];
  completed_at: string;
}

// SQL Query Constants for Backend & ORM Adapters
export const SQL_QUERIES = {
  GET_ALL_MACHINES: `SELECT * FROM machines ORDER BY health_score ASC;`,
  GET_MACHINE_BY_ID: `SELECT * FROM machines WHERE id = $1;`,
  UPDATE_MACHINE_HEALTH: `
    UPDATE machines 
    SET health_score = $1, rul_days = $2, failure_risk = $3, 
        predicted_failure_mode = $4, anomaly_detected = $5, anomaly_score = $6, updated_at = CURRENT_TIMESTAMP
    WHERE id = $7 RETURNING *;
  `,
  INSERT_TELEMETRY_READING: `
    INSERT INTO telemetry_readings (
      machine_id, timestamp, vibration_velocity_rms, vibration_peak_acceleration,
      temperature_celsius, motor_phase_current_amps, rotational_speed_rpm,
      acoustic_emission_db, iso_zone, anomaly_flag
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id;
  `,
  GET_RECENT_TELEMETRY: `
    SELECT * FROM telemetry_readings 
    WHERE machine_id = $1 
    ORDER BY timestamp DESC 
    LIMIT $2;
  `,
  INSERT_ALERT: `
    INSERT INTO maintenance_alerts (
      id, machine_id, risk_level, detected_issue, recommended_action,
      status, assigned_technician, estimated_downtime_hours, cost_impact_usd
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `,
  UPDATE_ALERT_STATUS: `
    UPDATE maintenance_alerts 
    SET status = $1, resolution_notes = $2, resolved_at = $3
    WHERE id = $4 RETURNING *;
  `,
  GET_ACTIVE_ALERTS: `
    SELECT a.*, m.name as machine_name, m.plant_location
    FROM maintenance_alerts a
    JOIN machines m ON a.machine_id = m.id
    WHERE a.status IN ('active', 'investigating')
    ORDER BY CASE a.risk_level WHEN 'Critical' THEN 1 WHEN 'Warning' THEN 2 ELSE 3 END, a.created_at DESC;
  `,
  GET_FLEET_METRICS: `
    SELECT 
      COUNT(*) AS total_machines,
      COUNT(*) FILTER (WHERE status = 'optimal') AS healthy_count,
      COUNT(*) FILTER (WHERE status = 'warning') AS warning_count,
      COUNT(*) FILTER (WHERE status = 'critical') AS critical_count,
      AVG(health_score) AS avg_health,
      AVG(rul_days) AS avg_rul
    FROM machines;
  `
};
