import { SectionConfig } from './types';

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
        id: 'poc',
        label: 'Point of Contact (PCO)',
        description: 'Secondary contact person (e.g. site supervisor, relative). If you do not have a PCO, you can omit it.',
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
      },
      {
        id: 'address',
        label: 'Full Installation Address',
        description: 'Physical rooftop site address where panels will be installed.',
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
    description: 'Technical and utility metrics for each installation. Remove the ones you do not keep track of in your daily operations.',
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
      },
      {
        id: 'type',
        label: 'Connection Type',
        description: 'System utility mode: On-grid, Off-grid, or Hybrid system with batteries.',
        included: true,
        notes: '',
        fieldType: 'dropdown',
        dropdownOptions: 'On-grid, Off-grid, Hybrid Solar system',
        confirmed: false
      },
      {
        id: 'vendor',
        label: 'Preferred Equipment Vendor',
        description: 'Specific brand/vendor used for solar panels or inverters (e.g. Tata, Waaree, Growatt).',
        included: true,
        notes: '',
        fieldType: 'dropdown',
        dropdownOptions: 'Tata Power, Waaree, Adani Solar, Growatt, Sungrow',
        confirmed: false
      },
      {
        id: 'meter_cat',
        label: 'Meter Category',
        description: 'Utility net-metering classification (e.g., LT2, LT3, Residential, Commercial, etc.).',
        included: true,
        notes: '',
        fieldType: 'dropdown',
        dropdownOptions: 'LT-2, LT-3, Residential, Commercial',
        confirmed: false
      },
      {
        id: 'eb_number',
        label: 'EC Number (Electricity Board Number)',
        description: 'Customer connection consumer ID from the electricity provider.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'dtr_code',
        label: 'DTR Code (Transformer Code)',
        description: 'Local transformer reference code. Often needed for grid feasibility clearance.',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'sanctioned_load',
        label: 'Sanctioned Utility Load (kW)',
        description: 'The maximum allowed electrical load sanctioned by the electricity company.',
        included: true,
        notes: '',
        fieldType: 'number',
        confirmed: false
      },
      {
        id: 'discom_div',
        label: 'DISCOM Division (Text or Number)',
        description: 'Local regional electricity board division or circle (supports both Text and Number).',
        included: true,
        notes: '',
        fieldType: 'text',
        confirmed: false
      },
      {
        id: 'google_docs_link',
        label: 'Google Drive / Docs Link (GDrive)',
        description: 'Quick links to site-survey reports, single-line designs, and contracts.',
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
