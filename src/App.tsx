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
  Edit
} from 'lucide-react';
import { INITIAL_SECTIONS } from './initialData';
import { SectionConfig, FieldConfig, ClientSubmission } from './types';

export default function App() {
  // Session / Profile management states
  const [sessionActive, setSessionActive] = useState(false);
  const [loginTab, setLoginTab] = useState<'client' | 'admin'>('client');
  const [phoneInput, setPhoneInput] = useState('');
  const [accessIdInput, setAccessIdInput] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSelectedSessionKey, setAdminSelectedSessionKey] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [saveFeedback, setSaveFeedback] = useState('');
  const [savedSessions, setSavedSessions] = useState<{
    key: string;
    phone: string;
    accessId: string;
    companyName: string;
    lastUpdated: string;
    clientName: string;
    clientEmail: string;
    userCount: string;
    adminUserCount: string;
    salesUserCount: string;
    financeUserCount: string;
  }[]>([]);

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
  const [userCount, setUserCount] = useState<string>('');
  const [adminUserCount, setAdminUserCount] = useState<string>('');
  const [salesUserCount, setSalesUserCount] = useState<string>('');
  const [financeUserCount, setFinanceUserCount] = useState<string>('');

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

  // Financial calculations and payment methods
  const [financialsStatus, setFinancialsStatus] = useState<'configured' | 'skipped' | 'dk'>('configured');
  const [customPaymentMethods, setCustomPaymentMethods] = useState<string[]>(['Online Transfer', 'Cash', 'Check', 'Bank Solar Loan', 'Personal Loan']);
  const [newPaymentInput, setNewPaymentInput] = useState('');

  // Subsidy and Bank module toggles
  const [subsidyEnabled, setSubsidyEnabled] = useState(true);
  const [bankInfoEnabled, setBankInfoEnabled] = useState(false); // User request: '6. Bank & Loan Coordination Info - skip this option' (set default to disabled/skipped)

  // Submissions and API interaction state
  const [activeSubmission, setActiveSubmission] = useState<ClientSubmission | null>(null);
  const [aiProposal, setAiProposal] = useState<string>('');
  const [isLoadingProposal, setIsLoadingProposal] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isCopySuccess, setIsCopySuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');

  // Load All Saved Sessions from LocalStorage (for Admin panel use)
  const refreshSavedSessions = () => {
    const list: {
      key: string;
      phone: string;
      accessId: string;
      companyName: string;
      lastUpdated: string;
      clientName: string;
      clientEmail: string;
      userCount: string;
      adminUserCount: string;
      salesUserCount: string;
      financeUserCount: string;
    }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('solar_crm_save_') && key !== 'solar_crm_save_admin_master') {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const d = JSON.parse(raw);
            const keyParts = key.replace('solar_crm_save_', '').split('_');
            const phoneVal = d.clientPhone || keyParts[0] || 'Unknown';
            const accessIdVal = d.clientAccessId || keyParts[1] || 'None';
            list.push({
              key,
              phone: phoneVal,
              accessId: accessIdVal,
              companyName: d.companyName || 'Unnamed Installer',
              lastUpdated: d.submittedAt || 'In-progress draft',
              clientName: d.clientName || 'Draft Installer',
              clientEmail: d.clientEmail || 'N/A',
              userCount: d.userCount || 'N/A',
              adminUserCount: d.adminUserCount || '',
              salesUserCount: d.salesUserCount || '',
              financeUserCount: d.financeUserCount || ''
            });
          }
        } catch (e) {
          // ignore
        }
      }
    }
    setSavedSessions(list);
  };

  React.useEffect(() => {
    refreshSavedSessions();
  }, [sessionActive]);

  // Save state to Local Storage helper function
  const saveToLocalStorage = (phone: string, accessId: string) => {
    const cleanPhone = (phone || '').trim();
    const cleanAccessId = (accessId || '').trim();
    if (!cleanPhone && !isAdmin) return;

    const dataToSave = {
      clientName,
      clientPhone: cleanPhone,
      clientAccessId: cleanAccessId,
      clientEmail,
      companyName,
      customNotes,
      hasWebsite,
      websiteAddress,
      websiteConfirmed,
      liveProjectsCount,
      userCount,
      adminUserCount,
      salesUserCount,
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
      financialsStatus,
      customPaymentMethods,
      subsidyEnabled,
      bankInfoEnabled,
      securityLevels,
      activeSubmission,
      aiProposal,
      submittedAt: new Date().toLocaleString()
    };

    let key = 'solar_crm_save_' + cleanPhone + '_' + cleanAccessId;
    if (isAdmin) {
      if (adminSelectedSessionKey) {
        key = adminSelectedSessionKey;
      } else {
        key = 'solar_crm_save_admin_master';
      }
    }
    localStorage.setItem(key, JSON.stringify(dataToSave));
    // Also update saved list
    refreshSavedSessions();
  };

  // Debounced auto-saver effect hook
  React.useEffect(() => {
    if (sessionActive && (clientPhone.trim() || isAdmin)) {
      const timer = setTimeout(() => {
        saveToLocalStorage(clientPhone, clientAccessId);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [
    sessionActive,
    isAdmin,
    adminSelectedSessionKey,
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
    salesUserCount,
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
    if (d.financialStageName !== undefined) setFinancialStageName(d.financialStageName);
    if (d.financialsStatus !== undefined) setFinancialsStatus(d.financialsStatus);
    if (d.customPaymentMethods !== undefined) setCustomPaymentMethods(d.customPaymentMethods);
    if (d.subsidyEnabled !== undefined) setSubsidyEnabled(d.subsidyEnabled);
    if (d.bankInfoEnabled !== undefined) setBankInfoEnabled(d.bankInfoEnabled);
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

  // Client login / workspace loader
  const handleClientStartOrResume = (phoneToLoad: string, accessIdToLoad: string) => {
    const cleanPhone = phoneToLoad.trim();
    const cleanAccessId = accessIdToLoad.trim();
    if (!cleanPhone) {
      setPhoneError('Please enter a valid phone number');
      return;
    }
    if (!cleanAccessId) {
      setPhoneError('Please enter an Access ID / Passcode to protect your workspace');
      return;
    }

    setPhoneError('');
    setIsAdmin(false);

    // Key format is: solar_crm_save_${phone}_${accessId}
    const newKey = 'solar_crm_save_' + cleanPhone + '_' + cleanAccessId;
    const savedData = localStorage.getItem(newKey);

    if (savedData) {
      try {
        const d = JSON.parse(savedData);
        loadSessionFromData(d);
        setSaveFeedback('Welcome back! Loaded your secure specifications draft.');
      } catch (err) {
        console.error('Error loading saved data:', err);
        setPhoneError('Could not restore saved data. Starting fresh.');
        startFreshSession(cleanPhone, cleanAccessId);
      }
    } else {
      // Check if there is an old key format 'solar_crm_save_${phone}'
      const oldKey = 'solar_crm_save_' + cleanPhone;
      const oldData = localStorage.getItem(oldKey);
      if (oldData) {
        try {
          const d = JSON.parse(oldData);
          loadSessionFromData(d);
          // Update client access id to the newly specified one
          setClientAccessId(cleanAccessId);
          setSaveFeedback('Welcome back! Upgraded your session with Access ID protection.');
          // Immediately save to new key
          setTimeout(() => {
            saveToLocalStorage(cleanPhone, cleanAccessId);
          }, 100);
        } catch (err) {
          startFreshSession(cleanPhone, cleanAccessId);
        }
      } else {
        // Start completely fresh
        startFreshSession(cleanPhone, cleanAccessId);
        setSaveFeedback('Started fresh workspace session with Access ID protection.');
      }
    }
    setSessionActive(true);
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  // Admin login logic
  const handleAdminLogin = (passcode: string) => {
    if (passcode.trim() !== 'admin2026') {
      setPhoneError('Invalid Admin Passcode. Please try again.');
      return;
    }

    setPhoneError('');
    setIsAdmin(true);
    setClientPhone('Admin Master');
    setClientAccessId('admin');
    setAdminSelectedSessionKey('');

    // Load admin master template if it exists
    const adminKey = 'solar_crm_save_admin_master';
    const adminSaved = localStorage.getItem(adminKey);
    if (adminSaved) {
      try {
        const d = JSON.parse(adminSaved);
        loadSessionFromData(d);
        setSaveFeedback('Logged in as Admin. Loaded Master Admin configuration.');
      } catch (err) {
        startFreshSession('Admin Master', 'admin');
      }
    } else {
      startFreshSession('Admin Master', 'admin');
      setSaveFeedback('Logged in as Admin. Started fresh Master Admin configuration.');
    }

    setSessionActive(true);
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  // Admin loads a selected client session
  const handleAdminLoadClientSession = (key: string) => {
    setAdminSelectedSessionKey(key);
    if (!key) {
      // Revert to master admin template
      const adminKey = 'solar_crm_save_admin_master';
      const adminSaved = localStorage.getItem(adminKey);
      if (adminSaved) {
        try {
          loadSessionFromData(JSON.parse(adminSaved));
          setSaveFeedback('Viewing Master Admin template.');
        } catch (e) {
          startFreshSession('Admin Master', 'admin');
        }
      } else {
        startFreshSession('Admin Master', 'admin');
      }
      return;
    }

    const data = localStorage.getItem(key);
    if (data) {
      try {
        const d = JSON.parse(data);
        loadSessionFromData(d);
        setSaveFeedback(`Loaded client session for: ${d.companyName || d.clientPhone}`);
      } catch (e) {
        console.error('Error loading client session:', e);
      }
    }
  };

  const handleAdminInspectSubmission = (key: string) => {
    setAdminSelectedSessionKey(key);
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const d = JSON.parse(data);
        loadSessionFromData(d);
        
        // Reconstruct or extract activeSubmission to display compiled view-only report
        if (d.activeSubmission) {
          setActiveSubmission(d.activeSubmission);
        } else {
          const reconstructed: ClientSubmission = {
            id: `reconstructed_${Date.now()}`,
            clientName: d.clientName || 'Draft Installer Person',
            clientPhone: d.clientPhone || 'N/A',
            clientEmail: d.clientEmail || '',
            companyName: d.companyName || 'Draft Company Name',
            submittedAt: d.submittedAt || 'In-progress draft',
            sections: d.sections || INITIAL_SECTIONS,
            stages: d.stages || [],
            stagesStatus: d.stagesStatus || 'dk',
            financialCalculationsUnderstood: d.financialsStatus === 'configured',
            customNotes: d.customNotes || '',
            branchList: d.branchList || [],
            hasWebsite: d.hasWebsite === true,
            websiteAddress: d.websiteAddress || '',
            liveProjectsCount: d.liveProjectsCount || '',
            backendEmail: d.backendEmail || '',
            backendPassword: d.backendPassword || '',
            userCount: d.userCount || '',
            adminUserCount: d.adminUserCount || '',
            salesUserCount: d.salesUserCount || '',
            financeUserCount: d.financeUserCount || '',
            financialRoleViewPermission: d.financialRoleViewPermission || 'all'
          };
          setActiveSubmission(reconstructed);
        }
        setSaveFeedback(`Viewing compiled requirements for ${d.companyName || d.clientPhone}`);
      } catch (e) {
        console.error('Error loading client session for admin preview:', e);
      }
    }
  };

  // Admin deletes a draft permanently
  const handleDeleteDraft = (e: React.MouseEvent, keyToDelete: string) => {
    e.stopPropagation();
    const cleanKeyName = keyToDelete.replace('solar_crm_save_', '');
    if (window.confirm(`Are you sure you want to permanently delete saved draft "${cleanKeyName}"?`)) {
      localStorage.removeItem(keyToDelete);
      if (adminSelectedSessionKey === keyToDelete) {
        setAdminSelectedSessionKey('');
        startFreshSession('Admin Master', 'admin');
      }
      refreshSavedSessions();
      setSaveFeedback('Draft removed from browser memory.');
      setTimeout(() => setSaveFeedback(''), 2500);
    }
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

            {/* View-only form preview */}
            <div className="pt-1.5">
              {fType === 'dropdown' ? (
                <div className="space-y-1.5">
                  <select
                    disabled
                    className="w-full max-w-md px-3.5 py-2.5 bg-slate-100/70 border border-slate-200/80 rounded-xl text-xs text-slate-500 cursor-not-allowed font-semibold"
                  >
                    <option value="">-- Select Option (View Only) --</option>
                    {(field.dropdownOptions || 'Option 1, Option 2').split(',').map((opt, i) => (
                      <option key={i} value={opt.trim()}>{opt.trim()}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 font-mono font-semibold">
                    💡 Option values: {(field.dropdownOptions || 'Option 1, Option 2')}
                  </p>
                </div>
              ) : fType === 'number' ? (
                <input
                  type="number"
                  disabled
                  placeholder="e.g. 0.00 (View Only)"
                  className="w-full max-w-md px-3.5 py-2.5 bg-slate-100/70 border border-slate-200/80 rounded-xl text-xs text-slate-500 cursor-not-allowed font-semibold"
                />
              ) : fType === 'date' ? (
                <input
                  type="date"
                  disabled
                  className="w-full max-w-md px-3.5 py-2.5 bg-slate-100/70 border border-slate-200/80 rounded-xl text-xs text-slate-500 cursor-not-allowed font-semibold"
                />
              ) : (
                <input
                  type="text"
                  disabled
                  placeholder="Text Input (View Only)"
                  className="w-full max-w-md px-3.5 py-2.5 bg-slate-100/70 border border-slate-200/80 rounded-xl text-xs text-slate-500 cursor-not-allowed font-semibold"
                />
              )}
              {field.notes && (
                <p className="text-[10px] text-slate-400 font-mono mt-1 italic">
                  💡 Instruction: "{field.notes}"
                </p>
              )}
            </div>
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
                  Omitted
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

    // 2. Render for CONFIGURATION or UNSELECTED state (Expanded Card)
    return (
      <div
        key={field.id}
        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/30 shadow-3xs ring-1 ring-slate-100/50 space-y-4 animate-fade-in"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-black text-slate-900">
                {field.label}
              </span>
              <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-bold font-mono px-2 py-0.5 rounded-md">
                Type: {typeLabelMap[fType] || fType}
              </span>
              {field.isCustom && (
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  Custom
                </span>
              )}
              {field.id === 'branch' && (
                <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  Branch Specific
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {field.id === 'poc' ? (
                <span>Point of Contact (POC). If you do not have a POC, omit it.</span>
              ) : field.description}
            </p>
          </div>

          {/* Edit Type Toggle Button */}
          {!isEditingType && (
            <button
              type="button"
              onClick={() => setEditingTypeFieldId(field.id)}
              className="px-2.5 py-1.5 text-[11px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Edit className="w-3 h-3 text-indigo-600" />
              Edit Type
            </button>
          )}
        </div>

        {isEditingType ? (
          <div className="bg-white border border-slate-150 p-4 rounded-xl space-y-4 animate-fade-in">
            {/* Field Type Selection Grid */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Select Field Input Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['text', 'dropdown', 'number', 'date'] as const).map((type) => {
                  const labelMap = {
                    text: '📝 Text Input',
                    dropdown: '🎯 Dropdown list',
                    number: '🔢 Number Input',
                    date: '📅 Date Picker'
                  };
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleFieldTypeChange(sectionId, field.id, type)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-black text-center transition cursor-pointer ${
                        fType === type
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                      }`}
                    >
                      {labelMap[type]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* If Dropdown is selected, show dropdown options config */}
            {fType === 'dropdown' ? (
              <div className="space-y-1.5 animate-fade-in">
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider">
                  List Dropdown Option Values (Comma Separated) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required={fType === 'dropdown'}
                  value={field.dropdownOptions || ''}
                  onChange={(e) => handleDropdownOptionsChange(sectionId, field.id, e.target.value)}
                  placeholder="e.g. On-grid, Off-grid, Hybrid Solar system"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                />
                <p className="text-[10px] text-slate-400 font-medium font-mono">
                  💡 Separation format: Option 1, Option 2, Option 3
                </p>
              </div>
            ) : (
              <div className="space-y-1 animate-fade-in">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Extra operational instructions (Optional)
                </label>
                <input
                  type="text"
                  value={field.notes || ''}
                  onChange={(e) => handleFieldNoteChange(sectionId, field.id, e.target.value)}
                  placeholder="e.g. Default value, validation limits, or placeholder instructions..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-indigo-500 outline-none transition font-medium text-slate-900"
                />
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setEditingTypeFieldId(null)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-lg transition cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        ) : (
          field.notes && (
            <div className="text-xs text-slate-400 font-mono italic">
              Note: "{field.notes}"
            </div>
          )
        )}

        {/* Unified Action Block at the bottom */}
        <div className="pt-3 border-t border-slate-150 flex flex-col sm:flex-row gap-2 justify-end items-center">
          {field.isCustom && (
            <button
              type="button"
              onClick={() => handleDeleteCustomField(sectionId, field.id)}
              className="w-full sm:w-auto px-3.5 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Custom Field
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setSections(prev =>
                prev.map(sec => {
                  if (sec.id === sectionId) {
                    return {
                      ...sec,
                      fields: sec.fields.map(f => {
                        if (f.id === field.id) {
                          return { ...f, included: false, confirmed: true };
                        }
                        return f;
                      })
                    };
                  }
                  return sec;
                })
              );
            }}
            className="w-full sm:w-auto px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Skip / Omit Field
          </button>

          <button
            type="button"
            onClick={() => {
              setSections(prev =>
                prev.map(sec => {
                  if (sec.id === sectionId) {
                    return {
                      ...sec,
                      fields: sec.fields.map(f => {
                        if (f.id === field.id) {
                          if (f.fieldType === 'dropdown' && !f.dropdownOptions?.trim()) {
                            return { ...f, included: true, confirmed: true, dropdownOptions: 'Option 1, Option 2' };
                          }
                          return { ...f, included: true, confirmed: true };
                        }
                        return f;
                      })
                    };
                  }
                  return sec;
                })
              );
            }}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            Confirm Field
          </button>
        </div>
      </div>
    );
  };

  // Custom field addition for any section
  const [addingCustomFieldToSection, setAddingCustomFieldToSection] = useState<string | null>(null);
  const [customFieldName, setCustomFieldName] = useState('');
  const [customFieldDesc, setCustomFieldDesc] = useState('');
  const [customFieldType, setCustomFieldType] = useState<'text' | 'dropdown' | 'number' | 'date'>('text');
  const [customFieldDropdownOptions, setCustomFieldDropdownOptions] = useState('');

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
  const handleAddStage = () => {
    if (!newStageInput.trim()) return;
    setCustomStages(prev => [...prev, newStageInput.trim()]);
    setNewStageInput('');
  };

  const handleRemoveStage = (index: number) => {
    setCustomStages(prev => prev.filter((_, idx) => idx !== index));
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
      errors.push(`Please enter between 3 and 15 workflow stages, or choose "I don't know / Skip". Currently: ${customStages.length} stages.`);
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFormErrors([]);
    setIsLoadingProposal(true);

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

    // Call the server-side Gemini proposal generator route
    try {
      // Map structures to Gemini API format
      const payload = {
        clientInfo: {
          name: submission.clientName,
          phone: submission.clientPhone,
          email: submission.clientEmail,
          company: submission.companyName,
          websiteAddress: submission.websiteAddress,
          liveProjectsCount: submission.liveProjectsCount,
          backendEmail: submission.backendEmail,
          backendPassword: submission.backendPassword,
          userCount: submission.userCount,
          financialRoleViewPermission: submission.financialRoleViewPermission
        },
        sections: {
          customers: {
            fields: submission.sections.find(s => s.id === 'customers')?.fields.map(f => ({
              key: f.id,
              label: f.label,
              active: f.included,
              isCustom: f.isCustom,
              fieldType: f.fieldType || 'text',
              dropdownOptions: f.dropdownOptions || ''
            })) || [],
            pocOption: usePocForPipeline === true ? 'pipeline' as const : (sections.find(s => s.id === 'customers')?.fields.find(f => f.id === 'poc')?.included ? 'keep' as const : 'remove' as const),
            branchOption: hasMultipleBranches === true ? 'multiple' as const : 'single' as const,
            branchList: hasMultipleBranches ? branchList : []
          },
          projects: {
            fields: submission.sections.find(s => s.id === 'projects')?.fields.map(f => ({
              key: f.id,
              label: f.label,
              active: f.included,
              isCustom: f.isCustom,
              fieldType: f.fieldType || 'text',
              dropdownOptions: f.dropdownOptions || ''
            })) || []
          },
          stages: {
            includeFinancialStage,
            financialStageName: includeFinancialStage ? financialStageName : '',
            list: submission.stagesStatus === 'configured' ? submission.stages : ['Expert-defined solar milestones']
          },
          financials: {
            fields: submission.sections.find(s => s.id === 'financials')?.fields.map(f => ({
              key: f.id,
              label: f.label,
              active: f.included,
              isCustom: f.isCustom,
              fieldType: f.fieldType || 'text',
              dropdownOptions: f.dropdownOptions || ''
            })) || [],
            includePayType: financialsStatus === 'configured',
            paymentMethods: customPaymentMethods
          },
          subsidy: {
            enabled: subsidyEnabled,
            fields: submission.sections.find(s => s.id === 'subsidy_status_history')?.fields.map(f => ({
              key: f.id,
              label: f.label,
              active: f.included,
              fieldType: f.fieldType || 'text',
              dropdownOptions: f.dropdownOptions || ''
            })) || []
          },
          bankInfo: {
            enabled: bankInfoEnabled,
            fields: submission.sections.find(s => s.id === 'bank_info')?.fields.map(f => ({
              key: f.id,
              label: f.label,
              active: f.included,
              fieldType: f.fieldType || 'text',
              dropdownOptions: f.dropdownOptions || ''
            })) || []
          }
        },
        notes: submission.customNotes
      };

      setEmailStatus('sending');
      try {
        const formSubmitPayload = {
          "_subject": `📩 Solar CRM Configurator Blueprint Submission: ${submission.companyName} (${submission.clientPhone})`,
          "Company Name": submission.companyName,
          "Contact Person": submission.clientName,
          "Phone Number": submission.clientPhone,
          "Email Address": submission.clientEmail || 'Not Specified',
          "Has Website": submission.hasWebsite ? `Yes (${submission.websiteAddress})` : 'No',
          "Live Projects Count": submission.liveProjectsCount || 'Not Specified',
          "Total Staff Users": submission.userCount || 'Not Specified',
          "CRN / Project ID Tracking": submission.crnTrackingType === 'default'
            ? `Auto-Increment (${
                submission.crnScope === 'crn'
                  ? 'CRN Only'
                  : submission.crnScope === 'project'
                  ? 'Project ID Only'
                  : 'Both CRN & Project ID'
              }, Prefix: ${submission.crnPrefix})`
            : 'Skipped / Omitted',
          "CRM Admin Login Email": submission.backendEmail || 'Not Specified',
          "CRM Admin Login Password": submission.backendPassword || 'Not Specified',
          "Financial Role View Permission": submission.financialRoleViewPermission === 'all' ? 'Can view all modules (read-only)' : 'None (restricted)',
          "Branches setup": hasMultipleBranches ? `Multiple: ${branchList.join(', ')}` : 'Single Branch',
          "Workflow Pipeline Sequence": stagesStatus === 'configured' ? customStages.join(' -> ') : 'Expert recommendations requested',
          "Financial Ledger Tracked": financialsStatus === 'configured' ? 'Yes' : 'No',
          "Include Final Payout Stage": includeFinancialStage ? `Yes (${financialStageName})` : 'No',
          "Payment Methods Allowed": customPaymentMethods.join(', '),
          "Government Subsidy Status History": subsidyEnabled ? 'Enabled' : 'Bypassed',
          "Customer Bank Info & Loans Coordination": bankInfoEnabled ? 'Enabled' : 'Bypassed',
          "General Comments & Custom Notes": submission.customNotes || 'None',
          "Submission Time (UTC)": submission.submittedAt,
          "_honey": "", // honeypot spam protection
          "_template": "table" // formatted beautifully in recipient's inbox
        };

        const formSubmitRes = await fetch('https://formsubmit.co/ajax/enquiry@mahvishsadaf.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formSubmitPayload)
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

      const res = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Server returned an error generating proposal.');
      }

      const data = await res.json();
      setAiProposal(data.proposal || 'Specification generated successfully.');
    } catch (err: any) {
      console.error('API Error:', err);
      // Fallback proposal if AI fails or no internet
      setAiProposal(`
# Solar CRM Specification Design Draft

Thank you for submitting your custom specifications. Here is your requirements manifest:

### Client Details
- **Company Name**: ${submission.companyName}
- **Contact Name**: ${submission.clientName}
- **Phone Number**: ${submission.clientPhone}
- **Email**: ${submission.clientEmail || 'Not Specified'}

### Configured Database Requirements:
1. **Customer Module**: ${submission.sections.find(s => s.id === 'customers')?.fields.filter(f => f.included).map(f => f.label).join(', ')}
   - *Multi-Branch Operation:* ${hasMultipleBranches ? `Yes (Branches: ${branchList.join(', ')})` : 'No'}
2. **Project Technical Module**: ${submission.sections.find(s => s.id === 'projects')?.fields.filter(f => f.included).map(f => f.label).join(', ')}
3. **Financials Module**: ${submission.sections.find(s => s.id === 'financials')?.fields.filter(f => f.included).map(f => f.label).join(', ')}
   - *Payment Modes:* ${customPaymentMethods.join(', ')}
   - *Financial stage in pipeline:* ${includeFinancialStage ? `Yes ("${financialStageName}")` : 'No'}
4. **Subsidy Module**: ${subsidyEnabled ? 'Enabled' : 'Bypassed / Skipped'}
5. **Banking & Loans Module**: ${bankInfoEnabled ? 'Enabled' : 'Bypassed / Skipped'}

### Workflows / Stages:
- **Stages Configuration**: ${submission.stagesStatus === 'configured' ? submission.stages.map((s, i) => `\n  ${i + 1}. ${s}`).join('') : 'Let CRM experts suggest dynamic stages'}
      `);
    } finally {
      setIsLoadingProposal(false);
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
        : 'Omitted / Skipped'
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

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6 relative z-10">
            <button
              type="button"
              onClick={() => {
                setLoginTab('client');
                setPhoneError('');
              }}
              className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                loginTab === 'client'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Client Login
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginTab('admin');
                setPhoneError('');
              }}
              className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                loginTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4" />
              Admin Portal
            </button>
          </div>

          {loginTab === 'client' ? (
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
          ) : (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAdminLogin(adminPasscode);
              }} 
              className="space-y-4 relative z-10"
            >
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-3">
                <label className="block text-[11px] font-black text-amber-400 uppercase tracking-wider">
                  Enter Admin Master Passcode
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="password"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter Master Password..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition font-bold"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  🔧 Full supervisor access. Allows viewing and editing all clients' drafts from browser memory.
                </p>
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
                Verify & Enter Master Console
                <ChevronRight className="w-4 h-4 text-slate-950 stroke-[3]" />
              </button>
            </form>
          )}
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
                {isAdmin 
                  ? (adminSelectedSessionKey 
                      ? savedSessions.find(s => s.key === adminSelectedSessionKey)?.phone || 'Client Spec' 
                      : 'Admin Master') 
                  : clientPhone}
              </span>
            </div>
            <button
              onClick={() => {
                saveToLocalStorage(clientPhone, clientAccessId);
                setSessionActive(false);
                setIsAdmin(false);
                setClientPhone('');
                setClientAccessId('');
                setPhoneInput('');
                setAccessIdInput('');
                setAdminPasscode('');
                setAdminSelectedSessionKey('');
                setSaveFeedback('Logged out successfully.');
                setTimeout(() => setSaveFeedback(''), 2500);
              }}
              className="text-xs font-black uppercase tracking-wider text-red-600 hover:text-white hover:bg-red-500 bg-white px-4 py-2.5 rounded-xl transition border border-red-200 shadow-3xs"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Supervisor Control Deck */}
      {isAdmin && (
        <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-3 sm:px-6 relative z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-red-500 text-slate-950 text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">
                Admin Supervisor Console
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Inspect & Edit Client Specifications Locally
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-300 font-bold shrink-0">Selected Profile:</span>
              <select
                value={adminSelectedSessionKey}
                onChange={(e) => handleAdminLoadClientSession(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 w-full sm:w-64"
              >
                <option value="">Master Admin Draft Template</option>
                {savedSessions.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.companyName} ({s.phone}) [ID: {s.accessId}]
                  </option>
                ))}
              </select>
              {adminSelectedSessionKey && (
                <button
                  onClick={(e) => handleDeleteDraft(e, adminSelectedSessionKey)}
                  className="p-2 hover:bg-red-500/10 rounded-xl text-red-400 hover:text-red-300 transition shrink-0"
                  title="Delete Selected Client Session permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
          isAdmin ? (
            /* Admin Submissions & PDF Generator Dashboard */
            <div className="space-y-8 animate-fade-in">
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-red-400 text-xs font-black uppercase tracking-widest">
                      <Lock className="w-4 h-4 text-red-400" />
                      Admin Master Console
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
                      Requirements Submissions Vault
                    </h2>
                    <p className="mt-1 text-slate-400 text-xs sm:text-sm font-semibold">
                      Read-only access to compiled solar requirements and instant PDF generator.
                    </p>
                  </div>
                  <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 shrink-0">
                    🔒 Mode: <span className="text-red-400 font-black">View-Only Submissions</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Submissions Stored</span>
                  <p className="text-2xl font-black text-slate-800 mt-1">{savedSessions.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Role-Based Controls</span>
                  <p className="text-2xl font-black text-indigo-600 mt-1">3 Active (Admin/Sales/Finance)</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Local Database</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">Active Offline</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>Registered Solar Installers Spec Packages</span>
                  <span className="text-xs font-bold text-slate-400 font-mono">({savedSessions.length} total)</span>
                </h3>

                {savedSessions.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Users className="w-12 h-12 text-slate-300 mx-auto" />
                    <div>
                      <p className="text-sm font-bold text-slate-700">No client submissions found</p>
                      <p className="text-xs text-slate-400 mt-1">When installers configure their CRM and submit specs, they will appear here.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedSessions.map((s) => (
                      <div 
                        key={s.key} 
                        className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-100/50 transition"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-800 text-sm">{s.companyName}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 font-mono">
                              Pin: {s.accessId}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500 font-medium">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-400">Contact:</span>
                              <span className="text-slate-700 font-bold">{s.clientName} ({s.phone})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-400">Email:</span>
                              <span className="text-slate-700 font-bold">{s.clientEmail}</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:col-span-2 pt-1">
                              <span className="font-semibold text-slate-400">Seats:</span>
                              <span className="text-indigo-600 font-black">
                                Total {s.userCount || 'N/A'} (Admin: {s.adminUserCount || '0'} | Sales: {s.salesUserCount || '0'} | Finance: {s.financeUserCount || '0'})
                              </span>
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-1">
                            🕒 Last updated: {s.lastUpdated}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleAdminInspectSubmission(s.key)}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Inspect & Print PDF
                          </button>
                          
                          <button
                            onClick={(e) => handleDeleteDraft(e, s.key)}
                            className="p-2.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-xl transition border border-transparent hover:border-red-200"
                            title="Delete submission permanent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
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
              </div>

              {/* SECTION: HOSTING, SCALING & OPERATIONAL SECURITY PROFILE */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                    2. Hosting, Scaling & Operational Security Profile
                  </h3>
                </div>

                {/* 1) Website and CRM Hosting URL */}
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
                          Confirm & Lock Website Hosting
                        </button>
                      </div>
                    </div>
                  )}
                </div>

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
                              'Omitted (No CRN or Project ID tracking)'
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
                            setSaveFeedback('Omitted CRN & Project ID tracking.');
                            setTimeout(() => setSaveFeedback(''), 2500);
                          }}
                          className="w-full sm:w-auto px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Skip / Omit Tracking
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
                  <div className="bg-slate-50 border border-slate-150 p-4 sm:p-5 rounded-2xl space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      How many live active projects do you currently manage? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={liveProjectsCount}
                      onChange={(e) => setLiveProjectsCount(e.target.value)}
                      placeholder="e.g., 25 active installations"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                    />
                    <p className="text-[10px] text-slate-400 font-medium">Used to provision database storage allocations and load parameters.</p>
                  </div>

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
                    <div className="bg-slate-50 border border-slate-150 p-4 sm:p-5 rounded-2xl space-y-2 animate-fade-in">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Number of staff who will use this CRM? <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={userCount}
                        onChange={(e) => setUserCount(e.target.value)}
                        placeholder="e.g., 12 sales and operations agents"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:border-indigo-500 outline-none transition font-semibold text-slate-900"
                      />
                      <p className="text-[10px] text-slate-400 font-medium mb-2">Used to determine staff seat licenses and concurrent session limits.</p>
                      
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
                        Confirm & Lock Staff Seats
                      </button>
                    </div>
                  )}
                </div>

                {/* 3) Backend Master credentials setup */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 border border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
                  <div className="flex items-start gap-3">
                    <Key className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-amber-300 block">Create Admin Backend Credentials</span>
                      <span className="text-xs text-slate-400 block">
                        Kindly provide a new email address and master password. Developers will use these to host, bootstrap, and secure your database backend. This will also serve as your master admin account.
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        New CRM Admin Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={backendEmail}
                        onChange={(e) => setBackendEmail(e.target.value)}
                        placeholder="e.g., admin@peaksolar.in"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-xs focus:border-amber-400 outline-none transition font-medium text-white placeholder-slate-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        New Master Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={backendPassword}
                        onChange={(e) => setBackendPassword(e.target.value)}
                        placeholder="Create a secure password..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-xs focus:border-amber-400 outline-none transition font-medium text-white placeholder-slate-600"
                      />
                    </div>
                  </div>
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

              {/* SECTION: CUSTOMERS */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                      2. Customer Registry Fields
                    </h3>
                  </div>
                </div>

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
            </div>

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
                    Kindly enter the physical or administrative stages of your installation. To make your CRM lightweight, there are **no preloaded options** — you either write your own exact sequence, skip tracking, or load a demo/suggested structure.
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
                    🤷 I Don't Know / Skip Customization
                  </button>
                </div>

                {stagesStatus === 'configured' && (
                  <div className="space-y-4 pt-2">
                    
                    {/* Add Stage Input Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                      <label className="block text-xs font-bold text-slate-700 uppercase">
                        Add Workflow Stage Sequence (e.g. "Rooftop Foundation Casting")
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
                          Add Step
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Must be between 3 and 15 stages.
                        </span>
                        <button
                          type="button"
                          onClick={handleLoadDemoStages}
                          className="text-[10px] font-bold text-indigo-600 hover:underline"
                        >
                          Load Standard Demo Sequence Instead
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
                                  {index + 1}
                                </span>
                                <span className="text-xs font-bold text-slate-900">{stage}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveStage(index)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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

                    {/* Financial Milestone Specific Toggle */}
                    <div className="pt-4 border-t border-slate-150 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">Include "Financial stage/approval" in workflow?</span>
                        <span className="text-xs text-slate-500">Track dynamic billing checks during installation. Skip if not needed.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIncludeFinancialStage(!includeFinancialStage)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                          includeFinancialStage
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                            : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {includeFinancialStage ? 'Included' : 'Skipped / Omitted'}
                      </button>
                    </div>

                    {includeFinancialStage && (
                      <div className="bg-amber-50/20 border border-amber-200/50 rounded-2xl p-4 sm:p-5 space-y-3 animate-fade-in">
                        <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider">
                          Custom Financial Stage Name (Write what custom stage name should look like)
                        </label>
                        <input
                          type="text"
                          value={financialStageName}
                          onChange={(e) => setFinancialStageName(e.target.value)}
                          placeholder="e.g., Final Payment Clearance, Dispatch Invoice Payout"
                          className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs focus:border-amber-500 outline-none transition font-medium text-slate-900"
                        />
                        <div className="bg-white border border-slate-200/70 p-3 rounded-xl text-xs text-slate-700 shadow-2xs">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Active Stage Draft Preview:</span>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center">
                              $
                            </span>
                            <span className="font-bold">{financialStageName || 'No stage name written yet'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* SECTION: FINANCIALS & AUTOMATED CALCULATIONS */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                      5. Billing, Ledgers & Automatic Calculations
                    </h3>
                  </div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-5 text-emerald-950 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-700" />
                    Dynamic Automation Rules Included
                  </h4>
                  <p className="text-xs leading-relaxed text-emerald-800">
                    Calculations are entirely automatic. As receipts or milestone installments are entered by your staff, the CRM auto-calculates and revises outstanding balances in real-time:
                  </p>
                  <code className="block bg-white border border-emerald-200 p-2 text-center rounded-lg text-xs font-mono font-bold text-emerald-900">
                    Receivable Balance = Quoted Amount - Discount - Total Received
                  </code>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setFinancialsStatus('configured')}
                    className={`flex-1 px-4 py-3 rounded-2xl text-xs font-bold border transition text-center ${
                      financialsStatus === 'configured'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    💵 Track Standard Ledger Fields
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinancialsStatus('skipped')}
                    className={`flex-1 px-4 py-3 rounded-2xl text-xs font-bold border transition text-center ${
                      financialsStatus === 'skipped'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    ⏭️ Skip Financial Module entirely
                  </button>
                </div>

                {financialsStatus === 'configured' && (
                  <div className="space-y-4">
                    {/* Financial Fields List */}
                    <div className="space-y-4">
                      {sections.find(s => s.id === 'financials')?.fields.map(field => renderFieldRow('financials', field))}
                    </div>

                    {/* Add Custom Field Button at the bottom */}
                    {addingCustomFieldToSection !== 'financials' && (
                      <div className="flex justify-start pt-1">
                        <button
                          type="button"
                          onClick={() => setAddingCustomFieldToSection('financials')}
                          className="text-xs font-black text-emerald-600 hover:text-emerald-800 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 px-4 py-2.5 rounded-xl transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          Add Custom Field
                        </button>
                      </div>
                    )}

                    {/* Inline custom field addition panel for financials */}
                    {addingCustomFieldToSection === 'financials' && (
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-4 animate-fade-in">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Create Custom Financial Field</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={customFieldName}
                            onChange={(e) => setCustomFieldName(e.target.value)}
                            placeholder="Field Name (e.g., Insurance Surcharge)"
                            className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-500 outline-none transition bg-white"
                          />
                          <input
                            type="text"
                            value={customFieldDesc}
                            onChange={(e) => setCustomFieldDesc(e.target.value)}
                            placeholder="Short description / purpose"
                            className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-500 outline-none transition bg-white"
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
                                    ? 'bg-emerald-600 text-white shadow-2xs'
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
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-emerald-500 outline-none transition font-semibold text-slate-900"
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
                            onClick={() => handleAddCustomField('financials')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                          >
                            Save Custom Field
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Payment Modes Configuration */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block uppercase">Custom Payment Methods & Modes</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">Specify modes your customers can choose from (e.g. Cash, Online Transfer, Bank Loan, Personal Loan etc.)</p>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPaymentInput}
                          onChange={(e) => setNewPaymentInput(e.target.value)}
                          placeholder="e.g., Check payment, Central Subsidy Direct Credit"
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:border-emerald-500 outline-none transition font-medium"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddPaymentMethod();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddPaymentMethod}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Mode
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {customPaymentMethods.map((method, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 pl-3 pr-2 py-1 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2"
                          >
                            <span>{method}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePaymentMethod(method)}
                              className="text-slate-400 hover:text-red-600 p-0.5 rounded-full hover:bg-red-50 transition"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: GOVERNMENT SUBSIDIES */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                      6. Subsidy Status & Portal Application Milestones
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubsidyEnabled(!subsidyEnabled)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      subsidyEnabled
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {subsidyEnabled ? 'Subsidies Enabled' : 'Subsidies Bypassed'}
                  </button>
                </div>

                {subsidyEnabled ? (
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

              {/* SECTION: CUSTOMER BANKING INFO & FINANCING - SKIP OPTION */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-teal-600" />
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                      7. Customer Banking & Loan Coordination Info
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
                  <div className="space-y-2.5 animate-fade-in pt-2">
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

              {/* ACTION: GENERATE BLUEPRINT */}
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl transition shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 active:scale-98 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-950" />
                  Generate Customized CRM Blueprint
                </button>
              </div>

            </form>
          </div>
          )
        ) : (
          
          /* VIEW SUBMISSION AND PROPOSAL VIEW */
          <div className="space-y-8 animate-fade-in">
            
            {/* SUCCESS TITLE BANNER */}
            <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-100 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    Bespoke CRM Requirements Complete
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
                    Specification Form Compiled!
                  </h2>
                  <p className="mt-1 text-emerald-100 text-xs sm:text-sm font-semibold">
                    Installer Profile: {activeSubmission.companyName} ({activeSubmission.clientName} - {activeSubmission.clientPhone})
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs text-xs font-bold">
                    {emailStatus === 'sending' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                        <span className="text-amber-200">Sending specifications directly to enquiry@mahvishsadaf.com...</span>
                      </>
                    )}
                    {emailStatus === 'success' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                        <span className="text-emerald-100">✓ Sent successfully to enquiry@mahvishsadaf.com!</span>
                      </>
                    )}
                    {emailStatus === 'failed' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                        <span className="text-rose-200">⚠ Transmission offline. Export below or try resending.</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 shrink-0">
                  {isAdmin ? (
                    <button
                      onClick={() => {
                        setActiveSubmission(null);
                        setAiProposal('');
                        setAdminSelectedSessionKey('');
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1 border border-slate-700 shadow-sm"
                    >
                      ← Back to Submissions Vault
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveSubmission(null);
                        setAiProposal('');
                      }}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center gap-1 shadow-sm"
                    >
                      ✏️ Revisit & Edit Specifications
                    </button>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    Print PDF
                  </button>
                </div>
              </div>
            </div>

            {/* TWO COLUMNS: EXPORT AND PROPOSAL REPORT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT EXPORT CONTROL CARD (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100">
                    Export Requirements Package
                  </h3>

                  <div className="space-y-3">
                    <button
                      onClick={handleCopyMarkdown}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {isCopySuccess ? 'Copied to Clipboard!' : 'Copy Specification Markdown'}
                    </button>

                    <button
                      onClick={handleDownloadJSON}
                      className="w-full py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Database Configuration JSON
                    </button>
                  </div>

                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs text-slate-500 leading-relaxed">
                    <p className="font-bold text-slate-700 mb-1">📦 Development Specification Package</p>
                    This manifest documents your specific field preferences, branch configurations, workflow milestones, payment methodologies, and custom inputs in a direct, clear format. Send this file directly to our developer team to boot your database in minutes!
                  </div>
                </div>

                {/* MINI CUSTOMIZER SUMMARY PANEL */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
                    Configured Module Summary
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="font-bold text-slate-600">Multi-Branch Operation</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${hasMultipleBranches ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
                        {hasMultipleBranches ? 'Yes' : 'No'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="font-bold text-slate-600">Project Workflow Stages</span>
                      <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                        {activeSubmission.stagesStatus === 'configured' ? `${activeSubmission.stages.length} Milestones` : 'Skipped / Custom recommendation'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="font-bold text-slate-600">Payment Ledger Rules</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase">
                        Automated Balances
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="font-bold text-slate-600">Government Subsidy Module</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${subsidyEnabled ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-600'}`}>
                        {subsidyEnabled ? 'Enabled' : 'Bypassed'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="font-bold text-slate-600">Banking & Loan Coordinates</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${bankInfoEnabled ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'}`}>
                        {bankInfoEnabled ? 'Enabled' : 'Bypassed'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="font-bold text-slate-600">CRN & Project ID Tracking</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${activeSubmission.crnTrackingType !== 'skipped' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {activeSubmission.crnTrackingType === 'default' ? (
                          `Auto [${
                            activeSubmission.crnScope === 'crn'
                              ? 'CRN'
                              : activeSubmission.crnScope === 'project'
                              ? 'Project ID'
                              : 'Both'
                          }] (${activeSubmission.crnPrefix || 'CRN-'})`
                        ) : (
                          'Omitted'
                        )}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT AI ANALYSIS & EXPLAINER REPORT (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-800">
                      Bespoke CRM Implementation Proposal
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-bold">
                    Analysis by Google Gemini AI
                  </span>
                </div>

                {isLoadingProposal ? (
                  <div className="text-center py-20 space-y-4">
                    <RefreshCw className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
                    <div>
                      <p className="text-sm font-bold text-slate-850">Architecting Your Bespoke CRM Proposal...</p>
                      <p className="text-xs text-slate-400 mt-1">Gemini is writing a custom deployment roadmap and database scheme draft based on your choices.</p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed space-y-4 font-normal selection:bg-amber-100 selection:text-slate-900">
                    <div className="whitespace-pre-line text-slate-800">
                      {aiProposal}
                    </div>
                  </div>
                )}

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
