import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { baseUrl, reportId, summary, pages, violations } = await request.json();
    
    console.log('Comprehensive Report API received:', {
      baseUrl,
      reportId,
      summaryKeys: summary ? Object.keys(summary) : null,
      pagesCount: pages?.length,
      violationsCount: violations?.length
    });

    if (!violations || violations.length === 0) {
      console.log('No violations provided');
      return NextResponse.json({ error: 'No violations provided' }, { status: 400 });
    }

    const websiteUrl = baseUrl;
    const totalViolations = violations.length;
    const scanSummary = summary;

    // Format violations for comprehensive analysis
    const violationsByRule = {};
    violations.forEach(violation => {
      const rule = violation.rule || violation.id;
      if (!violationsByRule[rule]) {
        violationsByRule[rule] = {
          rule: rule,
          severity: violation.impact || violation.severity,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          tags: violation.tags || [],
          count: 0,
          examples: []
        };
      }
      violationsByRule[rule].count += violation.nodes?.length || 1;
      if (violation.nodes && violation.nodes.length > 0) {
        violationsByRule[rule].examples.push(...violation.nodes.slice(0, 3));
      }
    });

    const violationSummary = Object.values(violationsByRule);

    // Comprehensive prompt for detailed business report
    const prompt = `You are a senior accessibility consultant creating a comprehensive business report for a client. Generate a complete accessibility audit report that can be presented to executives and development teams.

WEBSITE AUDIT DETAILS:
Website URL: ${websiteUrl}
Total Violations Found: ${totalViolations}
Unique Violation Types: ${violationSummary.length}
Pages Scanned: ${pages?.length || scanSummary?.pages || 'Multiple'}
Scan Date: ${new Date().toLocaleDateString()}

DETAILED VIOLATION ANALYSIS:
${violationSummary.map((v, index) => `
${index + 1}. VIOLATION TYPE: ${v.rule}
   - Severity: ${v.severity}
   - Affected Elements: ${v.count}
   - Impact: ${v.description}
   - WCAG Guidelines: ${v.help}
   - Reference: ${v.helpUrl}
   - Technical Tags: ${v.tags.join(', ')}
   - Sample Elements: ${v.examples.map(ex => ex.html || ex.target || 'Element').slice(0, 2).join(' | ')}
`).join('')}

CREATE A COMPREHENSIVE BUSINESS REPORT with the following sections:

Format your response as JSON with this exact structure:
{
  "executiveSummary": "Professional 2-3 paragraph summary suitable for executives, highlighting business impact, legal compliance risks, and recommended actions",
  
  "complianceStatus": {
    "wcagLevel": "Current WCAG compliance level assessment",
    "legalRisk": "Assessment of ADA/legal compliance risks",
    "industryBenchmark": "How this compares to industry standards"
  },

  "criticalFindings": [
    {
      "finding": "Most critical accessibility issue",
      "businessImpact": "Direct impact on business/users",
      "legalRisk": "Legal compliance implications",
      "priority": "critical|high|medium|low"
    }
  ],

  "detailedAnalysis": [
    {
      "violationType": "exact-violation-rule-name",
      "severity": "critical|serious|moderate|minor",
      "affectedElements": number,
      "wcagCriteria": "Specific WCAG success criteria",
      "userImpact": "Detailed explanation of how this affects users with disabilities",
      "businessRisk": "Potential business/legal risks",
      "technicalExplanation": "Technical details of the violation",
      "remediationSteps": [
        "Step 1: Immediate action required",
        "Step 2: Implementation details",
        "Step 3: Testing and validation",
        "Step 4: Long-term maintenance"
      ],
      "codeExample": "Complete before/after code example with proper formatting",
      "testingInstructions": "Detailed testing procedures for validation",
      "timeEstimate": "Estimated development time to fix",
      "skillsRequired": "Technical skills needed for implementation"
    }
  ],

  "implementationRoadmap": {
    "phase1": {
      "title": "Critical Issues (0-2 weeks)",
      "items": ["List of immediate fixes required"],
      "effort": "Estimated effort in hours/days"
    },
    "phase2": {
      "title": "High Priority (2-6 weeks)", 
      "items": ["List of high priority fixes"],
      "effort": "Estimated effort in hours/days"
    },
    "phase3": {
      "title": "Medium Priority (6-12 weeks)",
      "items": ["List of medium priority fixes"],
      "effort": "Estimated effort in hours/days"
    }
  },

  "resourceRequirements": {
    "developmentTeam": "Required team composition and skills",
    "tools": "Recommended accessibility testing tools",
    "training": "Team training recommendations",
    "budget": "Estimated budget considerations"
  },

  "ongoingMaintenance": {
    "testingSchedule": "Recommended testing frequency",
    "monitoringTools": "Tools for continuous monitoring",
    "teamResponsibilities": "Ongoing team responsibilities",
    "complianceChecklist": "Regular compliance verification steps"
  },

  "appendices": {
    "wcagGuidelines": "Relevant WCAG 2.1 AA guidelines summary",
    "legalReferences": "ADA, Section 508, and other legal references",
    "toolsAndResources": "Recommended tools and learning resources",
    "glossary": "Accessibility terms and definitions"
  }
}

IMPORTANT: 
- Make this report professional and suitable for executive presentation
- Include specific business language and ROI considerations
- Provide actionable recommendations with clear timelines
- Address legal compliance and risk mitigation
- Include technical details for development teams`;

    // Call Ollama API
    let modelToUse = 'qwen2.5';
    
    try {
      const modelsResponse = await fetch('http://localhost:11434/api/tags');
      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        const models = modelsData.models?.map(m => m.name) || [];
        modelToUse = models.find(m => m.includes('qwen2.5')) || models.find(m => m.includes('llama2')) || 'qwen2.5';
      }
    } catch (e) {
      console.log('Model check failed, using qwen2.5');
    }

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelToUse,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.2, // Lower temperature for more consistent business reports
          top_p: 0.9,
          num_predict: 4000 // Increased for comprehensive reports
        }
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status} - ${ollamaResponse.statusText}`);
    }

    const ollamaData = await ollamaResponse.json();
    
    // Parse the AI response
    let comprehensiveReport;
    try {
      const responseText = ollamaData.response;
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const jsonString = responseText.slice(jsonStart, jsonEnd);
        comprehensiveReport = JSON.parse(jsonString);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      
      // Comprehensive fallback report
      comprehensiveReport = {
        executiveSummary: `This accessibility audit of ${websiteUrl} identified ${violations.length} violations across ${violationSummary.length} different rule types. The findings indicate significant accessibility barriers that pose legal compliance risks and impact user experience for individuals with disabilities. Immediate remediation is recommended to ensure WCAG 2.1 AA compliance and reduce potential legal exposure.`,
        
        complianceStatus: {
          wcagLevel: "Non-compliant with WCAG 2.1 AA standards",
          legalRisk: "High risk of ADA compliance violations",
          industryBenchmark: "Below industry accessibility standards"
        },

        criticalFindings: violationSummary
          .filter(v => v.severity === 'serious' || v.severity === 'critical')
          .slice(0, 5)
          .map(v => ({
            finding: `${v.rule} - ${v.count} affected elements`,
            businessImpact: `Impacts ${v.count} elements, affecting user experience and accessibility`,
            legalRisk: "High legal compliance risk under ADA Title III",
            priority: v.severity === 'serious' ? 'high' : 'critical'
          })),

        detailedAnalysis: violationSummary.map(v => ({
          violationType: v.rule,
          severity: v.severity,
          affectedElements: v.count,
          wcagCriteria: v.tags.find(tag => tag.includes('wcag')) || 'WCAG 2.1 AA',
          userImpact: `This violation affects ${v.count} elements and creates barriers for users with disabilities`,
          businessRisk: "Potential legal liability and reduced user accessibility",
          technicalExplanation: v.description,
          remediationSteps: [
            `Identify all ${v.count} elements with ${v.rule} violations`,
            "Implement WCAG-compliant solutions according to guidelines",
            "Test fixes with screen readers and accessibility tools", 
            "Establish monitoring to prevent regression"
          ],
          codeExample: `/* Fix for ${v.rule} */\n/* Implement according to WCAG 2.1 AA guidelines */\n/* Refer to: ${v.helpUrl} */`,
          testingInstructions: "Test with screen readers (NVDA, JAWS) and keyboard navigation",
          timeEstimate: v.count > 10 ? "2-5 days" : "1-2 days",
          skillsRequired: "HTML/CSS/JavaScript, WCAG 2.1 knowledge, accessibility testing tools"
        })),

        implementationRoadmap: {
          phase1: {
            title: "Critical Issues (0-2 weeks)",
            items: violationSummary.filter(v => v.severity === 'serious').map(v => `Fix ${v.rule} (${v.count} elements)`),
            effort: "40-80 hours"
          },
          phase2: {
            title: "High Priority (2-6 weeks)",
            items: violationSummary.filter(v => v.severity === 'moderate').map(v => `Fix ${v.rule} (${v.count} elements)`),
            effort: "60-120 hours"
          },
          phase3: {
            title: "Medium Priority (6-12 weeks)", 
            items: violationSummary.filter(v => v.severity === 'minor').map(v => `Fix ${v.rule} (${v.count} elements)`),
            effort: "20-40 hours"
          }
        },

        resourceRequirements: {
          developmentTeam: "Frontend developers with accessibility experience, QA testers familiar with assistive technologies",
          tools: "Screen readers (NVDA, JAWS), axe-core, WAVE, accessibility testing browser extensions",
          training: "WCAG 2.1 compliance training, assistive technology usage, accessibility testing methodologies",
          budget: "Consider dedicated accessibility consultant and testing tools licensing"
        },

        ongoingMaintenance: {
          testingSchedule: "Weekly automated accessibility scans, monthly manual audits",
          monitoringTools: "Automated accessibility monitoring tools, continuous integration testing",
          teamResponsibilities: "Dedicated accessibility champion, developer training, QA accessibility testing",
          complianceChecklist: "Regular WCAG compliance verification, user testing with disabilities community"
        },

        appendices: {
          wcagGuidelines: "Web Content Accessibility Guidelines (WCAG) 2.1 Level AA compliance requirements",
          legalReferences: "Americans with Disabilities Act (ADA) Title III, Section 508, EU EN 301 549",
          toolsAndResources: "axe-core, WAVE, Pa11y, NVDA screen reader, WebAIM resources",
          glossary: "Screen reader: assistive technology for blind users; WCAG: Web Content Accessibility Guidelines; ADA: Americans with Disabilities Act"
        }
      };
    }

    return NextResponse.json({
      success: true,
      report: comprehensiveReport,
      metadata: {
        generatedAt: new Date().toISOString(),
        websiteUrl: websiteUrl,
        totalViolations: violations.length,
        uniqueViolationTypes: violationSummary.length,
        scanSummary: scanSummary
      }
    });

  } catch (error) {
    console.error('Comprehensive Report API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate comprehensive report', 
        details: error.message,
        isOllamaRunning: error.message.includes('ECONNREFUSED') ? false : null
      },
      { status: 500 }
    );
  }
}