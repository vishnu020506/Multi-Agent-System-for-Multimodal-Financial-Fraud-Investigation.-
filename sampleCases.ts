import { InvestigationCase } from '../types';

export const INITIAL_CASES: InvestigationCase[] = [
  {
    id: 'FRA-2024-8901',
    title: 'Apex Logistics & Shell Syndicate: Invoice Forgery & Smurfing Ring',
    targetEntity: 'Apex Global Logistics LLC & Meridian Holdings Ltd',
    dateCreated: '2024-10-18',
    status: 'ESCALATED',
    totalExposure: 482500,
    currency: 'USD',
    riskAssessment: {
      overallRiskScore: 94,
      riskTier: 'CRITICAL',
      confidenceScore: 96,
      agentWeights: {
        transactionAgent: 0.25,
        documentAgent: 0.20,
        textAgent: 0.20,
        graphAgent: 0.20,
        audioAgent: 0.15,
      },
      agentScores: {
        transactionAgent: 96,
        documentAgent: 92,
        textAgent: 89,
        graphAgent: 98,
        audioAgent: 94,
      },
      keyRiskDrivers: [
        'Smurfing pattern: 14 structured transactions between $9,750 and $9,950 to evade BSA $10k reporting',
        'Document OCR detected offshore beneficiary routing divert and BSA structuring in Bank Wire Voucher #8901',
        'NLP communication flagged high coercion tone and "bypass compliance" instructions from authorized signer',
        'Graph Agent identified beneficial owner loop connecting Apex to offshore shell in Tortola via shared IP 194.38.21.104',
        'Audio wiretap confirmed VP verbal instruction to split $98,500 into sub-$10k tranches with severe acoustic stress tremor',
      ],
      mitigatingFactors: [
        'Apex LLC had 18 months of prior clean corporate history before control switch',
      ],
      sarRequired: true,
    },
    transactionAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 96,
      totalVolume: 482500,
      flaggedVolume: 432100,
      anomaliesDetected: [
        {
          type: 'STRUCTURING_SMURFING',
          description: '14 rapid wire transfers issued within 36 hours all valued between $9,750 and $9,980 to stay beneath mandatory CTR filing.',
          severity: 'HIGH',
          evidenceIds: ['TX-8901-01', 'TX-8901-02', 'TX-8901-03', 'TX-8901-04'],
        },
        {
          type: 'VELOCITY_SPIKE',
          description: 'Transaction velocity increased by 840% over baseline 30-day moving average on recipient account.',
          severity: 'HIGH',
          evidenceIds: ['TX-8901-07', 'TX-8901-08'],
        },
        {
          type: 'OFF_HOURS_DRAIN',
          description: 'Immediate pass-through of funds within 14 minutes of receipt during non-banking hours (02:41 AM UTC).',
          severity: 'MEDIUM',
          evidenceIds: ['TX-8901-11'],
        },
      ],
      structuringAnalysis: {
        detected: true,
        clusterSummary: 'High-confidence smurfing cluster detected targeting $10,000 Bank Secrecy Act threshold.',
        thresholdTarget: 10000,
      },
      transactions: [
        {
          id: 'TX-8901-01',
          timestamp: '2024-10-15 09:14:22',
          senderAccount: 'US-882910-APEX',
          senderName: 'Apex Global Logistics LLC',
          receiverAccount: 'BVI-9021-MRDN',
          receiverName: 'Meridian Holdings Ltd',
          amount: 9850,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'SMURFING',
          notes: 'Just under $10,000 threshold. Ref: Consultation Fee Pt 1',
        },
        {
          id: 'TX-8901-02',
          timestamp: '2024-10-15 11:32:05',
          senderAccount: 'US-882910-APEX',
          senderName: 'Apex Global Logistics LLC',
          receiverAccount: 'BVI-9021-MRDN',
          receiverName: 'Meridian Holdings Ltd',
          amount: 9920,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'SMURFING',
          notes: 'Ref: Consultation Fee Pt 2',
        },
        {
          id: 'TX-8901-03',
          timestamp: '2024-10-15 14:05:40',
          senderAccount: 'US-882910-APEX',
          senderName: 'Apex Global Logistics LLC',
          receiverAccount: 'BVI-9021-MRDN',
          receiverName: 'Meridian Holdings Ltd',
          amount: 9800,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'SMURFING',
          notes: 'Ref: Expedited Freight Retainer',
        },
        {
          id: 'TX-8901-04',
          timestamp: '2024-10-15 16:48:19',
          senderAccount: 'US-882910-APEX',
          senderName: 'Apex Global Logistics LLC',
          receiverAccount: 'BVI-9021-MRDN',
          receiverName: 'Meridian Holdings Ltd',
          amount: 9950,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'SMURFING',
          notes: 'Ref: Vessel Lease tranche A',
        },
        {
          id: 'TX-8901-05',
          timestamp: '2024-10-16 08:12:00',
          senderAccount: 'US-882910-APEX',
          senderName: 'Apex Global Logistics LLC',
          receiverAccount: 'BVI-9021-MRDN',
          receiverName: 'Meridian Holdings Ltd',
          amount: 9780,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'SMURFING',
          notes: 'Ref: Vessel Lease tranche B',
        },
        {
          id: 'TX-8901-06',
          timestamp: '2024-10-16 10:44:12',
          senderAccount: 'US-882910-APEX',
          senderName: 'Apex Global Logistics LLC',
          receiverAccount: 'BVI-9021-MRDN',
          receiverName: 'Meridian Holdings Ltd',
          amount: 9890,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'SMURFING',
          notes: 'Ref: Cargo handling allocation',
        },
        {
          id: 'TX-8901-07',
          timestamp: '2024-10-16 13:20:55',
          senderAccount: 'BVI-9021-MRDN',
          senderName: 'Meridian Holdings Ltd',
          receiverAccount: 'CY-3341-KYST',
          receiverName: 'Keystone Consulting Cyprus',
          amount: 58000,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'VELOCITY_SPIKE',
          notes: 'Immediate aggregate wire out upon receiving smurfed inflows',
        },
        {
          id: 'TX-8901-08',
          timestamp: '2024-10-16 15:55:10',
          senderAccount: 'CY-3341-KYST',
          senderName: 'Keystone Consulting Cyprus',
          receiverAccount: 'US-77124-CRTR',
          receiverName: 'Carter Trust Capital (Personal LLC)',
          amount: 54500,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'CROSS_BORDER',
          notes: 'Circular reroute into personal vehicle of Apex signatory',
        },
        {
          id: 'TX-8901-09',
          timestamp: '2024-10-12 11:00:00',
          senderAccount: 'US-882910-APEX',
          senderName: 'Apex Global Logistics LLC',
          receiverAccount: 'US-10294-PWUTIL',
          receiverName: 'City Power & Utilities',
          amount: 1420,
          currency: 'USD',
          channel: 'ACH',
          flagged: false,
          anomalyType: 'NORMAL',
          notes: 'Standard utility expense bill',
        },
      ],
    },
    documentAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 94,
      documentsProcessed: 4,
      forgedDocumentsCount: 3,
      keyFindings: [
        'Malla Reddy University Student ID: Authentic credential verified for Peddareddy Gari Vishnuvardhan Reddy (Roll: 2411CS040128). Genuine university crest logo, Code 128 barcode, and Vice Chancellor signature confirmed.',
        'Check #7721 Front Scan: Chemical wash detected under Payee field; Amount numeral altered from $1,850 to $9,850 with ink composition variance.',
        'Bank Wire Advice #8901: Calibrated $9,850 transfer detected targeting $10,000 BSA threshold with offshore beneficiary diversion.',
        'Wire voucher #049: Bitmapped signature spliced from SEC Form 10-K; explicit instruction to split wires below $10,000.',
      ],
      documents: [
        {
          id: 'DOC-8901-MRU-ID',
          fileName: 'Malla_Reddy_University_Student_ID.jpg',
          docType: 'ID_CARD',
          uploadDate: '2024-10-22',
          imageUrl: '/uploads/malla_reddy_student_id.jpg',
          ocrExtractedText: `MALLA REDDY UNIVERSITY
[Official University Crest: Orange Mortarboard Cap atop Dark Blue 'M' Temple Columns with Laurel Wreath]

PEDDAREDDY GARI VISHNUVARDHAN REDDY
Roll Number : 2411CS040128
School      : SoE (School of Engineering)
Branch      : B.Tech.-CS (Computer Science & Engineering)
Batch       : 2024-2028
Date of Birth : 05.02.2006
Parent No   : 9989702024
Blood Group : O+

[Barcode: 2411CS040128]
Authorized Signatory: [Signed: G. Reddy] Vice Chancellor
Status: AUTHENTIC GENUINE REGULATED CREDENTIAL (REAL)`,
          extractedFields: [
            { label: 'Institution', value: 'Malla Reddy University', confidence: 0.99 },
            { label: 'Student Name', value: 'PEDDAREDDY GARI VISHNUVARDHAN REDDY', confidence: 0.99 },
            { label: 'Roll Number', value: '2411CS040128', confidence: 0.99 },
            { label: 'School / Faculty', value: 'SoE (School of Engineering)', confidence: 0.99 },
            { label: 'Branch / Major', value: 'B.Tech.-CS', confidence: 0.99 },
            { label: 'Batch Tenure', value: '2024-2028', confidence: 0.99 },
            { label: 'Date of Birth', value: '05.02.2006', confidence: 0.99 },
            { label: 'Parent Contact', value: '9989702024', confidence: 0.99 },
            { label: 'Blood Group', value: 'O+', confidence: 0.99 },
            { label: 'University Logo', value: 'Verified Authentic (Mortarboard & M Columns)', confidence: 0.99 },
            { label: 'Barcode Data', value: '2411CS040128 (Code 128 Standard)', confidence: 0.99 },
            { label: 'Signatory Authority', value: 'Vice Chancellor (G. Reddy Signed)', confidence: 0.99 },
          ],
          observedInformation: {
            documentCategory: 'University Student Identification Credential',
            documentCategoryTitle: 'Malla Reddy University Official Student ID Card',
            summary: 'Official high-security physical PVC Student Identity Card issued by Malla Reddy University for student Peddareddy Gari Vishnuvardhan Reddy (Roll No: 2411CS040128). Forensic verification confirms authentic university logo, valid linear barcode, official watermark, and genuine Vice Chancellor signature.',
            bankOrPlatform: 'Malla Reddy University (Hyderabad, Telangana)',
            sender: 'Office of the Vice Chancellor / Admissions Registrar',
            recipient: 'PEDDAREDDY GARI VISHNUVARDHAN REDDY',
            transactionId: '2411CS040128',
            statedTotal: 'Active Student (Batch 2024-2028)',
            currency: 'ID',
            date: '2024-10-22',
            paymentChannel: 'Physical PVC Smart ID Card / Optical Barcode',
            status: 'AUTHENTIC & ACTIVE (REAL)',
            keyHighlights: [
              'Institution: Malla Reddy University (Maisammaguda, Dulapally, Hyderabad, Telangana)',
              'Student Name: PEDDAREDDY GARI VISHNUVARDHAN REDDY',
              'Roll Number: 2411CS040128 • School of Engineering (SoE) • Branch: B.Tech.-CS',
              'Academic Tenure: Batch 2024-2028 • Date of Birth: 05.02.2006 • Blood Group: O+',
              'Emergency / Parent Contact: 9989702024 registered with university records',
              'Logo Forensic Analysis: 100% Vector Fidelity on Mortarboard graduation cap, classical "M" temple columns, and dual 7-leaf laurel wreaths with official Navy #1E3A8A and Orange #EA580C colors. Zero pixel halos, zero clone stamp boundaries.',
              'Security Barcode: Code 128 encoding "2411CS040128" confirmed matching student roll number',
              'Authentication: Authorized green wet-ink signature of Vice Chancellor (G. Reddy) verified'
            ],
            logoForensics: {
              logoChecked: true,
              verificationStatus: 'AUTHENTIC_ORIGINAL',
              institutionName: 'Malla Reddy University',
              emblemDescription: 'Graduation Mortarboard Cap atop Classical "M" Temple Columns with Laurel Foliage Wreath',
              laurelWreathLeaves: 7,
              colorHexMatches: [
                { name: 'Primary University Navy', hex: '#1E3A8A', matchConfidence: 0.99 },
                { name: 'Accent Academic Orange', hex: '#EA580C', matchConfidence: 0.99 }
              ],
              tamperingDetected: false,
              pixelIntegrityNotes: 'Zero pixel haloing, zero clone stamp boundaries, vector typography kerning 100% genuine.'
            },
            studentDetails: {
              fullName: 'PEDDAREDDY GARI VISHNUVARDHAN REDDY',
              rollNumber: '2411CS040128',
              school: 'SoE (School of Engineering)',
              branch: 'B.Tech.-CS',
              batch: '2024-2028',
              dateOfBirth: '05.02.2006',
              parentContact: '9989702024',
              bloodGroup: 'O+',
              authorizedSignatory: 'Vice Chancellor (G. Reddy)',
              barcodeData: '2411CS040128'
            },
            forensicIntegrity: 'Authentic physical PVC student identification card with high-resolution micro-printing, UV watermark crest, and authorized Vice Chancellor signature.'
          },
          tamperingDetected: false,
          tamperingConfidence: 0.02,
          forgeryIndicators: [],
          vendorTaxMatch: true,
          mathDiscrepancy: false,
          imageForensics: {
            hasImageVisual: true,
            tamperBoxes: [],
            softwareSignature: 'Authentic Physical PVC Smart Card (Optical Camera Capture)',
            compressionVariance: 0.01,
            visualDocumentType: 'ID_CARD',
            exifMetadata: {
              creationTool: 'Physical Credential / Optical Camera Capture',
              modifyDate: '2024-10-22',
              compression: 'Standard Baseline JPEG',
              colorSpace: 'sRGB',
              originalResolution: 'High Resolution Document Scan',
              iccProfileMismatch: false,
            },
          },
        },
        {
          id: 'DOC-8901-FB-01',
          fileName: 'Federal_Bank_RTGS_Counterfoil_2026.jpg',
          docType: 'BANK_TRANSACTION',
          uploadDate: '2026-06-04',
          imageUrl: '/uploads/federal_bank_rtgs_counterfoil.jpg',
          ocrExtractedText: `FEDERAL BANK - YOUR PERFECT BANKING PARTNER
Counterfoil (For Customer) / ग्राहक के लिए ग्राहक पावती / కస్టమర్ కోసం (కస్టమర్ రసీదు)
BRANCH: RCM
DATE: 04/06/2026
REFERENCE NUMBER: FDRLRS2026060400 / 225194
APPLICATION FOR: RTGS [✓] (Real-Time Gross Settlement) / NEFT

BENEFICIARY DETAILS:
Beneficiary Name: P. Shyam Prasad
Beneficiary Account Number: 50100034451811
Beneficiary Bank: HDFC Bank
Beneficiary IFSC Code: HDFC0001041

TRANSACTION AMOUNT:
Amount: ₹11,00,000.00 (Eleven Lakh Indian Rupees Only)
Total Debited: ₹11,00,000.00
Charges: Standard RBI RTGS Tariff

AUTHORIZATION & STAMP:
Bank Stamp: Federal Bank Branch Official Seal (Violet Wet Ink)
Cashier Signature: [Signed - Teller Verified]
Assistant Manager Signature: [Signed - Crossed Over Branch Seal]`,
          extractedFields: [
            { label: 'Originating Bank', value: 'Federal Bank (The Federal Bank Ltd)', confidence: 0.99 },
            { label: 'Bank Branch', value: 'RCM Branch', confidence: 0.98 },
            { label: 'Transaction Date', value: '04/06/2026 (4th June 2026)', confidence: 0.99 },
            { label: 'Activity / Service', value: 'RTGS (Real-Time Gross Settlement)', confidence: 0.98 },
            { label: 'Reference / Scroll', value: 'FDRLRS2026060400 / 225194', confidence: 0.99 },
            { label: 'Beneficiary Name', value: 'P. Shyam Prasad', confidence: 0.99 },
            { label: 'Beneficiary Account', value: '50100034451811 (HDFC Bank)', confidence: 0.99 },
            { label: 'Beneficiary IFSC', value: 'HDFC0001041', confidence: 0.99 },
            { label: 'Transfer Amount', value: '₹11,00,000.00 INR (Eleven Lakhs)', confidence: 0.99, discrepancy: true, discrepancyDetail: 'High-Value Transfer exceeding ₹10 Lakh PMLA/FIU-IND threshold' },
            { label: 'Bank Stamp', value: 'Federal Bank Official Branch Violet Seal', confidence: 0.99 },
            { label: 'Signatures', value: 'Dual Authorized Signatures (Cashier & Asst. Manager)', confidence: 0.98 },
          ],
          observedInformation: {
            documentCategory: 'Federal Bank RTGS / NEFT Remittance Counterfoil',
            documentCategoryTitle: 'Federal Bank RTGS / NEFT Remittance Counterfoil',
            summary: 'Customer counterfoil for an interbank RTGS fund transfer of ₹11,00,000.00 from Federal Bank (RCM Branch) to HDFC Bank account 50100034451811 held by P. Shyam Prasad. Stamped with official Federal Bank seal and dual signatures (Cashier & Asst. Manager).',
            bankOrPlatform: 'Federal Bank (The Federal Bank Limited)',
            sender: 'Federal Bank Customer / RCM Branch Account Holder',
            recipient: 'P. Shyam Prasad (HDFC Bank Acct #50100034451811, IFSC: HDFC0001041)',
            transactionId: 'FDRLRS2026060400 / Scroll: 225194',
            statedTotal: '₹11,00,000.00 INR (Eleven Lakh Rupees)',
            paymentChannel: 'RTGS (Real-Time Gross Settlement)',
            status: 'Executed & Branch Stamped (Verified)',
            keyHighlights: [
              'Originating Institution: Federal Bank (Tagline: "YOUR PERFECT BANKING PARTNER", Branch: RCM)',
              'Transaction Date: 04/06/2026 (4th June 2026)',
              'Remittance Rail: RTGS (Real-Time Gross Settlement) marked with checkmark',
              'Beneficiary Name: P. Shyam Prasad',
              'Beneficiary Account Number: 50100034451811 (HDFC Bank standard 14-digit format)',
              'Beneficiary IFSC Code: HDFC0001041 (HDFC Bank Branch)',
              'Remittance Amount: ₹11,00,000.00 INR (High value: triggers PMLA ₹10 Lakh CTR reporting scrutiny)',
              'Physical Authentication: Dual branch officer signatures (Cashier & Assistant Manager) over violet Federal Bank rubber seal',
              'Voucher Type: Customer Counterfoil (English, Hindi: ग्राहक पावती, Telugu: కస్టమర్ రసీదు)'
            ],
            forensicIntegrity: 'Authentic physical paper document with wet-ink rubber stamp and genuine ballpoint pen pressure strokes.'
          },
          tamperingDetected: false,
          tamperingConfidence: 0.05,
          forgeryIndicators: [],
          vendorTaxMatch: true,
          mathDiscrepancy: false,
          imageForensics: {
            hasImageVisual: true,
            tamperBoxes: [],
            softwareSignature: 'Physical Paper Counterfoil (Camera Capture / Mobile Scan)',
            compressionVariance: 0.02,
            visualDocumentType: 'BANK_TRANSACTION',
            exifMetadata: {
              creationTool: 'Physical Counterfoil / Optical Image',
              modifyDate: '2026-06-04',
              compression: 'Standard Baseline',
              colorSpace: 'sRGB',
              originalResolution: 'Full HD',
              iccProfileMismatch: false,
            },
          },
        },
        {
          id: 'DOC-8901-A',
          fileName: 'Bank_Wire_Transfer_Advice_8901.pdf',
          docType: 'BANK_TRANSACTION',
          uploadDate: '2024-10-17',
          ocrExtractedText: `METROPOLITAN RESERVE BANK, N.A.
FEDWIRE / SWIFT MT103 SETTLEMENT ADVICE
TRANSACTION ID: WT-8829-9942
EXECUTION TIMESTAMP: 2024-10-15 09:14:22 UTC

ORIGINATING / SENDER DETAILS:
Account Name: Apex Global Logistics LLC
Account Number: US-882910-APEX (Operating Treasury)
Bank / Routing: Metropolitan Reserve Bank, N.A. (ABA: 021000021)

BENEFICIARY / RECIPIENT DETAILS:
Beneficiary Name: Meridian Holdings Ltd
Account Number: BVI-9021-MRDN (Offshore Wire Routing)
Beneficiary Bank: Atlantic Offshore Custody Bank Ltd, Road Town, Tortola BVI

TRANSACTION PARTICULARS:
Transfer Amount: $9,850.00 USD
Amount in Words: Nine Thousand Eight Hundred Fifty and 00/100 USD
Payment Channel: Fedwire Real-Time Gross Settlement
Reference Memo: Consultation Retainer Tranche 1 (APX-9942)
Status: COMPLETED / FLAGGED FOR BSA COMPLIANCE REVIEW
Compliance Flag: Structured Wire Lot calibrated under $10,000 threshold (31 U.S.C. § 5324)`,
          extractedFields: [
            { label: 'Bank Name', value: 'Metropolitan Reserve Bank, N.A.', confidence: 0.99 },
            { label: 'Transaction Reference', value: 'WT-8829-9942', confidence: 0.99 },
            { label: 'Sender Account', value: 'Apex Global Logistics LLC (US-882910)', confidence: 0.98 },
            { label: 'Beneficiary Account', value: 'Meridian Holdings Ltd (BVI-9021-MRDN)', confidence: 0.97, discrepancy: true, discrepancyDetail: 'Offshore shell company account in Tortola BVI' },
            { label: 'Transfer Amount', value: '$9,850.00 USD', confidence: 0.99, discrepancy: true, discrepancyDetail: 'BSA § 5324 Structuring: Calibrated below $10,000 reporting threshold' },
            { label: 'Settlement Channel', value: 'Fedwire / SWIFT MT103', confidence: 0.98 },
            { label: 'Execution Timestamp', value: '2024-10-15 09:14:22 UTC', confidence: 0.98 },
            { label: 'Transaction Status', value: 'FLAGGED (Structuring Anomaly)', confidence: 0.99 },
          ],
          tamperingDetected: true,
          tamperingConfidence: 0.94,
          forgeryIndicators: [
            'Structuring Evasion: Transfer calibrated to $9,850 to avoid mandatory Currency Transaction Report (CTR).',
            'Offshore routing divert: Remittance routed to unverified shell account BVI-9021-MRDN in Tortola.',
            'Disbursement override: Executed without standard secondary treasury authorization hash.',
          ],
          vendorTaxMatch: false,
          mathDiscrepancy: false,
          observedInformation: {
            documentCategory: 'Bank Wire Transfer Receipt',
            summary: 'Audited Federal Reserve wire transfer advice for $9,850.00 USD executed between Apex Global Logistics LLC and Meridian Holdings Ltd. Calibrated just below the $10,000 Bank Secrecy Act CTR reporting limit.',
            bankOrPlatform: 'Metropolitan Reserve Bank, N.A.',
            sender: 'Apex Global Logistics LLC (US-882910-APEX)',
            recipient: 'Meridian Holdings Ltd (BVI-9021-MRDN)',
            transactionId: 'WT-8829-9942',
            amount: '$9,850.00 USD',
            currency: 'USD',
            date: '2024-10-15 09:14:22 UTC',
            paymentChannel: 'Fedwire / SWIFT MT103 Real-Time Gross Settlement',
            status: 'FLAGGED FOR BSA COMPLIANCE REVIEW',
            keyHighlights: [
              'Originating Bank: Metropolitan Reserve Bank, N.A. (ABA Routing: 021000021)',
              'Beneficiary Account routed offshore to British Virgin Islands shell vehicle',
              'Transfer calibrated at $9,850.00 USD to bypass automated CTR filing triggers',
              'Electronic settlement audit trail linked to structured smurfing pattern',
            ],
            forensicNotes: [
              'Cryptographic SHA-256 clearing digest verified against institutional banking standard',
              'Offshore beneficiary routing coordinates divert capital outside domestic banking system',
            ],
          },
          imageForensics: {
            hasImageVisual: true,
            visualDocumentType: 'BANK_TRANSACTION',
            softwareSignature: 'Fedwire Gateway / Core Settlement v4.2',
            compressionVariance: 0.94,
            originalTemplateDiff: 'Template calibrated below $10,000 threshold to evade Bank Secrecy Act CTR filing',
            exifMetadata: {
              creationTool: 'Banking Core Settlement Engine v4.2',
              modifyDate: '2024-10-15 09:15:02 UTC',
              compression: 'Standard Banking PDF/A-1b',
              colorSpace: 'DeviceRGB',
              originalResolution: '300 DPI',
              iccProfileMismatch: false,
            },
            tamperBoxes: [
              {
                id: 'TB-01',
                label: 'Structured Amount ($9,850.00)',
                top: 48,
                left: 60,
                width: 32,
                height: 12,
                severity: 'CRITICAL',
                technique: 'ELA_COMPRESSION_DELTA',
                originalValue: '$10,000+ CTR Threshold',
                alteredValue: '$9,850.00',
                description: 'Calibrated wire transfer below $10,000 threshold to evade Bank Secrecy Act CTR filing.',
              },
              {
                id: 'TB-02',
                label: 'Offshore Remittance Account',
                top: 36,
                left: 10,
                width: 52,
                height: 10,
                severity: 'HIGH',
                technique: 'CLONE_STAMP',
                originalValue: 'Domestic Escrow',
                alteredValue: 'BVI-9021-MRDN',
                description: 'Beneficiary account routed offshore to zero-tax secrecy jurisdiction.',
              }
            ]
          }
        },
        {
          id: 'DOC-8901-B',
          fileName: 'Wire_Authorization_Voucher_049.png',
          docType: 'BANK_SLIP',
          uploadDate: '2024-10-17',
          ocrExtractedText: `TREASURY DISBURSEMENT AUTHORIZATION
Date: 2024-10-15
Authorization Code: TR-9941-X
Requested By: David Vance, VP Operations
Approval: Overridden per Executive Discretion (Auth ID: DV-77)
Target: Meridian Holdings Ltd
Split into micro-lots: YES (Instruction: "Ensure rapid processing under $10,000 lots per vendor contract terms")
Account Signoff: [Digital Signature Mismatch - Hash Inconsistent]`,
          extractedFields: [
            { label: 'Disbursement Code', value: 'TR-9941-X', confidence: 0.96 },
            { label: 'Authorizer', value: 'David Vance', confidence: 0.97 },
            { label: 'Split Transaction Directive', value: 'Confirmed: Lots < $10,000', confidence: 0.99, discrepancy: true, discrepancyDetail: 'Explicit written instruction to structure transactions' },
            { label: 'Signature Integrity', value: 'FAILED_HASH', confidence: 0.91, discrepancy: true, discrepancyDetail: 'Cryptographic signature hash does not match David Vance certificate' },
          ],
          tamperingDetected: true,
          tamperingConfidence: 0.91,
          forgeryIndicators: [
            'Signer public key does not validate against enterprise Active Directory PKI.',
            'Explicit directive to structure wire lots below $10,000.',
          ],
          vendorTaxMatch: true,
          mathDiscrepancy: false,
          imageForensics: {
            hasImageVisual: true,
            visualDocumentType: 'WIRE_SLIP',
            softwareSignature: 'GIMP 2.10.34 / Pillow 10.1 Image Library',
            compressionVariance: 0.91,
            originalTemplateDiff: 'Digital signature line spliced from another executive authorization PDF',
            exifMetadata: {
              creationTool: 'GIMP 2.10.34 (Linux/Ubuntu)',
              modifyDate: '2024-10-15 09:12:04 UTC',
              compression: 'PNG Deflate (Non-standard bank camera profile)',
              colorSpace: 'sRGB',
              originalResolution: '200 DPI',
              iccProfileMismatch: true,
            },
            tamperBoxes: [
              {
                id: 'TB-04',
                label: 'Forged Executive Signature',
                top: 74,
                left: 54,
                width: 40,
                height: 16,
                severity: 'CRITICAL',
                technique: 'SIGNATURE_FORGERY',
                originalValue: 'Valid Corporate PKI Token',
                alteredValue: 'Bitmapped Signature Stamp',
                description: 'Signature graphic extracted from public SEC Form 10-K filing and pasted with jagged alpha-transparency border. Hash failed PKI verification.',
              },
              {
                id: 'TB-05',
                label: 'Structuring Directive Annotation',
                top: 52,
                left: 10,
                width: 78,
                height: 14,
                severity: 'CRITICAL',
                technique: 'FONT_SUBSTITUTION',
                originalValue: 'Single Treasury Lump Wire',
                alteredValue: 'Split into micro-lots < $10,000',
                description: 'Manual typed instruction to bypass automated Currency Transaction Report (CTR) filing. ELA compression analysis highlights post-export text injection.',
              }
            ]
          }
        },
        {
          id: 'DOC-8901-D',
          fileName: 'Check_Front_Altered_9850.png',
          docType: 'CHECK_IMAGE',
          uploadDate: '2024-10-17',
          ocrExtractedText: `APEX GLOBAL LOGISTICS LLC - OPERATING ACCT
CHECK NO: 7721
DATE: 2024-10-15
PAY TO THE ORDER OF: Meridian Holdings Ltd
AMOUNT: $9,850.00 (Nine Thousand Eight Hundred Fifty and 00/100 Dollars)
MEMO: Route Advisory Invoice APX-9942
AUTHORIZED SIGNATURE: [David Vance - Forged Stroke Discontinuity]
MICR: :021000021: 8829104492 7721`,
          extractedFields: [
            { label: 'Check Number', value: '7721', confidence: 0.99 },
            { label: 'Payee Name', value: 'Meridian Holdings Ltd', confidence: 0.97, discrepancy: true, discrepancyDetail: 'Original payee was "Tri-State Terminal" bleached and overwritten' },
            { label: 'Check Amount Numeral', value: '$9,850.00', confidence: 0.98, discrepancy: true, discrepancyDetail: 'Numeral "9" added in front of "$1,850.00" with altered ink chemistry' },
            { label: 'Check Amount in Words', value: 'Nine Thousand Eight Hundred Fifty', confidence: 0.96, discrepancy: true, discrepancyDetail: 'Font kerning and baseline slant inconsistent with Check Printer' },
            { label: 'MICR Encoding Line', value: ':021000021: 8829104492 7721', confidence: 0.99 },
          ],
          tamperingDetected: true,
          tamperingConfidence: 0.97,
          forgeryIndicators: [
            'Check Washing / Alteration: Chemical wash detected under Payee line using ultraviolet/luminance differential analysis.',
            'Amount Manipulation: Numeral "9" was prefixed onto legitimate $1,850.00 check to match smurfing ceiling ($9,850.00).',
            'Signature Pen Stroke Discontinuity: High-resolution edge analysis reveals hesitation points characteristic of traced signature.',
          ],
          vendorTaxMatch: false,
          mathDiscrepancy: true,
          imageForensics: {
            hasImageVisual: true,
            visualDocumentType: 'CHECK',
            softwareSignature: 'Adobe Photoshop 25.1 (Macintosh)',
            compressionVariance: 0.97,
            originalTemplateDiff: 'Original Check #7721 for $1,850.00 washed and modified to $9,850.00 to Meridian Holdings Ltd',
            exifMetadata: {
              creationTool: 'Adobe Photoshop 25.1 (Macintosh M2)',
              modifyDate: '2024-10-15 11:42:19 UTC',
              compression: 'JPEG baseline (Quality 78% with re-compression halos)',
              colorSpace: 'Adobe RGB (1998)',
              originalResolution: '600 DPI Check Scanner (Downsampled to 300 DPI)',
              iccProfileMismatch: true,
            },
            tamperBoxes: [
              {
                id: 'TB-06',
                label: 'Altered Dollar Amount ($9,850.00)',
                top: 36,
                left: 72,
                width: 24,
                height: 14,
                severity: 'CRITICAL',
                technique: 'ELA_COMPRESSION_DELTA',
                originalValue: '$1,850.00',
                alteredValue: '$9,850.00',
                description: 'ELA error analysis shows glowing 98.2% compression difference. The digit "9" was clipped from another voucher and spliced over the dollar sign, with the remainder re-aligned.',
              },
              {
                id: 'TB-07',
                label: 'Chemically Washed Payee Field',
                top: 32,
                left: 18,
                width: 50,
                height: 14,
                severity: 'CRITICAL',
                technique: 'CLONE_STAMP',
                originalValue: 'Tri-State Terminal Services',
                alteredValue: 'Meridian Holdings Ltd',
                description: 'Luminance variance analysis reveals residual chemical bleach halo where original payee was dissolved, and "Meridian Holdings Ltd" was re-printed using desktop inkjet toner.',
              },
              {
                id: 'TB-08',
                label: 'Traced Signature with Hesitation Marks',
                top: 66,
                left: 58,
                width: 36,
                height: 20,
                severity: 'HIGH',
                technique: 'SIGNATURE_FORGERY',
                originalValue: 'Genuine Signature',
                alteredValue: 'Traced Facsimile',
                description: 'Micro-tremor frequency analysis indicates mechanical tracing rather than fluid executive stroke. No dynamic pen pressure variation present.',
              }
            ]
          }
        },
        {
          id: 'DOC-8901-C',
          fileName: 'Quarterly_Warehouse_Lease_Standard.pdf',
          docType: 'CONTRACT',
          uploadDate: '2024-09-01',
          ocrExtractedText: `COMMERCIAL LEASE AGREEMENT
Landlord: Tri-State Port Facilities Inc
Tenant: Apex Global Logistics LLC
Monthly Rent: $18,200.00
Term: 36 Months`,
          extractedFields: [
            { label: 'Agreement Type', value: 'Commercial Warehouse Lease', confidence: 0.99 },
            { label: 'Monthly Rent', value: '$18,200.00', confidence: 0.98 },
            { label: 'Status', value: 'Valid / Unaltered', confidence: 0.99 },
          ],
          tamperingDetected: false,
          tamperingConfidence: 0.04,
          forgeryIndicators: [],
          vendorTaxMatch: true,
          mathDiscrepancy: false,
        },
      ],
    },
    textAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 89,
      urgencyScore: 92,
      suspiciousKeywordsCount: 14,
      collusionIndicators: [
        'C-suite executive explicitly instructing AP clerk to bypass compliance screening',
        'Use of evasion vocabulary: "keep it under ten grand", "avoid the automated CTR flag", "urgent wire"',
        'Threat of professional retaliation: "I expect this completed before you leave today without questioning"',
      ],
      nlpSummary: 'High-confidence indicator of intentional anti-money laundering evasion and executive coercion. The communications reveal premeditated transaction structuring to bypass bank reporting thresholds.',
      communications: [
        {
          id: 'TXT-8901-01',
          timestamp: '2024-10-15 08:30:14',
          channel: 'INTERNAL_CHAT',
          from: 'David Vance (VP Ops)',
          to: 'Sarah Jenkins (AP Specialist)',
          subject: 'URGENT: Meridian Payments today',
          body: 'Sarah, I just emailed you the Meridian invoices. We need the full $138k wired out today immediately. Do NOT send it in one wire—break it up into separate batches between $9,700 and $9,950 so we do not trigger the bank’s tedious CTR paperwork delays. The vendor needs liquidity urgently.',
          nlpFlags: {
            urgencyLevel: 'HIGH',
            coercionDetected: true,
            kickbackKeywordsFound: ['break it up', 'CTR paperwork', 'liquidity urgently', 'batches under'],
            sentiment: 'URGENT',
          },
          highlightedKeywords: ['break it up', 'CTR paperwork', 'batches', 'liquidity urgently'],
        },
        {
          id: 'TXT-8901-02',
          timestamp: '2024-10-15 08:44:02',
          channel: 'INTERNAL_CHAT',
          from: 'Sarah Jenkins (AP Specialist)',
          to: 'David Vance (VP Ops)',
          subject: 'Re: URGENT: Meridian Payments today',
          body: 'David, compliance rules require any invoice over $50k to have a two-person sign-off and matched purchase order. Also splitting payments under $10,000 looks like structuring under our AML policy. Can we get Marcus from Finance to sign off first?',
          nlpFlags: {
            urgencyLevel: 'MEDIUM',
            coercionDetected: false,
            kickbackKeywordsFound: ['compliance rules', 'structuring', 'AML policy'],
            sentiment: 'EVASIVE',
          },
          highlightedKeywords: ['compliance rules', 'structuring', 'AML policy'],
        },
        {
          id: 'TXT-8901-03',
          timestamp: '2024-10-15 08:48:19',
          channel: 'INTERNAL_CHAT',
          from: 'David Vance (VP Ops)',
          to: 'Sarah Jenkins (AP Specialist)',
          subject: 'Re: URGENT: Meridian Payments today',
          body: 'Sarah, Marcus is on travel and I have executive signoff authority on this contract. You do not need to lecture me on AML. If the shipments are delayed because this payment is held up, it falls on your desk. Process the wires as instructed now.',
          nlpFlags: {
            urgencyLevel: 'HIGH',
            coercionDetected: true,
            kickbackKeywordsFound: ['executive authority', 'falls on your desk', 'process now'],
            sentiment: 'AGGRESSIVE',
          },
          highlightedKeywords: ['falls on your desk', 'executive authority', 'process now'],
        },
        {
          id: 'TXT-8901-04',
          timestamp: '2024-10-16 14:10:05',
          channel: 'EMAIL',
          from: 'David Vance <dvance@apexlogistics-secure.net>',
          to: 'Elena Rostova <erostova@keystone-advisory.cy>',
          subject: 'Retainer transfer completed / routing instructions',
          body: 'Elena, the tranches have cleared Meridian and are moving to Keystone Cyprus today. Confirm once the credit lands and forward the 70% share to Carter Trust Capital per our agreement.',
          nlpFlags: {
            urgencyLevel: 'HIGH',
            coercionDetected: false,
            kickbackKeywordsFound: ['tranches', 'cleared', 'forward the 70% share', 'Carter Trust Capital'],
            sentiment: 'URGENT',
          },
          highlightedKeywords: ['tranches', 'forward the 70% share', 'Carter Trust Capital'],
        },
      ],
    },
    graphAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 98,
      circularRoutingDetected: true,
      shellCompaniesIdentified: [
        'Meridian Holdings Ltd (BVI Shell - 0 employees, shared nominee director)',
        'Keystone Consulting Cyprus (Intermediary Layering Entity)',
        'Carter Trust Capital (Beneficial Owner Shell Company)',
      ],
      sharedDeviceOrIpFindings: [
        'IP Address 194.38.21.104 used to log into Apex Banking portal AND Meridian BVI wire receiver portal within 35 minutes.',
        'Device Hardware Hash #UUID-7719-B4A matched between David Vance corporate laptop and Carter Trust Capital signatory.',
      ],
      networkDiameter: 4,
      nodes: [
        { id: 'N1', label: 'Apex Global Logistics', type: 'COMPANY', riskScore: 78, details: 'Primary Corporate Operating Entity (US)', x: 120, y: 180 },
        { id: 'N2', label: 'David Vance (VP Ops)', type: 'PERSON', riskScore: 96, details: 'Authorized Corporate Signatory & Alleged Architect', x: 280, y: 80 },
        { id: 'N3', label: 'Meridian Holdings Ltd', type: 'OFFSHORE_SHELL', riskScore: 94, details: 'BVI Shell Entity - No real commercial operations', x: 440, y: 180 },
        { id: 'N4', label: 'Keystone Consulting', type: 'OFFSHORE_SHELL', riskScore: 88, details: 'Cyprus Layering Intermediary', x: 600, y: 180 },
        { id: 'N5', label: 'Carter Trust Capital', type: 'COMPANY', riskScore: 99, details: 'End Beneficiary LLC controlled by David Vance', x: 440, y: 320 },
        { id: 'N6', label: 'IP 194.38.21.104', type: 'IP_ADDRESS', riskScore: 92, details: 'Shared VPN IP linking Apex, Meridian & Carter Trust', x: 280, y: 280 },
      ],
      edges: [
        { id: 'E1', source: 'N1', target: 'N3', label: '14x Wires ($138.4k)', amount: 138400, relationType: 'TRANSFERRED', isSuspicious: true },
        { id: 'E2', source: 'N3', target: 'N4', label: 'Layering Wire ($58k)', amount: 58000, relationType: 'TRANSFERRED', isSuspicious: true },
        { id: 'E3', source: 'N4', target: 'N5', label: 'Kickback Flow ($54.5k)', amount: 54500, relationType: 'TRANSFERRED', isSuspicious: true },
        { id: 'E4', source: 'N2', target: 'N5', label: 'Ultimate Beneficial Owner', relationType: 'BENEFICIAL_OWNER', isSuspicious: true },
        { id: 'E5', source: 'N2', target: 'N1', label: 'Director / Signer', relationType: 'DIRECTOR', isSuspicious: false },
        { id: 'E6', source: 'N6', target: 'N2', label: 'Login Origin', relationType: 'SHARED_IP', isSuspicious: true },
        { id: 'E7', source: 'N6', target: 'N3', label: 'Authorized Access IP', relationType: 'SHARED_IP', isSuspicious: true },
        { id: 'E8', source: 'N5', target: 'N1', label: 'Circular Kickback Loop', relationType: 'TRANSFERRED', isSuspicious: true },
      ],
    },
    audioAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 94,
      recordingsProcessed: 2,
      flaggedRecordingsCount: 2,
      averageStressScore: 89,
      voiceBiometricAnomalies: [
        'Voice stress analyzer detected acoustic micro-tremors (88Hz) in caller David Vance during payment splitting commands.',
        'Speaker verification confirmed 99.4% biometric match with David Vance corporate voiceprint baseline.',
        'Coercion acoustic marker: elevated vocal intensity (+14dB) and rapid cadence pressuring AP staff.'
      ],
      recordings: [
        {
          id: 'REC-8901-01',
          title: 'Wire Instruction Coercion: D. Vance to Accounts Payable',
          callDate: '2024-10-15 08:42:15',
          durationSeconds: 142,
          caller: 'David Vance',
          callerRole: 'VP Operations (Authorized Signer)',
          receiver: 'Sarah Jenkins',
          receiverRole: 'Accounts Payable Specialist',
          channel: 'WIRETAP',
          voiceStressScore: 92,
          pitchTremorDetected: true,
          coercionToneDetected: true,
          audioWaveform: [28, 45, 62, 85, 94, 76, 52, 88, 92, 98, 64, 40, 72, 86, 95, 80, 48, 65, 91, 78, 55, 34, 68, 89, 96, 73, 42, 30],
          transcript: [
            { timestamp: '00:04', speaker: 'Sarah Jenkins', text: 'Apex Accounts Payable, Sarah speaking.' },
            { timestamp: '00:08', speaker: 'David Vance', text: 'Sarah, it\'s David. Did you see the Meridian invoice I dropped into your queue?', flagged: false },
            { timestamp: '00:15', speaker: 'Sarah Jenkins', text: 'Yes, Mr. Vance, but the invoice total is $98,500. Corporate policy requires dual VP sign-off and AML compliance hold for anything over $10,000.', flagged: true, flagReason: 'Corporate AML dual-control requirement stated' },
            { timestamp: '00:26', speaker: 'David Vance', text: 'Listen to me carefully. We do not have time for dual sign-offs. The container ship is docked at Tortola and they will seize our cargo.', flagged: true, flagReason: 'False operational emergency coercion' },
            { timestamp: '00:38', speaker: 'David Vance', text: 'I want you to break that wire down. Send 9,850 now, then another 9,920 in an hour, and keep each wire strictly under ten thousand. Do not trigger the currency transaction reporting desk.', flagged: true, flagReason: 'Explicit BSA 31 U.S.C. § 5324 structuring instruction' },
            { timestamp: '00:54', speaker: 'Sarah Jenkins', text: 'David, splitting wires like that sounds like structuring... I could lose my compliance certification.', flagged: true, flagReason: 'Employee resistance / compliance hesitation' },
            { timestamp: '01:05', speaker: 'David Vance', text: 'I am the VP of Operations. I authorize this personally. If you hold this up and our freight is stuck, I will replace you by noon today. Release the first 9,850 right now.', flagged: true, flagReason: 'Hostile termination threat & forced circumvention' },
            { timestamp: '01:22', speaker: 'Sarah Jenkins', text: 'Understood... releasing the first tranche now under reference APX-9942.', flagged: false }
          ],
          keyAudioFindings: [
            'Acoustic stress peak (94/100) occurred when caller instructed: "keep each wire strictly under ten thousand"',
            'Biometric vocal pitch spiked from 118 Hz to 174 Hz indicating heightened autonomic nervous system arousal and evasion awareness',
            'Direct verbal confirmation linking the invoice total ($98,500) to intentional structured sub-$10k tranches'
          ]
        },
        {
          id: 'REC-8901-02',
          title: 'Offshore Nominee Wire Intercept: D. Vance to BVI Registered Agent',
          callDate: '2024-10-16 11:05:30',
          durationSeconds: 98,
          caller: 'David Vance',
          callerRole: 'VP Operations (Apex)',
          receiver: 'Meridian Nominee',
          receiverRole: 'BVI Shell Registered Nominee',
          channel: 'VOIP_INTERCEPT',
          voiceStressScore: 86,
          pitchTremorDetected: true,
          coercionToneDetected: false,
          audioWaveform: [35, 50, 70, 82, 60, 45, 68, 75, 88, 72, 54, 40, 62, 79, 85, 68, 50, 64, 78, 62, 45, 38],
          transcript: [
            { timestamp: '00:02', speaker: 'Meridian Nominee', text: 'Meridian Corporate Services, Road Town.' },
            { timestamp: '00:06', speaker: 'David Vance', text: 'Did the batches clear into the BVI account from Apex?', flagged: false },
            { timestamp: '00:14', speaker: 'Meridian Nominee', text: 'Yes, six tranches of approximately 9,800 have posted. Totaling 58k so far.', flagged: true, flagReason: 'Confirmation of smurfed wire receipt' },
            { timestamp: '00:22', speaker: 'David Vance', text: 'Good. Wire 58,000 immediately to Keystone Consulting in Limassol. Label it advisory fees. Don\'t let the funds sit overnight.', flagged: true, flagReason: 'Rapid layering instruction to intermediate jurisdiction' }
          ],
          keyAudioFindings: [
            'Confirmed receipt of structured tranches matching Transaction Agent batch TX-8901-01 through 06',
            'Direct instruction to immediately re-route funds to Cyprus (Keystone Consulting) to prevent asset freezing'
          ]
        }
      ]
    },
    correlations: [
      {
        id: 'CORR-01',
        title: 'Bank Wire Advice Discrepancy Correlated to Structured Wire Batches',
        description: 'Document Agent flagged an offshore beneficiary mismatch on Wire Settlement Advice #WT-8829-9942. Transaction Agent identified 14 rapid transfers totaling structured wire amounts under $10,000.',
        modalities: ['DOCUMENT', 'TRANSACTION'],
        confidence: 0.98,
        significance: 'CRITICAL',
        causalChain: 'Altered Wire Settlement Advice -> Split Wire Instructions -> 14 Structured Transactions Below $10k Threshold',
      },
      {
        id: 'CORR-02',
        title: 'Chat Coercion Timestamp Precedes First Smurfed Wire by 44 Minutes',
        description: 'Text Agent NLP analysis of David Vance demanding payment splitting at 08:30 AM directly aligns with the initial $9,850 wire initiated at 09:14 AM.',
        modalities: ['TEXT', 'TRANSACTION'],
        confidence: 0.96,
        significance: 'CRITICAL',
        causalChain: 'Executive Pressure over Slack -> Clerk Initiates First Under-Threshold Wire 44 mins later',
      },
      {
        id: 'CORR-03',
        title: 'Digital Forensic Link: Shared IP & Device Hardware Identifier',
        description: 'Graph Agent discovered that the BVI receiver portal and Apex corporate account were accessed from the identical IP (194.38.21.104) and matching device UUID.',
        modalities: ['GRAPH', 'TRANSACTION'],
        confidence: 0.97,
        significance: 'CRITICAL',
        causalChain: 'David Vance Device -> Accesses Sender Account -> Accesses Receiver Offshore Account',
      },
      {
        id: 'CORR-04',
        title: 'Full Multimodal Triangulation: Circular Embezzlement Route',
        description: 'Document falsification + Text collusion + Transaction smurfing + Graph beneficial ownership converge to prove a closed-loop embezzlement scheme returning funds to the corporate insider.',
        modalities: ['DOCUMENT', 'TEXT', 'TRANSACTION', 'GRAPH'],
        confidence: 0.99,
        significance: 'CRITICAL',
        causalChain: 'Apex Funds -> Forged Meridian Invoice -> Smurfed Wires -> Cyprus Layer -> Carter Trust (Vance Personal Vehicle)',
      },
      {
        id: 'CORR-05',
        title: 'Voice Wiretap Verifies Deliberate Structuring Instruction to AP Clerk',
        description: 'Audio Agent voice stress and transcript analysis of intercepted call REC-8901-01 confirms D. Vance ordered the splitting of the $98,500 invoice into sub-$10k tranches to evade currency reporting desk.',
        modalities: ['AUDIO', 'TEXT', 'TRANSACTION'],
        confidence: 0.99,
        significance: 'CRITICAL',
        causalChain: 'Executive Wiretap Order -> Sub-$10k Splitting Command -> 14 Structured Wires Initiated',
      },
    ],
    report: {
      caseId: 'FRA-2024-8901',
      caseTitle: 'Apex Logistics & Shell Syndicate: Wire Structuring & Smurfing Ring',
      investigatorName: 'Lead Investigator J. Mercer, CAMS, CFE',
      generatedDate: '2024-10-18',
      executiveSummary: 'This investigation uncovered a coordinated, multi-stage trade-based money laundering and commercial embezzlement operation orchestrated by David Vance, Vice President of Operations at Apex Global Logistics LLC. Using structured wire settlement vouchers and altered banking routing details, the perpetrator coerced accounting personnel into structuring $138,400 into 14 distinct wire transfers below the $10,000 Bank Secrecy Act CTR threshold. The funds were routed through a BVI shell company (Meridian Holdings Ltd) and a Cyprus intermediary (Keystone Consulting) before being transferred into Carter Trust Capital, an entity beneficially owned by Vance.',
      methodologyOverview: 'The Multi-Agent Multimodal System processed 18 transaction records, 3 forensic document scans, 4 internal chat/email communications, and entity ownership graph topologies. Cross-modal correlation verified synchronized timestamps, identical network artifacts, and arithmetic anomalies.',
      evidentiaryExhibits: [
        { id: 'EX-1', exhibitNumber: 'Exhibit A-1', type: 'OCR Forensic Scan', description: 'Wire Settlement Advice #WT-8829-9942 showing beneficiary alteration and $9,850 BSA threshold evasion', relevance: 'Proves intentional falsification of bank settlement documentation' },
        { id: 'EX-2', exhibitNumber: 'Exhibit B-1', type: 'Banking Ledger', description: 'Batch sequence of 14 wire transfers structured between $9,750 and $9,950', relevance: 'Evidences deliberate BSA 31 U.S.C. § 5324 structuring' },
        { id: 'EX-3', exhibitNumber: 'Exhibit C-1', type: 'NLP Chat Log', description: 'Slack exchange between D. Vance and S. Jenkins instructing bypass of AML controls', relevance: 'Demonstrates criminal scienter, coercion, and intent' },
        { id: 'EX-4', exhibitNumber: 'Exhibit D-1', type: 'Network Graph Topology', description: 'Graph analysis proving beneficial ownership loop back to D. Vance personal LLC', relevance: 'Establishes direct personal enrichment from corporate fraud' },
      ],
      regulatoryActions: [
        { action: 'File Suspicious Activity Report (SAR / FinCEN Form 111)', justification: 'Mandatory filing under 31 CFR § 1020.320 for structured transactions over $5,000 with known suspect.', priority: 'IMMEDIATE' },
        { action: 'Emergency Administrative Hold on Acct US-882910-APEX & US-77124-CRTR', justification: 'Prevent further dissipation of corporate capital pending subpoena.', priority: 'IMMEDIATE' },
        { action: 'Referral to Federal Bureau of Investigation (Financial Crimes Section)', justification: 'Wire fraud (18 U.S.C. § 1343) and Money Laundering (18 U.S.C. § 1956).', priority: 'HIGH' },
        { action: 'Internal Human Resources & Audit Committee Notification', justification: 'Immediate suspension of signatory authority for David Vance.', priority: 'IMMEDIATE' },
      ],
      sarFilingDraft: {
        subjectName: 'Vance, David M. (and Meridian Holdings Ltd / Carter Trust Capital)',
        narrativeSummary: 'Subject engaged in structuring wire transactions below currency transaction reporting thresholds ($10,000) using falsified commercial invoices to divert funds to offshore entities under beneficial control.',
        estimatedLoss: 482500,
        violationCodes: ['BSA-Structuring (31 USC 5324)', 'Wire Fraud (18 USC 1343)', 'Commercial Bribery/Kickback', 'Money Laundering (18 USC 1956)'],
      },
      investigatorNotes: [
        'Initial AML alert triggered by automated velocity threshold monitor on 10/16.',
        'Spoke with Sarah Jenkins under whistleblower protection; confirmed chat logs are authentic.',
        'BVI corporate registry indicates Meridian Holdings incorporated 4 months ago with zero filing history.',
        'Recommendation: Proceed with immediate freeze request to corresponding banking partners.',
      ],
    },
  },
  {
    id: 'FRA-2024-7742',
    title: 'Executive Impersonation & Tampered PDF Voucher',
    targetEntity: 'Valence Biotech Corp & Swiss Escrow Agent AG',
    dateCreated: '2024-11-04',
    status: 'ACTIVE_INVESTIGATION',
    totalExposure: 1250000,
    currency: 'USD',
    riskAssessment: {
      overallRiskScore: 88,
      riskTier: 'HIGH',
      confidenceScore: 92,
      agentWeights: {
        transactionAgent: 0.20,
        documentAgent: 0.30,
        textAgent: 0.20,
        graphAgent: 0.10,
        audioAgent: 0.20,
      },
      agentScores: {
        transactionAgent: 84,
        documentAgent: 95,
        textAgent: 91,
        graphAgent: 80,
        audioAgent: 98,
      },
      keyRiskDrivers: [
        'High-velocity single wire transfer of $1,250,000 to newly configured offshore beneficiary in Zurich',
        'PDF Metadata reveals altered bank routing and IBAN on payment voucher using free online editor',
        'Executive email sent from spoofed lookalike domain (@va1ence-biotech.com with numeral 1 instead of l)',
        'Sign-off stamp image lifted from public SEC quarterly 10-Q filing',
        'Audio AI detected AI deepfake neural voice clone (99.1% synthetic match) impersonating CEO Dr. Henry Vance',
      ],
      mitigatingFactors: [
        'Wire was held by treasury fraud department prior to final correspondent release',
      ],
      sarRequired: true,
    },
    transactionAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 84,
      totalVolume: 1250000,
      flaggedVolume: 1250000,
      anomaliesDetected: [
        {
          type: 'VELOCITY_SPIKE',
          description: 'Single outbound wire of $1,250,000 exceeding standard single-day cap ($250,000) by 500%.',
          severity: 'HIGH',
          evidenceIds: ['TX-7742-01'],
        },
        {
          type: 'NEW_BENEFICIARY',
          description: 'Recipient account opened 6 calendar days prior to wire instruction in non-treaty jurisdiction.',
          severity: 'HIGH',
          evidenceIds: ['TX-7742-01'],
        },
      ],
      structuringAnalysis: {
        detected: false,
        clusterSummary: 'Single high-value wire attempting immediate account drainage.',
        thresholdTarget: 250000,
      },
      transactions: [
        {
          id: 'TX-7742-01',
          timestamp: '2024-11-03 16:58:30',
          senderAccount: 'US-9910-VALENCE',
          senderName: 'Valence Biotech Corp Operating Acct',
          receiverAccount: 'CH-8921-ESCROW',
          receiverName: 'Swiss Escrow Agent AG',
          amount: 1250000,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'CROSS_BORDER',
          notes: 'Flagged for high amount, end of business day initiation, new beneficiary',
        },
      ],
    },
    documentAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 95,
      documentsProcessed: 2,
      forgedDocumentsCount: 2,
      keyFindings: [
        'Payment Voucher #PV-2024-88: Banking coordinates overlay has different resolution and anti-aliasing than document background.',
        'Signature of CEO Dr. Henry Vance is an exact pixel-for-pixel duplicate of signature on SEC 10-K dated March 2024.',
        'PDF Producer tag: "Sejda PDF Editor Web" - uncharacteristic of corporate ERP software.',
      ],
      documents: [
        {
          id: 'DOC-7742-A',
          fileName: 'Payment_Voucher_Valence_SwissAcquisition.pdf',
          docType: 'PURCHASE_ORDER',
          uploadDate: '2024-11-04',
          ocrExtractedText: `VALENCE BIOTECH DISBURSEMENT ORDER
Voucher ID: PV-2024-88
Purpose: Confidential Project Alpine Patent Rights Acquisition
Amount: $1,250,000.00 USD
Beneficiary: Swiss Escrow Agent AG, Zurich CH
IBAN: CH93 0070 0110 0002 9941 2
Signatory: Dr. Henry Vance, CEO [Copied SEC signature graphic]`,
          extractedFields: [
            { label: 'Voucher Number', value: 'PV-2024-88', confidence: 0.99 },
            { label: 'Amount', value: '$1,250,000.00', confidence: 0.99 },
            { label: 'Beneficiary IBAN', value: 'CH93 0070 0110 0002 9941 2', confidence: 0.98, discrepancy: true, discrepancyDetail: 'Beneficiary name does not match Swiss registry entity name' },
          ],
          tamperingDetected: true,
          tamperingConfidence: 0.96,
          forgeryIndicators: [
            'Image overlay mismatch: 150 DPI signature block pasted on 300 DPI vector PDF canvas.',
            'Metadata string matches online PDF altering utility.',
          ],
          vendorTaxMatch: false,
          mathDiscrepancy: false,
        },
      ],
    },
    textAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 91,
      urgencyScore: 96,
      suspiciousKeywordsCount: 9,
      collusionIndicators: [
        'Domain typo-squatting impersonation of Chief Executive Officer',
        'Strict instructions enforcing radio silence and bypassing standard phone verification',
      ],
      nlpSummary: 'Classic Business Email Compromise (BEC) social engineering profile. Uses manufactured crisis timing and executive intimidation.',
      communications: [
        {
          id: 'TXT-7742-01',
          timestamp: '2024-11-03 16:30:11',
          channel: 'EMAIL',
          from: 'Dr. Henry Vance <henry.vance@va1ence-biotech.com>',
          to: 'Treasurer Desk <treasury@valence-biotech.com>',
          subject: 'STRICTLY CONFIDENTIAL // Patent Acquisition Wire Today',
          body: 'Team: I am in closed-door M&A negotiations in Frankfurt. We have 45 minutes to execute the escrow deposit for Project Alpine or the patent rights will be auctioned to a competitor. Attached is the emergency voucher. Do not call my cell as I am in sensitive discussions. Process immediately.',
          nlpFlags: {
            urgencyLevel: 'HIGH',
            coercionDetected: true,
            kickbackKeywordsFound: ['closed-door', 'do not call', 'process immediately', 'emergency deposit'],
            sentiment: 'URGENT',
          },
          highlightedKeywords: ['do not call', 'emergency deposit', 'process immediately', 'closed-door'],
        },
      ],
    },
    graphAnalysis: {
      agentStatus: 'COMPLETED',
      riskScore: 80,
      circularRoutingDetected: false,
      shellCompaniesIdentified: ['Swiss Escrow Agent AG (Mule Account)'],
      sharedDeviceOrIpFindings: ['Email originating server in Lagos, Nigeria; claimed sender in Frankfurt'],
      networkDiameter: 2,
      nodes: [
        { id: 'GN1', label: 'Valence Biotech Corp', type: 'COMPANY', riskScore: 20, x: 160, y: 200 },
        { id: 'GN2', label: 'Spoofed CEO Persona', type: 'PERSON', riskScore: 98, x: 380, y: 100 },
        { id: 'GN3', label: 'Swiss Escrow Agent AG', type: 'OFFSHORE_SHELL', riskScore: 92, x: 600, y: 200 },
        { id: 'GN4', label: 'Lagos ISP Origin Node', type: 'IP_ADDRESS', riskScore: 95, x: 380, y: 320 },
      ],
      edges: [
        { id: 'GE1', source: 'GN2', target: 'GN1', label: 'Phishing Email', relationType: 'INVOICED', isSuspicious: true },
        { id: 'GE2', source: 'GN1', target: 'GN3', label: 'Intercepted Wire ($1.25M)', amount: 1250000, relationType: 'TRANSFERRED', isSuspicious: true },
        { id: 'GE3', source: 'GN4', target: 'GN2', label: 'SMTP Connection IP', relationType: 'SHARED_IP', isSuspicious: true },
      ],
    },
    audioAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 98,
      recordingsProcessed: 1,
      flaggedRecordingsCount: 1,
      averageStressScore: 96,
      voiceBiometricAnomalies: [
        'Acoustic Deepfake Detector confirmed AI Neural Voice Cloning (99.1% synthetic probability).',
        'Spectral flatness measure identified robotic anti-aliasing artifacts at word boundaries above 8 kHz.',
        'Zero biological micro-tremor detected: synthetic frequency stability characteristic of neural TTS models.'
      ],
      recordings: [
        {
          id: 'REC-7742-01',
          title: 'Deepfake CEO Voice Memo: Impersonating Dr. Henry Vance',
          callDate: '2024-11-03 16:45:10',
          durationSeconds: 48,
          caller: 'Synthetic Caller (@va1ence-biotech.com spoof)',
          callerRole: 'Claimed: Dr. Henry Vance (CEO)',
          receiver: 'Mark Reynolds',
          receiverRole: 'Treasury Wire Supervisor',
          channel: 'VOIP_INTERCEPT',
          voiceStressScore: 96,
          pitchTremorDetected: false,
          deepfakeDetected: true,
          coercionToneDetected: true,
          audioWaveform: [45, 75, 88, 90, 85, 92, 95, 70, 60, 80, 95, 98, 88, 75, 60, 45, 70, 85, 90, 82, 65, 40],
          transcript: [
            { timestamp: '00:03', speaker: 'Synthetic Dr. Vance', text: 'Mark, it\'s Henry Vance. I\'m currently boarding a flight to Zurich for the Project Alpine IP closing.', flagged: false },
            { timestamp: '00:12', speaker: 'Synthetic Dr. Vance', text: 'You should have received payment voucher PV-2024-88 in your inbox. I need you to bypass normal dual-signoff and wire the 1.25 million dollars to Swiss Escrow Agent immediately.', flagged: true, flagReason: 'Urgent bypass directive via cloned voice' },
            { timestamp: '00:25', speaker: 'Synthetic Dr. Vance', text: 'If that wire is delayed past five PM Central European Time, the Swiss sellers will terminate the acquisition and we lose exclusivity.', flagged: true, flagReason: 'High pressure deadline coercion' },
            { timestamp: '00:36', speaker: 'Synthetic Dr. Vance', text: 'I am taking full board responsibility. Release the wire now and I will sign off in the system when I land.', flagged: true, flagReason: 'Circumvention of internal treasury dual control' }
          ],
          keyAudioFindings: [
            'Deepfake acoustic analysis revealed synthetic voice cloning matching public keynote addresses of Dr. Henry Vance',
            'Phase discontinuity detected between phonetic transitions indicating neural mel-spectrogram synthesis',
            'Correlates with spoofed domain @va1ence-biotech.com and forged PDF signature on Payment Voucher PV-2024-88'
          ]
        }
      ]
    },
    correlations: [
      {
        id: 'CORR-77-01',
        title: 'Domain Spoofing & High Urgency Wire Alignment',
        description: 'Text Agent detected fake domain @va1ence-biotech.com timestamped 28 minutes before the $1.25M payment authorization reached treasury.',
        modalities: ['TEXT', 'TRANSACTION'],
        confidence: 0.99,
        significance: 'CRITICAL',
        causalChain: 'Spoofed Email Inbound -> Panic Created -> High Value Wire Injected into Queue',
      },
      {
        id: 'CORR-77-02',
        title: 'Document OCR Discrepancy Validated Against Forensic Network Origin',
        description: 'Forged signature on PDF voucher correlates directly with SMTP headers originating from outside the corporate perimeter.',
        modalities: ['DOCUMENT', 'GRAPH'],
        confidence: 0.95,
        significance: 'CRITICAL',
        causalChain: 'External Off-Network Access -> Forged PDF Produced -> False Escrow Recipient',
      },
      {
        id: 'CORR-77-03',
        title: 'AI Deepfake Audio Cloned Voice Triangulates with Forged PDF Voucher',
        description: 'Audio AI Agent detected synthetic voice cloning in voicemail REC-7742-01 demanding expedited execution of Voucher #PV-2024-88, confirming multi-vector social engineering attack.',
        modalities: ['AUDIO', 'DOCUMENT', 'TRANSACTION'],
        confidence: 0.99,
        significance: 'CRITICAL',
        causalChain: 'AI Cloned Voice Memo -> Forged PDF Attached -> Attempted $1.25M Exfiltration to Swiss Mule Account',
      },
    ],
    report: {
      caseId: 'FRA-2024-7742',
      caseTitle: 'Executive Impersonation & Tampered PDF Voucher',
      investigatorName: 'Senior Cyber Fraud Analyst K. O’Connor',
      generatedDate: '2024-11-04',
      executiveSummary: 'Attempted Business Email Compromise (BEC) and wire fraud of $1,250,000 targeting Valence Biotech Corp. The attacker spoofed the CEO using lookalike domain @va1ence-biotech.com and attached a doctored payment voucher bearing a copied public signature. Treasury controls flagged the transaction for multimodal AI verification, which confirmed forgery indicators and network anomalies.',
      methodologyOverview: 'Automated OCR analysis detected signature cloning; NLP analysis identified urgency coercion; DNS/IP tracing uncovered geographical dissonance.',
      evidentiaryExhibits: [
        { id: 'EX-77-1', exhibitNumber: 'Exhibit 1', type: 'Email Header Analysis', description: 'DKIM and SPF failure on domain @va1ence-biotech.com', relevance: 'Proves impersonation' },
        { id: 'EX-77-2', exhibitNumber: 'Exhibit 2', type: 'Graphic Forensics', description: 'Side-by-side pixel overlay of CEO signature vs SEC filing', relevance: 'Proves physical forgery' },
      ],
      regulatoryActions: [
        { action: 'Permanent Wire Recall / Reversal Request to Clearinghouse', justification: 'Confirm funds remain within interbank clearing window.', priority: 'IMMEDIATE' },
        { action: 'Domain Take-Down Request to Registrar', justification: 'Cease active spoofing infrastructure.', priority: 'HIGH' },
        { action: 'IC3 Complaint Submission to FBI', justification: 'International wire fraud criminal referral.', priority: 'ROUTINE' },
      ],
      sarFilingDraft: {
        subjectName: 'Unknown Impersonator using Swiss Escrow Agent AG',
        narrativeSummary: 'Attempted wire fraud through executive impersonation and falsified corporate vouchers.',
        estimatedLoss: 1250000,
        violationCodes: ['Wire Fraud Attempt (18 USC 1343)', 'Identity Theft (18 USC 1028)'],
      },
      investigatorNotes: [
        'Wire stopped in transit at correspondent clearing level; zero financial loss sustained.',
        'Treasury workflow updated to mandate out-of-band telephone verification for transfers > $100k.',
      ],
    },
  },
  {
    id: 'FRA-2024-6109',
    title: 'Circular Crypto-Fiat Wash & Phantom Vendor Network',
    targetEntity: 'Aether Capital Trading & Helios Digital Partners',
    dateCreated: '2024-09-22',
    status: 'ACTIVE_INVESTIGATION',
    totalExposure: 890000,
    currency: 'USD',
    riskAssessment: {
      overallRiskScore: 91,
      riskTier: 'CRITICAL',
      confidenceScore: 94,
      agentWeights: {
        transactionAgent: 0.30,
        documentAgent: 0.10,
        textAgent: 0.15,
        graphAgent: 0.30,
        audioAgent: 0.15,
      },
      agentScores: {
        transactionAgent: 93,
        documentAgent: 82,
        textAgent: 80,
        graphAgent: 99,
        audioAgent: 88,
      },
      keyRiskDrivers: [
        'Graph Agent uncovered closed circular transaction loop returning 92% of funds to origin within 72 hours',
        'Phantom vendor consulting agreements lack deliverables or verifiable counterparty addresses',
        'Off-ramping into unhosted virtual asset wallets with mixer hops',
        'Rapid pass-through layering through 4 jurisdictional entities',
        'Intercepted encrypted VoIP call confirmed intention to disguise circular transfers as tax-exempt foreign loans',
      ],
      mitigatingFactors: [],
      sarRequired: true,
    },
    transactionAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 93,
      totalVolume: 890000,
      flaggedVolume: 818800,
      anomaliesDetected: [
        {
          type: 'CIRCULAR_LOOP',
          description: 'Closed circular flow: Aether -> Helios -> Vertex -> Delta -> Aether (Fee retention ~8%).',
          severity: 'HIGH',
          evidenceIds: ['TX-6109-01', 'TX-6109-02', 'TX-6109-03', 'TX-6109-04'],
        },
      ],
      structuringAnalysis: {
        detected: false,
        clusterSummary: 'High-volume wash trading and circular funds recycling.',
        thresholdTarget: 0,
      },
      transactions: [
        {
          id: 'TX-6109-01',
          timestamp: '2024-09-18 10:11:00',
          senderAccount: 'US-AETHER-01',
          senderName: 'Aether Capital Trading',
          receiverAccount: 'SG-HELIOS-99',
          receiverName: 'Helios Digital Partners (Singapore)',
          amount: 890000,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'CROSS_BORDER',
          notes: 'Initial capital injection under advisory contract',
        },
        {
          id: 'TX-6109-02',
          timestamp: '2024-09-19 02:40:12',
          senderAccount: 'SG-HELIOS-99',
          senderName: 'Helios Digital Partners',
          receiverAccount: 'KY-VERTEX-12',
          receiverName: 'Vertex Global Cayman',
          amount: 865000,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'VELOCITY_SPIKE',
          notes: 'Layering transfer retaining 2.8% fee',
        },
        {
          id: 'TX-6109-03',
          timestamp: '2024-09-20 08:15:30',
          senderAccount: 'KY-VERTEX-12',
          senderName: 'Vertex Global Cayman',
          receiverAccount: 'PA-DELTA-44',
          receiverName: 'Delta Pacific Panama',
          amount: 840000,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'CROSS_BORDER',
          notes: 'Offshore hop to zero-tax secrecy haven',
        },
        {
          id: 'TX-6109-04',
          timestamp: '2024-09-21 17:50:00',
          senderAccount: 'PA-DELTA-44',
          senderName: 'Delta Pacific Panama',
          receiverAccount: 'US-AETHER-02',
          receiverName: 'Aether Capital Offshore Sub',
          amount: 818800,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'CROSS_BORDER',
          notes: 'Completed circular wash return to original principal',
        },
      ],
    },
    documentAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 82,
      documentsProcessed: 2,
      forgedDocumentsCount: 1,
      keyFindings: [
        'Service agreements describe vague "algorithmic liquidity provisioning" with no measurable deliverables.',
        'Address listed for Helios Digital is a known co-working mailbox in Singapore housing over 4,000 registered entities.',
      ],
      documents: [
        {
          id: 'DOC-6109-A',
          fileName: 'Consulting_Service_Agreement_Helios.pdf',
          docType: 'CONTRACT',
          uploadDate: '2024-09-20',
          ocrExtractedText: `MASTER CONSULTING AGREEMENT
Parties: Aether Capital LLC & Helios Digital Partners Pte
Service: General Quantitative Sentiment Analysis & Market Making Feasibility
Fee: $890,000 Flat upfront retainer
Deliverables: Quarterly verbal briefings as mutually agreed`,
          extractedFields: [
            { label: 'Vendor Entity', value: 'Helios Digital Partners Pte', confidence: 0.98 },
            { label: 'Retainer Fee', value: '$890,000.00', confidence: 0.99 },
            { label: 'Deliverables Specification', value: 'Verbal briefings only', confidence: 0.92, discrepancy: true, discrepancyDetail: 'No tangible work product or audit trail specified' },
          ],
          tamperingDetected: false,
          tamperingConfidence: 0.12,
          forgeryIndicators: ['Contract boilerplate matches templates circulating in shell company kits.'],
          vendorTaxMatch: true,
          mathDiscrepancy: false,
        },
      ],
    },
    textAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 80,
      urgencyScore: 78,
      suspiciousKeywordsCount: 8,
      collusionIndicators: [
        'Coordinated scheduling of hops to bypass compliance holds',
        'Discussion of "cleansing origin" and "repatriating as foreign investment gain"',
      ],
      nlpSummary: 'Communications evidence intentional layering designed to obfuscate beneficial ownership and re-characterize domestic taxable funds as foreign loans.',
      communications: [
        {
          id: 'TXT-6109-01',
          timestamp: '2024-09-17 19:12:00',
          channel: 'INTERNAL_CHAT',
          from: 'Anton K. (Managing Partner)',
          to: 'Julian M. (Operations)',
          subject: 'Routing Schedule for Cycle 4',
          body: 'Julian, keep each hop moving within 24 hours. The Cayman correspondent asks fewer questions if the funds arrive from Singapore rather than direct from the US. Once Delta receives it, book the return to Aether Sub as a foreign subordinated loan.',
          nlpFlags: {
            urgencyLevel: 'MEDIUM',
            coercionDetected: false,
            kickbackKeywordsFound: ['fewer questions', 'foreign subordinated loan', 'hops'],
            sentiment: 'NEUTRAL',
          },
          highlightedKeywords: ['fewer questions', 'foreign subordinated loan', 'hops'],
        },
      ],
    },
    graphAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 99,
      circularRoutingDetected: true,
      shellCompaniesIdentified: [
        'Helios Digital Partners (Singapore Shell)',
        'Vertex Global Cayman (Cayman Special Purpose Vehicle)',
        'Delta Pacific Panama (Panama Bearer Share Structure)',
      ],
      sharedDeviceOrIpFindings: [
        'Bank accounts across all 4 countries controlled by same 2FA authenticator seed.',
      ],
      networkDiameter: 4,
      nodes: [
        { id: 'C1', label: 'Aether Capital (US)', type: 'COMPANY', riskScore: 85, x: 200, y: 120 },
        { id: 'C2', label: 'Helios Digital (SG)', type: 'OFFSHORE_SHELL', riskScore: 90, x: 500, y: 120 },
        { id: 'C3', label: 'Vertex Global (KY)', type: 'OFFSHORE_SHELL', riskScore: 92, x: 500, y: 320 },
        { id: 'C4', label: 'Delta Pacific (PA)', type: 'OFFSHORE_SHELL', riskScore: 94, x: 200, y: 320 },
      ],
      edges: [
        { id: 'CE1', source: 'C1', target: 'C2', label: '$890,000 Wire', amount: 890000, relationType: 'TRANSFERRED', isSuspicious: true },
        { id: 'CE2', source: 'C2', target: 'C3', label: '$865,000 Layer', amount: 865000, relationType: 'TRANSFERRED', isSuspicious: true },
        { id: 'CE3', source: 'C3', target: 'C4', label: '$840,000 Offshore Hop', amount: 840000, relationType: 'TRANSFERRED', isSuspicious: true },
        { id: 'CE4', source: 'C4', target: 'C1', label: '$818,800 "Loan"', amount: 818800, relationType: 'TRANSFERRED', isSuspicious: true },
      ],
    },
    audioAnalysis: {
      agentStatus: 'FLAGGED',
      riskScore: 88,
      recordingsProcessed: 1,
      flaggedRecordingsCount: 1,
      averageStressScore: 84,
      voiceBiometricAnomalies: [
        'Acoustic tension markers detected during discussion of "cleansing capital origin" and shell dissolution.',
        'Low speech rate with unnatural pauses indicating rehearsed covert operational terminology.',
      ],
      recordings: [
        {
          id: 'REC-6109-01',
          title: 'Encrypted Wire Order: A. Vance & J. Morales Layering Call',
          callDate: '2024-09-19 14:20:00',
          durationSeconds: 115,
          caller: 'Anton K.',
          callerRole: 'Managing Partner (Aether)',
          receiver: 'Julian M.',
          receiverRole: 'Operations Controller',
          channel: 'VOIP_INTERCEPT',
          voiceStressScore: 84,
          pitchTremorDetected: true,
          coercionToneDetected: false,
          audioWaveform: [30, 48, 65, 78, 85, 70, 52, 68, 82, 75, 58, 42, 66, 80, 72, 60, 48, 55, 74, 62, 40, 32],
          transcript: [
            { timestamp: '00:05', speaker: 'Anton K.', text: 'Julian, ensure the Singapore transfer is split into Vertex Cayman by tomorrow morning.', flagged: false },
            { timestamp: '00:18', speaker: 'Julian M.', text: 'Understood. What narrative should we register for the Panama return?', flagged: false },
            { timestamp: '00:28', speaker: 'Anton K.', text: 'Book it as an unsecured shareholder liquidity loan. That cleanses the origin and avoids domestic capital tax.', flagged: true, flagReason: 'Intent to evade corporate income taxation and disguise beneficial ownership' },
            { timestamp: '00:45', speaker: 'Julian M.', text: 'And the entity registration in Panama?', flagged: false },
            { timestamp: '00:52', speaker: 'Anton K.', text: 'Dissolve Delta Pacific thirty days after the final wire lands. Leave no corporate footprint.', flagged: true, flagReason: 'Pre-planned dissolution of shell entity to frustrate regulatory audit' }
          ],
          keyAudioFindings: [
            'Direct verbal intent establishing the sham nature of the "foreign shareholder loan"',
            'Confirmed premeditated dissolution of Panama shell company following fund repatriation'
          ]
        }
      ]
    },
    correlations: [
      {
        id: 'CORR-61-01',
        title: 'Closed Loop Volume Conservation',
        description: 'Graph circular loop topology correlates directly with 4 sequential transaction amounts, where exact 8% shrinkage matches standard money laundering layering commission.',
        modalities: ['GRAPH', 'TRANSACTION'],
        confidence: 0.99,
        significance: 'CRITICAL',
        causalChain: 'US Outflow -> 3 Shell Jurisdictions -> Repatriated to US as Foreign Loan',
      },
      {
        id: 'CORR-61-02',
        title: 'VoIP Wiretap Unveils Artificial Loan Pretext and Pre-Planned Shell Dissolution',
        description: 'Audio intercept REC-6109-01 confirms Managing Partner instructed operations to re-characterize circular funds as an unsecured foreign loan and dissolve the Panama vehicle within 30 days.',
        modalities: ['AUDIO', 'TEXT', 'GRAPH'],
        confidence: 0.98,
        significance: 'CRITICAL',
        causalChain: 'Verbal Loan Pretext Order -> Multi-Jurisdictional Round Trip -> Planned Shell Liquidation',
      },
    ],
    report: {
      caseId: 'FRA-2024-6109',
      caseTitle: 'Circular Crypto-Fiat Wash & Phantom Vendor Network',
      investigatorName: 'Senior AML Investigator L. Thorne, ACAMS',
      generatedDate: '2024-09-22',
      executiveSummary: 'Complex layering scheme involving circular wire transfers across Singapore, the Cayman Islands, and Panama, recycling $890,000 back to the originating entity disguised as a tax-exempt foreign shareholder loan.',
      methodologyOverview: 'Graph topology analysis combined with transactional velocity and contractual audit.',
      evidentiaryExhibits: [
        { id: 'EX-61-1', exhibitNumber: 'Exhibit 1', type: 'Graph Loop Visualization', description: 'Complete 4-node circular directed cycle', relevance: 'Demonstrates absence of commercial economic substance' },
      ],
      regulatoryActions: [
        { action: 'IRS Criminal Investigation (CI) Referral for Tax Evasion', justification: 'Sham foreign loans used to evade corporate income taxation.', priority: 'IMMEDIATE' },
      ],
      sarFilingDraft: {
        subjectName: 'Aether Capital Trading & Anton K.',
        narrativeSummary: 'Circular transaction routing lacking economic purpose designed to disguise taxable capital distributions.',
        estimatedLoss: 890000,
        violationCodes: ['Tax Evasion (26 USC 7201)', 'Money Laundering (18 USC 1956)'],
      },
      investigatorNotes: ['Entities in Panama dissolved 1 week following fund extraction.'],
    },
  },
  {
    id: 'FRA-2024-4215',
    title: 'Clean Benchmark: Quarterly Vendor Procurement (Low Risk Baseline)',
    targetEntity: 'Apex Global Logistics LLC & Evergreen Packaging Inc',
    dateCreated: '2024-08-10',
    status: 'CLEARED',
    totalExposure: 34200,
    currency: 'USD',
    riskAssessment: {
      overallRiskScore: 12,
      riskTier: 'CLEAN',
      confidenceScore: 98,
      agentWeights: {
        transactionAgent: 0.20,
        documentAgent: 0.20,
        textAgent: 0.20,
        graphAgent: 0.20,
        audioAgent: 0.20,
      },
      agentScores: {
        transactionAgent: 8,
        documentAgent: 10,
        textAgent: 14,
        graphAgent: 16,
        audioAgent: 10,
      },
      keyRiskDrivers: [
        'All transaction parameters fall within normal 12-month baseline ranges',
        'Invoice math verified with zero discrepancies or PDF editing artifacts',
        'State and Federal tax registry IDs confirmed active and in good standing',
        'Two-party approval protocol followed per corporate governance policy',
        'Voice verification call verified legitimate delivery with zero biometric stress cues',
      ],
      mitigatingFactors: [
        'Vendor has 6-year verified operational history',
        'Standard 30-day payment term honored',
      ],
      sarRequired: false,
    },
    transactionAnalysis: {
      agentStatus: 'COMPLETED',
      riskScore: 8,
      totalVolume: 34200,
      flaggedVolume: 0,
      anomaliesDetected: [],
      structuringAnalysis: {
        detected: false,
        clusterSummary: 'Normal commercial payment sequence with established terms.',
        thresholdTarget: 0,
      },
      transactions: [
        {
          id: 'TX-4215-01',
          timestamp: '2024-08-05 14:22:00',
          senderAccount: 'US-882910-APEX',
          senderName: 'Apex Global Logistics LLC',
          receiverAccount: 'US-4491-EVRGRN',
          receiverName: 'Evergreen Packaging Inc',
          amount: 34200,
          currency: 'USD',
          channel: 'ACH',
          flagged: false,
          anomalyType: 'NORMAL',
          notes: 'Standard Net-30 invoice settlement for corrugated shipping cartons',
        },
      ],
    },
    documentAnalysis: {
      agentStatus: 'COMPLETED',
      riskScore: 10,
      documentsProcessed: 1,
      forgedDocumentsCount: 0,
      keyFindings: [
        'Invoice math fully verified: 60,000 units @ $0.57 = $34,200.00.',
        'Digital PKI signature verified against DigiCert corporate root CA.',
      ],
      documents: [
        {
          id: 'DOC-4215-A',
          fileName: 'Invoice_EVR_40012_Standard.pdf',
          docType: 'INVOICE',
          uploadDate: '2024-08-01',
          ocrExtractedText: `INVOICE #EVR-40012
Vendor: Evergreen Packaging Inc, Atlanta GA
Customer: Apex Global Logistics LLC
PO Number: PO-2024-8190
Item: Corrugated Shipping Containers (Grade B)
Qty: 60,000 @ $0.57
Subtotal: $34,200.00
Tax (Exempt Resale): $0.00
Total Due: $34,200.00`,
          extractedFields: [
            { label: 'Vendor Name', value: 'Evergreen Packaging Inc', confidence: 0.99 },
            { label: 'Amount', value: '$34,200.00', confidence: 0.99 },
            { label: 'Math Check', value: 'PASS', confidence: 1.0 },
          ],
          tamperingDetected: false,
          tamperingConfidence: 0.02,
          forgeryIndicators: [],
          vendorTaxMatch: true,
          mathDiscrepancy: false,
        },
      ],
    },
    textAnalysis: {
      agentStatus: 'COMPLETED',
      riskScore: 14,
      urgencyScore: 10,
      suspiciousKeywordsCount: 0,
      collusionIndicators: [],
      nlpSummary: 'Standard routine business communication with appropriate approvals and cordial tone.',
      communications: [
        {
          id: 'TXT-4215-01',
          timestamp: '2024-08-02 10:15:00',
          channel: 'EMAIL',
          from: 'Procurement <procurement@apexlogistics.com>',
          to: 'Evergreen Sales <sales@evergreenpackaging.com>',
          subject: 'PO-2024-8190 Delivery confirmation',
          body: 'Hi team, warehouse received the carton shipment today in good order. Invoice EVR-40012 has been queued for scheduled payment on August 5.',
          nlpFlags: {
            urgencyLevel: 'LOW',
            coercionDetected: false,
            kickbackKeywordsFound: [],
            sentiment: 'NEUTRAL',
          },
          highlightedKeywords: [],
        },
      ],
    },
    graphAnalysis: {
      agentStatus: 'COMPLETED',
      riskScore: 16,
      circularRoutingDetected: false,
      shellCompaniesIdentified: [],
      sharedDeviceOrIpFindings: [],
      networkDiameter: 1,
      nodes: [
        { id: 'B1', label: 'Apex Global Logistics', type: 'COMPANY', riskScore: 15, x: 250, y: 200 },
        { id: 'B2', label: 'Evergreen Packaging', type: 'COMPANY', riskScore: 12, x: 550, y: 200 },
      ],
      edges: [
        { id: 'BE1', source: 'B1', target: 'B2', label: 'ACH Payment ($34.2k)', amount: 34200, relationType: 'TRANSFERRED', isSuspicious: false },
      ],
    },
    audioAnalysis: {
      agentStatus: 'COMPLETED',
      riskScore: 10,
      recordingsProcessed: 1,
      flaggedRecordingsCount: 0,
      averageStressScore: 12,
      voiceBiometricAnomalies: [],
      recordings: [
        {
          id: 'REC-4215-01',
          title: 'Routine Vendor Confirmation: Apex AP & Evergreen Dispatch',
          callDate: '2024-08-08 11:15:00',
          durationSeconds: 74,
          caller: 'Linda Morales',
          callerRole: 'AP Specialist (Apex)',
          receiver: 'Tom Gallagher',
          receiverRole: 'Dispatch Manager (Evergreen Packaging)',
          channel: 'RECORDED_LINE',
          voiceStressScore: 12,
          pitchTremorDetected: false,
          deepfakeDetected: false,
          coercionToneDetected: false,
          audioWaveform: [15, 22, 28, 32, 25, 20, 30, 35, 28, 22, 18, 24, 30, 26, 20, 16],
          transcript: [
            { timestamp: '00:03', speaker: 'Tom Gallagher', text: 'Evergreen Packaging dispatch, Tom speaking.' },
            { timestamp: '00:08', speaker: 'Linda Morales', text: 'Hi Tom, calling from Apex Accounts to verify delivery receipt of the 40 pallets of corrugated containers.', flagged: false },
            { timestamp: '00:18', speaker: 'Tom Gallagher', text: 'Yes, delivery signed at warehouse dock 4 on Tuesday. Invoice total matches PO-2024-082 exactly at $34,200.', flagged: false },
            { timestamp: '00:28', speaker: 'Linda Morales', text: 'Great, dual approval is logged in SAP and payment is scheduled for the Friday ACH run.', flagged: false }
          ],
          keyAudioFindings: [
            'Normal acoustic indicators: baseline vocal pitch stability, zero coercion signals',
            'Full commercial verification confirmed matching PO #PO-2024-082 and warehouse bill of lading'
          ]
        }
      ]
    },
    correlations: [
      {
        id: 'CORR-42-01',
        title: 'Complete Multi-Modal Validation (Legitimate)',
        description: 'Purchase Order, Delivery confirmation email, OCR invoice totals, and ACH banking settlement match 100% with no variances.',
        modalities: ['DOCUMENT', 'TEXT', 'TRANSACTION'],
        confidence: 0.99,
        significance: 'MEDIUM',
        causalChain: 'Purchase Order -> Delivery Notice -> Verified Invoice -> Scheduled Normal ACH Payment',
      },
    ],
    report: {
      caseId: 'FRA-2024-4215',
      caseTitle: 'Clean Benchmark: Quarterly Vendor Procurement',
      investigatorName: 'Lead Auditor M. Chen',
      generatedDate: '2024-08-10',
      executiveSummary: 'Routine vendor transaction cleared of any suspicious activity. All multimodal evidence verifies legitimate commercial trade with zero fraud indicators.',
      methodologyOverview: 'Automated verification across all 4 agents confirmed low risk.',
      evidentiaryExhibits: [
        { id: 'EX-42-1', exhibitNumber: 'Exhibit 1', type: 'Reconciliation Sheet', description: 'Matched Purchase Order against Delivery Receipt and Invoice', relevance: 'Confirms legitimate trade' },
      ],
      regulatoryActions: [
        { action: 'Close File - Cleared with No Suspicious Indicators', justification: 'Zero AML or fraud risks identified.', priority: 'ROUTINE' },
      ],
      sarFilingDraft: {
        subjectName: 'N/A',
        narrativeSummary: 'No suspicious activity identified. Benchmarked clean transaction.',
        estimatedLoss: 0,
        violationCodes: [],
      },
      investigatorNotes: ['File closed and archived into clean audit samples.'],
    },
  },
];
