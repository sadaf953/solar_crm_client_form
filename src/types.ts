/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FieldConfig {
  id: string;
  label: string;
  description: string;
  included: boolean;
  notes: string;
  isCustom?: boolean;
  fieldType?: 'text' | 'dropdown' | 'number' | 'date';
  dropdownOptions?: string;
  confirmed?: boolean;
}

export interface SectionConfig {
  id: string;
  title: string;
  description: string;
  fields: FieldConfig[];
  enabled: boolean; // Sections can be disabled entirely (e.g. Subsidy or Bank Info)
}

export interface ClientSubmission {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  companyName: string;
  submittedAt: string;
  sections: SectionConfig[];
  stages: string[]; // List of custom stages configured by the client
  stagesStatus: 'configured' | 'dk'; // 'dk' = Don't Know / Skip
  financialCalculationsUnderstood: boolean;
  customNotes: string;
  branchList?: string[];
  hasWebsite?: boolean;
  websiteAddress?: string;
  liveProjectsCount?: string;
  backendEmail?: string;
  backendPassword?: string;
  userCount?: string;
  adminUserCount?: string;
  salesUserCount?: string;
  financeUserCount?: string;
  financialRoleViewPermission?: string;
  crnTrackingType?: 'default' | 'custom' | 'skipped';
  crnScope?: 'crn' | 'project' | 'both';
  crnPrefix?: string;
  crnConfirmed?: boolean;
  staffConfirmed?: boolean;
}
