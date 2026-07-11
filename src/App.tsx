/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sun,
  Lock,
  Check,
  Trash2,
  Plus,
  HelpCircle,
  FileText,
  Building2,
  Users,
  Layers,
  Wallet,
  TrendingUp,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Printer,
  Copy,
  Download,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Info,
  AlertCircle,
  Globe,
  Key,
  Phone,
  Edit,
  Settings
} from 'lucide-react';
import { INITIAL_SECTIONS } from './initialData';
import { SectionConfig, FieldConfig, ClientSubmission } from './types';
import { supabase } from './supabaseClient';

// Billing and ledger fields are configured dynamically via INITIAL_SECTIONS

export default function App() {
  // Session / Profile management states
  const [sessionActive, setSessionActive] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [accessIdInput, setAccessIdInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [saveFeedback, setSaveFeedback] = useState('');

  // Tab navigation
  const [currentTab, setCurrentTab] = useState(0);

  // Gated sections are always visible to the client
  const adminShowCredentials = true;
  const adminShowProjectTypes = true;
  const adminShowWebsite = true;

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAccessId, setClientAccessId] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  // Dynamic Security Levels State
  const [securityLevels, setSecurityLevels] = useState<{ id: string; name: string; description: string; color: string; isCustom?: boolean }[]>([
    {
      id: 'admin',
      name: 'Admin Access',
      description: 'All Access: Unlimited permissions. Can view, edit, add, and delete records across all customer, technical, bank, and ledger modules.',
      color: 'bg-red-500 text-white'
    },
    {
      id: 'sales',
      name: 'Sales Access',
      description: 'Operations Only: Full editing rights for customer registries, site specifications, and project milestones. Zero access to view/edit any financial ledger or calculation metrics.',
      color: 'bg-orange-500 text-white'
    },
    {
      id: 'finance',
      name: 'Financial Access',
      description: 'Ledger Specialist: Edit payment ledger records and discount rates. Cannot edit core customer details or project designs.',
      color: 'bg-teal-500 text-white'
    }
  ]);
  const [newLevelName, setNewLevelName] = useState('');
  const [newLevelDesc, setNewLevelDesc] = useState('');

  // Operational statistics and CRM Hosting
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(false);
  const [websiteAddress, setWebsiteAddress] = useState('');
  const [websiteConfirmed, setWebsiteConfirmed] = useState(true);
  const [liveProjectsCount, setLiveProjectsCount] = useState<string>('');
  const [totalProjectsCount, setTotalProjectsCount] = useState<string>('');
  const [softwaresUsed, setSoftwaresUsed] = useState<string>('');
  const [sheetLinks, setSheetLinks] = useState<string[]>(['']);
  const [opsInfoConfirmed, setOpsInfoConfirmed] = useState(false);
  const [wantPaymentTracking, setWantPaymentTracking] = useState<'yes' | 'no' | null>(null);
  const [wantFinanceTag, setWantFinanceTag] = useState<'yes' | 'no' | null>(null);
  const [wantFinancialInfoOnCard, setWantFinancialInfoOnCard] = useState<'yes' | 'no' | null>(null);
  const [projectType, setProjectType] = useState<string[]>([]);
  const [extraFeatureNotes, setExtraFeatureNotes] = useState('');
  const [customerSectionSkipped, setCustomerSectionSkipped] = useState(false);
  const [financialSectionSkipped, setFinancialSectionSkipped] = useState(false);
  const [userCount, setUserCount] = useState<string>('');
  const [adminUserCount, setAdminUserCount] = useState<string>('');
  const [salesUserCount, setSalesUserCount] = useState<string>('');
  const [financeUserCount, setFinanceUserCount] = useState<string>('');
  const [billingConfirmed, setBillingConfirmed] = useState(false);
  const [subsidyConfirmed, setSubsidyConfirmed] = useState(false);

  // Backend Credentials setup
  const [backendEmail, setBackendEmail] = useState('');
  const [backendPassword, setBackendPassword] = useState('');



  // Login levels view permission for financial role
  const [financialRoleViewPermission, setFinancialRoleViewPermission] = useState<'all' | 'none'>('all');

  // Interactive configurations
  const [sections, setSections] = useState<SectionConfig[]>(() => {
    // Clone initial sections
    return JSON.parse(JSON.stringify(INITIAL_SECTIONS));
  });

  // Branch and POC specialized configuration states
  const [hasMultipleBranches, setHasMultipleBranches] = useState<boolean | null>(false);
  const [usePocForPipeline, setUsePocForPipeline] = useState<boolean | null>(null);

  // CRN / Project ID Tracking Configuration States
  const [crnTrackingType, setCrnTrackingType] = useState<'default' | 'custom' | 'skipped'>('default');
  const [crnScope, setCrnScope] = useState<'crn' | 'project' | 'both'>('both');
  const [crnPrefix, setCrnPrefix] = useState<string>('CRN-2026-');
  const [crnConfirmed, setCrnConfirmed] = useState<boolean>(true);
  const [staffConfirmed, setStaffConfirmed] = useState<boolean>(false);
  const [staffCheckboxConfirmed, setStaffCheckboxConfirmed] = useState<boolean>(false);
  const [showSecurityDetails, setShowSecurityDetails] = useState<boolean>(false);

  // Tracks which field's input type is currently being modified by the user
  const [editingTypeFieldId, setEditingTypeFieldId] = useState<string | null>(null);

  // Branch tracking states
  const [branchList, setBranchList] = useState<string[]>(['Main Office', 'North Division', 'South Division']);
  const [newBranchInput, setNewBranchInput] = useState('');

  const handleAddBranch = () => {
    if (!newBranchInput.trim()) return;
    if (branchList.includes(newBranchInput.trim())) return;
    setBranchList(prev => [...prev, newBranchInput.trim()]);
    setNewBranchInput('');
  };

  const handleRemoveBranch = (branch: string) => {
    setBranchList(prev => prev.filter(b => b !== branch));
  };

  // Project workflow stages - No preloaded options
  const [customStages, setCustomStages] = useState<string[]>([]);
  const [stagesStatus, setStagesStatus] = useState<'configured' | 'dk'>('configured');
  const [newStageInput, setNewStageInput] = useState('');
  const [includeFinancialStage, setIncludeFinancialStage] = useState(true);
  const [financialStageName, setFinancialStageName] = useState('Financial Clearance / Final Payout');
  const [financialStageList, setFinancialStageList] = useState<string[]>(['Financial Clearance / Final Payout']);
  const [financialStageInput, setFinancialStageInput] = useState('');
  const [formatStagesAsNumbers, setFormatStagesAsNumbers] = useState(false);

  // Financial calculations and payment methods
  const [financialsStatus, setFinancialsStatus] = useState<'configured' | 'skipped' | 'dk'>('configured');
  const [customPaymentMethods, setCustomPaymentMethods] = useState<string[]>(['Online Transfer', 'Cash', 'Check', 'Bank Solar Loan', 'Personal Loan']);
  const [newPaymentInput, setNewPaymentInput] = useState('');

  // Subsidy and Bank module toggles
  const [subsidyEnabled, setSubsidyEnabled] = useState(true);
  const [bankInfoEnabled, setBankInfoEnabled] = useState(false); // User request: '6. Bank & Loan Coordination Info - skip this option' (set default to disabled/skipped)

  // Keep the pipeline financial-stage prompt aligned with the main tracking choice only.
  React.useEffect(() => {
    setIncludeFinancialStage(wantPaymentTracking === 'yes');
  }, [wantPaymentTracking]);

  // Submissions and API interaction state
  const [activeSubmission, setActiveSubmission] = useState<ClientSubmission | null>(null);
  const [aiProposal, setAiProposal] = useState<string>('');
  const [isLoadingProposal, setIsLoadingProposal] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isCopySuccess, setIsCopySuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');

  // Auto-save logic handles data synchronization to Supabase

  // Save state to Supabase helper function
  const saveToLocalStorage = async (phone: string, accessId: string) => {
    const cleanPhone = (phone || '').trim();
    const cleanAccessId = (accessId || '').trim();
    if (!cleanPhone) return;

    const dataToSave = {
      clientName, clientPhone: cleanPhone, clientAccessId: cleanAccessId, clientEmail,
      companyName, customNotes, hasWebsite, websiteAddress, websiteConfirmed,
      liveProjectsCount, userCount, adminUserCount, salesUserCount, financeUserCount,
      backendEmail, backendPassword, financialRoleViewPermission, sections,
      wantPaymentTracking, wantFinanceTag, wantFinancialInfoOnCard,
      hasMultipleBranches, crnTrackingType, crnScope, crnPrefix, crnConfirmed, staffConfirmed,
      branchList, customStages, stagesStatus, includeFinancialStage, financialStageName, financialStageList,
      financialsStatus, customPaymentMethods, subsidyEnabled, bankInfoEnabled,
      billingConfirmed, subsidyConfirmed,
      securityLevels, activeSubmission, aiProposal,
      submittedAt: new Date().toLocaleString()
    };

    try {
      const { error } = await supabase.from('crm_sessions').upsert({
        phone: cleanPhone, access_id: cleanAccessId,
        company_name: companyName, client_name: clientName,
        client_email: clientEmail, user_count: userCount,
        data: dataToSave, updated_at: new Date().toISOString()
      }, { onConflict: 'phone,access_id' });
      if (error) throw error;
    } catch (e) {
      console.error('Error saving to Supabase', e);
    }
  };

  // Debounced auto-saver effect hook
  React.useEffect(() => {
    if (sessionActive && clientPhone.trim()) {
      const timer = setTimeout(() => {
        saveToLocalStorage(clientPhone, clientAccessId);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [
    sessionActive,
    clientName,
    clientPhone,
    clientAccessId,
    clientEmail,
    companyName,
    customNotes,
    hasWebsite,
    websiteAddress,
    websiteConfirmed,
    liveProjectsCount,
    userCount,
    adminUserCount,
    financeUserCount,
    backendEmail,
    backendPassword,
    financialRoleViewPermission,
    sections,
    hasMultipleBranches,
    crnTrackingType,
    crnScope,
    crnPrefix,
    crnConfirmed,
    staffConfirmed,
    branchList,
    customStages,
    stagesStatus,
    includeFinancialStage,
    financialStageName,
    financialStageList,
    financialsStatus,
    customPaymentMethods,
    subsidyEnabled,
    bankInfoEnabled,
    securityLevels,
    activeSubmission,
    aiProposal
  ]);

  // Load a client or admin session
  const loadSessionFromData = (d: any) => {
    if (d.clientName !== undefined) setClientName(d.clientName);
    if (d.clientPhone !== undefined) setClientPhone(d.clientPhone);
    if (d.clientAccessId !== undefined) setClientAccessId(d.clientAccessId);
    if (d.clientEmail !== undefined) setClientEmail(d.clientEmail);
    if (d.companyName !== undefined) setCompanyName(d.companyName);
    if (d.customNotes !== undefined) setCustomNotes(d.customNotes);
    if (d.hasWebsite !== undefined) setHasWebsite(d.hasWebsite);
    if (d.totalProjectsCount !== undefined) setTotalProjectsCount(d.totalProjectsCount);
    if (d.softwaresUsed !== undefined) setSoftwaresUsed(d.softwaresUsed);
    if (d.sheetLinks !== undefined) setSheetLinks(d.sheetLinks);
    if (d.opsInfoConfirmed !== undefined) setOpsInfoConfirmed(d.opsInfoConfirmed);
    if (d.wantPaymentTracking !== undefined) setWantPaymentTracking(d.wantPaymentTracking);
    if (d.wantFinanceTag !== undefined) setWantFinanceTag(d.wantFinanceTag);
    if (d.wantFinancialInfoOnCard !== undefined) setWantFinancialInfoOnCard(d.wantFinancialInfoOnCard);
    if (d.projectType !== undefined) setProjectType(d.projectType);
    if (d.extraFeatureNotes !== undefined) setExtraFeatureNotes(d.extraFeatureNotes);
    if (d.customerSectionSkipped !== undefined) setCustomerSectionSkipped(d.customerSectionSkipped);
    if (d.financialSectionSkipped !== undefined) setFinancialSectionSkipped(d.financialSectionSkipped);
    if (d.websiteAddress !== undefined) setWebsiteAddress(d.websiteAddress);
    if (d.websiteConfirmed !== undefined) setWebsiteConfirmed(d.websiteConfirmed);
    if (d.liveProjectsCount !== undefined) setLiveProjectsCount(d.liveProjectsCount);
    if (d.userCount !== undefined) setUserCount(d.userCount);
    if (d.adminUserCount !== undefined) setAdminUserCount(d.adminUserCount);
    if (d.salesUserCount !== undefined) setSalesUserCount(d.salesUserCount);
    if (d.financeUserCount !== undefined) setFinanceUserCount(d.financeUserCount);
    if (d.backendEmail !== undefined) setBackendEmail(d.backendEmail);
    if (d.backendPassword !== undefined) setBackendPassword(d.backendPassword);
    if (d.financialRoleViewPermission !== undefined) setFinancialRoleViewPermission(d.financialRoleViewPermission);
    if (d.sections !== undefined) setSections(d.sections);
    if (d.hasMultipleBranches !== undefined) setHasMultipleBranches(d.hasMultipleBranches);
    if (d.crnTrackingType !== undefined) setCrnTrackingType(d.crnTrackingType);
    if (d.crnScope !== undefined) setCrnScope(d.crnScope);
    if (d.crnPrefix !== undefined) setCrnPrefix(d.crnPrefix);
    if (d.crnConfirmed !== undefined) setCrnConfirmed(d.crnConfirmed);
    if (d.staffConfirmed !== undefined) setStaffConfirmed(d.staffConfirmed);
    if (d.branchList !== undefined) setBranchList(d.branchList);
    if (d.customStages !== undefined) setCustomStages(d.customStages);
    if (d.stagesStatus !== undefined) setStagesStatus(d.stagesStatus);
    if (d.includeFinancialStage !== undefined) setIncludeFinancialStage(d.includeFinancialStage);
    if (d.financialStageList !== undefined) {
      setFinancialStageList(d.financialStageList);
      setFinancialStageName(d.financialStageList.join(' -> '));
    } else if (d.financialStageName !== undefined) {
      const parsed = (d.financialStageName || '').split(' -> ').filter(Boolean);
      setFinancialStageList(parsed.length ? parsed : ['Financial Clearance / Final Payout']);
      setFinancialStageName(d.financialStageName);
    }
    if (d.financialsStatus !== undefined) setFinancialsStatus(d.financialsStatus);
    if (d.customPaymentMethods !== undefined) setCustomPaymentMethods(d.customPaymentMethods);
    if (d.subsidyEnabled !== undefined) setSubsidyEnabled(d.subsidyEnabled);
    if (d.bankInfoEnabled !== undefined) setBankInfoEnabled(d.bankInfoEnabled);
    setBillingConfirmed(d.billingConfirmed === true);
    setSubsidyConfirmed(d.subsidyConfirmed === true);
    if (d.securityLevels !== undefined) setSecurityLevels(d.securityLevels);
    if (d.activeSubmission !== undefined) setActiveSubmission(d.activeSubmission);
    if (d.aiProposal !== undefined) setAiProposal(d.aiProposal);
  };

  const startFreshSession = (phone: string, accessId: string) => {
    setClientName('');
    setClientPhone(phone);
    setClientAccessId(accessId);
    setClientEmail('');
    setCompanyName('');
    setCustomNotes('');
    setHasWebsite(null);
    setTotalProjectsCount('');
    setSoftwaresUsed('');
    setSheetLinks(['']);
    setOpsInfoConfirmed(false);
    setWantPaymentTracking(null);
    setWantFinanceTag(null);
    setWantFinancialInfoOnCard(null);
    setProjectType([]);
    setExtraFeatureNotes('');
    setCustomerSectionSkipped(false);
    setFinancialSectionSkipped(false);
    setBillingConfirmed(false);
    setSubsidyConfirmed(false);
    setWebsiteAddress('');
    setWebsiteConfirmed(false);
    setLiveProjectsCount('');
    setUserCount('');
    setAdminUserCount('');
    setSalesUserCount('');
    setFinanceUserCount('');
    setBackendEmail('');
    setBackendPassword('');
    setFinancialRoleViewPermission('all');
    setSections(JSON.parse(JSON.stringify(INITIAL_SECTIONS)));
    setHasMultipleBranches(null);
    setCrnTrackingType('default');
    setCrnPrefix('CRN-2026-');
    setCrnConfirmed(false);
    setBranchList(['Main Office', 'North Division', 'South Division']);
    setCustomStages([]);
    setStagesStatus('configured');
    setIncludeFinancialStage(true);
    setFinancialStageName('Financial Clearance / Final Payout');
    setFinancialStageList(['Financial Clearance / Final Payout']);
    setFinancialsStatus('configured');
    setCustomPaymentMethods(['Online Transfer', 'Cash', 'Check', 'Bank Solar Loan', 'Personal Loan']);
    setSubsidyEnabled(true);
    setBankInfoEnabled(false);
    setSecurityLevels([
      {
        id: 'admin',
        name: 'Admin Access',
        description: 'All Access: Unlimited permissions. Can view, edit, add, and delete records across all customer, technical, bank, and ledger modules.',
        color: 'bg-red-500 text-white'
      },
      {
        id: 'sales',
        name: 'Sales Access',
        description: 'Operations Only: Full editing rights for customer registries, site specifications, and project milestones. Zero access to view/edit any financial ledger or calculation metrics.',
        color: 'bg-orange-500 text-white'
      },
      {
        id: 'finance',
        name: 'Financial Access',
        description: 'Ledger Specialist: Edit payment ledger records and discount rates. Cannot edit core customer details or project designs.',
        color: 'bg-teal-500 text-white'
      }
    ]);
    setActiveSubmission(null);
    setAiProposal('');
  };

  // Client login / workspace loader (Supabase)
  const handleClientStartOrResume = async (phoneToLoad: string, accessIdToLoad: string) => {
    const cleanPhone = phoneToLoad.trim();
    const cleanAccessId = accessIdToLoad.trim();
    if (!cleanPhone) { setPhoneError('Please enter a valid phone number'); return; }
    if (!cleanAccessId) { setPhoneError('Please enter an Access ID / Passcode to protect your workspace'); return; }

    // Prevent client login from accessing admin row
    if (cleanPhone === 'Admin Master' || cleanAccessId === 'admin') {
      setPhoneError('Admin Master login must be performed via the Admin Portal tab.');
      return;
    }

    setPhoneError('');

    try {
      const { data } = await supabase.from('crm_sessions')
        .select('*').eq('phone', cleanPhone).eq('access_id', cleanAccessId).single();
      if (data && data.data) {
        loadSessionFromData(data.data);
        setSaveFeedback('Welcome back! Loaded your secure specifications draft.');
      } else {
        startFreshSession(cleanPhone, cleanAccessId);
        setSaveFeedback('Started fresh workspace session with Access ID protection.');
      }
    } catch {
      startFreshSession(cleanPhone, cleanAccessId);
      setSaveFeedback('Started fresh workspace session.');
    }
    setCurrentTab(0);
    setSessionActive(true);
    setTimeout(() => setSaveFeedback(''), 4000);
  };

    const handleAddSecurityLevel = () => {
    if (!newLevelName.trim() || !newLevelDesc.trim()) return;
    const cleanName = newLevelName.trim();
    if (securityLevels.some(sl => sl.name.toLowerCase() === cleanName.toLowerCase())) return;

    const newId = 'custom_' + Date.now();
    const newLevel = {
      id: newId,
      name: cleanName,
      description: newLevelDesc.trim(),
      color: 'bg-indigo-600 text-white',
      isCustom: true
    };

    setSecurityLevels(prev => [...prev, newLevel]);
    setNewLevelName('');
    setNewLevelDesc('');
    setSaveFeedback(`Created custom role: ${cleanName}`);
    setTimeout(() => setSaveFeedback(''), 2500);
  };

  const handleRemoveSecurityLevel = (id: string) => {
    const levelToRemove = securityLevels.find(sl => sl.id === id);
    setSecurityLevels(prev => prev.filter(sl => sl.id !== id));
    if (levelToRemove) {
      setSaveFeedback(`Removed custom role: ${levelToRemove.name}`);
      setTimeout(() => setSaveFeedback(''), 2500);
    }
  };

  // Keep branch allocation logic synchronized with the Branch question
  const handleBranchToggle = (multiple: boolean) => {
    setHasMultipleBranches(multiple);
    setSections(prev =>
      prev.map(sec => {
        if (sec.id === 'customers') {
          return {
            ...sec,
            fields: sec.fields.map(f => {
              if (f.id === 'branch') {
                return { ...f, included: multiple };
              }
              return f;
            })
          };
        }
        return sec;
      })
    );
  };

  // Approve / Delete (include/exclude) field toggling
  const handleToggleField = (sectionId: string, fieldId: string, included: boolean) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            fields: sec.fields.map(f => {
              if (f.id === fieldId) {
                return { ...f, included };
              }
              return f;
            })
          };
        }
        return sec;
      })
    );
  };

  // Field note update
  const handleFieldNoteChange = (sectionId: string, fieldId: string, notes: string) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            fields: sec.fields.map(f => {
              if (f.id === fieldId) {
                return { ...f, notes };
              }
              return f;
            })
          };
        }
        return sec;
      })
    );
  };

  // Field type update
  const handleFieldTypeChange = (sectionId: string, fieldId: string, fieldType: 'text' | 'dropdown' | 'number' | 'date') => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            fields: sec.fields.map(f => {
              if (f.id === fieldId) {
                return { ...f, fieldType };
              }
              return f;
            })
          };
        }
        return sec;
      })
    );
  };

  // Dropdown options update
  const handleDropdownOptionsChange = (sectionId: string, fieldId: string, dropdownOptions: string) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            fields: sec.fields.map(f => {
              if (f.id === fieldId) {
                return { ...f, dropdownOptions };
              }
              return f;
            })
          };
        }
        return sec;
      })
    );
  };

  const handleConfirmField = (sectionId: string, fieldId: string, confirmed: boolean) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            fields: sec.fields.map(f => {
              if (f.id === fieldId) {
                return { ...f, confirmed };
              }
              return f;
            })
          };
        }
        return sec;
      })
    );
  };


  const renderFieldRow = (sectionId: string, field: FieldConfig) => {
    // Hide branch if explicitly set to No
    if (field.id === 'branch' && hasMultipleBranches === false) return null;

    const isIncluded = field.included;
    const isConfirmed = field.confirmed;
    const fType = field.fieldType || 'text';
    
    // Type visual label mapping
    const typeLabelMap = {
      text: 'Text',
      number: 'Number',
      dropdown: 'Dropdown',
      date: 'Date'
    };
    
    // 1. Render for COMPACT FROZEN/CONFIRMED state
    if (isConfirmed) {
      if (isIncluded) {
        return (
          <div
            key={field.id}
            className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/10 hover:bg-emerald-50/20 transition-all animate-fade-in space-y-3 text-xs shadow-3xs"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                </div>
                <div className="flex flex-wrap items-center gap-x-1.5 min-w-0">
                  <span className="font-extrabold text-slate-800 truncate">
                    {field.label}
                  </span>
                  <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-bold font-mono px-2 py-0.5 rounded-md shrink-0">
                    Type: {typeLabelMap[fType] || fType}
                  </span>
                  {field.isCustom && (
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0">
                      Custom
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleConfirmField(sectionId, field.id, false)}
                  className="px-2.5 py-1.5 text-[11px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  title="Edit field configuration"
                >
                  <Edit className="w-3 h-3 text-indigo-600" />
                  <span className="text-[11px] font-black text-indigo-600">Edit</span>
                </button>
              </div>
            </div>

            {field.description && (
              <p className="text-[11px] text-slate-500 font-medium">
                {field.description}
              </p>
            )}

            {/* View-only: show notes only if present */}
            {field.notes && (
              <p className="text-[11px] text-slate-600 font-medium italic pt-1">
                Note: {field.notes}
              </p>
            )}
          </div>
        );
      } else {
        // Compact Omitted State
        return (
          <div
            key={field.id}
            className="py-1.5 px-3 sm:px-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50/80 transition-all animate-fade-in flex items-center justify-between gap-3 text-xs shadow-3xs"
          >
            <div className="flex items-center gap-2 min-w-0 opacity-60">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <span className="text-slate-400 text-xs font-bold leading-none select-none">–</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 min-w-0">
                <span className="font-bold text-slate-400 line-through truncate">
                  {field.label}
                </span>
                <span className="text-[9px] bg-slate-200/60 text-slate-500 px-1.5 py-0.2 rounded font-black uppercase shrink-0">
                  Skipped
                </span>
              </div>
            </div>
            
            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => handleConfirmField(sectionId, field.id, false)}
                className="p-1 px-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                title="Restore field"
              >
                <Edit className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-black text-slate-500 hover:text-indigo-700">Restore</span>
              </button>
            </div>
          </div>
        );
      }
    }

    const isEditingType = editingTypeFieldId === field.id;

    // 2. Render for CONFIGURATION or UNSELECTED state (Single compact row)
    return (
      <div key={field.id} className="animate-fade-in">
        {/* Single compact row: label + type + desc + buttons all inline */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/60 transition-all">
          {/* Left: name + type badge + description */}
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
            <span className="text-xs font-black text-slate-900 shrink-0">{field.label}</span>
            <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-500 font-bold font-mono px-1.5 py-0.5 rounded shrink-0">
              {typeLabelMap[fType] || fType}
            </span>
            {field.isCustom && (
              <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0">Custom</span>
            )}
            <span className="text-[11px] text-slate-400 truncate hidden sm:block">
              {field.id === 'poc' ? 'Point of Contact (POC).' : field.description}
            </span>
          </div>

          {/* Right: Edit Type | Skip | Confirm - no divider, tight */}
          <div className="flex items-center gap-1.5 shrink-0">
            {field.isCustom && (
              <button
                type="button"
                onClick={() => handleDeleteCustomField(sectionId, field.id)}
                className="px-2 py-1 border border-rose-200 hover:bg-rose-50 text-rose-500 font-bold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setEditingTypeFieldId(isEditingType ? null : field.id)}
              className="px-2.5 py-1 text-[11px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Edit className="w-3 h-3" />
              <span className="hidden sm:inline">Edit Type</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSections(prev =>
                  prev.map(sec => {
                    if (sec.id === sectionId) {
                      return { ...sec, fields: sec.fields.map(f => f.id === field.id ? { ...f, included: false, confirmed: true } : f) };
                    }
                    return sec;
                  })
                );
              }}
              className="px-2.5 py-1 border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 font-bold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => {
                setSections(prev =>
                  prev.map(sec => {
                    if (sec.id === sectionId) {
                      return { ...sec, fields: sec.fields.map(f => {
                        if (f.id === field.id) {
                          if (f.fieldType === 'dropdown' && !f.dropdownOptions?.trim()) {
                            return { ...f, included: true, confirmed: true, dropdownOptions: 'Option 1, Option 2' };
                          }
                          return { ...f, included: true, confirmed: true };
                        }
                        return f;
                      })};
                    }
                    return sec;
                  })
                );
              }}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3 h-3 stroke-[3]" />
              Confirm
            </button>
          </div>
        </div>

        {/* Edit Type expansion panel - shows below row when active */}
        {isEditingType && (
          <div className="mt-1 bg-white border border-slate-200 p-4 rounded-xl space-y-3 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['text', 'dropdown', 'number', 'date'] as const).map((type) => {
                const labelMap = { text: '📝 Text', dropdown: '🎯 Dropdown', number: '🔢 Number', date: '📅 Date' };
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleFieldTypeChange(sectionId, field.id, type)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-black text-center transition cursor-pointer ${
                      fType === type ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {labelMap[type]}
                  </button>
                );
              })}
            </div>

            {fType === 'dropdown' ? (
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Dropdown Options (comma separated) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={field.dropdownOptions || ''}
                  onChange={(e) => handleDropdownOptionsChange(sectionId, field.id, e.target.value)}
                  placeholder="e.g. On-grid, Off-grid, Hybrid"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-indigo-500 outline-none transition font-semibold"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Optional note / instruction
                </label>
                <input
                  type="text"
                  value={field.notes || ''}
                  onChange={(e) => handleFieldNoteChange(sectionId, field.id, e.target.value)}
                  placeholder="e.g. Default value, validation limits..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-indigo-500 outline-none transition font-medium"
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setEditingTypeFieldId(null)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-lg transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Custom field addition for any section
  const [addingCustomFieldToSection, setAddingCustomFieldToSection] = useState<string | null>(null);
  const [customFieldName, setCustomFieldName] = useState('');
  const [customFieldDesc, setCustomFieldDesc] = useState('');
  const [customFieldType, setCustomFieldType] = useState<'text' | 'dropdown' | 'number' | 'date'>('text');
  const [customFieldDropdownOptions, setCustomFieldDropdownOptions] = useState('');
  const [customBulkFieldInput, setCustomBulkFieldInput] = useState('');

  const handleAddCustomField = (sectionId: string) => {
    if (!customFieldName.trim()) return;

    const newField: FieldConfig = {
      id: `custom_${Date.now()}`,
      label: customFieldName.trim(),
      description: customFieldDesc.trim() || 'Custom operational field specified by installer.',
      included: true,
      notes: '',
      fieldType: customFieldType,
      dropdownOptions: customFieldType === 'dropdown' ? customFieldDropdownOptions.trim() : '',
      isCustom: true,
      confirmed: false
    };

    setSections(prev =>
      prev.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            fields: [...sec.fields, newField]
          };
        }
        return sec;
      })
    );

    setCustomFieldName('');
    setCustomFieldDesc('');
    setCustomFieldType('text');
    setCustomFieldDropdownOptions('');
    setAddingCustomFieldToSection(null);
  };

  // Add multiple custom financial fields from comma-separated input
  const handleAddBulkCustomFinancialFields = (sectionId: string) => {
    const names = customBulkFieldInput.split(',').map(s => s.trim()).filter(Boolean);
    if (names.length === 0) return;
    setSections(prev => prev.map(sec => {
      if (sec.id === sectionId) {
        const newFields = names.map(name => ({
          id: `custom_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
          label: name,
          description: 'Custom financial field',
          included: true,
          notes: '',
          fieldType: 'text',
          confirmed: false,
          isCustom: true
        }));
        return { ...sec, fields: [...sec.fields, ...newFields] };
      }
      return sec;
    }));
    setCustomBulkFieldInput('');
    setAddingCustomFieldToSection(null);
  };

  // Permanently delete custom fields
  const handleDeleteCustomField = (sectionId: string, fieldId: string) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            fields: sec.fields.filter(f => f.id !== fieldId)
          };
        }
        return sec;
      })
    );
  };

  // Dynamic Stages operations
  const handleFinancialTrackingChoice = (value: 'yes' | 'no') => {
    setWantPaymentTracking(value);
    setIncludeFinancialStage(value === 'yes');
  };

  const handleAddStage = () => {
    const values = newStageInput
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    if (values.length === 0) return;

    setCustomStages(prev => {
      const merged = [...prev];
      values.forEach(value => {
        if (!merged.includes(value)) merged.push(value);
      });
      return merged;
    });
    setNewStageInput('');
  };

  const handleAddFinancialStageName = () => {
    const values = financialStageInput
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    if (values.length === 0) return;

    setFinancialStageList(prev => {
      const merged = [...prev];
      values.forEach(value => {
        if (!merged.includes(value)) merged.push(value);
      });
      return merged;
    });
    setFinancialStageName(
      [...financialStageList, ...values.filter(value => !financialStageList.includes(value))].join(' -> ')
    );
    setFinancialStageInput('');
  };

  const handleRemoveStage = (index: number) => {
    setCustomStages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveStage = (index: number, direction: -1 | 1) => {
    setCustomStages(prev => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleMoveFinancialStage = (index: number, direction: -1 | 1) => {
    setFinancialStageList(prev => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setFinancialStageName(
      financialStageList.map((value, valueIndex) => valueIndex === index ? financialStageList[index + direction] : valueIndex === index + direction ? financialStageList[index] : value).join(' -> ')
    );
  };

  const handleRemoveFinancialStage = (index: number) => {
    setFinancialStageList(prev => prev.filter((_, idx) => idx !== index));
    setFinancialStageName(
      financialStageList.filter((_, idx) => idx !== index).join(' -> ')
    );
  };

  const handleLoadDemoStages = () => {
    setCustomStages([
      'Grid Feasibility Clearance',
      'Structural Single Line Diagram (SLD) Design',
      'Material Dispatch & Procurement',
      'Mounting Structure & Module Clamping',
      'Inverter Commissioning & Cabling',
      'DISCOM Joint Inspection & Net Meter Fitting'
    ]);
    setStagesStatus('configured');
  };

  // Dynamic Payment Methods operations
  const handleAddPaymentMethod = () => {
    if (!newPaymentInput.trim()) return;
    if (customPaymentMethods.includes(newPaymentInput.trim())) return;
    setCustomPaymentMethods(prev => [...prev, newPaymentInput.trim()]);
    setNewPaymentInput('');
  };

  const handleRemovePaymentMethod = (method: string) => {
    setCustomPaymentMethods(prev => prev.filter(m => m !== method));
  };

  // Submit specifications configuration
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!clientName.trim()) {
      errors.push('Please enter your full name (Customer Contact Person).');
    }
    if (!clientPhone.trim()) {
      errors.push('Please enter your primary mobile phone number.');
    }
    if (!companyName.trim()) {
      errors.push('Please enter your solar energy company name.');
    }

    if (stagesStatus === 'configured' && customStages.length > 0 && (customStages.length < 3 || customStages.length > 15)) {
      errors.push(`Please enter between 3 and 15 workflow stages, or choose "Consultation Needed". Currently: ${customStages.length} stages.`);
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFormErrors([]);

    const submission: ClientSubmission = {
      id: `spec_${Date.now()}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      companyName: companyName.trim(),
      submittedAt: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      sections: JSON.parse(JSON.stringify(sections)),
      stages: stagesStatus === 'configured' ? customStages : [],
      stagesStatus,
      financialCalculationsUnderstood: financialsStatus === 'configured',
      customNotes: customNotes.trim(),
      branchList: hasMultipleBranches ? branchList : [],
      websiteAddress: hasWebsite ? websiteAddress.trim() : undefined,
      hasWebsite: hasWebsite === true,
      liveProjectsCount,
      backendEmail: backendEmail.trim(),
      backendPassword: backendPassword.trim(),
      userCount,
      adminUserCount,
      salesUserCount,
      financeUserCount,
      financialRoleViewPermission,
      crnTrackingType,
      crnScope,
      crnPrefix: crnTrackingType !== 'skipped' ? crnPrefix : undefined,
      crnConfirmed,
      staffConfirmed
    };

    setActiveSubmission(submission);

    setEmailStatus('sending');
    try {
        const cleanJsonPayload = {
          companyName: submission.companyName,
          clientName: submission.clientName,
          clientPhone: submission.clientPhone,
          clientEmail: submission.clientEmail,
          submittedAt: submission.submittedAt,
          userCount: submission.userCount,
          adminUserCount: submission.adminUserCount,
          salesUserCount: submission.salesUserCount,
          financeUserCount: submission.financeUserCount,
          hasWebsite: submission.hasWebsite,
          websiteAddress: submission.websiteAddress,
          liveProjectsCount: submission.liveProjectsCount,
          hasMultipleBranches: hasMultipleBranches,
          branchList: hasMultipleBranches ? branchList : [],
          crnTrackingType: submission.crnTrackingType,
          crnScope: submission.crnScope,
          crnPrefix: submission.crnPrefix,
          stagesStatus: submission.stagesStatus,
          customStages: submission.stages,
          includeFinancialStage: includeFinancialStage,
          financialStageName: includeFinancialStage ? financialStageName : '',
          financialsStatus: financialsStatus,
          paymentMethods: customPaymentMethods,
          subsidyEnabled: subsidyEnabled,
          bankInfoEnabled: bankInfoEnabled,
          financialRoleViewPermission: submission.financialRoleViewPermission,
          customNotes: submission.customNotes,
          modules: submission.sections.map(sec => ({
            id: sec.id,
            title: sec.title,
            description: sec.description,
            enabled: sec.id === 'subsidy_status_history' ? subsidyEnabled : sec.id === 'bank_info' ? bankInfoEnabled : sec.id === 'financials' ? (financialsStatus === 'configured') : true,
            fields: sec.fields.map(f => ({
              id: f.id,
              label: f.label,
              description: f.description,
              included: f.included,
              fieldType: f.fieldType || 'text',
              isCustom: !!f.isCustom,
              dropdownOptions: f.dropdownOptions || ''
            }))
          }))
        };

        const jsonBlob = new Blob([JSON.stringify(cleanJsonPayload, null, 2)], { type: 'application/json' });
        
        const formData = new FormData();
        formData.append('attachment', jsonBlob, `${submission.companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_spec_blueprint.json`);
        formData.append('_subject', `📩 Solar CRM Configurator Blueprint Submission: ${submission.companyName} (${submission.clientPhone})`);
        formData.append('Company Name', submission.companyName);
        formData.append('Contact Person', submission.clientName);
        formData.append('Phone Number', submission.clientPhone);
        formData.append('Email Address', submission.clientEmail || 'Not Specified');
        formData.append('Has Website', submission.hasWebsite ? `Yes (${submission.websiteAddress})` : 'No');
        formData.append('Live Projects Count', submission.liveProjectsCount || 'Not Specified');
        formData.append('Total Staff Users', submission.userCount || 'Not Specified');
        formData.append('CRN / Project ID Tracking', submission.crnTrackingType === 'default'
          ? `Auto-Increment (${
              submission.crnScope === 'crn'
                ? 'CRN Only'
                : submission.crnScope === 'project'
                ? 'Project ID Only'
                : 'Both CRN & Project ID'
            }, Prefix: ${submission.crnPrefix})`
          : 'Skipped');
        formData.append('CRM Admin Login Email', submission.backendEmail || 'Not Specified');
        formData.append('CRM Admin Login Password', submission.backendPassword || 'Not Specified');
        formData.append('Financial Role View Permission', submission.financialRoleViewPermission === 'all' ? 'Can view all modules (read-only)' : 'None (restricted)');
        formData.append('Branches setup', hasMultipleBranches ? `Multiple: ${branchList.join(', ')}` : 'Single Branch');
        formData.append('Workflow Pipeline Sequence', stagesStatus === 'configured' ? customStages.join(' -> ') : 'Expert recommendations requested');
        formData.append('Financial Ledger Tracked', financialsStatus === 'configured' ? 'Yes' : 'No');
        formData.append('Include Final Payout Stage', includeFinancialStage ? `Yes (${financialStageName})` : 'No');
        formData.append('Payment Methods Allowed', customPaymentMethods.join(', '));
        formData.append('Government Subsidy Status History', subsidyEnabled ? 'Enabled' : 'Bypassed');
        formData.append('Customer Bank Info & Loans Coordination', bankInfoEnabled ? 'Enabled' : 'Bypassed');
        formData.append('General Comments & Custom Notes', submission.customNotes || 'None');
        formData.append('Submission Time (UTC)', submission.submittedAt);
        formData.append('_honey', '');
        formData.append('_template', 'table');

        const formSubmitRes = await fetch('https://formsubmit.co/ajax/enquiry@mahvishsadaf.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        if (formSubmitRes.ok) {
          setEmailStatus('success');
        } else {
          setEmailStatus('failed');
        }
      } catch (submitErr) {
        console.error('FormSubmit transmission failed:', submitErr);
        setEmailStatus('failed');
      }
    };

  // Generate plain-text Markdown structure to copy/download
  const getRawMarkdown = () => {
    if (!activeSubmission) return '';
    let md = `# Solar CRM Requirements Specification Sheet\n\n`;
    
    md += `## 📋 Client Profile & Operational Parameters\n`;
    md += `- **Installer Company**: ${activeSubmission.companyName}\n`;
    md += `- **Primary Contact Name**: ${activeSubmission.clientName}\n`;
    md += `- **Contact Phone**: ${activeSubmission.clientPhone}\n`;
    md += `- **Contact Email**: ${activeSubmission.clientEmail || 'N/A'}\n`;
    md += `- **Configured At**: ${activeSubmission.submittedAt}\n\n`;

    md += `## 🌐 Hosting & System Scale Configuration\n`;
    md += `- **Has Website**: ${activeSubmission.hasWebsite ? `Yes (${activeSubmission.websiteAddress})` : 'No (To be hosted on dynamic cloud domain)'}\n`;
    md += `- **Active/Live Projects**: ${activeSubmission.liveProjectsCount || 'Not specified'}\n`;
    md += `- **Total System Users / Staff**: ${activeSubmission.userCount || 'Not specified'}\n`;
    md += `- **CRN / Project ID Tracking Mode**: ${
      activeSubmission.crnTrackingType === 'default'
        ? `Auto-Increment (${
            activeSubmission.crnScope === 'crn'
              ? 'CRN Only'
              : activeSubmission.crnScope === 'project'
              ? 'Project ID Only'
              : 'Both CRN & Project ID'
          }, Prefix: "${activeSubmission.crnPrefix || 'CRN-2026-'}")`
        : 'Skipped'
    }\n\n`;

    md += `## 🔐 Requested Backend Setup Credentials\n`;
    md += `- **Created CRM Admin Email**: ${activeSubmission.backendEmail || 'Not specified'}\n`;
    md += `- **Created CRM Admin Password**: ${activeSubmission.backendPassword || 'Not specified'}\n`;
    md += `  *(This account will be pre-configured as the master administrator for database and backend server environment provisioning)*\n\n`;

    md += `## 👥 User Roles & Access Control Levels\n`;
    md += `1. **Admin Role**: All Access (Full read, write, edit, delete on Customer Details, Project Metrics, Subsidy, Bank Info, Financials, and Pipeline stages).\n`;
    md += `2. **Financial Role**: Can only edit Payment Details & Ledger inputs. \n`;
    md += `   - *Viewing rights to other CRM tables:* ${activeSubmission.financialRoleViewPermission === 'all' ? 'Can VIEW all other fields (read-only)' : 'Cannot VIEW other fields (None - view-restricted)'}\n`;
    md += `3. **Sales Role**: Can view and edit all Customer registry, survey data, project metrics, and pipeline stages, but has ZERO access to edit any financial calculation field or ledger records.\n\n`;

    md += `## 🗄️ Database Table Layouts & Field Approvals\n\n`;

    activeSubmission.sections.forEach(sec => {
      // Check if section is bypassed
      if (sec.id === 'subsidy_status_history' && !subsidyEnabled) return;
      if (sec.id === 'bank_info' && !bankInfoEnabled) return;
      if (sec.id === 'financials' && financialsStatus === 'skipped') return;

      md += `### Module: ${sec.title}\n`;
      md += `${sec.description}\n\n`;

      if (sec.id === 'customers' && hasMultipleBranches) {
        md += `**Branch Offices Configured:** ${branchList.join(', ')}\n\n`;
      }

      const approved = sec.fields.filter(f => f.included);
      const deleted = sec.fields.filter(f => !f.included);

      md += `**Approved Fields:**\n`;
      if (approved.length === 0) {
        md += `*No fields selected.*\n`;
      } else {
        approved.forEach(f => {
          const fType = f.fieldType || 'text';
          const formatStr = fType === 'dropdown' ? `Dropdown List (${f.dropdownOptions || 'no options specified'})` : `${fType.toUpperCase()} Field`;
          
          md += `- **${f.label}** (\`${f.id}\`${f.isCustom ? ', Custom Field' : ''}): ${f.description}\n`;
          md += `  - *Input Component:* ${formatStr}\n`;
          if (f.notes.trim()) {
            md += `  - *Operational Notes / Options:* "${f.notes.trim()}"\n`;
          }
        });
      }

      if (deleted.length > 0) {
        md += `\n**Deleted Fields (Do Not Include):**\n`;
        md += deleted.map(f => `- ~~${f.label}~~ (\`${f.id}\`)`).join('\n') + `\n`;
      }
      md += `\n---\n\n`;
    });

    md += `## ⛓️ Installation Pipeline Workflow Stages\n`;
    if (activeSubmission.stagesStatus === 'configured' && activeSubmission.stages.length > 0) {
      md += `The client configured their own custom chronological solar installation sequence:\n\n`;
      activeSubmission.stages.forEach((stage, idx) => {
        md += `${idx + 1}. **${stage}**\n`;
      });
    } else if (activeSubmission.stagesStatus === 'dk') {
      md += `- Status: *Bypassed* (Client requested standard CRM pre-designed milestones or demo setup).\n`;
    }
    md += `- **Include Financial Milestones:** ${includeFinancialStage ? `Yes, track custom milestone "${financialStageName}"` : 'No'}\n\n`;

    md += `## 💵 Payments & Receivable Calculations\n`;
    md += `- Calculations: **Fully Automated** (Receivable balance auto-updates depending on Quoted Amount, Discount, and Payments entered).\n`;
    md += `- Accepted Payment Methods: ${customPaymentMethods.join(', ')}\n\n`;

    if (activeSubmission.customNotes) {
      md += `## 💬 Installer Extra Remarks\n`;
      md += `"${activeSubmission.customNotes}"\n`;
    }

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(getRawMarkdown());
    setIsCopySuccess(true);
    setTimeout(() => setIsCopySuccess(false), 2500);
  };

  const handleDownloadJSON = () => {
    if (!activeSubmission) return;
    const jsonStr = JSON.stringify(activeSubmission, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeSubmission.companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_solar_crm_spec.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If NOT sessionActive, show the beautiful phone-number based welcome / login screen
  if (!sessionActive) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-slate-900 font-sans antialiased">
        <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-6 relative">
            <div className="mx-auto w-16 h-16 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
              <Sun className="w-9 h-9 text-amber-950 animate-spin-slow" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Solar CRM Configurator</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 font-medium">Bespoke Requirements Discovery, Database & Stage Flow Planner</p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleClientStartOrResume(phoneInput, accessIdInput);
            }} 
            className="space-y-4 relative z-10"
          >
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-amber-400 uppercase tracking-wider">
                  Step 1: Your Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. +1 555-0199 or 987654321"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-amber-400 uppercase tracking-wider">
                  Step 2: Access ID / Passcode
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="password"
                    value={accessIdInput}
                    onChange={(e) => setAccessIdInput(e.target.value)}
                    placeholder="Create or enter your Access ID/Pin"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition font-bold"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  🔒 This locks your session so only you can access, edit, or submit this specific solar requirements form.
                </p>
              </div>
            </div>

            {phoneError && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{phoneError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2"
            >
              Access Secure Workspace
              <ChevronRight className="w-4 h-4 text-slate-950 stroke-[3]" />
            </button>
          </form>
        </div>

        {/* Global Toast for Login Feedbacks */}
        {saveFeedback && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-xs font-bold">{saveFeedback}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-slate-900">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 py-3.5 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2.5 rounded-2xl text-slate-950 shadow-md">
              <Sun className="w-7 h-7 text-amber-950 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Solar CRM Requirements Planner</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Active Session
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Bespoke database schemas, stage flows & automatic calculation planner</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Auto-Saving Draft: <span className="font-bold text-emerald-950 font-mono">
                {clientPhone}
              </span>
            </div>
            <button
              onClick={() => {
                saveToLocalStorage(clientPhone, clientAccessId);
                setSessionActive(false);
                setClientPhone('');
                setClientAccessId('');
                setPhoneInput('');
                setAccessIdInput('');
                setSaveFeedback('Logged out successfully.');
                setTimeout(() => setSaveFeedback(''), 2500);
              }}
              className="text-xs font-black uppercase tracking-wider text-red-600 hover:text-white hover:bg-red-500 bg-white px-4 py-2.5 rounded-xl transition border border-red-200 shadow-3xs cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Global Auto-save Notification Toast */}
      {saveFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-xs font-bold">{saveFeedback}</span>
          <button 
            onClick={() => setSaveFeedback('')}
            className="text-slate-400 hover:text-white font-bold ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        
        {/* If Form has not been submitted yet */}
        {!activeSubmission ? (
          (
            <div className="space-y-8">
            
            {/* Guide Info Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 max-w-4xl">
                <span className="bg-amber-400/20 text-amber-300 text-[10.5px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-400/20">
                  Dynamic Specification Tool
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-3 tracking-tight leading-tight">
                  Design Your Dream Solar CRM Blueprint
                </h2>
                <p className="mt-2.5 text-slate-300 text-sm sm:text-base leading-relaxed">
                  We design custom operational CRMs specifically optimized for Solar Installers. Review this form line-by-line:
                  <strong> Approve (Keep)</strong> modules that matter to your business, <strong>Delete (Remove)</strong> the ones you don't use, and add your own custom stages or variables.
                </p>
              </div>
            </div>

            {/* Error notifications */}
            {formErrors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-800">Please correct the following errors before submitting:</h4>
                  <ul className="list-disc list-inside text-xs text-red-700 mt-1 space-y-1">
                    {formErrors.map((err, idx) => (
                      <li key={idx} className="font-semibold">{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmitForm} className="space-y-8">

              {/* TAB NAVIGATION - SLIDING PILL */}
              {(() => {
                const tabs: { label: string; icon: string; hidden?: boolean }[] = [
                  { label: 'Profile', icon: '👤' },
                  { label: 'Security', icon: '🔒' },
                  { label: 'Pipeline', icon: '🚀' },
                  { label: 'Customers', icon: '🧑‍💼' },
                  { label: 'Projects', icon: '🏗️' },
                  { label: 'Finance', icon: '💰' },
                  { label: 'Submit', icon: '✅' },
                ];
                const visibleTabs = tabs.filter(t => !t.hidden);
                return (
                  <div className="sticky top-0 z-20 -mx-6 sm:-mx-8 px-3 sm:px-4 py-2 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-sm mb-4 rounded-t-3xl overflow-x-auto">
                    <div className="flex gap-1 min-w-max p-1 bg-slate-100 rounded-2xl w-fit">
                      {visibleTabs.map((tab, i) => {
                        const realIdx = tabs.indexOf(tab);
                        return (
                          <button
                            key={realIdx}
                            type="button"
                            onClick={() => { setCurrentTab(realIdx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className={`relative px-3.5 py-1.5 text-[11px] font-black transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 rounded-xl ${
                              currentTab === realIdx
                                ? 'bg-white text-slate-900 shadow-sm scale-[1.02]'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <span className="text-sm leading-none">{tab.icon}</span>
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}


              {/* --- TAB 0 --- */}
              {currentTab === 0 && (
              <div className="space-y-6">
              {/* TOP LEVEL CONTACT PANEL */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                    1. Installer Identity & Primary Contacts
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g., Rajesh Sharma"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g., +91 98765 43210"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Solar Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., Peak Solar Power"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g., info@peaksolar.in"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition font-medium"
                    />
                  </div>
                </div>

                {/* Operational Info Fields with confirm-to-view behavior */}
                <div className="mt-5 pt-5 border-t border-slate-100 space-y-4">
                  {opsInfoConfirmed ? (
                    // VIEW ONLY mode
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Operational Overview</span>
                        <button
                          type="button"
                          onClick={() => setOpsInfoConfirmed(false)}
                          className="flex items-center gap-1 text-[11px] font-black text-slate-400 hover:text-indigo-600 transition"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {liveProjectsCount && (
                          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Live Active Projects</p>
                            <p className="text-sm font-bold text-slate-800">{liveProjectsCount}</p>
                          </div>
                        )}
                        {totalProjectsCount && (
                          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Total Projects Till Date</p>
                            <p className="text-sm font-bold text-slate-800">{totalProjectsCount}</p>
                          </div>
                        )}
                        {softwaresUsed && (
                          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Softwares Used</p>
                            <p className="text-sm font-bold text-slate-800">{softwaresUsed}</p>
                          </div>
                        )}
                      </div>
                      {sheetLinks.filter(l => l.trim()).length > 0 && (
                        <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Google Sheet View Links</p>
                          {sheetLinks.filter(l => l.trim()).map((link, i) => (
                            <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                              className="block text-xs font-semibold text-indigo-600 hover:text-indigo-800 truncate underline decoration-indigo-200">
                              {link}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // EDIT mode
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Live Active Projects <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={liveProjectsCount}
                            onChange={(e) => setLiveProjectsCount(e.target.value)}
                            placeholder="e.g. 42"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Total Projects Till Date
                          </label>
                          <input
                            type="number"
                            value={totalProjectsCount}
                            onChange={(e) => setTotalProjectsCount(e.target.value)}
                            placeholder="e.g. 340"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Softwares Currently Used
                          </label>
                          <input
                            type="text"
                            value={softwaresUsed}
                            onChange={(e) => setSoftwaresUsed(e.target.value)}
                            placeholder="e.g. Excel, Tally, WhatsApp"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition font-medium"
                          />
                        </div>
                      </div>

                      {/* Google Sheet Links - dynamic add/remove */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Google Sheet View Link(s)
                          <span className="ml-1 text-[10px] font-semibold text-slate-400 normal-case">(paste one or more view-only links)</span>
                        </label>
                        {sheetLinks.map((link, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => {
                                const updated = [...sheetLinks];
                                updated[i] = e.target.value;
                                setSheetLinks(updated);
                              }}
                              placeholder={`Sheet link ${i + 1} - e.g. https://docs.google.com/spreadsheets/...`}
                              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition font-medium"
                            />
                            {sheetLinks.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setSheetLinks(prev => prev.filter((_, idx) => idx !== i))}
                                className="px-2 py-2 border border-rose-200 hover:bg-rose-50 text-rose-500 rounded-xl transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setSheetLinks(prev => [...prev, ''])}
                          className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                        >
                          <span className="text-base leading-none">+</span> Add another sheet link
                        </button>
                      </div>

                      {/* Confirm button */}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (!liveProjectsCount.trim()) return;
                            setOpsInfoConfirmed(true);
                          }}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Backend Credentials - gated by admin dashboard */}
                {adminShowCredentials && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 border border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-start gap-3">
                      <Key className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-amber-300 block">Create Admin Backend Credentials</span>
                        <span className="text-xs text-slate-400 block leading-relaxed">
                          Kindly provide a new email address and master password. Developers will use these to host, bootstrap, and secure your database backend. This will also serve as your master admin account.
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          New CRM Admin Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={backendEmail}
                          onChange={(e) => setBackendEmail(e.target.value)}
                          placeholder="e.g., admin@peaksolar.in"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs focus:border-amber-400 outline-none transition font-medium text-white placeholder-slate-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          New Master Password <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={backendPassword}
                          onChange={(e) => setBackendPassword(e.target.value)}
                          placeholder="Create a secure password..."
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs focus:border-amber-400 outline-none transition font-medium text-white placeholder-slate-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Two Key Product Questions + Project Type + Finance Tags */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                  {/* Project Type - gated by admin */}
                  {adminShowProjectTypes && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Project Type(s) You Handle
                      <span className="ml-1 text-[10px] font-semibold text-slate-400 normal-case">(select all that apply)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Government / PSU', 'Hybrid / Off-grid'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setProjectType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                            projectType.includes(type)
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  )}
                  {/* Q5: Other features / workflow issues */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Any other features or workflow issues to address?
                    </label>
                    <textarea
                      value={extraFeatureNotes}
                      onChange={(e) => setExtraFeatureNotes(e.target.value)}
                      placeholder="e.g. We need automatic follow-up reminders, site photo uploads, or WhatsApp alerts for overdue payments..."
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 outline-none transition font-medium resize-none"
                    />
                  </div>
                </div>

                {/* Pipeline Stages + Financial Stage Quick-View Tags */}
                {(customStages.length > 0 || stagesStatus === 'dk' || financialsStatus !== 'configured') && (
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mr-1">Pipeline:</span>
                    {stagesStatus === 'dk' ? (
                      <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-black">
                        Skip / Expert-defined
                      </span>
                    ) : customStages.length === 0 ? (
                      <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full font-semibold">
                        No stages added yet
                      </span>
                    ) : (
                      customStages.map((stage, i) => (
                        <span key={i} className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-semibold truncate max-w-[120px]" title={stage}>
                          {stage}
                        </span>
                      ))
                    )}
                    <span className="ml-3 text-[10px] font-black text-slate-400 uppercase tracking-wider mr-1">Financial:</span>
                    {financialsStatus === 'configured' ? (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-black">
                        {includeFinancialStage ? financialStageName || 'Financial Stage' : 'No Financial Stage'}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full font-semibold">
                        Skipped
                      </span>
                    )}
                  </div>
                )}
              </div>


              {/* BOTTOM NAV - Prev / Next */}
              <div className="flex items-center justify-between pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => { setCurrentTab(prev => Math.max(0, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-5 py-2.5 text-xs font-black rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition flex items-center gap-1.5 ${currentTab === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  ← Prev
                </button>
                <span className="text-[11px] text-slate-400 font-semibold">{`${currentTab + 1} / 7`}</span>
                {currentTab < 6 ? (
                  <button
                    type="button"
                    onClick={() => { setCurrentTab(prev => Math.min(6, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-5 py-2.5 text-xs font-black rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    Next →
                  </button>
                ) : (
                  <span />
                )}
              </div>

              </div>
              )}

              {/* --- TAB 1 --- */}
              {currentTab === 1 && (
              <div className="space-y-6">
              {/* SECTION: HOSTING, SCALING & OPERATIONAL SECURITY PROFILE */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                    2. Hosting, Scaling & Operational Security Profile
                  </h3>
                </div>

                {/* 1) Website and CRM Hosting URL - gated by admin */}
                {adminShowWebsite && (
                <div className="space-y-4">
                  {websiteConfirmed ? (
                    <div className="py-2 px-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/15 hover:bg-emerald-50/40 transition-all flex items-center justify-between gap-3 text-xs shadow-3xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-1.5 min-w-0">
                          <span className="font-extrabold text-slate-800">
                            Hosting Configuration:
                          </span>
                          <span className="font-semibold text-slate-600 truncate">
                            {hasWebsite === true ? `Domain (${websiteAddress})` : 'Cloud Hosting (No Existing Website)'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWebsiteConfirmed(false)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-lg transition-all flex items-center gap-1 shrink-0"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-black text-slate-500 hover:text-indigo-700">Edit</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">Do you have an active company website address?</span>
                            <span className="text-xs text-slate-500 mt-0.5 block">This domain configuration will be used to host your custom CRM.</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setHasWebsite(true);
                                setWebsiteConfirmed(false);
                              }}
                              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border ${
                                hasWebsite === true
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              Yes, I have a website
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setHasWebsite(false);
                                setWebsiteAddress('');
                              }}
                              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border ${
                                hasWebsite === false
                                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              No, configure cloud hosting
                            </button>
                          </div>
                        </div>
                      </div>

                      {hasWebsite === true && (
                        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 sm:p-5 space-y-2 animate-fade-in">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Enter Website Address (URL) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="url"
                            value={websiteAddress}
                            onChange={(e) => setWebsiteAddress(e.target.value)}
                            placeholder="e.g., https://www.peaksolar.in"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                          />
                          <p className="text-[11px] text-slate-400 font-medium font-mono">
                            🔗 Landing origin for binding custom dashboard sub-domains.
                          </p>
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (hasWebsite === true && !websiteAddress.trim()) {
                              setSaveFeedback('Please enter your website URL address first!');
                              setTimeout(() => setSaveFeedback(''), 2500);
                              return;
                            }
                            if (hasWebsite === null) {
                              setSaveFeedback('Please choose a website option first!');
                              setTimeout(() => setSaveFeedback(''), 2500);
                              return;
                            }
                            setWebsiteConfirmed(true);
                            setSaveFeedback('Website hosting selection confirmed!');
                            setTimeout(() => setSaveFeedback(''), 2500);
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )}

                {/* 1.5) Customer Reference Number (CRN) & Project ID Tracking Model */}
                <div className="space-y-4">
                  {crnConfirmed ? (
                    <div className="py-2.5 px-3.5 sm:px-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40 transition-all animate-fade-in flex items-center justify-between gap-3 text-xs shadow-3xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-1.5 min-w-0">
                          <span className="font-extrabold text-slate-800">
                            Tracking:
                          </span>
                          <span className="font-semibold text-slate-600 truncate">
                            {crnTrackingType === 'skipped' ? (
                              'Skipped (No CRN or Project ID tracking)'
                            ) : (
                              `Auto-increment tracker [${
                                crnScope === 'crn'
                                  ? 'CRN Only'
                                  : crnScope === 'project'
                                  ? 'Project ID Only'
                                  : 'Both CRN & Project ID'
                              }] with prefix "${crnPrefix}"`
                            )}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCrnConfirmed(false)}
                        className="p-1 px-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                        title="Edit CRN setup"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px] font-black text-slate-500 hover:text-indigo-700">Edit</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200/85 rounded-2xl p-5 sm:p-6 space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-slate-950 block">
                          Configure Customer Reference Number (CRN) & Project ID Tracking
                        </span>
                        <span className="text-xs text-slate-500 block leading-relaxed">
                          Specify how your CRM should automatically assign and track individual client reference codes or Project IDs.
                        </span>
                      </div>
                      
                      {/* What would you like to track choice block */}
                      <div className="space-y-2 pt-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Select What to Track <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setCrnScope('crn')}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                              crnScope === 'crn'
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span className="block text-xs font-black">🔢 CRN Only</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCrnScope('project')}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                              crnScope === 'project'
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span className="block text-xs font-black">📁 Project ID Only</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCrnScope('both')}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                              crnScope === 'both'
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span className="block text-xs font-black">⚡ Both CRN & Project ID</span>
                          </button>
                        </div>
                      </div>

                      {/* Sequence Prefix configuration block */}
                      <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Custom Sequence Prefix <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={crnPrefix}
                            onChange={(e) => setCrnPrefix(e.target.value)}
                            placeholder="e.g., CRN-2026-"
                            className="w-full sm:max-w-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                          />
                          <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-2.5 flex items-center text-[10px] text-slate-500 font-mono">
                            💡 Sample code output: <strong className="text-slate-800 ml-1.5 font-bold">{crnPrefix}001</strong>
                          </div>
                        </div>
                      </div>

                      {/* Unified Action Block for CRN Setup */}
                      <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row gap-2 justify-end items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setCrnTrackingType('skipped');
                            setCrnConfirmed(true);
                            setSaveFeedback('Skipped CRN & Project ID tracking.');
                            setTimeout(() => setSaveFeedback(''), 2500);
                          }}
                          className="w-full sm:w-auto px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Default
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (!crnPrefix.trim()) {
                              setSaveFeedback('Please enter a custom sequence prefix!');
                              setTimeout(() => setSaveFeedback(''), 2500);
                              return;
                            }
                            setCrnTrackingType('default');
                            setCrnConfirmed(true);
                            setSaveFeedback('Tracking configuration confirmed!');
                            setTimeout(() => setSaveFeedback(''), 2500);
                          }}
                          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Confirm Tracking Setup
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2) & 4) Operational Scaling parameters */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {staffConfirmed ? (
                    <div className="bg-emerald-50/20 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden animate-fade-in shadow-3xs">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Staff Users Confirmed</span>
                            <span className="text-xs font-black text-slate-800 truncate">
                              Total Users: {userCount || 'Not Specified'}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStaffConfirmed(false)}
                          className="px-2.5 py-1.5 text-[11px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Edit className="w-3 h-3 text-indigo-600" />
                          Edit
                        </button>
                      </div>
                      
                      {(adminUserCount || salesUserCount || financeUserCount) && (
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-100 text-[11px] font-bold">
                          {adminUserCount && <div className="text-red-700 bg-red-50/60 p-1.5 rounded-lg border border-red-100/50 text-center truncate">Admin: {adminUserCount}</div>}
                          {salesUserCount && <div className="text-orange-700 bg-orange-50/60 p-1.5 rounded-lg border border-orange-100/50 text-center truncate">Sales: {salesUserCount}</div>}
                          {financeUserCount && <div className="text-teal-700 bg-teal-50/60 p-1.5 rounded-lg border border-teal-100/50 text-center truncate">Finance: {financeUserCount}</div>}
                        </div>
                      )}
                    </div>
                  ) : (
                     <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-3 animate-fade-in sm:col-span-2">
                       <div className="flex items-center gap-3">
                         <label className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">Staff Count <span className="text-red-500">*</span></label>
                         <input
                           type="text"
                           required
                           value={userCount}
                           onChange={(e) => setUserCount(e.target.value)}
                           placeholder="e.g., 12 total"
                           className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                         />
                       </div>
                       
                      {/* Role access breakout counts */}
                      <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-3">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Access Seats Breakout (Optional):
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-red-600 uppercase tracking-wider">
                              Admin Seats
                            </label>
                            <input
                              type="text"
                              value={adminUserCount}
                              onChange={(e) => setAdminUserCount(e.target.value)}
                              placeholder="e.g., 2"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-orange-600 uppercase tracking-wider">
                              Sales Seats
                            </label>
                            <input
                              type="text"
                              value={salesUserCount}
                              onChange={(e) => setSalesUserCount(e.target.value)}
                              placeholder="e.g., 8"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-teal-600 uppercase tracking-wider">
                              Finance Seats
                            </label>
                            <input
                              type="text"
                              value={financeUserCount}
                              onChange={(e) => setFinanceUserCount(e.target.value)}
                              placeholder="e.g., 2"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 mb-2">
                        <input
                          type="checkbox"
                          id="confirmStaffCheckbox"
                          checked={staffCheckboxConfirmed}
                          onChange={(e) => setStaffCheckboxConfirmed(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                        />
                        <label htmlFor="confirmStaffCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                          I confirm these staff options are correct
                        </label>
                      </div>

                      <button
                        type="button"
                        disabled={!staffCheckboxConfirmed}
                        onClick={() => {
                          if (!userCount.trim()) {
                            setSaveFeedback('Please enter the number of staff users first!');
                            setTimeout(() => setSaveFeedback(''), 2500);
                            return;
                          }
                          setStaffConfirmed(true);
                          setSaveFeedback('Staff configuration confirmed & locked!');
                          setTimeout(() => setSaveFeedback(''), 2500);
                        }}
                        className={`w-full px-4 py-2 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs ${
                          staffCheckboxConfirmed 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-98' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        Confirm
                      </button>
                    </div>
                  )}
                </div>

                {/* 5) Access Control / Levels of Logins */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-widest block">System Security & Login Levels Hierarchy</span>
                      <span className="text-[11px] text-slate-500">Define role permissions and access hierarchies for your CRM system:</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSecurityDetails(!showSecurityDetails)}
                      className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5"
                    >
                      {showSecurityDetails ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </>
                      )}
                    </button>
                  </div>

                  {showSecurityDetails && (
                    <div className="space-y-5 animate-fade-in">

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {securityLevels.map((level, index) => (
                      <div key={level.id} className="bg-white border border-slate-200/70 rounded-xl p-4 space-y-2.5 shadow-2xs relative flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${level.id === 'admin' ? 'bg-red-500' : level.id === 'sales' ? 'bg-orange-500' : level.id === 'finance' ? 'bg-teal-500' : 'bg-indigo-500'}`}></span>
                              <span className="text-xs font-extrabold text-slate-800 uppercase">{index + 1}. {level.name}</span>
                            </div>
                            {level.isCustom && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSecurityLevels(prev => prev.filter(l => l.id !== level.id));
                                  setSaveFeedback(`Removed custom role: ${level.name}`);
                                  setTimeout(() => setSaveFeedback(''), 2500);
                                }}
                                className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition"
                                title="Delete Custom Role"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                            {level.description}
                          </p>
                        </div>

                        {level.id === 'finance' && (
                          <div className="pt-2 border-t border-slate-100">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                              Should Finance view other data?
                            </label>
                            <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                              <button
                                type="button"
                                onClick={() => setFinancialRoleViewPermission('all')}
                                className={`py-1 text-[10px] font-bold rounded transition ${
                                  financialRoleViewPermission === 'all'
                                    ? 'bg-indigo-600 text-white shadow-3xs'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                View All
                              </button>
                              <button
                                type="button"
                                onClick={() => setFinancialRoleViewPermission('none')}
                                className={`py-1 text-[10px] font-bold rounded transition ${
                                  financialRoleViewPermission === 'none'
                                    ? 'bg-slate-800 text-white shadow-3xs'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                View None
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add option to add more levels */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                      + Add Custom Access Level / Security Role
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Role/Level Name
                        </label>
                        <input
                          type="text"
                          value={newLevelName}
                          onChange={(e) => setNewLevelName(e.target.value)}
                          placeholder="e.g. Site Surveyor, Technical Auditor"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Short Description of Permissions
                        </label>
                        <input
                          type="text"
                          value={newLevelDesc}
                          onChange={(e) => setNewLevelDesc(e.target.value)}
                          placeholder="e.g. Can view site specs and upload field measurements only."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newLevelName.trim() || !newLevelDesc.trim()) {
                            alert('Please enter both role name and description.');
                            return;
                          }
                          const newRole = {
                            id: `custom_${Date.now()}`,
                            name: newLevelName.trim(),
                            description: newLevelDesc.trim(),
                            color: 'bg-indigo-500 text-white',
                            isCustom: true
                          };
                          setSecurityLevels(prev => [...prev, newRole]);
                          setNewLevelName('');
                          setNewLevelDesc('');
                          setSaveFeedback(`Created custom role: ${newRole.name}`);
                          setTimeout(() => setSaveFeedback(''), 2500);
                        }}
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Security Level
                      </button>
                    </div>
                  </div>
                    </div>
                  )}
                </div>
              </div>


              {/* BOTTOM NAV - Prev / Next */}
              <div className="flex items-center justify-between pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => { setCurrentTab(prev => Math.max(0, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-5 py-2.5 text-xs font-black rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition flex items-center gap-1.5 ${currentTab === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  ← Prev
                </button>
                <span className="text-[11px] text-slate-400 font-semibold">{`${currentTab + 1} / 7`}</span>
                {currentTab < 6 ? (
                  <button
                    type="button"
                    onClick={() => { setCurrentTab(prev => Math.min(6, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-5 py-2.5 text-xs font-black rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    Next →
                  </button>
                ) : (
                  <span />
                )}
              </div>

              </div>
              )}

              {/* --- TAB 2 --- */}
              {currentTab === 2 && (
              <div className="space-y-6">
              {/* SECTION: WORKFLOW PIPELINE STAGES - No Preloaded Options */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-amber-600" />
                      <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                        4. Project Workflow Pipeline (3 to 15 milestones)
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {customStages.length} Stages Configured
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Kindly enter the physical or administrative stages of your installation. To make your CRM lightweight, there are **no preloaded options** - you either write your own exact sequence, skip tracking, or load a demo/suggested structure.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStagesStatus('configured');
                      setCustomStages([]);
                    }}
                    className={`flex-1 px-4 py-3 rounded-2xl text-xs font-bold border transition text-center ${
                      stagesStatus === 'configured'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    🚀 Enter My Own Workflow Sequence
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStagesStatus('dk');
                      setCustomStages([]);
                    }}
                    className={`flex-1 px-4 py-3 rounded-2xl text-xs font-bold border transition text-center ${
                      stagesStatus === 'dk'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    🤷 I Don't Know / Consultation Needed
                  </button>
                </div>


                {stagesStatus === 'configured' && (
                  <div className="space-y-4 pt-2">
                    
                    {/* Add Stage Input Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                      <label className="block text-xs font-bold text-slate-700 uppercase">
                        Add Workflow Stage Sequence (comma separated)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newStageInput}
                          onChange={(e) => setNewStageInput(e.target.value)}
                          placeholder="e.g., Feasibility Clearance, Cable Laying, Net Meter installation"
                          className="flex-1 px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs focus:border-amber-500 outline-none transition font-medium text-slate-900"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddStage();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddStage}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Stages
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Use commas to add multiple stages at once. Must be between 3 and 15 stages.
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormatStagesAsNumbers(prev => !prev)}
                          className="text-[10px] font-bold text-indigo-600 hover:underline"
                        >
                          {formatStagesAsNumbers ? 'Plain List' : 'Numbered List'}
                        </button>
                      </div>
                    </div>

{/* Current Custom Stages List */}
                    {customStages.length > 0 ? (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          Active Installation Progression Checklist
                        </div>
                        <div className="divide-y divide-slate-100">
                          {customStages.map((stage, index) => (
                            <div key={index} className="px-4 py-3 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-black flex items-center justify-center">
                                  {formatStagesAsNumbers ? index + 1 : '•'}
                                </span>
                                <span className="text-xs font-bold text-slate-900">{stage}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveStage(index, -1)}
                                  className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition"
                                  aria-label="Move stage up"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveStage(index, 1)}
                                  className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition"
                                  aria-label="Move stage down"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStage(index)}
                                  className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                        <p className="text-xs text-slate-500 font-semibold">Your stage progression checklist is currently empty.</p>
                        <p className="text-[10px] text-slate-400 mt-1">Add your steps above, or click "Load Standard Demo Sequence" to populate reference points.</p>
                      </div>
                    )}

                  </div>
                )}
              </div>

                    {/* Financial Stage toggle - right below the Add Workflow input */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
                      <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex-1">Include Financial Stage / Approval Sequence?</span>
                      <div className="flex gap-1.5 shrink-0">
                        <button type="button" onClick={() => handleFinancialTrackingChoice('yes')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${wantPaymentTracking === 'yes' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'}`}>
                          Confirm
                        </button>
                        <button type="button" onClick={() => handleFinancialTrackingChoice('no')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${wantPaymentTracking === 'no' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'}`}>
                          Skip
                        </button>
                      </div>
                    </div>

                    {wantPaymentTracking === 'yes' && includeFinancialStage && (
                      <div className="bg-amber-50/20 border border-amber-200/50 rounded-2xl p-4 sm:p-5 space-y-3 animate-fade-in">
                        <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider">
                          Financial Stage / Approval Sequence (comma separated)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={financialStageInput}
                            onChange={(e) => setFinancialStageInput(e.target.value)}
                            placeholder="e.g., Billing Review, Final Approval, Payout Clearance"
                            className="flex-1 px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs focus:border-amber-500 outline-none transition font-medium text-slate-900"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddFinancialStageName();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddFinancialStageName}
                            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-500">Use commas to add multiple financial stages at once.</span>
                          <button
                            type="button"
                            onClick={() => setFormatStagesAsNumbers(prev => !prev)}
                            className="text-[10px] font-bold text-amber-700 hover:underline"
                          >
                            {formatStagesAsNumbers ? 'Plain List' : 'Numbered List'}
                          </button>
                        </div>
                        <div className="bg-white border border-slate-200/70 p-3 rounded-xl text-xs text-slate-700 shadow-2xs">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Active Stage Draft Preview:</span>
                          <div className="flex flex-col gap-2">
                            {financialStageList.map((name, index) => (
                              <div key={`${name}-${index}`} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center">
                                    {formatStagesAsNumbers ? index + 1 : '•'}
                                  </span>
                                  <span className="font-bold">{name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveFinancialStage(index, -1)}
                                    className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition"
                                    aria-label="Move financial stage up"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveFinancialStage(index, 1)}
                                    className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition"
                                    aria-label="Move financial stage down"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFinancialStage(index)}
                                    className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    

              {/* BOTTOM NAV - Prev / Next */}
              <div className="flex items-center justify-between pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => { setCurrentTab(prev => Math.max(0, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-5 py-2.5 text-xs font-black rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition flex items-center gap-1.5 ${currentTab === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  ← Prev
                </button>
                <span className="text-[11px] text-slate-400 font-semibold">{`${currentTab + 1} / 7`}</span>
                {currentTab < 6 ? (
                  <button
                    type="button"
                    onClick={() => { setCurrentTab(prev => Math.min(6, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-5 py-2.5 text-xs font-black rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    Next →
                  </button>
                ) : (
                  <span />
                )}
              </div>

              </div>
              )}

              {/* --- TAB 3 Customers --- */}
              {currentTab === 3 && (
              <div className="space-y-6">
              {/* SECTION: CUSTOMERS */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                      2. Customer Registry Fields
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomerSectionSkipped(prev => !prev)}
                    className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                      customerSectionSkipped
                        ? 'bg-rose-100 text-rose-700 border-rose-200'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {customerSectionSkipped ? '↩ Restore Section' : 'Skip Section'}
                  </button>
                </div>
                {customerSectionSkipped && (
                  <div className="text-center py-5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-500 font-semibold">Customer Registry section skipped.</p>
                  </div>
                )}
                {!customerSectionSkipped && (<>

                {/* Specialized Question: Branch Office */}
                <div className="space-y-4">
                  <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-sm font-bold text-amber-950 block">Do you operate from more than 1 branch office?</span>
                        <span className="text-xs text-amber-800/80 mt-0.5 block">If no, we will automatically clean up and remove the branch allocation tracking completely.</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleBranchToggle(true)}
                          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border ${
                            hasMultipleBranches === true
                              ? 'bg-amber-600 text-slate-950 border-amber-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          Yes, track branches
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBranchToggle(false)}
                          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border ${
                            hasMultipleBranches === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          No, remove branch field
                        </button>
                      </div>
                    </div>
                  </div>

                  {hasMultipleBranches === true && (
                    <div className="bg-amber-55 border border-amber-200/50 rounded-2xl p-4 sm:p-5 space-y-3 animate-fade-in">
                      <div>
                        <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Configure Your Branch Offices</span>
                        <span className="text-[11px] text-amber-850">Add the values of different branches you have:</span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newBranchInput}
                          onChange={(e) => setNewBranchInput(e.target.value)}
                          placeholder="e.g., Delhi Branch, Bangalore Office"
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:border-amber-500 outline-none transition font-medium text-slate-900"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddBranch();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddBranch}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Branch
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {branchList.map((branch, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 pl-3 pr-2 py-1 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2"
                          >
                            <span>{branch}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveBranch(branch)}
                              className="text-slate-400 hover:text-red-600 p-0.5 rounded-full hover:bg-red-50 transition"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Customers Fields List */}
                <div className="space-y-3">
                  {sections.find(s => s.id === 'customers')?.fields.map(field => renderFieldRow('customers', field))}
                </div>

                {/* Add Custom Field Button at the bottom */}
                {addingCustomFieldToSection !== 'customers' && (
                  <div className="flex justify-start pt-1">
                    <button
                      type="button"
                      onClick={() => setAddingCustomFieldToSection('customers')}
                      className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100/80 px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      Add Custom Field
                    </button>
                  </div>
                )}

                {/* Inline custom field addition panel */}
                {addingCustomFieldToSection === 'customers' && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-4 animate-fade-in">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Create Custom Customer Field</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={customFieldName}
                        onChange={(e) => setCustomFieldName(e.target.value)}
                        placeholder="Field Name (e.g., GSTIN Number)"
                        className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 outline-none transition bg-white"
                      />
                      <input
                        type="text"
                        value={customFieldDesc}
                        onChange={(e) => setCustomFieldDesc(e.target.value)}
                        placeholder="Short description / purpose"
                        className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 outline-none transition bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Field Input Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        {([
                          { id: 'text', label: '📝 Plain Text' },
                          { id: 'number', label: '🔢 Number' },
                          { id: 'date', label: '📅 Date' },
                          { id: 'dropdown', label: '🎯 Drop Down' }
                        ] as const).map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setCustomFieldType(t.id)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition ${
                              customFieldType === t.id
                                ? 'bg-indigo-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {customFieldType === 'dropdown' && (
                      <div className="space-y-1.5 animate-fade-in">
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                          Dropdown Options (separated with a comma) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customFieldDropdownOptions}
                          onChange={(e) => setCustomFieldDropdownOptions(e.target.value)}
                          placeholder="e.g. Option A, Option B, Option C"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 text-xs font-bold pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAddingCustomFieldToSection(null);
                          setCustomFieldType('text');
                          setCustomFieldDropdownOptions('');
                        }}
                        className="px-3 py-1.5 text-slate-500 hover:bg-slate-150 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddCustomField('customers')}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                      >
                        Save Custom Field
                      </button>
                    </div>
                  </div>
                )}
              </div>
                </>)}
              </div>

              </div>
              )}

              {/* --- TAB 4 (Projects) --- */}
              {currentTab === 4 && (
              <div className="space-y-6">
              {/* SECTION: PROJECTS */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-orange-600" />
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                      3. Solar Project Technical Details
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  ⚡ <strong>Note:</strong> Remove any parameters below that you do not use in your daily operations or keep track of.
                </p>

                {/* Projects Fields List */}
                <div className="space-y-3">
                  {sections.find(s => s.id === 'projects')?.fields.map(field => renderFieldRow('projects', field))}
                </div>

                {/* Add Custom Field Button at the bottom */}
                {addingCustomFieldToSection !== 'projects' && (
                  <div className="flex justify-start pt-1">
                    <button
                      type="button"
                      onClick={() => setAddingCustomFieldToSection('projects')}
                      className="text-xs font-black text-orange-600 hover:text-orange-800 flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100/80 px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      Add Custom Field
                    </button>
                  </div>
                )}

                {/* Custom field addition */}
                {addingCustomFieldToSection === 'projects' && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-4 animate-fade-in">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Create Custom Project Field</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={customFieldName}
                        onChange={(e) => setCustomFieldName(e.target.value)}
                        placeholder="Field Name (e.g., Battery Storage Capacity)"
                        className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 outline-none transition bg-white"
                      />
                      <input
                        type="text"
                        value={customFieldDesc}
                        onChange={(e) => setCustomFieldDesc(e.target.value)}
                        placeholder="Short description / purpose"
                        className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 outline-none transition bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Field Input Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        {([
                          { id: 'text', label: '📝 Plain Text' },
                          { id: 'number', label: '🔢 Number' },
                          { id: 'date', label: '📅 Date' },
                          { id: 'dropdown', label: '🎯 Drop Down' }
                        ] as const).map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setCustomFieldType(t.id)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition ${
                              customFieldType === t.id
                                ? 'bg-indigo-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {customFieldType === 'dropdown' && (
                      <div className="space-y-1.5 animate-fade-in">
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                          Dropdown Options (separated with a comma) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customFieldDropdownOptions}
                          onChange={(e) => setCustomFieldDropdownOptions(e.target.value)}
                          placeholder="e.g. Option A, Option B, Option C"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 text-xs font-bold pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAddingCustomFieldToSection(null);
                          setCustomFieldType('text');
                          setCustomFieldDropdownOptions('');
                        }}
                        className="px-3 py-1.5 text-slate-500 hover:bg-slate-150 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddCustomField('projects')}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded"
                      >
                        Save Custom Field
                      </button>
                    </div>
                  </div>
                )}
              </div>


              {/* BOTTOM NAV - Prev / Next */}
              <div className="flex items-center justify-between pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => { setCurrentTab(prev => Math.max(0, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-5 py-2.5 text-xs font-black rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition flex items-center gap-1.5 ${currentTab === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  ← Prev
                </button>
                <span className="text-[11px] text-slate-400 font-semibold">{`${currentTab + 1} / 7`}</span>
                {currentTab < 6 ? (
                  <button
                    type="button"
                    onClick={() => { setCurrentTab(prev => Math.min(6, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-5 py-2.5 text-xs font-black rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    Next →
                  </button>
                ) : (
                  <span />
                )}
              </div>

              </div>
              )}

              {/* --- TAB 5 Finance --- */}
              {currentTab === 5 && (
              <div className="space-y-6">

              {/* BILLING FIELDS CARD */}
              <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm space-y-6 transition-all ${billingConfirmed ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 bg-white'}`}>
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                      Billing & Ledger Fields
                    </h3>
                  </div>
                  {billingConfirmed ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${financialsStatus === 'configured' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {financialsStatus === 'configured' ? 'Confirmed' : 'Skipped'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setBillingConfirmed(false)}
                        className="px-2.5 py-1.5 text-[11px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1.5 shrink-0">
                      <button type="button" onClick={() => {
                        setFinancialsStatus('skipped');
                        setBillingConfirmed(true);
                      }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${financialsStatus === 'skipped' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                        Skip
                      </button>
                      <button type="button" onClick={() => {
                        setFinancialsStatus('configured');
                        setBillingConfirmed(true);
                      }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-1 ${financialsStatus === 'configured' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                        Confirm
                      </button>
                    </div>
                  )}
                </div>

                {billingConfirmed ? (
                  <div className="rounded-2xl border border-emerald-200 bg-white/70 p-4 space-y-3">
                    <p className="text-xs font-black text-slate-800">
                      Current selection: {financialsStatus === 'configured' ? 'Billing module enabled' : 'Billing module skipped'}
                    </p>
                    {financialsStatus === 'configured' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                        {sections.find(s => s.id === 'financials')?.fields.filter(f => f.included).map(field => (
                          <div key={field.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-100 shadow-3xs">
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{field.label}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Type: {field.fieldType || 'text'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500">Use Edit to reopen and change this section.</p>
                  </div>
                ) : financialsStatus === 'configured' ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                      Configure monetary metrics. Note: Calculations of receivables are fully automatic based on payments entered. Keep or customize these tracked fields:
                    </p>

                    <div className="space-y-4">
                      {sections.find(s => s.id === 'financials')?.fields.map(field => renderFieldRow('financials', field))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 border border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-500 font-semibold">You have bypassed the Billing & Ledger Fields module.</p>
                  </div>
                )}
              </div>

              {/* SECTION: GOVERNMENT SUBSIDIES */}
              <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm space-y-6 transition-all ${subsidyConfirmed ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 bg-white'}`}>
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                      5. Subsidy Status & Portal Application Milestones
                    </h3>
                  </div>
                  {subsidyConfirmed ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${subsidyEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {subsidyEnabled ? 'Confirmed' : 'Skipped'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSubsidyConfirmed(false)}
                        className="px-2.5 py-1.5 text-[11px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1.5 shrink-0">
                      <button type="button" onClick={() => {
                        setSubsidyEnabled(false);
                        setSubsidyConfirmed(true);
                      }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${!subsidyEnabled ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                        Skip
                      </button>
                      <button type="button" onClick={() => {
                        setSubsidyEnabled(true);
                        setSubsidyConfirmed(true);
                      }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-1 ${subsidyEnabled ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                        Confirm
                      </button>
                    </div>
                  )}
                </div>

                {subsidyConfirmed ? (
                  <div className="rounded-2xl border border-emerald-200 bg-white/70 p-4 space-y-3">
                    <p className="text-xs font-black text-slate-800">
                      Current selection: {subsidyEnabled ? 'Subsidy module enabled' : 'Subsidy module skipped'}
                    </p>
                    {subsidyEnabled && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                        {sections.find(s => s.id === 'subsidy_status_history')?.fields.filter(f => f.included).map(field => (
                          <div key={field.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-100 shadow-3xs">
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{field.label}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Type: {field.fieldType || 'text'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500">Use Edit to reopen and change this section.</p>
                  </div>
                ) : subsidyEnabled ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                      Tracks government solar portal subsidy files from pending registry to final credit disbursement. Keep or customize these tracked fields:
                    </p>

                    <div className="space-y-4">
                      {sections.find(s => s.id === 'subsidy_status_history')?.fields.map(field => renderFieldRow('subsidy_status_history', field))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 border border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-500 font-semibold">You have bypassed the Government Subsidy module.</p>
                  </div>
                )}
              </div>

              {/* SECTION: CUSTOMER BANKING INFO & FINANCING - SKIP OPTION - includes Payment Methods */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-teal-600" />
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                      6. Customer Banking & Loan Coordination Info
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBankInfoEnabled(true)}
                    className={`flex-1 px-4 py-3 rounded-2xl text-xs font-bold border transition text-center ${
                      bankInfoEnabled
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    🏦 Yes, Keep Banking & Loan Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setBankInfoEnabled(false)}
                    className={`flex-1 px-4 py-3 rounded-2xl text-xs font-bold border transition text-center ${
                      !bankInfoEnabled
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    ⏭️ No, Skip Banking Details
                  </button>
                </div>

                {bankInfoEnabled ? (
                  <div className="space-y-4 animate-fade-in pt-2">
                    <p className="text-xs text-slate-500">
                      Specify which customer bank details and loan documents your team needs to collect and track inside the CRM:
                    </p>
                    <div className="space-y-4">
                      {sections.find(s => s.id === 'bank_info')?.fields.map(field => renderFieldRow('bank_info', field))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 border border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-500 font-semibold">You have bypassed the Customer Banking Details & Loan module.</p>
                  </div>
                )}
              </div>


              {/* BOTTOM NAV - Prev / Next */}
              <div className="flex items-center justify-between pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => { setCurrentTab(prev => Math.max(0, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-5 py-2.5 text-xs font-black rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition flex items-center gap-1.5 ${currentTab === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  ← Prev
                </button>
                <span className="text-[11px] text-slate-400 font-semibold">{`${currentTab + 1} / 7`}</span>
                {currentTab < 6 ? (
                  <button
                    type="button"
                    onClick={() => { setCurrentTab(prev => Math.min(6, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-5 py-2.5 text-xs font-black rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    Next →
                  </button>
                ) : (
                  <span />
                )}
              </div>

              </div>
              )}

              {/* --- TAB 6 Submit --- */}
              {currentTab === 6 && (
              <div className="space-y-6">
              {/* EXTRA REMARKS SECTION */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                    8. Special CRM Notes or General Custom Request Comments
                  </h3>
                </div>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. We require a separate mobile app for site engineers to upload site surveys directly, or we need automatic daily WhatsApp reports..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:border-amber-500 outline-none transition font-medium"
                ></textarea>
              </div>

              {/* ACTION: GENERATE & SUBMIT BLUEPRINT */}
              <div className="pt-4 flex flex-col items-center gap-3">
                <button
                  type="submit"
                  disabled={emailStatus === 'sending'}
                  className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl transition shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 active:scale-98 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-950" />
                  {emailStatus === 'sending' ? 'Submitting Specifications...' : 'Submit Specifications'}
                </button>
              </div>

              {/* BOTTOM NAV - Prev / Next */}
              <div className="flex items-center justify-between pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => { setCurrentTab(prev => Math.max(0, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-5 py-2.5 text-xs font-black rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition flex items-center gap-1.5 ${currentTab === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  ← Prev
                </button>
                <span className="text-[11px] text-slate-400 font-semibold">{`${currentTab + 1} / 7`}</span>
                <span />
              </div>

              </div>
              )}

            </form>
          </div>
          )
        ) : (
          
          /* VIEW SUBMISSION AND PROPOSAL VIEW */
          <div className="max-w-2xl mx-auto py-12 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center space-y-6">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
              
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-9 h-9 text-emerald-400 animate-bounce" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Specifications Submitted!
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Company: {activeSubmission.companyName} ({activeSubmission.clientName})
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl max-w-md mx-auto space-y-3.5 text-slate-300">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left pb-1.5 border-b border-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Submission Status
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-400">Destination:</span>
                  <span className="font-black text-white font-mono">enquiry@mahvishsadaf.com</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-400">Attachment:</span>
                  <span className="font-black text-emerald-400 font-mono">spec_blueprint.json</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="font-semibold text-slate-400">Status:</span>
                  {emailStatus === 'sending' && (
                    <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold">
                      Sending...
                    </span>
                  )}
                  {emailStatus === 'success' && (
                    <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">
                      ✓ Delivered
                    </span>
                  )}
                  {emailStatus === 'failed' && (
                    <span className="bg-red-500/15 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-md font-bold">
                      ⚠ Offline
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed max-w-md mx-auto font-medium">
                Your specifications package has been transmitted to our developers. We will compile your dashboard and contact you soon.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setActiveSubmission(null);
                    setCurrentTab(0);
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  ✏️ Reopen & Edit Form
                </button>
                <button
                  onClick={handleDownloadJSON}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Config JSON
                </button>
                <button
                  onClick={() => {
                    setActiveSubmission(null);
                    setSessionActive(false);
                    setClientPhone('');
                    setClientAccessId('');
                    setPhoneInput('');
                    setAccessIdInput('');
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Exit Workspace
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-100 py-8 px-4 border-t border-slate-200 text-center mt-12 text-xs text-slate-500 font-semibold">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-600 font-bold">
            <Sun className="w-4 h-4 text-amber-500" />
            Solar CRM Configuration Tool
          </div>
          <div>
            Built with pure high-craft design and responsive Swiss grid layouts
          </div>
        </div>
      </footer>

    </div>
  );
}
