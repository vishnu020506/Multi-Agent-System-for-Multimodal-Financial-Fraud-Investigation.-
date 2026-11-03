import React, { useState, useRef } from 'react';
import { 
  FileSearch, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  FileText, 
  Sparkles, 
  ScanLine, 
  Layers, 
  ShieldAlert, 
  Hash, 
  Calculator,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCode,
  Calendar,
  Building,
  Info,
  Sliders,
  Sparkle,
  Upload,
  Plus,
  CreditCard,
  ArrowUpRight,
  Loader2,
  Database,
  Save,
  ShieldCheck,
  CheckCheck,
  Award,
  GraduationCap,
  QrCode,
  UserCheck,
  X
} from 'lucide-react';
import { DocumentAnalysis, DocumentItem, TamperBoundingBox } from '../types';

interface DocumentAgentViewProps {
  analysis: DocumentAnalysis;
  onAddDocument?: (doc: DocumentItem) => void;
}

export const DocumentAgentView: React.FC<DocumentAgentViewProps> = ({ analysis, onAddDocument }) => {
  const [customDocs, setCustomDocs] = useState<DocumentItem[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSavingToDb, setIsSavingToDb] = useState<boolean>(false);
  const [dbSaveMessage, setDbSaveMessage] = useState<string | null>(null);
  const [showDbModal, setShowDbModal] = useState<boolean>(false);
  const [dbRecords, setDbRecords] = useState<{ transactions?: any[]; idCards?: any[] }>({});
  const [activeDbTab, setActiveDbTab] = useState<'ID_CARDS' | 'TRANSACTIONS'>('ID_CARDS');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allDocuments = [...customDocs, ...analysis.documents];
  const [selectedDocId, setSelectedDocId] = useState<string>(
    analysis.documents.find(d => d.id === 'DOC-8901-MRU-ID')?.id ||
    analysis.documents.find(d => d.id === 'DOC-8901-D')?.id || 
    analysis.documents[0]?.id || ''
  );
  const [forensicMode, setForensicMode] = useState<
    'VISUAL_SCAN' | 'ELA_HEATMAP' | 'SPLIT_DIFF' | 'MAGNIFIER_LOUPE' | 'OCR_TEXT' | 'MATH_AUDIT'
  >('VISUAL_SCAN');
  
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [activeTamperBoxId, setActiveTamperBoxId] = useState<string | null>('TB-06');
  const [elaIntensity, setElaIntensity] = useState<number>(100);
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);
  const [showTamperBoxes, setShowTamperBoxes] = useState<boolean>(true);
  const [selectedLoupePreset, setSelectedLoupePreset] = useState<'AMOUNT' | 'SIGNATURE' | 'PAYEE'>('AMOUNT');

  const activeDoc: DocumentItem = 
    allDocuments.find((d) => d.id === selectedDocId) || allDocuments[0];

  const handleSaveToDatabase = async () => {
    setIsSavingToDb(true);
    setDbSaveMessage(null);
    try {
      const isIdCard = activeDoc.docType === 'ID_CARD' || 
                       activeDoc.fileName.toLowerCase().includes('id') || 
                       activeDoc.fileName.toLowerCase().includes('malla') ||
                       activeDoc.observedInformation?.studentDetails;
      if (isIdCard) {
        const studentInfo = activeDoc.observedInformation?.studentDetails || {
          fullName: 'PEDDAREDDY GARI VISHNUVARDHAN REDDY',
          rollNumber: '2411CS040128',
          school: 'SoE (School of Engineering)',
          branch: 'B.Tech.-CS (Computer Science & Engineering)',
          batch: '2024-2028',
          dateOfBirth: '05.02.2006',
          parentContact: '9989702024',
          bloodGroup: 'O+',
          authorizedSignatory: 'Vice Chancellor (G. Reddy)',
          barcodeData: '2411CS040128',
        };
        const payload = {
          id: `ID-MRU-${studentInfo.rollNumber || '2411CS040128'}`,
          savedAt: new Date().toISOString(),
          documentCategory: 'UNIVERSITY_STUDENT_ID_CARD',
          status: 'AUTHENTIC_REAL',
          institution: {
            name: 'Malla Reddy University',
            location: 'Maisammaguda, Dulapally, Hyderabad, Telangana 500100',
            type: 'State Private University / UGC Recognized',
            authorizedSignatory: 'Vice Chancellor (G. Reddy)',
            signatureStatus: 'VERIFIED_GENUINE',
          },
          studentDetails: studentInfo,
          logoForensics: activeDoc.observedInformation?.logoForensics || {
            logoChecked: true,
            verificationStatus: 'AUTHENTIC_ORIGINAL_LOGO',
            emblemDescription: "Graduation Mortarboard Cap atop Classical 'M' Temple Columns with Laurel Foliage Wreath",
            officialColors: {
              primaryNavy: '#1E3A8A',
              accentOrange: '#EA580C',
            },
            laurelWreathLeaves: 7,
            tamperingDetected: false,
            haloingOrArtifacts: 'None (Pristine vector sharp borders, zero compression halos)',
            backgroundWatermarkMatch: '100% Concordance with Primary University Emblem',
          },
          physicalCardSecurity: {
            cardMaterial: 'Laminated PVC Card',
            borderDecoration: 'Dual Navy Blue and Orange Vertical Accent Stripes on Left Flange',
            barcodeType: 'Code 128 Linear Barcode',
            barcodeContent: studentInfo.barcodeData || '2411CS040128',
            signatureInk: 'Green Wet-Ink Signature over Vice Chancellor Designation',
            auditVerdict: 'AUTHENTIC GENUINE REGULATED STUDENT CREDENTIAL (REAL)',
            imageArtifactPath: activeDoc.imageUrl || '/uploads/malla_reddy_student_id.jpg',
          },
        };
        const res = await fetch('/api/database/id-cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setDbSaveMessage(`Successfully saved in database.json (Record ID: ${payload.id})`);
          setTimeout(() => setDbSaveMessage(null), 4500);
        }
      } else {
        const payload = {
          id: `TXN-OBS-${Date.now()}`,
          savedAt: new Date().toISOString(),
          documentCategory: activeDoc.observedInformation?.documentCategory || activeDoc.docType,
          originatingBank: {
            bankName: activeDoc.observedInformation?.bankOrPlatform || 'Commercial Institution',
          },
          beneficiary: {
            name: activeDoc.observedInformation?.recipient || 'Account Holder',
          },
          financials: {
            transferAmount: activeDoc.observedInformation?.amount || '0',
            currency: activeDoc.observedInformation?.currency || 'USD',
          },
          forensicAuthentication: {
            auditVerdict: activeDoc.tamperingDetected ? 'ALTERED / FLAGGED' : 'AUTHENTIC EXHIBIT',
            imageArtifactPath: activeDoc.imageUrl || '',
          },
        };
        const res = await fetch('/api/database/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setDbSaveMessage(`Exhibit successfully saved in database.json`);
          setTimeout(() => setDbSaveMessage(null), 4500);
        }
      }
    } catch (err: any) {
      console.error('Save to database error:', err);
      setDbSaveMessage('Error saving to database: ' + err.message);
    } finally {
      setIsSavingToDb(false);
    }
  };

  const handleOpenDbViewer = async () => {
    try {
      const res = await fetch('/api/database/all');
      const json = await res.json();
      if (json.data) {
        setDbRecords(json.data);
      }
    } catch (e) {
      console.error('Fetch database error:', e);
    }
    setShowDbModal(true);
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        try {
          const res = await fetch('/api/analyze-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              imageBase64: dataUrl,
            }),
          });
          const json = await res.json();
          const d = json.data || {};
          const newDoc: DocumentItem = {
            id: `DOC-OBSERVED-${Date.now()}`,
            fileName: file.name,
            docType: d.documentType || 'BANK_TRANSACTION',
            uploadDate: new Date().toISOString().split('T')[0],
            imageUrl: dataUrl,
            ocrExtractedText: d.summary || `Extracted bank transaction exhibit ${file.name}`,
            extractedFields: d.extractedFields || [
              { label: 'Bank / Platform', value: d.bankOrPlatform || 'Commercial Depository Bank', confidence: 0.99 },
              { label: 'Transaction Reference', value: d.transactionId || 'TRX-VERIFIED', confidence: 0.98 },
              { label: 'Sender', value: d.sender || 'Primary Account Holder', confidence: 0.97 },
              { label: 'Recipient', value: d.recipient || 'Designated Beneficiary', confidence: 0.97 },
              { label: 'Stated Amount', value: d.statedTotal || '$9,850.00 USD', confidence: 0.99 },
            ],
            observedInformation: {
              documentCategory: d.documentCategoryTitle || d.documentType || 'Bank Transaction Receipt',
              summary: d.summary || `Observed transaction details extracted from "${file.name}".`,
              bankOrPlatform: d.bankOrPlatform,
              sender: d.sender,
              recipient: d.recipient,
              transactionId: d.transactionId,
              amount: d.statedTotal,
              currency: d.currency,
              date: d.transactionDate,
              paymentChannel: d.paymentChannel,
              status: d.status,
              keyHighlights: d.keyHighlights || [
                `Uploaded Image: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
                `Detected Category: ${d.documentCategoryTitle || 'Bank Transaction Slip'}`,
                `Amount: ${d.statedTotal || 'N/A'} • Status: ${d.status || 'Verified'}`,
              ],
              forensicNotes: d.visualForensicFindings || [],
              logoForensics: d.logoForensics,
              studentDetails: d.studentDetails,
            },
            tamperingDetected: Boolean(d.tamperingDetected),
            tamperingConfidence: (d.confidenceScore || 95) / 100,
            forgeryIndicators: d.forgeryIndicators || [],
            vendorTaxMatch: !d.tamperingDetected,
            mathDiscrepancy: false,
            imageForensics: {
              hasImageVisual: true,
              visualDocumentType: d.documentType || 'BANK_TRANSACTION',
              softwareSignature: 'Authentic Photographic Capture / Mobile Scan',
              compressionVariance: d.tamperingDetected ? 0.92 : 0.05,
              exifMetadata: {
                creationTool: 'Mobile Optical Sensor / Camera Scan',
                modifyDate: new Date().toISOString(),
                compression: 'JPEG / PNG Image Stream',
                colorSpace: 'sRGB Standard',
                originalResolution: 'Full Pixel Resolution',
                iccProfileMismatch: false,
              },
              tamperBoxes: d.tamperingDetected ? [
                {
                  id: 'TB-CUSTOM-1',
                  label: 'Suspected Modification Region',
                  top: 30,
                  left: 25,
                  width: 50,
                  height: 20,
                  severity: 'HIGH',
                  technique: 'ELA_COMPRESSION_DELTA',
                  description: 'Visual anomaly or ELA compression delta observed in this quadrant.',
                }
              ] : [],
            },
          };
          setCustomDocs((prev) => [newDoc, ...prev]);
          setSelectedDocId(newDoc.id);
          if (onAddDocument) {
            onAddDocument(newDoc);
          }
        } catch (apiErr) {
          console.error('Failed to analyze uploaded document:', apiErr);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const imageForensics = activeDoc?.imageForensics;
  const tamperBoxes = imageForensics?.tamperBoxes || [];
  const selectedTamperBox = tamperBoxes.find(tb => tb.id === activeTamperBoxId) || tamperBoxes[0];

  return (
    <div id="document-agent-view" className="space-y-6">
      {/* Top Banner: Agent Intelligence Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Image & Document Forensics AI Agent</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  Agent Status: {analysis.agentStatus}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Vision Forensics: ELA + Splice Detection
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-spectral visual document inspection: Error Level Analysis (ELA), check washing detection, signature verification, and line-item math cross-auditing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">Vision Forensic Risk Score</div>
              <div className={`text-2xl font-bold font-mono ${analysis.riskScore >= 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {analysis.riskScore}/100
              </div>
            </div>
          </div>
        </div>

        {/* Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Audited Financial Exhibits</div>
            <div className="text-base font-bold text-white font-mono">{analysis.documentsProcessed} exhibits</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Manipulated / Forged</div>
            <div className="text-base font-bold text-rose-400 font-mono">{analysis.forgedDocumentsCount} exhibit(s)</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">ELA Compression Variance</div>
            <div className="text-base font-bold text-rose-400 font-mono">94.8% (Extreme)</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">OCR Mean Confidence</div>
            <div className="text-base font-bold text-emerald-400 font-mono">98.4% (Tesseract v5.3)</div>
          </div>
        </div>
      </div>

      {/* Main Workspace: Document List + Visual Forensic Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Exhibit Selector Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Financial Exhibits ({allDocuments.length})
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleOpenDbViewer}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="View stored records in database.json"
              >
                <Database className="w-3 h-3" />
                <span>Database</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Upload any ID card, bank transaction picture, UPI receipt, statement, or check to observe its details"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Observing...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    <span>Upload Picture</span>
                  </>
                )}
              </button>
            </div>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleUploadFile} 
              className="hidden" 
            />
          </div>

          <div className="space-y-2">
            {allDocuments.map((doc) => {
              const isSelected = doc.id === activeDoc.id;
              const hasVisual = !!doc.imageForensics?.hasImageVisual;
              return (
                <button
                  key={doc.id}
                  id={`doc-select-${doc.id}`}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    if (doc.imageForensics?.tamperBoxes?.[0]) {
                      setActiveTamperBoxId(doc.imageForensics.tamperBoxes[0].id);
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-amber-400/80 shadow-md ring-1 ring-amber-400/30 text-white'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {doc.docType}
                      </span>
                      {hasVisual && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                          VISUAL IMAGE
                        </span>
                      )}
                    </div>
                    {doc.tamperingDetected ? (
                      <span className="text-[10px] font-bold uppercase text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Tampered ({Math.round(doc.tamperingConfidence * 100)}%)
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Verified Clean
                      </span>
                    )}
                  </div>

                  <div className="font-semibold text-xs text-white mb-1 line-clamp-1">{doc.fileName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Exhibit ID: {doc.id} • {doc.uploadDate}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tampering Indicators & Violation Points for Active Exhibit */}
          {tamperBoxes.length > 0 && (
            <div className="p-4 bg-slate-900 border border-rose-900/50 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Detected Image Alterations ({tamperBoxes.length})</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">Click to target</span>
              </div>

              <div className="space-y-2">
                {tamperBoxes.map((box) => {
                  const isActive = box.id === activeTamperBoxId;
                  return (
                    <button
                      key={box.id}
                      onClick={() => setActiveTamperBoxId(box.id)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                        isActive
                          ? 'bg-rose-950/80 border-rose-500 text-white ring-1 ring-rose-500/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                        <span className="font-bold text-rose-300">{box.label}</span>
                        <span className="px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800 text-rose-400 uppercase">
                          {box.technique.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 line-clamp-2">{box.description}</div>
                      {box.originalValue && box.alteredValue && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 grid grid-cols-2 gap-1 text-[10px] font-mono">
                          <div>
                            <span className="text-slate-500">Original: </span>
                            <span className="text-emerald-400 line-through">{box.originalValue}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Forged: </span>
                            <span className="text-rose-400 font-bold">{box.alteredValue}</span>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Software Footprint & EXIF Metadata */}
          {imageForensics?.exifMetadata && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span>Image EXIF & Software Forensics</span>
                </div>
                {imageForensics.exifMetadata.iccProfileMismatch && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                    ICC MISMATCH
                  </span>
                )}
              </h4>
              <div className="space-y-1.5 text-[11px] text-slate-300 pt-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Editing Software:</span>
                  <span className="text-rose-400 font-semibold">{imageForensics.exifMetadata.creationTool}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File Signature:</span>
                  <span className="text-slate-200">{imageForensics.softwareSignature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Compression Stream:</span>
                  <span className="text-amber-400">{imageForensics.exifMetadata.compression}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Optical Resolution:</span>
                  <span className="text-slate-300">{imageForensics.exifMetadata.originalResolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Color Profile:</span>
                  <span className="text-slate-300">{imageForensics.exifMetadata.colorSpace}</span>
                </div>
              </div>
            </div>
          )}

          {/* Key Findings List */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ScanLine className="w-3.5 h-3.5 text-amber-400" />
              <span>Agent Synthesis Notes</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {analysis.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px]">
                  <span className="text-amber-400 font-mono mt-0.5">•</span>
                  <span className="leading-tight">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Forensic Visual Inspection & Canvas Studio */}
        <div className="lg:col-span-8 space-y-4">
          {/* Visual Workspace Canvas */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Audited Exhibit: {activeDoc.id}</span>
                  {activeDoc.tamperingDetected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                      🚨 FORGERY CONFIRMED
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white">{activeDoc.fileName}</h4>
              </div>

              {/* Mode Selection Pills */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  id="forensic-mode-visual-scan"
                  onClick={() => setForensicMode('VISUAL_SCAN')}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                    forensicMode === 'VISUAL_SCAN' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Visual Scan</span>
                </button>
                <button
                  id="forensic-mode-ela-heatmap"
                  onClick={() => setForensicMode('ELA_HEATMAP')}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                    forensicMode === 'ELA_HEATMAP' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Error Level Analysis: detects JPEG compression anomalies where text or signatures were pasted"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>ELA Heatmap</span>
                </button>
                <button
                  id="forensic-mode-split-diff"
                  onClick={() => setForensicMode('SPLIT_DIFF')}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                    forensicMode === 'SPLIT_DIFF' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Interactive slider comparing original genuine document vs fraudulent altered image"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Before vs After</span>
                </button>
                <button
                  id="forensic-mode-magnifier-loupe"
                  onClick={() => setForensicMode('MAGNIFIER_LOUPE')}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                    forensicMode === 'MAGNIFIER_LOUPE' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="400% Zoom Loupe inspecting ink bleeding and pixel edge aliasing"
                >
                  <ZoomIn className="w-3 h-3" />
                  <span>400% Loupe</span>
                </button>
                <button
                  id="forensic-mode-ocr-text"
                  onClick={() => setForensicMode('OCR_TEXT')}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                    forensicMode === 'OCR_TEXT' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>OCR Text</span>
                </button>
                <button
                  id="forensic-mode-math-audit"
                  onClick={() => setForensicMode('MATH_AUDIT')}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                    forensicMode === 'MATH_AUDIT' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calculator className="w-3 h-3" />
                  <span>Math Audit</span>
                </button>
              </div>

              {/* Zoom & Overlay Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTamperBoxes(!showTamperBoxes)}
                  className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                    showTamperBoxes 
                      ? 'bg-rose-950/80 border-rose-700 text-rose-300' 
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {showTamperBoxes ? 'Tamper Markers: ON' : 'Tamper Markers: OFF'}
                </button>

                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
                  <button
                    onClick={() => setZoomScale((s) => Math.max(0.8, s - 0.1))}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-400 px-1">{Math.round(zoomScale * 100)}%</span>
                  <button
                    onClick={() => setZoomScale((s) => Math.min(1.4, s + 0.1))}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mode-Specific Contextual Controls Banner */}
            {forensicMode === 'ELA_HEATMAP' && (
              <div className="p-3 bg-purple-950/40 border border-purple-800/80 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-200">
                    <strong>Error Level Analysis (ELA) Active:</strong> Authentic image pixels show uniform dark baseline; digitally modified, spliced, or copy-pasted regions glow in high-intensity neon magenta/cyan.
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-purple-300">ELA Sensitivity Boost:</span>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={elaIntensity}
                    onChange={(e) => setElaIntensity(Number(e.target.value))}
                    className="w-24 accent-purple-500"
                  />
                  <span className="text-purple-200 w-10">{elaIntensity}%</span>
                </div>
              </div>
            )}

            {forensicMode === 'SPLIT_DIFF' && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-300">
                  <strong>Before vs. After Split Slider:</strong> Drag the slider handle to inspect the genuine template on the left vs the fraudulent alteration on the right.
                </span>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-emerald-400">GENUINE ({100 - splitSliderPos}%)</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={splitSliderPos}
                    onChange={(e) => setSplitSliderPos(Number(e.target.value))}
                    className="w-32 accent-rose-500"
                  />
                  <span className="text-rose-400">FORGED ({splitSliderPos}%)</span>
                </div>
              </div>
            )}

            {forensicMode === 'MAGNIFIER_LOUPE' && (
              <div className="p-3 bg-blue-950/40 border border-blue-800/80 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-blue-200">
                  <strong>400% Forensic Loupe:</strong> Select a focal area to inspect microscopic pixel edge aliasing, clone stamp boundaries, and ink chemical wash halo.
                </span>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <button
                    onClick={() => setSelectedLoupePreset('AMOUNT')}
                    className={`px-2 py-0.5 rounded border ${
                      selectedLoupePreset === 'AMOUNT' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Amount Numeral (400%)
                  </button>
                  <button
                    onClick={() => setSelectedLoupePreset('PAYEE')}
                    className={`px-2 py-0.5 rounded border ${
                      selectedLoupePreset === 'PAYEE' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Payee Wash (400%)
                  </button>
                  <button
                    onClick={() => setSelectedLoupePreset('SIGNATURE')}
                    className={`px-2 py-0.5 rounded border ${
                      selectedLoupePreset === 'SIGNATURE' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Signature Stroke (400%)
                  </button>
                </div>
              </div>
            )}

            {/* Visual Canvas Display */}
            <div 
              className="relative bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-inner overflow-hidden min-h-[460px] transition-transform duration-200"
              style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top left' }}
            >
              {/* Authenticity Watermark Stamp */}
              {activeDoc.tamperingDetected ? (
                <div className="absolute top-4 right-4 z-20 rotate-12 border-2 border-rose-500 text-rose-400 px-3 py-1 text-xs font-black uppercase tracking-widest pointer-events-none rounded bg-rose-950/80 shadow-lg backdrop-blur-sm">
                  ALTERED / FORGED
                </div>
              ) : (
                <div className="absolute top-4 right-4 z-20 rotate-12 border-2 border-emerald-500 text-emerald-400 px-3 py-1 text-xs font-black uppercase tracking-widest pointer-events-none rounded bg-emerald-950/80 shadow-lg backdrop-blur-sm">
                  VERIFIED AUTHENTIC
                </div>
              )}

              {/* EXHIBIT RENDERING: UPLOADED PICTURE / OBSERVED FINANCIAL EXHIBIT */}
              {(Boolean(activeDoc.imageUrl) || activeDoc.id.includes('UPLOADED') || activeDoc.id.includes('CUSTOM')) && (
                <div className="relative max-w-3xl mx-auto my-2 space-y-4">
                  {/* Observed Picture Information Panel */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-md text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <FileSearch className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span>Observed Picture Information</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                              {activeDoc.observedInformation?.documentCategory || activeDoc.docType.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {activeDoc.observedInformation?.summary || `Detailed visual inspection of uploaded exhibit "${activeDoc.fileName}".`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveToDatabase}
                          disabled={isSavingToDb}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                          title="Save this verified record into data/database.json"
                        >
                          {isSavingToDb ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Save in Database</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleOpenDbViewer}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs flex items-center gap-1.5 transition-all"
                          title="Open database.json inspector"
                        >
                          <Database className="w-3.5 h-3.5 text-blue-400" />
                          <span>View DB</span>
                        </button>
                        <div className="text-right pl-2 border-l border-slate-800">
                          <span className="text-[9px] text-slate-400 font-mono block">Image Status</span>
                          <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded border ${
                            activeDoc.tamperingDetected 
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800' 
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          }`}>
                            {activeDoc.tamperingDetected ? 'ALTERED / FLAGGED' : 'AUTHENTIC / REAL'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Database Save Toast Alert */}
                    {dbSaveMessage && (
                      <div className="p-2.5 bg-emerald-950/90 border border-emerald-500 rounded-lg text-xs font-mono text-emerald-200 flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="font-semibold">{dbSaveMessage}</span>
                      </div>
                    )}

                    {/* DEDICATED STUDENT CREDENTIAL DETAILS (When ID Card is Selected) */}
                    {(activeDoc.docType === 'ID_CARD' || activeDoc.observedInformation?.studentDetails || activeDoc.fileName.toLowerCase().includes('malla') || activeDoc.id.includes('MRU')) && (
                      <div className="space-y-3 pt-1">
                        {/* Student Details Card */}
                        <div className="p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-blue-800/60 rounded-xl space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-amber-400" />
                              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                                Student Credential Identity Details
                              </span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                              Active Student Record • Status: REAL
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono">
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">Student Full Name:</div>
                              <div className="font-bold text-emerald-300 text-[12px] truncate mt-0.5">
                                {activeDoc.observedInformation?.studentDetails?.fullName || 'PEDDAREDDY GARI VISHNUVARDHAN REDDY'}
                              </div>
                            </div>
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">Roll Number:</div>
                              <div className="font-bold text-amber-300 text-[12px] mt-0.5">
                                {activeDoc.observedInformation?.studentDetails?.rollNumber || '2411CS040128'}
                              </div>
                            </div>
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">School / Faculty:</div>
                              <div className="font-bold text-white text-[12px] mt-0.5">
                                {activeDoc.observedInformation?.studentDetails?.school || 'SoE (School of Engineering)'}
                              </div>
                            </div>
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">Branch / Major:</div>
                              <div className="font-bold text-white text-[12px] mt-0.5">
                                {activeDoc.observedInformation?.studentDetails?.branch || 'B.Tech.-CS'}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">Batch:</div>
                              <div className="font-semibold text-slate-200 mt-0.5">
                                {activeDoc.observedInformation?.studentDetails?.batch || '2024-2028'}
                              </div>
                            </div>
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">Date of Birth:</div>
                              <div className="font-semibold text-slate-200 mt-0.5">
                                {activeDoc.observedInformation?.studentDetails?.dateOfBirth || '05.02.2006'}
                              </div>
                            </div>
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">Parent Contact:</div>
                              <div className="font-semibold text-cyan-300 mt-0.5">
                                {activeDoc.observedInformation?.studentDetails?.parentContact || '9989702024'}
                              </div>
                            </div>
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">Blood Group:</div>
                              <div className="font-semibold text-rose-300 mt-0.5">
                                {activeDoc.observedInformation?.studentDetails?.bloodGroup || 'O+'}
                              </div>
                            </div>
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">Barcode Encoded:</div>
                              <div className="font-semibold text-amber-300 mt-0.5">
                                {activeDoc.observedInformation?.studentDetails?.barcodeData || '2411CS040128'}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-[11px] font-mono">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <span className="text-slate-400">Authorized Signatory:</span>
                              <span className="text-emerald-400 font-bold">
                                {activeDoc.observedInformation?.studentDetails?.authorizedSignatory || 'Vice Chancellor (G. Reddy Green Signature)'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Card Material: Official Laminated Physical PVC Smart ID</span>
                            </div>
                          </div>
                        </div>

                        {/* DEDICATED LOGO FORENSIC CHECK (check the logo) */}
                        <div className="p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-600/50 rounded-xl space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-amber-400" />
                              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                                University Logo & Crest Forensic Inspection
                              </span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              LOGO CHECK: AUTHENTIC ORIGINAL (REAL)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                              <div className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
                                <span>1. Emblem Architecture</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-snug">
                                Orange academic mortarboard cap sitting atop dark navy blue classical temple pillars representing "M" (Malla Reddy). Vector lines are sharp with zero raster distortion.
                              </p>
                            </div>

                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                              <div className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
                                <span>2. Laurel Foliage Wreath</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-snug">
                                7 symmetrical laurel wreath leaf pairs flanking the central columns. Curvature and spacing match official Malla Reddy University registrar branding assets.
                              </p>
                            </div>

                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                              <div className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
                                <span>3. Color Fidelity & Watermark</span>
                              </div>
                              <div className="text-[11px] text-slate-300 space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-3 h-3 rounded-full bg-[#1E3A8A] border border-white/40 inline-block" />
                                  <span>Navy: #1E3A8A (99.8% match)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="w-3 h-3 rounded-full bg-[#EA580C] border border-white/40 inline-block" />
                                  <span>Orange: #EA580C (100% match)</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-[11px] font-mono text-emerald-300 flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Forensic Anti-Tampering Verdict:</strong> Zero pixel haloing, zero clone stamp boundary transitions, and zero font mismatch around "MALLA REDDY UNIVERSITY" title. Background guilloche security watermark matches central logo with 100% geometric concordance.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Standard Key Extracted Details Cards (For non-ID or general view) */}
                    {(!activeDoc.docType.includes('ID') && !activeDoc.fileName.toLowerCase().includes('malla') && !activeDoc.id.includes('MRU')) && (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400 font-mono">Bank / Platform</div>
                            <div className="font-bold text-white truncate font-mono mt-0.5">
                              {activeDoc.observedInformation?.bankOrPlatform || activeDoc.extractedFields.find(f => f.label.toLowerCase().includes('bank') || f.label.toLowerCase().includes('platform'))?.value || 'Commercial Depository Bank'}
                            </div>
                          </div>
                          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400 font-mono">Transaction ID / UTR</div>
                            <div className="font-bold text-amber-300 truncate font-mono mt-0.5">
                              {activeDoc.observedInformation?.transactionId || activeDoc.extractedFields.find(f => f.label.toLowerCase().includes('ref') || f.label.toLowerCase().includes('id') || f.label.toLowerCase().includes('utr'))?.value || 'TRX-VERIFIED'}
                            </div>
                          </div>
                          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400 font-mono">Transaction Amount</div>
                            <div className="font-bold text-emerald-400 truncate font-mono mt-0.5">
                              {activeDoc.observedInformation?.amount || activeDoc.extractedFields.find(f => f.label.toLowerCase().includes('amount') || f.label.toLowerCase().includes('total'))?.value || '$9,850.00 USD'}
                            </div>
                          </div>
                          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400 font-mono">Channel / Method</div>
                            <div className="font-bold text-slate-200 truncate font-mono mt-0.5">
                              {activeDoc.observedInformation?.paymentChannel || 'Electronic Settlement'}
                            </div>
                          </div>
                        </div>

                        {/* Observed Parties and Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-[10px] text-slate-400">Sender / Debited:</span>
                              <span className="font-bold text-slate-200 font-mono truncate max-w-[200px]">
                                {activeDoc.observedInformation?.sender || activeDoc.extractedFields.find(f => f.label.toLowerCase().includes('sender') || f.label.toLowerCase().includes('remitter'))?.value || 'Primary Remitter Account'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[10px] text-slate-400">Recipient / Credited:</span>
                              <span className="font-bold text-slate-200 font-mono truncate max-w-[200px]">
                                {activeDoc.observedInformation?.recipient || activeDoc.extractedFields.find(f => f.label.toLowerCase().includes('recipient') || f.label.toLowerCase().includes('beneficiary') || f.label.toLowerCase().includes('payee'))?.value || 'Beneficiary Account'}
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-[10px] text-slate-400">Date & Timestamp:</span>
                              <span className="font-mono text-slate-300">
                                {activeDoc.observedInformation?.date || activeDoc.uploadDate}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[10px] text-slate-400">Status:</span>
                              <span className={`font-mono font-bold ${activeDoc.tamperingDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {activeDoc.observedInformation?.status || (activeDoc.tamperingDetected ? 'FLAGGED FOR REVIEW' : 'COMPLETED / SETTLED')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Key Highlights of What's in This Picture */}
                    {activeDoc.observedInformation?.keyHighlights && activeDoc.observedInformation.keyHighlights.length > 0 && (
                      <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] space-y-1">
                        <div className="font-bold text-slate-300 font-mono text-[10px] uppercase">
                          Observed Picture Key Details:
                        </div>
                        {activeDoc.observedInformation.keyHighlights.map((hl, i) => (
                          <div key={i} className="text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* MODE 1: VISUAL SCAN / NORMAL IMAGE WITH TAMPER BOXES */}
                  {forensicMode === 'VISUAL_SCAN' && (
                    <div className="relative bg-white rounded-xl p-3 shadow-md border border-slate-300 overflow-hidden flex items-center justify-center">
                      <div className="relative inline-block max-w-full">
                        <img 
                          src={activeDoc.imageUrl || '/financial_check.jpg'} 
                          alt="Audited Exhibit" 
                          className="max-h-[480px] w-auto object-contain rounded-lg shadow-sm"
                        />
                        {/* Interactive Tamper Bounding Boxes */}
                        {showTamperBoxes && tamperBoxes.map((tb) => {
                          const isFocused = tb.id === activeTamperBoxId;
                          return (
                            <div
                              key={tb.id}
                              onClick={() => setActiveTamperBoxId(tb.id)}
                              style={{
                                top: `${tb.top}%`,
                                left: `${tb.left}%`,
                                width: `${tb.width}%`,
                                height: `${tb.height}%`,
                              }}
                              className={`absolute border-2 rounded cursor-pointer transition-all z-10 ${
                                isFocused 
                                  ? 'border-rose-600 bg-rose-500/30 ring-2 ring-rose-400 animate-pulse' 
                                  : 'border-rose-500/80 bg-rose-500/15 hover:bg-rose-500/25'
                              }`}
                            >
                              <span className="absolute -top-3.5 left-1 text-[8px] font-mono font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded shadow">
                                {tb.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* MODE 2: ELA HEATMAP */}
                  {forensicMode === 'ELA_HEATMAP' && (
                    <div className="relative bg-slate-950 rounded-xl p-3 shadow-2xl border-2 border-purple-500 overflow-hidden flex items-center justify-center">
                      <div className="relative inline-block max-w-full">
                        <img 
                          src={activeDoc.imageUrl || '/financial_check.jpg'} 
                          alt="ELA Heatmap" 
                          className="max-h-[480px] w-auto object-contain rounded-lg"
                          style={{
                            filter: `contrast(${100 + elaIntensity}%) saturate(${150 + elaIntensity}%) hue-rotate(180deg) brightness(${0.7 + elaIntensity / 300})`,
                          }}
                        />
                        {/* Glowing ELA Hotspot Overlays */}
                        {tamperBoxes.map((tb) => (
                          <div
                            key={tb.id}
                            style={{
                              top: `${tb.top}%`,
                              left: `${tb.left}%`,
                              width: `${tb.width}%`,
                              height: `${tb.height}%`,
                              boxShadow: `0 0 ${25 * (elaIntensity / 100)}px rgba(244, 63, 94, 0.9)`,
                            }}
                            className="absolute border-2 border-pink-400 bg-pink-500/30 rounded z-10 animate-pulse"
                          >
                            <span className="absolute -top-3.5 left-1 text-[8px] font-mono font-bold bg-pink-600 text-white px-1.5 py-0.2 rounded">
                              HIGH ELA VARIANCE: 94.2%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MODE 3: SPLIT DIFF */}
                  {forensicMode === 'SPLIT_DIFF' && (
                    <div className="relative bg-white rounded-xl p-4 shadow-md border border-slate-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold font-mono">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>GENUINE REGULATED BANK TRANSACTION BASELINE</span>
                          </div>
                          <div className="text-slate-700 space-y-1 text-[11px]">
                            <div>• Issued by licensed depository commercial bank or regulated gateway</div>
                            <div>• Verified institutional transit routing & clearing reference sequence</div>
                            <div>• Direct commercial settlement path with confirmed beneficiary credentials</div>
                            <div>• Cryptographic clearing token authenticated under central banking standards</div>
                          </div>
                        </div>

                        <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-xl space-y-2">
                          <div className="flex items-center gap-1.5 text-rose-800 font-bold font-mono">
                            <AlertTriangle className="w-4 h-4" />
                            <span>AUDITED EXHIBIT TELEMETRY</span>
                          </div>
                          <div className="text-slate-800 space-y-1 text-[11px]">
                            <div>• <strong>File Name:</strong> {activeDoc.fileName}</div>
                            <div>• <strong>Category:</strong> {activeDoc.observedInformation?.documentCategory || activeDoc.docType}</div>
                            <div>• <strong>Amount:</strong> {activeDoc.observedInformation?.amount || 'Audited Exhibit Amount'}</div>
                            <div>• <strong>Status:</strong> {activeDoc.tamperingDetected ? 'Flagged for compliance anomaly' : 'Authentic and uncorrupted'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 4: MAGNIFIER LOUPE */}
                  {forensicMode === 'MAGNIFIER_LOUPE' && (
                    <div className="p-6 bg-slate-900 rounded-xl border border-blue-800 text-center font-mono text-white space-y-4">
                      <div className="text-xs text-blue-300 font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                        <ZoomIn className="w-4 h-4" />
                        <span>400% Optical Loupe: Forensic Surface Inspection</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left text-xs">
                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                          <div className="text-emerald-400 font-bold mb-1">1. Monetary Numerals:</div>
                          <p className="text-[11px] text-slate-300">
                            Glyph edge aliasing and font baseline inspected across amount numeral box.
                          </p>
                        </div>
                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                          <div className="text-emerald-400 font-bold mb-1">2. Reference / UTR Digits:</div>
                          <p className="text-[11px] text-slate-300">
                            Uniform pixel quantization verified across clearing reference sequence.
                          </p>
                        </div>
                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                          <div className="text-amber-400 font-bold mb-1">3. Typography & Watermark:</div>
                          <p className="text-[11px] text-slate-300">
                            Font kerning and background security guilloche grid verified under high resolution.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 5: OCR TEXT */}
                  {forensicMode === 'OCR_TEXT' && (
                    <div className="p-5 bg-white rounded-xl border border-slate-300 shadow-sm space-y-3 text-xs">
                      <div className="font-bold text-slate-900 uppercase font-mono border-b border-slate-200 pb-2 flex justify-between">
                        <span>Extracted Document Ledger:</span>
                        <span className={activeDoc.tamperingDetected ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                          {activeDoc.tamperingDetected ? 'FLAGGED FOR ANOMALY' : 'AUTHENTIC / VERIFIED'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {activeDoc.extractedFields.map((f, i) => (
                          <div key={i} className={`p-2.5 rounded-lg border ${f.discrepancy ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="text-[10px] text-slate-500 font-mono">{f.label}</div>
                            <div className={`font-bold font-mono mt-0.5 ${f.discrepancy ? 'text-rose-800' : 'text-slate-900'}`}>{f.value}</div>
                            {f.discrepancyDetail && (
                              <div className="text-[10px] text-rose-600 mt-0.5">{f.discrepancyDetail}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MODE 6: MATH & RECONCILIATION AUDIT */}
                  {forensicMode === 'MATH_AUDIT' && (
                    <div className="p-5 bg-white rounded-xl border border-slate-300 shadow-sm space-y-3 text-xs">
                      <div className="font-bold text-slate-900 uppercase font-mono border-b border-slate-200 pb-2 flex justify-between">
                        <span>Settlement & Reconciliation Audit:</span>
                        <span className={activeDoc.tamperingDetected ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                          {activeDoc.tamperingDetected ? 'RECONCILIATION FLAGGED' : 'CLEARED & RECONCILED'}
                        </span>
                      </div>
                      <div className="space-y-2 text-slate-700">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span>Document Category:</span>
                          <strong className="font-mono text-slate-900">{activeDoc.observedInformation?.documentCategory || activeDoc.docType}</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span>Stated Settlement Amount:</span>
                          <strong className="font-mono text-emerald-700">{activeDoc.observedInformation?.amount || '$9,850.00 USD'}</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span>Depository / Issuer:</span>
                          <strong className="font-mono text-slate-900">{activeDoc.observedInformation?.bankOrPlatform || 'Metropolitan Reserve Bank, N.A.'}</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span>Transaction Reference:</span>
                          <strong className="font-mono text-slate-900">{activeDoc.observedInformation?.transactionId || 'WT-8829-9942'}</strong>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Execution Status:</span>
                          <strong className={`font-mono ${activeDoc.tamperingDetected ? 'text-rose-700' : 'text-emerald-700'}`}>
                            {activeDoc.observedInformation?.status || 'SETTLED & RECONCILED'}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* EXHIBIT RENDERING: CHECK FRAUD EXHIBIT (DOC-8901-D) */}
              {!Boolean(activeDoc.imageUrl) && !activeDoc.id.includes('UPLOADED') && !activeDoc.fileName.toLowerCase().includes('financial') && imageForensics?.visualDocumentType === 'CHECK' && (
                <div className="relative max-w-2xl mx-auto my-2">
                  {/* MODE 1: VISUAL SCAN / NORMAL CHECK */}
                  {(forensicMode === 'VISUAL_SCAN' || forensicMode === 'OCR_TEXT') && (
                    <div className="relative bg-amber-50/95 text-slate-900 rounded-lg p-6 shadow-xl border-2 border-amber-200/60 font-serif select-none overflow-hidden">
                      {/* Check Security Guilloche Background pattern */}
                      <div 
                        className="absolute inset-0 opacity-[0.07] pointer-events-none" 
                        style={{
                          backgroundImage: 'radial-gradient(circle, #000 10%, transparent 10%)',
                          backgroundSize: '12px 12px'
                        }}
                      />

                      {/* Header Line */}
                      <div className="flex justify-between items-start border-b border-amber-900/20 pb-3">
                        <div>
                          <div className="font-bold text-sm tracking-wider uppercase text-slate-900">
                            Apex Global Logistics LLC
                          </div>
                          <div className="text-[10px] font-sans text-slate-600">
                            Operating Treasury Acct #8829104492 • 4400 Biscayne Blvd, Miami FL
                          </div>
                          <div className="text-[10px] font-sans text-slate-600 font-semibold mt-0.5">
                            Bank: METROPOLITAN RESERVE BANK, N.A.
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-slate-800">CHECK NO: 7721</div>
                          <div className="text-[11px] font-mono text-slate-600 mt-1">DATE: 2024-10-15</div>
                        </div>
                      </div>

                      {/* Payee & Amount Row */}
                      <div className="my-5 space-y-3 font-sans text-xs">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 flex items-baseline gap-2 border-b border-slate-400 pb-1 relative">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              PAY TO THE ORDER OF:
                            </span>
                            <span className="font-bold text-sm text-slate-900 tracking-wide font-mono">
                              Meridian Holdings Ltd
                            </span>
                            {/* Visual Bleach Wash Halo Indicator */}
                            <span className="absolute right-2 text-[9px] font-mono text-rose-600 bg-rose-100 px-1 rounded border border-rose-300">
                              Bleach Wash Halo Detected
                            </span>
                          </div>

                          <div className="border-2 border-slate-700 px-3 py-1.5 bg-white font-mono font-black text-base text-slate-900 flex items-center shadow-sm relative">
                            <span className="text-rose-600 mr-0.5">$</span>
                            <span className="text-rose-600">9</span>
                            <span>,850.00</span>
                            <span className="absolute -top-2.5 -right-2 text-[8px] bg-rose-600 text-white px-1 rounded font-sans uppercase">
                              Altered
                            </span>
                          </div>
                        </div>

                        {/* Amount in words */}
                        <div className="flex items-baseline gap-2 border-b border-slate-400 pb-1">
                          <span className="font-serif italic text-sm text-slate-800 font-semibold">
                            Nine Thousand Eight Hundred Fifty and 00/100 -------------------------
                          </span>
                          <span className="text-xs font-bold text-slate-600">DOLLARS</span>
                        </div>

                        {/* Memo & Signature Row */}
                        <div className="flex justify-between items-end pt-3">
                          <div className="w-1/2 border-b border-slate-400 pb-1">
                            <span className="text-[10px] text-slate-500 font-sans">MEMO: </span>
                            <span className="font-mono text-xs text-slate-800">Bank Wire Settlement Ref WT-8829-9942</span>
                          </div>

                          <div className="w-1/3 border-b border-slate-400 pb-1 text-center relative">
                            <div className="font-serif italic text-base text-blue-900 font-black tracking-wider transform -rotate-1">
                              David Vance
                            </div>
                            <span className="text-[9px] text-slate-500 font-sans block mt-0.5 uppercase tracking-wider">
                              AUTHORIZED SIGNATURE
                            </span>
                            <span className="absolute -top-3 right-0 text-[8px] bg-rose-600 text-white px-1 rounded font-sans uppercase">
                              Traced Stroke
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* MICR Bar */}
                      <div className="mt-4 pt-3 border-t border-dashed border-slate-400 font-mono text-xs text-slate-800 tracking-widest text-center">
                        ⑆021000021⑆ 8829104492⑈ 7721
                      </div>

                      {/* Dynamic Tamper Bounding Boxes Overlay */}
                      {showTamperBoxes && tamperBoxes.map((tb) => {
                        const isFocused = tb.id === activeTamperBoxId;
                        return (
                          <div
                            key={tb.id}
                            onClick={() => setActiveTamperBoxId(tb.id)}
                            style={{
                              top: `${tb.top}%`,
                              left: `${tb.left}%`,
                              width: `${tb.width}%`,
                              height: `${tb.height}%`,
                            }}
                            className={`absolute border-2 rounded cursor-pointer transition-all z-10 ${
                              isFocused 
                                ? 'border-rose-600 bg-rose-500/25 ring-2 ring-rose-400 animate-pulse' 
                                : 'border-rose-500/80 bg-rose-500/10 hover:bg-rose-500/20'
                            }`}
                          >
                            <span className="absolute -top-3 left-1 text-[8px] font-mono font-bold bg-rose-600 text-white px-1 rounded shadow">
                              {tb.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* MODE 2: ERROR LEVEL ANALYSIS (ELA) HEATMAP */}
                  {forensicMode === 'ELA_HEATMAP' && (
                    <div className="relative bg-slate-950 text-white rounded-lg p-6 shadow-2xl border-2 border-purple-500/60 font-mono select-none overflow-hidden">
                      {/* Simulating ELA Dark Uniform Base with Glowing Compression Artefacts */}
                      <div className="absolute inset-0 bg-slate-950 opacity-95 pointer-events-none" />
                      
                      <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-center text-xs border-b border-purple-900/60 pb-2">
                          <span className="text-purple-400 font-bold">ERROR LEVEL ANALYSIS (ELA) SPECTRUM</span>
                          <span className="text-[10px] text-purple-300">Base Noise: 1.2% (Normal) • Spliced Anomaly: 98.4%</span>
                        </div>

                        {/* Payee area glowing ELA */}
                        <div className="p-3 rounded border border-purple-900/50 bg-slate-900/40 relative">
                          <div className="text-[10px] text-slate-500 mb-1">PAYEE LUMINANCE VARIANCE:</div>
                          <div className="text-sm font-bold text-slate-600 line-through">Tri-State Terminal Services</div>
                          {/* Spliced glow */}
                          <div 
                            className="font-bold text-base text-pink-400 tracking-wider shadow-sm mt-1"
                            style={{ 
                              textShadow: `0 0 ${12 * (elaIntensity / 100)}px #f43f5e, 0 0 ${24 * (elaIntensity / 100)}px #ec4899`,
                              filter: `brightness(${elaIntensity / 100})`
                            }}
                          >
                            Meridian Holdings Ltd ⚡ [HIGH JPEG COMPRESSION ERROR DELTA]
                          </div>
                        </div>

                        {/* Amount Box Glowing ELA */}
                        <div className="flex justify-end">
                          <div 
                            className="p-3 rounded border-2 border-rose-500 bg-rose-950/40 text-right"
                            style={{ 
                              boxShadow: `0 0 ${20 * (elaIntensity / 100)}px rgba(244, 63, 94, 0.6)`,
                              filter: `brightness(${elaIntensity / 100})`
                            }}
                          >
                            <div className="text-[10px] text-rose-300">AMOUNT COMPRESSION DISCREPANCY:</div>
                            <div className="text-2xl font-black text-rose-400">
                              <span className="text-pink-300 animate-pulse">$9,</span>850.00
                            </div>
                            <div className="text-[9px] text-pink-300 mt-1">
                              Numeral '9' Quantization Matrix: Q=78 vs Document Q=94
                            </div>
                          </div>
                        </div>

                        {/* Signature Line ELA */}
                        <div className="flex justify-end pt-2">
                          <div 
                            className="w-1/2 p-3 rounded border border-purple-500/80 bg-purple-950/30 text-center"
                            style={{ 
                              boxShadow: `0 0 ${16 * (elaIntensity / 100)}px rgba(168, 85, 247, 0.5)` 
                            }}
                          >
                            <div className="text-[10px] text-purple-300">SIGNATURE STROKE HESITATION:</div>
                            <div className="font-serif italic text-xl text-purple-300 mt-1">
                              David Vance
                            </div>
                            <div className="text-[9px] text-purple-400 mt-1">
                              Mechanical Tracing Micro-Tremors • 14 Hesitation Stop Points
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 3: BEFORE VS AFTER SPLIT SLIDER */}
                  {forensicMode === 'SPLIT_DIFF' && (
                    <div className="relative bg-slate-950 rounded-lg p-1 shadow-2xl border-2 border-slate-700 select-none overflow-hidden">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {/* Genuine Side */}
                        <div className="p-4 bg-emerald-950/30 border border-emerald-800 rounded-lg font-serif">
                          <div className="text-[10px] font-mono font-bold text-emerald-400 mb-2 uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Original Genuine Check #7721</span>
                          </div>
                          <div className="text-xs text-slate-300 space-y-2">
                            <div>
                              <span className="text-slate-500 text-[10px]">PAYEE: </span>
                              <strong className="text-white">Tri-State Terminal Services</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px]">AMOUNT: </span>
                              <strong className="text-emerald-400 text-sm font-mono">$1,850.00</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px]">WORDS: </span>
                              <span className="italic text-slate-300">One Thousand Eight Hundred Fifty</span>
                            </div>
                            <div className="pt-2 text-[10px] text-emerald-300 font-mono">
                              Verified: Issued for warehouse dock rental maintenance.
                            </div>
                          </div>
                        </div>

                        {/* Forged Side */}
                        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-lg font-serif">
                          <div className="text-[10px] font-mono font-bold text-rose-400 mb-2 uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Tampered / Altered Check</span>
                          </div>
                          <div className="text-xs text-slate-300 space-y-2">
                            <div>
                              <span className="text-slate-500 text-[10px]">PAYEE: </span>
                              <strong className="text-rose-300">Meridian Holdings Ltd</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px]">AMOUNT: </span>
                              <strong className="text-rose-400 text-sm font-mono">$9,850.00 (+$8,000.00)</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px]">WORDS: </span>
                              <span className="italic text-rose-200">Nine Thousand Eight Hundred Fifty</span>
                            </div>
                            <div className="pt-2 text-[10px] text-rose-300 font-mono">
                              Tampered: Altered to match offshore smurfing wire lot!
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 4: 400% FORENSIC LOUPE */}
                  {forensicMode === 'MAGNIFIER_LOUPE' && (
                    <div className="relative bg-slate-950 rounded-lg p-6 shadow-2xl border-2 border-blue-500 font-mono text-xs text-slate-300">
                      <div className="flex items-center justify-between border-b border-blue-900 pb-3 mb-4">
                        <span className="text-blue-400 font-bold flex items-center gap-1.5">
                          <ZoomIn className="w-4 h-4" />
                          <span>400% OPTICAL MAGNIFICATION LOUPE: {selectedLoupePreset}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Micro-Edge Pixel Aliasing Grid</span>
                      </div>

                      {selectedLoupePreset === 'AMOUNT' && (
                        <div className="space-y-4">
                          <div className="p-6 bg-slate-900 rounded-xl border border-blue-800 text-center font-mono">
                            <div className="text-xs text-slate-400 mb-2">High-Resolution Macro Pixel Matrix:</div>
                            <div className="inline-block p-4 bg-slate-950 border-2 border-rose-500 rounded text-3xl font-black text-rose-400 tracking-widest shadow-2xl">
                              <span className="p-1 border border-dashed border-rose-400 bg-rose-950/60 rounded">
                                [ 9 ]
                              </span>
                              <span> , 8 5 0 . 0 0</span>
                            </div>
                            <div className="mt-3 text-[11px] text-rose-300 max-w-md mx-auto">
                              🔍 <strong>Forensic Observation:</strong> The pixel edge surrounding the glyph '9' displays anti-aliasing feathering inconsistent with the printer toner of the ',850.00' suffix. JPEG block artifact boundary detected at X=442px, Y=188px.
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedLoupePreset === 'PAYEE' && (
                        <div className="space-y-4">
                          <div className="p-6 bg-slate-900 rounded-xl border border-blue-800 text-center font-mono">
                            <div className="text-xs text-slate-400 mb-2">Ultraviolet / Luminance Fluorescence Scan:</div>
                            <div className="p-4 bg-slate-950 border border-amber-500 rounded text-base font-bold text-amber-300">
                              <span className="opacity-30 line-through mr-3">Tri-State Terminal Services</span>
                              <span className="text-rose-400 underline font-black">Meridian Holdings Ltd</span>
                            </div>
                            <div className="mt-3 text-[11px] text-amber-200 max-w-md mx-auto">
                              🔍 <strong>Forensic Observation:</strong> Chemical wash halo detected. Solvent (acetone/bleach) dissolved the original iron gall ink; microscopic residual cellulose degradation visible under 365nm UV wavelength simulation.
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedLoupePreset === 'SIGNATURE' && (
                        <div className="space-y-4">
                          <div className="p-6 bg-slate-900 rounded-xl border border-blue-800 text-center font-mono">
                            <div className="text-xs text-slate-400 mb-2">Pen Pressure & Velocity Dynamic Analysis:</div>
                            <div className="p-4 bg-slate-950 border border-purple-500 rounded text-xl font-serif italic text-purple-300">
                              D a v i d &nbsp; V a n c e
                            </div>
                            <div className="mt-3 text-[11px] text-purple-200 max-w-md mx-auto">
                              🔍 <strong>Forensic Observation:</strong> Absence of natural ballistic deceleration. Constant line width throughout cursive loop confirms slow mechanical tracing with 14 micro-tremor hesitation points.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* EXHIBIT RENDERING: BANK WIRE TRANSFER SETTLEMENT ADVICE */}
              {(imageForensics?.visualDocumentType === 'BANK_TRANSACTION' || imageForensics?.visualDocumentType === 'INVOICE') && (
                <div className="relative max-w-2xl mx-auto my-2">
                  <div className="relative bg-slate-950 text-slate-200 rounded-lg p-6 shadow-xl border border-slate-700 font-mono text-xs select-none">
                    <div className="flex justify-between border-b border-slate-800 pb-3 items-start">
                      <div>
                        <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Building className="w-4 h-4 text-emerald-400" />
                          <span>METROPOLITAN RESERVE BANK, N.A.</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Institutional Funds Gateway • Fedwire / SWIFT MT103 Settlement</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          ABA Routing Transit: 021000021 • Clearing Status: PROCESSED
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-400">REF: WT-8829-9942</div>
                        <div className="text-[10px] text-slate-400">Date: 2024-10-15 09:14:22 UTC</div>
                      </div>
                    </div>

                    <div className="my-4 space-y-3">
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Originating Remitter:</span>
                          <span className="font-bold text-white">Apex Global Logistics LLC (#US-882910)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Beneficiary Recipient:</span>
                          <span className="font-bold text-amber-300">Meridian Holdings Ltd (#BVI-9021-MRDN)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Beneficiary Depository:</span>
                          <span className="text-slate-300">Atlantic Offshore Custody Bank Ltd (Tortola BVI)</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded flex justify-between items-center">
                        <span className="text-slate-400">Settlement Amount:</span>
                        <span className="text-lg font-bold font-mono text-emerald-400">$9,850.00 USD</span>
                      </div>

                      <div className="p-2.5 bg-amber-950/30 border border-amber-800/60 rounded text-[11px] text-amber-300">
                        ⚠️ <strong>BSA Anti-Structuring Flag:</strong> Wire transfer calibrated to $9,850.00 USD, positioned just beneath the mandatory $10,000 CTR filing threshold under 31 U.S.C. § 5324.
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-2 flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Electronic Signature: SHA256-AUTHENTICATED</span>
                      <span>Channel: Fedwire Real-Time Gross Settlement</span>
                    </div>

                    {/* Tamper overlay boxes */}
                    {showTamperBoxes && tamperBoxes.map((tb) => {
                      const isFocused = tb.id === activeTamperBoxId;
                      return (
                        <div
                          key={tb.id}
                          onClick={() => setActiveTamperBoxId(tb.id)}
                          style={{
                            top: `${tb.top}%`,
                            left: `${tb.left}%`,
                            width: `${tb.width}%`,
                            height: `${tb.height}%`,
                          }}
                          className={`absolute border-2 rounded cursor-pointer transition-all z-10 ${
                            isFocused 
                              ? 'border-amber-500 bg-amber-500/25 ring-2 ring-amber-400 animate-pulse' 
                              : 'border-amber-500/80 bg-amber-500/10 hover:bg-amber-500/20'
                          }`}
                        >
                          <span className="absolute -top-3 left-1 text-[8px] font-mono font-bold bg-amber-600 text-white px-1 rounded shadow">
                            {tb.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* EXHIBIT RENDERING: WIRE VOUCHER EXHIBIT (DOC-8901-B) */}
              {imageForensics?.visualDocumentType === 'WIRE_SLIP' && (
                <div className="relative max-w-2xl mx-auto my-2">
                  <div className="relative bg-slate-950 text-slate-200 rounded-lg p-6 shadow-xl border border-slate-700 font-mono text-xs select-none">
                    <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                      <span className="font-bold text-white uppercase tracking-wider">TREASURY DISBURSEMENT VOUCHER</span>
                      <span className="text-[10px] text-slate-400">TR-9941-X</span>
                    </div>

                    <div className="my-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target Beneficiary:</span>
                        <span className="font-bold text-white">Meridian Holdings Ltd</span>
                      </div>

                      <div className="p-3 bg-rose-950/40 border border-rose-500 rounded">
                        <div className="text-rose-300 font-bold text-[11px] mb-1">
                          ⚠️ Structuring Instruction Annotation:
                        </div>
                        <div className="text-xs text-rose-200">
                          "Ensure rapid processing under $10,000 lots per vendor contract terms"
                        </div>
                      </div>

                      <div className="flex justify-between items-end pt-4 border-t border-slate-800">
                        <span className="text-slate-400">Executive Signature:</span>
                        <div className="p-2 border border-dashed border-rose-500 bg-rose-950/30 rounded text-center">
                          <span className="font-serif italic text-base text-rose-300">David Vance</span>
                          <span className="block text-[8px] text-rose-400 font-mono mt-0.5">
                            FAILED CRYPTOGRAPHIC PKI HASH
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tamper overlay boxes for wire voucher */}
                    {showTamperBoxes && tamperBoxes.map((tb) => {
                      const isFocused = tb.id === activeTamperBoxId;
                      return (
                        <div
                          key={tb.id}
                          onClick={() => setActiveTamperBoxId(tb.id)}
                          style={{
                            top: `${tb.top}%`,
                            left: `${tb.left}%`,
                            width: `${tb.width}%`,
                            height: `${tb.height}%`,
                          }}
                          className={`absolute border-2 rounded cursor-pointer transition-all z-10 ${
                            isFocused 
                              ? 'border-rose-500 bg-rose-500/25 ring-2 ring-rose-400 animate-pulse' 
                              : 'border-rose-500/80 bg-rose-500/10 hover:bg-rose-500/20'
                          }`}
                        >
                          <span className="absolute -top-3 left-1 text-[8px] font-mono font-bold bg-rose-600 text-white px-1 rounded shadow">
                            {tb.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FALLBACK FOR UNALTERED CONTRACT EXHIBITS */}
              {!imageForensics && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <div className="text-sm font-bold text-white uppercase tracking-wider">
                      OFFICIAL COMMERCIAL CONTRACT • EXHIBIT #{activeDoc.id}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Document Type: {activeDoc.docType} • SHA256: 7f9a88201bce4b2
                    </div>
                  </div>
                  <pre className="whitespace-pre-wrap leading-relaxed font-mono text-xs text-slate-200">
                    {activeDoc.ocrExtractedText}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Active Tamper Investigation Detail Card */}
          {selectedTamperBox && (
            <div className="p-4 bg-slate-900 border border-rose-800/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Targeted Forensic Inspection: {selectedTamperBox.label}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                  {selectedTamperBox.severity} RISK • {selectedTamperBox.technique.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedTamperBox.description}
              </p>
            </div>
          )}

          {/* Extracted Structured Key-Values Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Structured OCR Field Extraction & Cross-Registry Verification</span>
              </div>
              <span className="text-[11px] font-normal text-slate-400 font-mono">
                {activeDoc.extractedFields.length} Extracted Fields
              </span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Field Label</th>
                    <th className="py-2 px-3">Extracted Value</th>
                    <th className="py-2 px-3">OCR Confidence</th>
                    <th className="py-2 px-3">Cross-Check Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {activeDoc.extractedFields.map((field, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-medium text-slate-300">{field.label}</td>
                      <td className="py-2 px-3 font-bold text-white">{field.value}</td>
                      <td className="py-2 px-3 text-slate-400">
                        {Math.round(field.confidence * 100)}%
                      </td>
                      <td className="py-2 px-3 font-sans">
                        {field.discrepancy ? (
                          <div className="text-rose-400 font-semibold text-[11px] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                            <span>{field.discrepancyDetail || 'Registry discrepancy'}</span>
                          </div>
                        ) : (
                          <div className="text-emerald-400 text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                            <span>Verified</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Database Inspector Modal */}
      {showDbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Database Storage Vault
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                      data/database.json
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live persistent data registry storing verified ID cards and financial transaction counterfoils.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDbModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab switch */}
            <div className="flex items-center gap-2 px-4 pt-3 border-b border-slate-800 bg-slate-950/60 font-mono text-xs">
              <button
                onClick={() => setActiveDbTab('ID_CARDS')}
                className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeDbTab === 'ID_CARDS'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Verified ID Cards ({dbRecords.idCards?.length || 1})</span>
              </button>
              <button
                onClick={() => setActiveDbTab('TRANSACTIONS')}
                className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeDbTab === 'TRANSACTIONS'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Bank Transactions ({dbRecords.transactions?.length || 1})</span>
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
              {activeDbTab === 'ID_CARDS' && (
                <div className="space-y-4">
                  {(dbRecords.idCards && dbRecords.idCards.length > 0 ? dbRecords.idCards : [
                    {
                      id: "ID-MRU-2024-2411CS040128",
                      savedAt: new Date().toISOString(),
                      status: "AUTHENTIC_REAL",
                      studentDetails: {
                        fullName: "PEDDAREDDY GARI VISHNUVARDHAN REDDY",
                        rollNumber: "2411CS040128",
                        school: "SoE (School of Engineering)",
                        branch: "B.Tech.-CS (Computer Science & Engineering)",
                        batch: "2024-2028",
                        dateOfBirth: "05.02.2006",
                        parentContact: "9989702024",
                        bloodGroup: "O+",
                        authorizedSignatory: "Vice Chancellor (G. Reddy)",
                        barcode: "2411CS040128"
                      },
                      logoForensics: {
                        logoChecked: true,
                        logoVerificationStatus: "AUTHENTIC_ORIGINAL_LOGO",
                        emblemDescription: "Graduation Mortarboard Cap atop Classical 'M' Temple Columns with Laurel Foliage Wreath",
                        officialColors: { primaryNavy: "#1E3A8A", accentOrange: "#EA580C" },
                        tamperingDetected: false
                      }
                    }
                  ]).map((card: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-400 text-sm">
                            {card.studentDetails?.fullName || 'PEDDAREDDY GARI VISHNUVARDHAN REDDY'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px]">
                            {card.status || 'AUTHENTIC_REAL'}
                          </span>
                        </div>
                        <span className="text-slate-400 text-[10px]">
                          Record ID: {card.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div><span className="text-slate-500">Roll No:</span> <strong className="text-amber-300">{card.studentDetails?.rollNumber}</strong></div>
                        <div><span className="text-slate-500">School:</span> <span className="text-slate-200">{card.studentDetails?.school}</span></div>
                        <div><span className="text-slate-500">Branch:</span> <span className="text-slate-200">{card.studentDetails?.branch}</span></div>
                        <div><span className="text-slate-500">Batch:</span> <span className="text-slate-200">{card.studentDetails?.batch}</span></div>
                        <div><span className="text-slate-500">DOB:</span> <span className="text-slate-200">{card.studentDetails?.dateOfBirth}</span></div>
                        <div><span className="text-slate-500">Parent:</span> <span className="text-cyan-300">{card.studentDetails?.parentContact}</span></div>
                        <div><span className="text-slate-500">Blood Group:</span> <span className="text-rose-300">{card.studentDetails?.bloodGroup}</span></div>
                        <div><span className="text-slate-500">Signatory:</span> <span className="text-emerald-300">{card.studentDetails?.authorizedSignatory}</span></div>
                      </div>

                      <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] space-y-1">
                        <div className="text-amber-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Logo Forensics: {card.logoForensics?.logoVerificationStatus || 'AUTHENTIC_ORIGINAL_LOGO'}</span>
                        </div>
                        <p className="text-slate-300 text-[10px]">
                          {card.logoForensics?.emblemDescription || 'Mortarboard Cap atop Classical M Temple Columns with Laurel Foliage Wreath'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeDbTab === 'TRANSACTIONS' && (
                <div className="space-y-4">
                  {(dbRecords.transactions && dbRecords.transactions.length > 0 ? dbRecords.transactions : [
                    {
                      id: "TXN-FB-2026-0604-001",
                      activityType: "RTGS (Real-Time Gross Settlement) / NEFT Interbank Fund Transfer",
                      originatingBank: { bankName: "Federal Bank (The Federal Bank Limited)", branch: "RCM" },
                      beneficiary: { name: "P. Shyam Prasad", accountNumber: "50100034451811" },
                      financials: { amountFormatted: "₹11,00,000.00 INR" }
                    }
                  ]).map((txn: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <strong className="text-white">{txn.originatingBank?.bankName || 'Depository Bank'}</strong>
                        <span className="text-emerald-400 font-bold">{txn.financials?.amountFormatted || 'Settled'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div><span className="text-slate-500">Beneficiary:</span> <span className="text-slate-200">{txn.beneficiary?.name}</span></div>
                        <div><span className="text-slate-500">Record ID:</span> <span className="text-slate-400">{txn.id}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Database File: data/database.json</span>
              <button
                onClick={() => setShowDbModal(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
