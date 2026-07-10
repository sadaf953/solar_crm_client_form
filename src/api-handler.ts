import { GoogleGenAI } from '@google/genai';

// Initialize Gemini with the API key from environment variables
// Note: We set the 'aistudio-build' header as requested for tracking
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface BlueprintPayload {
  clientInfo: {
    name: string;
    phone: string;
    email: string;
    company: string;
  };
  sections: {
    customers: {
      fields: Array<{ key: string; label: string; active: boolean; isCustom?: boolean }>;
      pocOption: 'keep' | 'pipeline' | 'remove';
      branchOption: 'single' | 'multiple';
    };
    projects: {
      fields: Array<{ key: string; label: string; active: boolean; isCustom?: boolean }>;
    };
    stages: {
      includeFinancialStage: boolean;
      list: string[];
    };
    financials: {
      fields: Array<{ key: string; label: string; active: boolean; isCustom?: boolean }>;
      includePayType: boolean;
      paymentMethods: string[];
    };
    subsidy: {
      enabled: boolean;
      fields: Array<{ key: string; label: string; active: boolean; isCustom?: boolean }>;
    };
    bankInfo: {
      enabled: boolean;
      fields: Array<{ key: string; label: string; active: boolean; isCustom?: boolean }>;
    };
  };
  notes?: string;
}

export async function generateProposal(payload: BlueprintPayload): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const { clientInfo, sections, notes } = payload;

  const prompt = `
You are an expert CRM Software Architect and Solar Energy Operations Consultant. 
A prospective solar installer/client has filled out a customized requirements form to outline their dream Solar CRM. 
You need to generate a highly professional, comprehensive, and tailored CRM Implementation & Architecture Proposal.

Here is the specification they configured:

### Client Contact Details:
- Name: ${clientInfo.name}
- Phone: ${clientInfo.phone}
- Email: ${clientInfo.email || 'Not provided'}
- Company: ${clientInfo.company || 'Not provided'}

### CRM Modules Configuration:

1. CUSTOMERS MODULE:
   - Branch setup: ${sections.customers.branchOption === 'multiple' ? 'Multiple branches tracked' : 'Single branch (removed branch field)'}
   - Point of Contact (POC) setup: ${
     sections.customers.pocOption === 'keep' 
       ? 'Track standard client POC' 
       : sections.customers.pocOption === 'pipeline' 
       ? 'Repurposed POC for pipeline stages' 
       : 'Removed POC field'
   }
   - Tracked Fields:
     ${sections.customers.fields.filter(f => f.active).map(f => `- ${f.label} (${f.key}) ${f.isCustom ? '[Custom Field]' : ''}`).join('\n     ')}

2. PROJECTS MODULE (Solar Assets):
   - Tracked Fields:
     ${sections.projects.fields.filter(f => f.active).map(f => `- ${f.label} (${f.key}) ${f.isCustom ? '[Custom Field]' : ''}`).join('\n     ')}

3. PROJECT WORKFLOW STAGES (Progress Pipelines):
   - Track financial stages? ${sections.stages.includeFinancialStage ? 'Yes, financial verification stages included' : 'No, skipped/handled separately'}
   - Configured Stages (Order of Execution):
     ${sections.stages.list.map((stage, idx) => `${idx + 1}. ${stage}`).join('\n     ')}

4. FINANCIALS & PAYMENTS MODULE:
   - Tracked Fields:
     ${sections.financials.fields.filter(f => f.active).map(f => `- ${f.label} (${f.key}) ${f.isCustom ? '[Custom Field]' : ''}`).join('\n     ')}
   - Track Payment Types? ${sections.financials.includePayType ? 'Yes' : 'No'}
   - Supported Payment Modes: ${sections.financials.paymentMethods.join(', ')}
   - Note: Automated calculations are configured (receivable = quoted_amt - discount - received).

5. SOLAR SUBSIDY STATUS HISTORY:
   - Tracking Enabled? ${sections.subsidy.enabled ? 'Yes, active' : 'No, bypassed'}
   ${sections.subsidy.enabled ? `\n   - Tracked Fields:\n     ${sections.subsidy.fields.filter(f => f.active).map(f => `- ${f.label} (${f.key})`).join('\n     ')}` : ''}

6. BANK & LOAN DISBURSEMENT INFO:
   - Tracking Enabled? ${sections.bankInfo.enabled ? 'Yes, active' : 'No, bypassed'}
   ${sections.bankInfo.enabled ? `\n   - Tracked Fields:\n     ${sections.bankInfo.fields.filter(f => f.active).map(f => `- ${f.label} (${f.key})`).join('\n     ')}` : ''}

${notes ? `### Client's Custom General Comments/Requests:\n"${notes}"` : ''}

---
Please produce a beautifully structured, authoritative, and motivating document with the following sections in Markdown:

1. **Executive Summary**: Acknowledge their company (${clientInfo.company || 'Solar Installer'}), their specific solar market focus, and the goals of this bespoke Solar CRM.
2. **Database Schema & Data Model**: Show a clean technical representation of the tables and fields they selected. Highlight any custom fields they added.
3. **Workflow & Pipeline Stage Analysis**: Review each of the ${sections.stages.list.length} stages they configured. Explain how the CRM will automate transitions or document uploads at these milestones.
4. **Financial Automation Logic**: Detail how the auto-revision calculations (quoted, received, discount, receivable) will prevent leaks, and describe the payment processing structure (Cash, Online, Loan, etc.).
5. **Subsidy & Financing Integrations** (if enabled): Outline how the CRM tracks government solar subsidies or client bank loans smoothly.
6. **Proposed Implementation Roadmap**: Suggest a 4-step development phase (e.g., Phase 1: Core Database & Client Auth, Phase 2: Project Workflows & Dynamic Forms, Phase 3: Financial Calculations & Subsidies, Phase 4: Testing & Deployment).

Make the tone professional, helpful, highly organized, and inspiring. Use bold text, Markdown tables where relevant, and clear section dividers. Avoid any generic AI-writing placeholders.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });
    return response.text || 'Error: Could not generate a proposal response.';
  } catch (error: any) {
    console.error('Gemini proposal generation failed:', error);
    throw new Error(error.message || 'Failed to generate proposal from AI model.');
  }
}
