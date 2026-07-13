import { SectionConfig, FieldConfig } from './types';

export const INITIAL_SECTIONS: SectionConfig[] = [
  {
    id: 'customers',
    title: 'Customer Details Module',
    description: 'Information about the client who is buying the solar installation. Decide which details are vital for your daily operations.',
    enabled: true,
    fields: [
      {
        id: 'name',
        label: 'Customer Name',
        description: 'Full legal name or business name of the solar customer.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'phone',
        label: 'Phone Number',
        description: 'Primary mobile number for notifications, calls, and updates.',
        included: true,
        notes: '',
        fieldType: 'number',
        confirmed: false
      },
      {
        id: 'email',
        label: 'Email Address',
        description: 'For sending formal solar quotes, approvals, and invoices.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'aadhar',
        label: 'Aadhar Card Number',
        description: 'Government identity proof (often essential for domestic subsidy approvals).',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'address',
        label: 'Full Installation Address',
        description: 'Physical rooftop site address where panels will be installed.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'google_docs_link',
        label: 'Google Drive / Docs Link (GDrive)',
        description: 'Quick links to site-survey reports, single-line designs, and contracts shared with the customer.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'location_link',
        label: 'Google Maps Location Link',
        description: 'Live GPS location pin of the rooftop site for survey and delivery teams.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      }
    ]
  },
  {
    id: 'projects',
    title: 'Solar Project Technical Fields',
    description: 'Technical specifications for each solar installation. The kWp capacity is pre-loaded; use "Add from Predefined List" to add more standard fields, or "Add Custom Field" for your own.',
    enabled: true,
    fields: [
      {
        id: 'capacity_kwp',
        label: 'System Capacity (kWp)',
        description: 'Solar panel array capacity in kilowatt-peak (e.g., 3 kWp, 5 kWp).',
        included: true,
        notes: '',
        fieldType: 'number',
        confirmed: false
      }
    ]
  },
  {
    id: 'company_tracking',
    title: 'Company-Side Tracking Module',
    description: 'Internal company fields for tracking POC assignments and branch allocations.',
    enabled: true,
    fields: [
      {
        id: 'poc',
        label: 'Point of Contact (POC)',
        description: 'Internal company staff member or secondary contact responsible for this project/account.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'branch',
        label: 'Branch Allocation',
        description: 'Tracks which office branch is handling this customer (e.g. North Branch, South Branch).',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      }
    ]
  },
  {
    id: 'financials',
    title: 'Financials & Dynamic Ledger Fields',
    description: 'Configure monetary metrics. Note: Calculations of receivables are fully automatic based on payments entered.',
    enabled: true,
    fields: [
      {
        id: 'quoted_amt',
        label: 'Quoted Project Amount',
        description: 'Agreed contract value including installation and structural costs.',
        included: true,
        notes: '',
        fieldType: 'number',
        confirmed: false
      },
      {
        id: 'discount',
        label: 'Discount Offered',
        description: 'Deductions or commercial waivers applied to the quoted deal.',
        included: true,
        notes: '',
        fieldType: 'number',
        confirmed: false
      },
      {
        id: 'received',
        label: 'Total Amount Received',
        description: 'Automatically updated as payments roll in (e.g. 10% booking, 60% dispatch).',
        included: true,
        notes: '',
        fieldType: 'number',
        confirmed: false
      },
      {
        id: 'payment_date',
        label: 'Payment Date',
        description: 'The date when the most recent or final payment was received.',
        included: true,
        notes: '',
        fieldType: 'date',
        confirmed: false
      },
      {
        id: 'receivable',
        label: 'Receivable Balance Outstanding',
        description: 'Dynamically auto-calculated: (Quoted Amount - Discount - Total Received).',
        included: true,
        notes: '',
        fieldType: 'number',
        confirmed: false
      },
      {
        id: 'pay_type',
        label: 'Payment Method Modes',
        description: 'Supported modes: Online Transfer, Cash, Check, Bank Solar Loan, Personal Loan, etc.',
        included: true,
        notes: '',
        fieldType: 'dropdown',
        dropdownOptions: 'Online Transfer, Cash, Check, Bank Solar Loan, Personal Loan',
        confirmed: false
      }
    ]
  },
  {
    id: 'subsidy_status_history',
    title: 'Subsidy Status & Timeline Module',
    description: 'Tracks government solar subsidy progress. Skip or disable this entire section if you do not track subsidies.',
    enabled: true,
    fields: [
      {
        id: 'status',
        label: 'Subsidy Approval Status',
        description: 'Tracks portal milestone states (e.g., Pending, Approved, Rejected).',
        included: true,
        notes: '',
        fieldType: 'dropdown',
        dropdownOptions: 'Pending, Approved, Rejected',
        confirmed: false
      },
      {
        id: 'date',
        label: 'Status Date',
        description: 'The date of current status update.',
        included: true,
        notes: '',
        fieldType: 'date',
        confirmed: false
      },
      {
        id: 'reason',
        label: 'Status Remarks / Delay Reason',
        description: 'Explanation for any pushbacks, documents missing, or rejections.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      }
    ]
  },
  {
    id: 'bank_info',
    title: 'Customer Banking & Financing Module',
    description: 'Tracks recipient account details. Skip or disable if you do not assist in loan processing or direct disbursements.',
    enabled: true,
    fields: [
      {
        id: 'account_name',
        label: 'Account Holder Name',
        description: 'Legal name in bank records (must match utility bill for subsidy credit).',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'bank_name',
        label: 'Bank Name',
        description: 'Institution name where the account is held.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'branch',
        label: 'Bank Branch & IFSC',
        description: 'IFSC code and physical branch details for transfer routing.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'account_number',
        label: 'Account Number',
        description: 'The bank account where subsidies/disbursements are routed.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'loan_app_number',
        label: 'Loan Application Number',
        description: 'Solar bank loan case number. Skip if not coordinating client finance.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      }
    ]
  }
];

// ─── Predefined field catalog for Technical / Projects section ───────────────
// Users can pick from these OR type their own custom fields.
// The 7 core utility fields that were previously default are now in the
// "Grid & Utility (Core)" category so users can add them if needed.
export interface PredefinedField {
  id: string;
  label: string;
  description: string;
  fieldType: 'text' | 'number' | 'date' | 'dropdown';
  dropdownOptions?: string;
  category: string;
}

export const PREDEFINED_PROJECT_FIELDS: PredefinedField[] = [
  // ── Core Utility Fields (previously default) ──
  { id: 'type', label: 'Connection Type', description: 'System utility mode: On-grid, Off-grid, or Hybrid system with batteries.', fieldType: 'dropdown', dropdownOptions: 'On-grid, Off-grid, Hybrid Solar system', category: 'Core Utility' },
  { id: 'vendor', label: 'Preferred Equipment Vendor', description: 'Specific brand/vendor used for solar panels or inverters (e.g. Tata, Waaree, Growatt).', fieldType: 'dropdown', dropdownOptions: 'Tata Power, Waaree, Adani Solar, Growatt, Sungrow', category: 'Core Utility' },
  { id: 'meter_cat', label: 'Meter Category', description: 'Utility net-metering classification (e.g., LT2, LT3, Residential, Commercial, etc.).', fieldType: 'dropdown', dropdownOptions: 'LT-2, LT-3, Residential, Commercial', category: 'Core Utility' },
  { id: 'eb_number', label: 'EC Number (Electricity Board Number)', description: 'Customer connection consumer ID from the electricity provider.', fieldType: 'text', category: 'Core Utility' },
  { id: 'dtr_code', label: 'DTR Code (Transformer Code)', description: 'Local transformer reference code. Often needed for grid feasibility clearance.', fieldType: 'text', category: 'Core Utility' },
  { id: 'sanctioned_load', label: 'Sanctioned Utility Load (kW)', description: 'The maximum allowed electrical load sanctioned by the electricity company.', fieldType: 'number', category: 'Core Utility' },
  { id: 'discom_div', label: 'DISCOM Division', description: 'Local regional electricity board division or circle (supports both Text and Number).', fieldType: 'text', category: 'Core Utility' },

  // ── Grid & Utility (Advanced) ──
  { id: 'pre_feeder_no', label: 'Feeder Number', description: 'Electricity feeder/circuit number from the utility supply network.', fieldType: 'text', category: 'Grid & Utility' },
  { id: 'pre_phase_type', label: 'Phase Type', description: 'Single-phase or three-phase electrical connection.', fieldType: 'dropdown', dropdownOptions: 'Single Phase, Three Phase', category: 'Grid & Utility' },
  { id: 'pre_net_meter_no', label: 'Net Meter Serial Number', description: 'Serial number of the net meter installed at the site.', fieldType: 'text', category: 'Grid & Utility' },
  { id: 'pre_grid_approval', label: 'Grid Approval Status', description: 'Current status of DISCOM/utility grid connection approval.', fieldType: 'dropdown', dropdownOptions: 'Pending, Approved, Rejected, Under Review', category: 'Grid & Utility' },
  { id: 'pre_grid_approval_date', label: 'Grid Approval Date', description: 'Date when DISCOM/utility granted grid connection approval.', fieldType: 'date', category: 'Grid & Utility' },

  // ── Equipment ──
  { id: 'pre_panel_brand', label: 'Solar Panel Brand', description: 'Specific panel brand used (e.g. Waaree, Adani, LONGi).', fieldType: 'dropdown', dropdownOptions: 'Waaree, Adani Solar, LONGi, Tata Power Solar, REC, Canadian Solar', category: 'Equipment' },
  { id: 'pre_inverter_brand', label: 'Inverter Brand', description: 'Brand of inverter installed (e.g. Growatt, Sungrow, SMA).', fieldType: 'dropdown', dropdownOptions: 'Growatt, Sungrow, SMA, Huawei, Delta, Fronius', category: 'Equipment' },
  { id: 'pre_inverter_capacity', label: 'Inverter Capacity (kW)', description: 'Rated capacity of the inverter in kilowatts.', fieldType: 'number', category: 'Equipment' },
  { id: 'pre_battery_capacity', label: 'Battery Storage Capacity (kWh)', description: 'Battery bank storage capacity in kilowatt-hours (if hybrid/off-grid).', fieldType: 'number', category: 'Equipment' },
  { id: 'pre_panel_count', label: 'Number of Solar Panels', description: 'Total count of panels installed on the rooftop.', fieldType: 'number', category: 'Equipment' },
  { id: 'pre_panel_wattage', label: 'Panel Wattage (Wp)', description: 'Individual panel wattage rating in Watt-peak.', fieldType: 'number', category: 'Equipment' },
  { id: 'pre_mounting_type', label: 'Mounting Structure Type', description: 'Type of mounting used (e.g., GI Fixed Tilt, Ballast, BIPV).', fieldType: 'dropdown', dropdownOptions: 'GI Fixed Tilt, Aluminium Fixed Tilt, Ballast Mount, RCC Mounting, BIPV, Tracker', category: 'Equipment' },
  { id: 'pre_tilt_angle', label: 'Panel Tilt Angle (°)', description: 'Installation angle of panels in degrees.', fieldType: 'number', category: 'Equipment' },

  // ── Site & Survey ──
  { id: 'pre_roof_type', label: 'Roof Type', description: 'Material and structure of the installation rooftop.', fieldType: 'dropdown', dropdownOptions: 'RCC Flat, Metal Sheet, Tin Shed, Asbestos, RCC Sloped, Ground Mount', category: 'Site & Survey' },
  { id: 'pre_roof_area', label: 'Rooftop Area (sq. ft.)', description: 'Available usable area on the rooftop for panel installation.', fieldType: 'number', category: 'Site & Survey' },
  { id: 'pre_shadow_analysis', label: 'Shadow / Shading Analysis', description: 'Whether shading analysis was performed and its outcome.', fieldType: 'dropdown', dropdownOptions: 'No Shading, Partial Shading, Full Analysis Done, Not Done', category: 'Site & Survey' },
  { id: 'pre_site_survey_done', label: 'Site Survey Completed', description: 'Flag indicating whether the physical site survey has been conducted.', fieldType: 'dropdown', dropdownOptions: 'Yes, No, Scheduled', category: 'Site & Survey' },
  { id: 'pre_site_photo', label: 'Site Photo Drive Link', description: 'Google Drive link to site survey and installation photos.', fieldType: 'text', category: 'Site & Survey' },

  // ── Documentation & Compliance ──
  { id: 'pre_sld_link', label: 'Single Line Diagram (SLD) Link', description: 'Link to the approved Single Line Diagram for the installation.', fieldType: 'text', category: 'Documentation' },
  { id: 'pre_inspection_date', label: 'DISCOM Inspection Date', description: 'Date of joint inspection by DISCOM/utility authority.', fieldType: 'date', category: 'Documentation' },
  { id: 'pre_energization_date', label: 'Energization / Commissioning Date', description: 'Date the system was energized and declared operational.', fieldType: 'date', category: 'Documentation' },
  { id: 'pre_warranty_expiry', label: 'Equipment Warranty Expiry Date', description: 'Expiry date of solar panel and inverter manufacturer warranty.', fieldType: 'date', category: 'Documentation' },
  { id: 'pre_amc_status', label: 'AMC Status (Annual Maintenance)', description: 'Whether an Annual Maintenance Contract is active.', fieldType: 'dropdown', dropdownOptions: 'Active, Expired, Not Applicable', category: 'Documentation' },
  { id: 'pre_generation_unit', label: 'Expected Generation (kWh/month)', description: 'Estimated monthly energy generation based on system capacity.', fieldType: 'number', category: 'Documentation' },
];

// ─── Predefined field catalog for Finance / Payment section ──────────────────
export const PREDEFINED_FINANCE_FIELDS: PredefinedField[] = [
  { id: 'pre_fin_booking_amount', label: 'Booking / Advance Amount', description: 'Initial booking or token advance amount collected.', fieldType: 'number', category: 'Payments' },
  { id: 'pre_fin_booking_date', label: 'Booking Amount Date', description: 'Date when the advance booking amount was collected.', fieldType: 'date', category: 'Payments' },
  { id: 'pre_fin_second_payment', label: 'Second Installment Amount', description: 'Second milestone payment (e.g., on material dispatch).', fieldType: 'number', category: 'Payments' },
  { id: 'pre_fin_second_date', label: 'Second Installment Date', description: 'Date when the second installment was received.', fieldType: 'date', category: 'Payments' },
  { id: 'pre_fin_final_payment', label: 'Final Payment Amount', description: 'Last/final payment towards project closure.', fieldType: 'number', category: 'Payments' },
  { id: 'pre_fin_final_date', label: 'Final Payment Date', description: 'Date when final payment was cleared.', fieldType: 'date', category: 'Payments' },
  { id: 'pre_fin_invoice_no', label: 'Invoice / Bill Number', description: 'Reference number of the invoice raised to the customer.', fieldType: 'text', category: 'Payments' },
  { id: 'pre_fin_invoice_date', label: 'Invoice Date', description: 'Date when the invoice was raised.', fieldType: 'date', category: 'Payments' },
  { id: 'pre_fin_gst_amount', label: 'GST Amount', description: 'Tax component (GST) applicable on the project.', fieldType: 'number', category: 'Tax & Compliance' },
  { id: 'pre_fin_gst_pct', label: 'GST Percentage (%)', description: 'GST rate applied on this project.', fieldType: 'dropdown', dropdownOptions: '5%, 12%, 18%', category: 'Tax & Compliance' },
  { id: 'pre_fin_tds', label: 'TDS Deduction', description: 'TDS amount deducted by the customer (if any).', fieldType: 'number', category: 'Tax & Compliance' },
  { id: 'pre_fin_subsidy_credit', label: 'Subsidy Credit Amount', description: 'Amount credited as government subsidy to the customer account.', fieldType: 'number', category: 'Subsidy' },
  { id: 'pre_fin_net_payable', label: 'Net Payable After Subsidy', description: "Customer's net payable amount after subsidy credit deduction.", fieldType: 'number', category: 'Subsidy' },
  { id: 'pre_fin_loan_amount', label: 'Solar Loan Amount', description: 'Amount disbursed via solar bank loan.', fieldType: 'number', category: 'Loan' },
  { id: 'pre_fin_emi_amount', label: 'EMI Amount', description: 'Monthly EMI amount for the solar loan.', fieldType: 'number', category: 'Loan' },
  { id: 'pre_fin_emi_start', label: 'EMI Start Date', description: 'Date from which the EMI repayment begins.', fieldType: 'date', category: 'Loan' },
  { id: 'pre_fin_profit_margin', label: 'Profit Margin (%)', description: 'Internal profit margin for this project.', fieldType: 'number', category: 'Internal' },
  { id: 'pre_fin_cost_price', label: 'Internal Cost Price', description: 'Total cost incurred by the company for this installation.', fieldType: 'number', category: 'Internal' },
];

export const PREDEFINED_COMPANY_FIELDS: PredefinedField[] = [
  {
    id: 'crn_id',
    label: 'CRN / Project ID',
    description: 'Customer Reference Number or internal Project ID auto-generated by the CRM system.',
    fieldType: 'text',
    category: 'Registry'
  },
  {
    id: 'application_no',
    label: 'Application / Reference Number',
    description: 'Unique application number assigned by portal or govt. authority (e.g. DISCOM, MNRE).',
    fieldType: 'text',
    category: 'Registry'
  },
  {
    id: 'payment_ref_no',
    label: 'Payment Reference / Transaction Number',
    description: 'Internal or bank-issued payment tracking ID for reconciliation.',
    fieldType: 'text',
    category: 'Registry'
  },
  {
    id: 'assigned_team',
    label: 'Assigned Installation Team',
    description: 'The internal team or sub-contractor assigned for the site installation.',
    fieldType: 'text',
    category: 'Operations'
  },
  {
    id: 'site_survey_date',
    label: 'Site Survey Date',
    description: 'Date when the physical site survey was completed.',
    fieldType: 'date',
    category: 'Dates'
  },
  {
    id: 'installation_date',
    label: 'Scheduled Installation Date',
    description: 'Target date for the physical solar panel installation.',
    fieldType: 'date',
    category: 'Dates'
  },
  {
    id: 'commission_date',
    label: 'Commissioning / Go-Live Date',
    description: 'Date when the system was officially commissioned and energized.',
    fieldType: 'date',
    category: 'Dates'
  },
  {
    id: 'internal_notes',
    label: 'Internal Admin Notes',
    description: 'Internal remarks for team coordination, follow-up actions, or special instructions.',
    fieldType: 'text',
    category: 'Internal'
  }
];
