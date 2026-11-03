import React, { useState } from 'react';
import { 
  Download, 
  Github, 
  Terminal, 
  Check, 
  Copy, 
  FileArchive, 
  Database, 
  Code2, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Server, 
  FileText,
  AlertCircle
} from 'lucide-react';
import JSZip from 'jszip';
import { SQL_QUERIES } from '../../db/schema';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalTab = 'download' | 'database' | 'script' | 'files';

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('download');
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [downloadErrorMsg, setDownloadErrorMsg] = useState<string | null>(null);
  const [selectedFileToView, setSelectedFileToView] = useState<'schema.sql' | 'seed.sql' | 'server.ts' | 'mlEngine.ts'>('schema.sql');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2500);
  };

  /**
   * Generates ZIP directly in browser memory with JSZip and initiates download
   * Uses File System Access API with Blob & DataURI fallbacks
   */
  const handleClientSideZipDownload = async () => {
    setIsGeneratingZip(true);
    setDownloadSuccessMsg(null);
    setDownloadErrorMsg(null);

    try {
      // 1. Fetch file map from server or generate zip
      const res = await fetch('/project-files.json');
      let files: Record<string, string> = {};
      if (res.ok) {
        files = await res.json();
      }

      const zip = new JSZip();
      const folder = zip.folder('predictx-ai-predictive-maintenance') || zip;

      // Add all project text files
      for (const [relPath, content] of Object.entries(files)) {
        folder.file(relPath, content);
      }

      // Add database files explicitly if not present
      if (!files['db/schema.sql']) {
        folder.file('db/schema.sql', SCHEMA_SQL_CONTENT);
      }
      if (!files['db/seed.sql']) {
        folder.file('db/seed.sql', SEED_SQL_CONTENT);
      }

      // Generate blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Method A: File System Access API (Native OS Save As dialog)
      if ('showSaveFilePicker' in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: 'predictx-ai-predictive-maintenance.zip',
            types: [{
              description: 'ZIP Archive (*.zip)',
              accept: { 'application/zip': ['.zip'] }
            }]
          });
          const writable = await handle.createWritable();
          await writable.write(zipBlob);
          await writable.close();
          setDownloadSuccessMsg('ZIP file saved directly to your computer!');
          setIsGeneratingZip(false);
          return;
        } catch (pickerErr: any) {
          if (pickerErr.name === 'AbortError') {
            setIsGeneratingZip(false);
            return;
          }
          console.warn('showSaveFilePicker fallback to object URL', pickerErr);
        }
      }

      // Method B: Object URL Download Link
      const blobUrl = URL.createObjectURL(zipBlob);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = 'predictx-ai-predictive-maintenance.zip';
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();

      setTimeout(() => {
        document.body.removeChild(tempLink);
        URL.revokeObjectURL(blobUrl);
      }, 1500);

      setDownloadSuccessMsg('ZIP downloaded to your browser Downloads folder!');
    } catch (err: any) {
      console.error('Client zip generation error:', err);
      // Fallback: Trigger direct public file URL
      try {
        const link = document.createElement('a');
        link.href = '/predictx-ai-predictive-maintenance.zip';
        link.download = 'predictx-ai-predictive-maintenance.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadSuccessMsg('Download initiated from server archive.');
      } catch (fallbackErr) {
        setDownloadErrorMsg('Browser restricted automatic file save. Please use the "1-Click Setup Script" or copy code from the tabs above!');
      }
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const gitCommands = `# 1. Extract zip and navigate to project directory
unzip predictx-ai-predictive-maintenance.zip -d predictx-ai
cd predictx-ai

# 2. Initialize Git repository
git init
git add .
git commit -m "feat: complete PredictX AI predictive maintenance platform with database schema"

# 3. Connect to your GitHub repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# 4. Push to GitHub!
git push -u origin main`;

  const nodeSetupScript = `// Run in terminal: node setup-predictx.js
// This single script creates all project files and database code!
// You can download it directly or copy it from the tab below.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900 text-white shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-white">PredictX Hackathon Export & Database</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-700/50">
                  Fullstack + SQL
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Complete React 19, ML models, Express API, and SQL relational database schema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors focus-visible:outline-none"
            aria-label="Close export modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('download')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'download' 
                ? 'bg-white text-blue-600 border-t-2 border-t-blue-600 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP Archive</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'database' 
                ? 'bg-white text-blue-600 border-t-2 border-t-blue-600 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database SQL Code</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'script' 
                ? 'bg-white text-blue-600 border-t-2 border-t-blue-600 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1-Click Setup Script</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'files' 
                ? 'bg-white text-blue-600 border-t-2 border-t-blue-600 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Project File Tree & Structure</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: DOWNLOAD & GIT INSTRUCTIONS */}
          {activeTab === 'download' && (
            <div className="space-y-5">
              {/* Main Download Card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 border-2 border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileArchive className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      predictx-ai-predictive-maintenance.zip
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2 font-mono">
                    <span>Size: ~2.5 MB</span>
                    <span>•</span>
                    <span>38 Total Files</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold font-sans flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Includes SQL Database & API
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-0.5">
                    Click the button below to save the zip file directly to your computer with all code and assets.
                  </p>
                </div>

                <button
                  onClick={handleClientSideZipDownload}
                  disabled={isGeneratingZip}
                  className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingZip ? 'Generating ZIP...' : 'Download Project .ZIP'}</span>
                </button>
              </div>

              {/* Status alerts */}
              {downloadSuccessMsg && (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Success:</strong> {downloadSuccessMsg}</span>
                </div>
              )}

              {downloadErrorMsg && (
                <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Browser Blocked Automatic Download</div>
                    <p className="mt-0.5">{downloadErrorMsg}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setActiveTab('script')}
                        className="px-2.5 py-1 bg-amber-600 text-white rounded text-[11px] font-bold"
                      >
                        Use 1-Click Setup Script Instead
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step-by-Step Push to GitHub Instructions */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    <Terminal className="w-4 h-4 text-blue-600" />
                    <span>Commands to Push to Your GitHub Repository</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'git')}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {copiedStep === 'git' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Commands</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative rounded-xl bg-slate-950 p-4 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                  <pre className="text-slate-300">
                    <span className="text-slate-500"># 1. Unzip the downloaded file</span>{'\n'}
                    <span className="text-blue-400">unzip</span> predictx-ai-predictive-maintenance.zip -d predictx-ai{'\n'}
                    <span className="text-blue-400">cd</span> predictx-ai{'\n'}{'\n'}
                    <span className="text-slate-500"># 2. Initialize Git & commit</span>{'\n'}
                    <span className="text-emerald-400">git init</span>{'\n'}
                    <span className="text-emerald-400">git add .</span>{'\n'}
                    <span className="text-emerald-400">git commit -m</span> <span className="text-amber-300">"feat: complete PredictX platform with ISO 10816-3 ML and database"</span>{'\n'}{'\n'}
                    <span className="text-slate-500"># 3. Push to your GitHub repo</span>{'\n'}
                    <span className="text-purple-400">git branch -M main</span>{'\n'}
                    <span className="text-purple-400">git remote add origin</span> https://github.com/<span className="text-amber-300">YOUR_USERNAME</span>/<span className="text-amber-300">YOUR_REPO</span>.git{'\n'}
                    <span className="text-purple-400">git push -u origin main</span>
                  </pre>
                </div>
              </div>

              {/* Faculty Local Run */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 block">👨‍🏫 Faculty / Evaluator Local Run Guide:</span>
                <p className="text-slate-600">
                  Your professor only needs to run <code className="bg-white px-1 py-0.5 rounded border border-slate-300 font-mono text-blue-700">npm install</code> followed by <code className="bg-white px-1 py-0.5 rounded border border-slate-300 font-mono text-blue-700">npm run dev</code>. The entire platform starts at <code className="font-mono">http://localhost:3000</code> with the IoT simulator, database services, and anomaly injection ready with zero setup.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DATABASE CODE */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Relational Database Code & SQL Models</h3>
                    <p className="text-xs text-slate-500">ISO 10816-3 compliant relational schema (PostgreSQL & SQLite compatible)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFileToView('schema.sql')}
                    className={`px-2.5 py-1 text-xs rounded-md font-mono ${selectedFileToView === 'schema.sql' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
                  >
                    schema.sql
                  </button>
                  <button
                    onClick={() => setSelectedFileToView('seed.sql')}
                    className={`px-2.5 py-1 text-xs rounded-md font-mono ${selectedFileToView === 'seed.sql' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
                  >
                    seed.sql
                  </button>
                  <button
                    onClick={() => setSelectedFileToView('server.ts')}
                    className={`px-2.5 py-1 text-xs rounded-md font-mono ${selectedFileToView === 'server.ts' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
                  >
                    server.ts
                  </button>
                </div>
              </div>

              {/* Code viewer with Copy */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-700">
                    {selectedFileToView === 'schema.sql' && 'db/schema.sql – DDL Tables & Indexes'}
                    {selectedFileToView === 'seed.sql' && 'db/seed.sql – Initial Production Data'}
                    {selectedFileToView === 'server.ts' && 'server.ts – Express API & Database Routes'}
                  </span>
                  <button
                    onClick={() => {
                      const content = selectedFileToView === 'schema.sql' ? SCHEMA_SQL_CONTENT : selectedFileToView === 'seed.sql' ? SEED_SQL_CONTENT : SERVER_TS_CONTENT;
                      copyToClipboard(content, 'sql_code');
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded bg-blue-50"
                  >
                    {copiedStep === 'sql_code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedStep === 'sql_code' ? 'Copied to Clipboard!' : 'Copy SQL File'}</span>
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto rounded-xl bg-slate-950 p-4 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed">
                  <pre>
                    {selectedFileToView === 'schema.sql' && SCHEMA_SQL_CONTENT}
                    {selectedFileToView === 'seed.sql' && SEED_SQL_CONTENT}
                    {selectedFileToView === 'server.ts' && SERVER_TS_CONTENT}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">6 Core Relational Tables</span>
                  <span className="text-slate-600">machines, sensor_channels, telemetry_readings, ml_failure_predictions, maintenance_alerts, maintenance_audit_logs.</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Time-Series Telemetry</span>
                  <span className="text-slate-600">Indexed by machine_id and timestamp with ISO Zone A/B/C/D classification.</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">REST API Endpoints</span>
                  <span className="text-slate-600">/api/telemetry/ingest, /api/database/schema, /api/database/export.sql.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 1-CLICK SETUP SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
                <div className="font-bold text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Cannot download .ZIP due to browser/iframe restrictions?</span>
                </div>
                <p>
                  No problem! You can generate the entire repository directly on your computer by copying this single script or running one command in your terminal.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Step 1: Download or Save the Setup Script
                  </span>
                  <a
                    href="/setup-predictx.js"
                    download="setup-predictx.js"
                    className="flex items-center gap-1 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download setup-predictx.js</span>
                  </a>
                </div>

                <div className="text-xs font-bold text-slate-800 pt-2">
                  Step 2: Run in your terminal / Command Prompt:
                </div>

                <div className="relative rounded-xl bg-slate-950 p-4 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                  <button
                    onClick={() => copyToClipboard('node setup-predictx.js', 'run_script')}
                    className="absolute top-3 right-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded flex items-center gap-1"
                  >
                    {copiedStep === 'run_script' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                  <pre className="text-emerald-400">node setup-predictx.js</pre>
                  <div className="text-slate-400 text-[11px] mt-2">
                    # This script automatically creates all 38 files (code + database + README) in a new folder!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FILE TREE */}
          {activeTab === 'files' && (
            <div className="space-y-4 text-xs">
              <div className="font-bold text-slate-800">Complete Repository Architecture (Included in ZIP):</div>
              <div className="rounded-xl bg-slate-900 p-4 font-mono text-slate-300 space-y-1 text-xs max-h-72 overflow-y-auto">
                <div className="text-blue-400 font-bold">📁 predictx-ai-predictive-maintenance/</div>
                <div className="pl-4">├── 📁 db/</div>
                <div className="pl-8 text-emerald-400">├── schema.sql (Full relational ANSI SQL DDL)</div>
                <div className="pl-8 text-emerald-400">└── seed.sql (Industrial baseline test seed data)</div>
                <div className="pl-4">├── 📁 src/</div>
                <div className="pl-8">├── 📁 components/</div>
                <div className="pl-12">├── 📁 dashboard/ (Fleet overview & health gauges)</div>
                <div className="pl-12">├── 📁 sensors/ (Real-time IoT telemetry monitor)</div>
                <div className="pl-12">├── 📁 predictions/ (ML failure classification & RUL)</div>
                <div className="pl-12">├── 📁 machines/ (Asset inventory & specs)</div>
                <div className="pl-12">├── 📁 alerts/ (Incident dispatch & work orders)</div>
                <div className="pl-12">├── 📁 analytics/ (Downtime prevention ROI)</div>
                <div className="pl-12">└── 📁 pipeline/ (Edge-to-cloud architecture)</div>
                <div className="pl-8">├── 📁 context/ (TelemetryContext stream engine)</div>
                <div className="pl-8">├── 📁 db/ (schema.ts & databaseService.ts)</div>
                <div className="pl-8">├── 📁 utils/ (mlEngine.ts ISO 10816 classifier)</div>
                <div className="pl-8">├── 📁 types/ (Comprehensive TypeScript definitions)</div>
                <div className="pl-8">├── App.tsx</div>
                <div className="pl-8">├── index.css (Tailwind CSS v4)</div>
                <div className="pl-8">└── main.tsx</div>
                <div className="pl-4 text-amber-300">├── server.ts (Express backend API & ingestion)</div>
                <div className="pl-4 text-blue-300">├── README.md (Comprehensive Faculty evaluation guide)</div>
                <div className="pl-4 text-blue-300">├── GITHUB_SETUP_GUIDE.md (Step-by-step push guide)</div>
                <div className="pl-4">├── package.json</div>
                <div className="pl-4">├── tsconfig.json</div>
                <div className="pl-4">└── vite.config.ts</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Database & Code Ready</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleClientSideZipDownload}
              disabled={isGeneratingZip}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingZip ? 'Generating...' : 'Download ZIP'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inline SQL references for instant copying in the UI
const SCHEMA_SQL_CONTENT = `-- PREDICTX RELATIONAL DATABASE SCHEMA (ISO 10816-3 COMPLIANT)
CREATE TABLE IF NOT EXISTS machines (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    type VARCHAR(64) NOT NULL,
    plant_location VARCHAR(128) NOT NULL,
    model_number VARCHAR(64) NOT NULL,
    serial_number VARCHAR(64) UNIQUE NOT NULL,
    installation_date DATE NOT NULL,
    last_service_date DATE NOT NULL,
    rated_rpm NUMERIC(8, 2) NOT NULL DEFAULT 1800.00,
    rated_kw NUMERIC(8, 2) NOT NULL DEFAULT 45.00,
    status VARCHAR(32) NOT NULL DEFAULT 'optimal',
    health_score NUMERIC(5, 2) NOT NULL DEFAULT 95.00,
    rul_days INTEGER NOT NULL DEFAULT 120,
    failure_risk VARCHAR(32) NOT NULL DEFAULT 'Low',
    predicted_failure_mode VARCHAR(128) DEFAULT 'Nominal Baseline',
    anomaly_detected BOOLEAN NOT NULL DEFAULT FALSE,
    anomaly_score NUMERIC(5, 4) NOT NULL DEFAULT 0.0500,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sensor_channels (
    id VARCHAR(32) PRIMARY KEY,
    machine_id VARCHAR(32) NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    sensor_type VARCHAR(64) NOT NULL,
    measurement_unit VARCHAR(16) NOT NULL,
    iso_standard_ref VARCHAR(64) DEFAULT 'ISO 10816-3',
    nominal_baseline NUMERIC(10, 3) NOT NULL,
    warning_threshold NUMERIC(10, 3) NOT NULL,
    critical_threshold NUMERIC(10, 3) NOT NULL,
    sampling_rate_hz INTEGER NOT NULL DEFAULT 1000
);

CREATE TABLE IF NOT EXISTS telemetry_readings (
    id BIGSERIAL PRIMARY KEY,
    machine_id VARCHAR(32) NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    vibration_velocity_rms NUMERIC(8, 3) NOT NULL,
    vibration_peak_acceleration NUMERIC(8, 3) NOT NULL DEFAULT 0.000,
    temperature_celsius NUMERIC(6, 2) NOT NULL,
    motor_phase_current_amps NUMERIC(6, 2) NOT NULL,
    rotational_speed_rpm NUMERIC(8, 2) NOT NULL,
    acoustic_emission_db NUMERIC(6, 2) NOT NULL DEFAULT 65.00,
    iso_zone VARCHAR(8) NOT NULL,
    anomaly_flag BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ml_failure_predictions (
    id BIGSERIAL PRIMARY KEY,
    machine_id VARCHAR(32) NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    inference_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(32) NOT NULL DEFAULT 'v2.4-xgboost-ensemble',
    predicted_failure_mode VARCHAR(128) NOT NULL,
    confidence_score NUMERIC(5, 4) NOT NULL,
    remaining_useful_life_hours NUMERIC(10, 2) NOT NULL,
    failure_probability_30d NUMERIC(5, 4) NOT NULL,
    primary_root_cause TEXT NOT NULL,
    recommended_mitigation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS maintenance_alerts (
    id VARCHAR(32) PRIMARY KEY,
    machine_id VARCHAR(32) NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    risk_level VARCHAR(16) NOT NULL,
    detected_issue VARCHAR(255) NOT NULL,
    recommended_action TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    assigned_technician VARCHAR(128) DEFAULT 'Unassigned',
    estimated_downtime_hours NUMERIC(5, 1) DEFAULT 2.0,
    cost_impact_usd NUMERIC(10, 2) DEFAULT 4500.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_audit_logs (
    id VARCHAR(32) PRIMARY KEY,
    machine_id VARCHAR(32) NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    action_type VARCHAR(64) NOT NULL,
    technician_name VARCHAR(128) NOT NULL,
    technician_role VARCHAR(64) NOT NULL DEFAULT 'Senior Reliability Tech',
    post_repair_vibration NUMERIC(6, 3) NOT NULL,
    iso_cert_status VARCHAR(32) NOT NULL DEFAULT 'ISO 10816-3 Certified',
    notes TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const SEED_SQL_CONTENT = `-- PREDICTX INDUSTRIAL SEED DATA
INSERT INTO machines (id, name, type, plant_location, model_number, serial_number, installation_date, last_service_date, rated_rpm, rated_kw, status, health_score, rul_days, failure_risk, predicted_failure_mode, anomaly_detected, anomaly_score)
VALUES 
('CNC-402', 'High-Speed 5-Axis CNC Milling Center', 'cnc_milling', 'Bay 1 - Precision Machining', 'Haas VF-4SS', 'SN-HAAS-2023-8819', '2023-04-15', '2026-09-10', 12000.00, 22.40, 'warning', 78.40, 24, 'Medium', 'Bearing Outer-Race Micro-Spalling', TRUE, 0.4210),
('PMP-108', 'Heavy Slurry Centrifugal Feed Pump', 'centrifugal_pump', 'Bay 4 - Fluid Circulation', 'Sulzer Ahlstar-A32', 'SN-SULZ-2022-4412', '2022-08-20', '2026-10-02', 2950.00, 75.00, 'optimal', 94.20, 185, 'Low', 'Nominal Baseline', FALSE, 0.0450),
('HYD-305', 'Automotive Deep-Draw Hydraulic Press', 'hydraulic_press', 'Bay 2 - Heavy Stamping', 'Schuler SH-800T', 'SN-SCHU-2021-9921', '2021-02-11', '2026-08-14', 1450.00, 160.00, 'optimal', 91.50, 142, 'Low', 'Nominal Baseline', FALSE, 0.0620),
('TRB-019', 'Combined Cycle Gas Turbine Generator', 'wind_turbine', 'Turbine Hall B', 'Siemens SGT-400', 'SN-SIEM-2020-1123', '2020-11-05', '2026-07-28', 3600.00, 12900.00, 'optimal', 96.80, 210, 'Low', 'Nominal Baseline', FALSE, 0.0210);`;

const SERVER_TS_CONTENT = `import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API: Health check & ISO Compliance status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'PredictX Industrial PdM API',
    iso_compliance: 'ISO 10816-3',
    timestamp: new Date().toISOString()
  });
});

// API: Database Schema
app.get('/api/database/schema', (req: Request, res: Response) => {
  const schemaPath = path.join(__dirname, 'db', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    res.type('text/plain').send(fs.readFileSync(schemaPath, 'utf8'));
  } else {
    res.status(404).send('Schema not found');
  }
});

// API: Telemetry Ingestion
app.post('/api/telemetry/ingest', (req: Request, res: Response) => {
  const { machine_id, vibration_rms, temperature, current } = req.body;
  let isoZone = 'A';
  if (vibration_rms > 7.1) isoZone = 'D';
  else if (vibration_rms > 4.5) isoZone = 'C';
  else if (vibration_rms > 1.8) isoZone = 'B';

  res.json({
    status: 'INGESTED',
    machine_id,
    iso_zone: isoZone,
    advisory: isoZone === 'D' ? 'CRITICAL: Immediate shutdown recommended' : 'NOMINAL'
  });
});

export default app;`;
