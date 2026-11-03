import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Routes for Database & IoT Telemetry
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'PredictX Industrial PdM API',
    iso_compliance: 'ISO 10816-3',
    timestamp: new Date().toISOString()
  });
});

// Database Schema endpoint
app.get('/api/database/schema', (req: Request, res: Response) => {
  const schemaPath = path.join(__dirname, 'db', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    res.type('text/plain').send(schemaSql);
  } else {
    res.status(404).send('Schema file not found');
  }
});

// Database SQL Export Download endpoint
app.get('/api/database/export.sql', (req: Request, res: Response) => {
  const schemaPath = path.join(__dirname, 'db', 'schema.sql');
  const seedPath = path.join(__dirname, 'db', 'seed.sql');
  
  let combinedSql = '-- PredictX Full Database Export\n\n';
  if (fs.existsSync(schemaPath)) combinedSql += fs.readFileSync(schemaPath, 'utf8') + '\n\n';
  if (fs.existsSync(seedPath)) combinedSql += fs.readFileSync(seedPath, 'utf8') + '\n\n';

  res.setHeader('Content-Disposition', 'attachment; filename="predictx-database-dump.sql"');
  res.type('application/sql').send(combinedSql);
});

// Telemetry Ingestion endpoint
app.post('/api/telemetry/ingest', (req: Request, res: Response) => {
  const { machine_id, vibration_rms, temperature, current, rpm } = req.body;
  
  // Calculate ISO 10816-3 Zone
  let isoZone = 'A';
  if (vibration_rms > 7.1) isoZone = 'D';
  else if (vibration_rms > 4.5) isoZone = 'C';
  else if (vibration_rms > 1.8) isoZone = 'B';

  res.json({
    status: 'INGESTED',
    packet_id: Date.now(),
    machine_id,
    iso_zone: isoZone,
    advisory: isoZone === 'D' ? 'CRITICAL: Immediate shutdown recommended' : 'NOMINAL'
  });
});

// In development or production, handle vite middlewares or static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[PredictX Server] Running on http://localhost:${PORT}`);
  });
}
