import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { violations, url } = await request.json();

    if (!violations || violations.length === 0) {
      return NextResponse.json({ error: 'No violations provided' }, { status: 400 });
    }

    // Format violations for AI prompt - group by rule type for better analysis
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
        violationsByRule[rule].examples.push(...violation.nodes.slice(0, 2)); // Add up to 2 examples per violation
      }
    });

    const violationSummary = Object.values(violationsByRule);

    const prompt = `You are an expert accessibility consultant specializing in WCAG 2.1 AA compliance. Analyze ALL the accessibility violations from a comprehensive website scan and provide detailed, actionable remediation guidance.

Website URL: ${url}
Total Violations: ${violations.length}
Unique Rule Types: ${violationSummary.length}

COMPREHENSIVE ACCESSIBILITY VIOLATIONS ANALYSIS:
${violationSummary.map((v, index) => `
${index + 1}. VIOLATION: ${v.rule}
   Severity Level: ${v.severity}
   Total Affected Elements: ${v.count}
   Description: ${v.description}
   WCAG Help: ${v.help}
   WCAG Tags: ${v.tags.join(', ')}
   Examples of affected elements: ${v.examples.map(ex => ex.html || ex.target || 'Element details not available').slice(0, 2).join(' | ')}
`).join('')}

REQUIREMENTS FOR YOUR RESPONSE:
1. Analyze EVERY violation type found (${violationSummary.length} different rules)
2. Provide detailed step-by-step fixes for each violation
3. Include complete, production-ready code examples
4. Explain the impact on users with disabilities
5. Reference specific WCAG 2.1 success criteria
6. Provide testing methods for each fix
7. Prioritize fixes based on severity and user impact

Format your response as JSON with this exact structure:
{
  "summary": "Comprehensive analysis of all ${violations.length} accessibility violations found across ${violationSummary.length} different rule types. Highlight the most critical issues and overall accessibility status.",
  "fixes": [
    {
      "rule": "exact-violation-rule-name",
      "priority": "critical|high|medium|low",
      "affectedElements": ${violations.length},
      "userImpact": "Detailed explanation of how this violation affects users with disabilities",
      "explanation": "Comprehensive explanation of what this violation means and why it matters for accessibility",
      "steps": [
        "Detailed step 1 with specific implementation guidance",
        "Detailed step 2 with exact technical requirements",
        "Detailed step 3 with validation methods",
        "Additional steps as needed for complete remediation"
      ],
      "codeExample": "Complete, production-ready HTML/CSS/JS code example showing before and after the fix",
      "wcagReference": "Specific WCAG 2.1 success criteria number (e.g., 2.4.2, 1.3.1)",
      "testingTips": "Comprehensive testing methods including screen reader testing, keyboard navigation, and automated tools",
      "commonMistakes": "Common implementation mistakes to avoid",
      "additionalResources": "Links to WCAG documentation or helpful resources"
    }
  ],
  "generalRecommendations": [
    "Detailed general accessibility best practices based on the violations found",
    "Specific testing strategies for this website",
    "Long-term accessibility maintenance recommendations"
  ],
  "priorityOrder": "Explain the recommended order for fixing violations based on user impact and technical difficulty"
}

IMPORTANT: Include fixes for ALL ${violationSummary.length} violation types found. Do not skip any violations.`;

    // Call Ollama API with fallback model
    const availableModels = ['qwen2.5', 'llama2'];
    let modelToUse = 'qwen2.5';
    
    // Check if qwen2.5 is available, fallback to llama2
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
          temperature: 0.3,
          top_p: 0.9,
          num_predict: 2000
        }
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status} - ${ollamaResponse.statusText}`);
    }

    const ollamaData = await ollamaResponse.json();
    
    // Parse the AI response
    let aiSuggestions;
    try {
      // Try to extract JSON from the response
      const responseText = ollamaData.response;
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const jsonString = responseText.slice(jsonStart, jsonEnd);
        aiSuggestions = JSON.parse(jsonString);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      // Fallback structured response with all violations
      aiSuggestions = {
        summary: `Found ${violations.length} accessibility violations across ${violationSummary.length} different rule types. The main issues involve: ${violationSummary.map(v => v.rule).join(', ')}. These violations need immediate attention to ensure WCAG 2.1 AA compliance.`,
        fixes: violationSummary.map(v => ({
          rule: v.rule,
          priority: v.severity === 'serious' || v.severity === 'critical' ? 'high' : v.severity === 'moderate' ? 'medium' : 'low',
          affectedElements: v.count,
          userImpact: `This violation affects ${v.count} elements and impacts users who rely on assistive technologies.`,
          explanation: v.description || `${v.rule} violation needs to be addressed for WCAG compliance. This affects the accessibility of your website for users with disabilities.`,
          steps: [
            `Identify all ${v.count} elements affected by the ${v.rule} violation`,
            `Review the WCAG guidelines for ${v.rule} compliance requirements`,
            `Implement the recommended accessibility fixes according to WCAG 2.1 AA standards`,
            `Test the fixes using screen readers and accessibility testing tools`,
            `Validate that all instances of this violation have been resolved`
          ],
          codeExample: `<!-- Fix for ${v.rule} violation -->\n<!-- Before: Non-compliant element -->\n<!-- After: WCAG-compliant implementation -->\n<!-- Please refer to WCAG documentation for specific code examples -->`,
          wcagReference: v.tags.find(tag => tag.startsWith('wcag')) || 'WCAG 2.1 AA guidelines',
          testingTips: `Test this ${v.rule} fix using screen readers (NVDA, JAWS), keyboard navigation, and automated accessibility tools like axe-core.`,
          commonMistakes: `Common mistakes include not testing with actual assistive technologies and not considering all user scenarios.`,
          additionalResources: v.helpUrl || 'https://www.w3.org/WAI/WCAG21/Understanding/'
        })),
        generalRecommendations: [
          "Implement a comprehensive accessibility testing strategy including automated tools and manual testing",
          "Test with multiple screen readers and assistive technologies",
          "Follow WCAG 2.1 AA guidelines consistently across all pages",
          "Conduct regular accessibility audits to catch issues early",
          "Train your development team on accessibility best practices",
          "Consider hiring accessibility consultants for complex issues"
        ],
        priorityOrder: "Fix critical and serious violations first (high priority), then moderate violations (medium priority), and finally minor issues (low priority). Focus on violations that affect the most users first."
      };
    }

    return NextResponse.json({
      success: true,
      suggestions: aiSuggestions
    });

  } catch (error) {
    console.error('AI Fix API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate AI suggestions', 
        details: error.message,
        isOllamaRunning: error.message.includes('ECONNREFUSED') ? false : null
      },
      { status: 500 }
    );
  }
}
