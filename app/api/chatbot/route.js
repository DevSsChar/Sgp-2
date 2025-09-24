import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('=== Chatbot API Called ===');
  
  try {
    const { message, conversationHistory = [], scanData = null } = await request.json();
    console.log('Received message:', message);

    if (!message || message.trim() === '') {
      console.log('Empty message received');
      return NextResponse.json({ 
        success: false, 
        error: 'Message is required' 
      }, { status: 400 });
    }

    // Smart response system based on keywords
    const msg = message.toLowerCase().trim();
    let response = '';

    // Accessibility-focused responses
    if (msg.includes('color') || msg.includes('contrast')) {
      response = `🎨 **Color Contrast Guidelines:**

• **Normal text**: Minimum 4.5:1 contrast ratio
• **Large text**: Minimum 3:1 contrast ratio  
• **Non-text elements**: Minimum 3:1 contrast ratio

**Quick fixes:**
- Use darker colors for text
- Add background colors for better contrast
- Test with tools like WebAIM's contrast checker
- Consider colorblind users (don't rely on color alone)

**WCAG Reference**: Success Criterion 1.4.3 (AA)`;

    } else if (msg.includes('alt') || msg.includes('image')) {
      response = `🖼️ **Alt Text Best Practices:**

• **Descriptive**: Explain what the image shows
• **Concise**: Keep under 125 characters
• **Context-aware**: Consider surrounding content
• **No redundancy**: Don't start with "Image of..."

**Examples:**
- ❌ "Image of dog"
- ✅ "Golden retriever running in a sunny park"

**For decorative images**: Use empty alt="" attribute

**WCAG Reference**: Success Criterion 1.1.1 (A)`;

    } else if (msg.includes('keyboard') || msg.includes('navigation') || msg.includes('tab')) {
      response = `⌨️ **Keyboard Navigation Requirements:**

• **All interactive elements** must be keyboard accessible
• **Visible focus indicators** on all focusable elements
• **Logical tab order** following content flow
• **No keyboard traps** - users can always navigate away

**Essential keys to support:**
- Tab/Shift+Tab (navigation)
- Enter/Space (activation)
- Arrow keys (for complex widgets)
- Escape (close modals/menus)

**WCAG Reference**: Success Criteria 2.1.1, 2.1.2 (A)`;

    } else if (msg.includes('heading') || msg.includes('h1') || msg.includes('h2')) {
      response = `📝 **Proper Heading Structure:**

• **One H1 per page** (main page title)
• **Sequential order**: Don't skip levels (h1→h2→h3)
• **Descriptive text**: Clearly describe the section content
• **Not for styling**: Use CSS for visual formatting

**Structure example:**
\`\`\`html
<h1>Page Title</h1>
  <h2>Main Section</h2>
    <h3>Subsection</h3>
    <h3>Another Subsection</h3>
  <h2>Another Main Section</h2>
\`\`\`

**WCAG Reference**: Success Criteria 1.3.1, 2.4.6 (AA)`;

    } else if (msg.includes('form') || msg.includes('label') || msg.includes('input')) {
      response = `📋 **Form Accessibility Essentials:**

• **Every input needs a label**: Use \`<label for="id">\` or \`aria-label\`
• **Required fields**: Mark with \`required\` attribute and visual indicators
• **Error messages**: Clear, specific, and associated with fields
• **Instructions**: Provide before the form, not just on error

**Example:**
\`\`\`html
<label for="email">Email Address (required)</label>
<input type="email" id="email" required aria-describedby="email-error">
<div id="email-error" role="alert">Please enter a valid email</div>
\`\`\`

**WCAG Reference**: Success Criteria 1.3.1, 3.3.1, 3.3.2 (A/AA)`;

    } else if (msg.includes('critical') || msg.includes('priority') || msg.includes('fix first')) {
      response = `🚨 **Priority Accessibility Fixes:**

${scanData ? '**Based on your scan data:**' : '**General priority order:**'}

**1. CRITICAL (Fix immediately)**
- Missing alt text on images
- Keyboard navigation failures
- Color contrast below 3:1

**2. HIGH (Fix this week)**
- Form labels missing
- Improper heading structure
- Focus indicators missing

**3. MEDIUM (Fix this month)**
- ARIA labels incomplete
- Link text not descriptive
- Color contrast below 4.5:1

**4. LOW (Ongoing improvements)**
- Page titles optimization
- Landmark roles enhancement

Start with Critical issues - they affect the most users!`;

    } else if (msg.includes('business') || msg.includes('impact') || msg.includes('legal')) {
      response = `💼 **Business Impact of Accessibility:**

**Legal Compliance:**
• ADA Title III requirements (US)
• Section 508 for government (US)
• EN 301 549 standard (EU)
• Potential lawsuits and fines

**Market Benefits:**
• **15% larger audience** (people with disabilities)
• **Better SEO** (screen readers = search engines)
• **Improved usability** for everyone
• **Enhanced brand reputation**

**ROI Factors:**
• Reduced legal risk
• Larger customer base
• Better search rankings
• Lower support costs

**Cost of inaction** > Cost of accessibility compliance`;

    } else if (msg.includes('test') || msg.includes('check') || msg.includes('validate')) {
      response = `🔍 **Accessibility Testing Methods:**

**Automated Tools:**
• WAVE (web accessibility evaluator)
• axe DevTools extension
• Lighthouse accessibility audit
• AccessibilityGuard Scanner (you're using it!)

**Manual Testing:**
• Keyboard-only navigation
• Screen reader testing (NVDA/JAWS/VoiceOver)
• Color contrast checking
• Zoom to 200% testing

**User Testing:**
• Include users with disabilities
• Task-based testing scenarios
• Feedback on real-world usage

**Testing frequency**: Every sprint/release cycle`;

    } else if (msg.includes('wcag') || msg.includes('guidelines') || msg.includes('standard')) {
      response = `📚 **WCAG 2.1 Guidelines Overview:**

**Four Principles (POUR):**
• **Perceivable**: Content must be presentable
• **Operable**: Interface components must be operable  
• **Understandable**: Information must be understandable
• **Robust**: Content must be robust enough for assistive technologies

**Conformance Levels:**
• **Level A**: Basic accessibility (minimum)
• **Level AA**: Standard compliance (recommended)
• **Level AAA**: Enhanced accessibility (ideal)

**Target**: WCAG 2.1 AA compliance covers most legal requirements

**Quick reference**: https://www.w3.org/WAI/WCAG21/quickref/`;

    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('help')) {
      response = `👋 **Hello! I'm AccessibilityGuard AI**

I'm your accessibility expert, ready to help you create more inclusive websites!

${scanData ? '🔍 **I can see you have scan data available!** I can provide specific guidance based on your scan results.' : ''}

**I can help with:**
• WCAG 2.1 compliance guidance
• Specific code fixes and examples
• Prioritizing accessibility issues
• Understanding business impact
• Testing methodologies

**Try asking:**
• "What should I fix first to improve compliance?"
• "How do I fix color contrast violations?"
• "Show me proper heading structure"
• "What's the business impact of these issues?"

What would you like to know about accessibility?`;

    } else {
      // Fallback response that acknowledges the specific question
      response = `🤔 **I understand you're asking about: "${message}"**

While I work on understanding your specific question better, here are some key accessibility principles that might help:

**Quick Accessibility Checklist:**
• ✅ All images have descriptive alt text
• ✅ Text has sufficient color contrast (4.5:1 minimum)
• ✅ All interactive elements work with keyboard
• ✅ Forms have proper labels
• ✅ Headings follow logical hierarchy
• ✅ Focus indicators are visible

**For specific guidance, try asking:**
• "How do I fix [specific issue]?"
• "What's the priority for accessibility fixes?"
• "Show me WCAG guidelines for [topic]"

**Need immediate help?** Check WCAG 2.1 Quick Reference: https://www.w3.org/WAI/WCAG21/quickref/

What specific accessibility challenge can I help you solve?`;
    }

    console.log('Generated response successfully');

    return NextResponse.json({ 
      success: true, 
      message: response,
      timestamp: new Date().toISOString(),
      hasContext: !!scanData
    });

  } catch (error) {
    console.error('=== Chatbot API Error ===');
    console.error('Error:', error.message);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'I apologize, but I encountered an error. Please try again!',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'AccessibilityGuard AI Chatbot is running' });
}