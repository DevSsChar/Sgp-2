import { jsPDF } from 'jspdf';

export class ComprehensiveReportPDF {
  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
  }

  // Color scheme
  colors = {
    primary: [0, 212, 255],
    secondary: [30, 64, 175],
    danger: [239, 68, 68],
    warning: [245, 158, 11],
    success: [16, 185, 129],
    gray: [107, 114, 128],
    dark: [31, 41, 55]
  };

  // Add header with company branding
  addHeader(title) {
    // Company name/logo area
    this.doc.setFontSize(24);
    this.doc.setTextColor(...this.colors.primary);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('AccessibilityGuard', this.margin, this.currentY);
    
    this.currentY += 10;
    
    // Report title
    this.doc.setFontSize(18);
    this.doc.setTextColor(...this.colors.dark);
    this.doc.text(title, this.margin, this.currentY);
    
    this.currentY += 15;
    
    // Horizontal line
    this.doc.setDrawColor(...this.colors.primary);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 10;
  }

  // Add section header
  addSectionHeader(title) {
    this.checkPageBreak(20);
    
    this.doc.setFontSize(16);
    this.doc.setTextColor(...this.colors.secondary);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    
    this.currentY += 10;
  }

  // Add paragraph text with word wrapping
  addParagraph(text, fontSize = 11) {
    this.checkPageBreak(20);
    
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(...this.colors.dark);
    this.doc.setFont('helvetica', 'normal');
    
    const lines = this.doc.splitTextToSize(text, this.pageWidth - (this.margin * 2));
    lines.forEach(line => {
      this.checkPageBreak(8);
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 5;
  }

  // Add bullet points
  addBulletList(items) {
    items.forEach(item => {
      this.checkPageBreak(15);
      
      this.doc.setFontSize(11);
      this.doc.setTextColor(...this.colors.dark);
      this.doc.text('•', this.margin, this.currentY);
      
      const lines = this.doc.splitTextToSize(item, this.pageWidth - (this.margin * 2) - 10);
      lines.forEach((line, index) => {
        if (index > 0) this.checkPageBreak(8);
        this.doc.text(line, this.margin + 8, this.currentY);
        if (index < lines.length - 1) this.currentY += 6;
      });
      
      this.currentY += 8;
    });
  }

  // Add key-value information box
  addInfoBox(title, data) {
    this.checkPageBreak(40);
    
    // Box background
    this.doc.setFillColor(240, 248, 255);
    this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - (this.margin * 2), 30, 'F');
    
    // Title
    this.doc.setFontSize(12);
    this.doc.setTextColor(...this.colors.secondary);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 5, this.currentY + 5);
    
    this.currentY += 15;
    
    // Data
    Object.entries(data).forEach(([key, value]) => {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${key}:`, this.margin + 5, this.currentY);
      
      this.doc.setFont('helvetica', 'normal');
      const valueLines = this.doc.splitTextToSize(String(value), this.pageWidth - this.margin * 2 - 40);
      this.doc.text(valueLines[0], this.margin + 40, this.currentY);
      
      this.currentY += 5;
    });
    
    this.currentY += 10;
  }

  // Enhanced violations table with full details
  addDetailedViolationsSection(violations, pages) {
    this.addSectionHeader('Detailed Violations Analysis');
    
    // Group violations by severity
    const violationsBySeverity = {
      critical: violations.filter(v => v.impact === 'critical'),
      serious: violations.filter(v => v.impact === 'serious'),
      moderate: violations.filter(v => v.impact === 'moderate'),
      minor: violations.filter(v => v.impact === 'minor')
    };

    // Process each severity level
    Object.entries(violationsBySeverity).forEach(([severity, severityViolations]) => {
      if (severityViolations.length === 0) return;

      this.checkPageBreak(30);
      
      // Severity header with color coding
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      
      const severityColors = {
        critical: [220, 38, 127],
        serious: [239, 68, 68],
        moderate: [245, 158, 11],
        minor: [34, 197, 94]
      };
      
      this.doc.setTextColor(...(severityColors[severity] || this.colors.gray));
      this.doc.text(`${severity.toUpperCase()} VIOLATIONS (${severityViolations.length})`, this.margin, this.currentY);
      this.currentY += 12;

      // Process each violation in this severity
      severityViolations.forEach((violation, index) => {
        this.addDetailedViolation(violation, index + 1, pages);
      });
    });
  }

  // Add detailed individual violation
  addDetailedViolation(violation, index, pages) {
    this.checkPageBreak(80);

    // Violation header box
    this.doc.setFillColor(248, 250, 252);
    this.doc.setDrawColor(203, 213, 225);
    this.doc.rect(this.margin, this.currentY - 3, this.pageWidth - (this.margin * 2), 25, 'FD');

    // Violation title
    this.doc.setFontSize(12);
    this.doc.setTextColor(...this.colors.dark);
    this.doc.setFont('helvetica', 'bold');
    const title = `${index}. ${violation.id || violation.rule || 'Unknown Rule'}`;
    this.doc.text(title, this.margin + 5, this.currentY + 8);

    // Impact badge
    const impactColor = {
      critical: [220, 38, 127],
      serious: [239, 68, 68], 
      moderate: [245, 158, 11],
      minor: [34, 197, 94]
    };
    
    this.doc.setFillColor(...(impactColor[violation.impact] || this.colors.gray));
    this.doc.rect(this.pageWidth - this.margin - 40, this.currentY + 2, 35, 8, 'F');
    this.doc.setFontSize(9);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text((violation.impact || 'unknown').toUpperCase(), this.pageWidth - this.margin - 37, this.currentY + 7);

    this.currentY += 20;

    // Description
    this.doc.setFontSize(10);
    this.doc.setTextColor(...this.colors.dark);
    this.doc.setFont('helvetica', 'normal');
    
    if (violation.description) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Description:', this.margin + 5, this.currentY);
      this.currentY += 5;
      
      this.doc.setFont('helvetica', 'normal');
      const descLines = this.doc.splitTextToSize(violation.description, this.pageWidth - (this.margin * 2) - 10);
      descLines.forEach(line => {
        this.checkPageBreak(8);
        this.doc.text(line, this.margin + 5, this.currentY);
        this.currentY += 4;
      });
      this.currentY += 3;
    }

    // Help information
    if (violation.help) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('How to Fix:', this.margin + 5, this.currentY);
      this.currentY += 5;
      
      this.doc.setFont('helvetica', 'normal');
      const helpLines = this.doc.splitTextToSize(violation.help, this.pageWidth - (this.margin * 2) - 10);
      helpLines.forEach(line => {
        this.checkPageBreak(8);
        this.doc.text(line, this.margin + 5, this.currentY);
        this.currentY += 4;
      });
      this.currentY += 3;
    }

    // WCAG Information
    if (violation.tags && violation.tags.length > 0) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('WCAG Guidelines:', this.margin + 5, this.currentY);
      this.currentY += 5;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(violation.tags.join(', '), this.margin + 5, this.currentY);
      this.currentY += 8;
    }

    // Help URL
    if (violation.helpUrl) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Reference:', this.margin + 5, this.currentY);
      this.currentY += 5;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(37, 99, 235); // Blue for URL
      this.doc.text(violation.helpUrl, this.margin + 5, this.currentY);
      this.doc.setTextColor(...this.colors.dark); // Reset color
      this.currentY += 8;
    }

    // Affected elements
    if (violation.nodes && violation.nodes.length > 0) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...this.colors.dark);
      this.doc.text(`Affected Elements (${violation.nodes.length} found):`, this.margin + 5, this.currentY);
      this.currentY += 8;

      // Show first 3 elements in detail
      const elementsToShow = violation.nodes.slice(0, 3);
      elementsToShow.forEach((node, nodeIndex) => {
        this.checkPageBreak(25);
        
        // Element box
        this.doc.setFillColor(255, 251, 235);
        this.doc.rect(this.margin + 10, this.currentY - 2, this.pageWidth - (this.margin * 2) - 20, 20, 'F');
        
        // Element number
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(`Element ${nodeIndex + 1}:`, this.margin + 15, this.currentY + 3);
        this.currentY += 8;

        // HTML snippet
        if (node.html) {
          this.doc.setFont('courier', 'normal');
          this.doc.setFontSize(8);
          const htmlLines = this.doc.splitTextToSize(
            node.html.length > 100 ? node.html.substring(0, 100) + '...' : node.html, 
            this.pageWidth - (this.margin * 2) - 30
          );
          htmlLines.forEach(line => {
            this.doc.text(line, this.margin + 15, this.currentY);
            this.currentY += 3;
          });
        }

        // Target selector
        if (node.target && node.target.length > 0) {
          this.doc.setFont('helvetica', 'normal');
          this.doc.setFontSize(8);
          this.doc.text(`Selector: ${node.target.join(', ')}`, this.margin + 15, this.currentY);
          this.currentY += 5;
        }

        this.currentY += 5;
      });

      // Show count if more elements exist
      if (violation.nodes.length > 3) {
        this.doc.setFont('helvetica', 'italic');
        this.doc.setFontSize(9);
        this.doc.text(`... and ${violation.nodes.length - 3} more similar elements`, this.margin + 15, this.currentY);
        this.currentY += 8;
      }
    }

    // Page information
    if (pages) {
      const violationPages = pages.filter(page => 
        page.violations && page.violations.some(v => v.id === violation.id)
      );
      
      if (violationPages.length > 0) {
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(`Found on Pages (${violationPages.length}):`, this.margin + 5, this.currentY);
        this.currentY += 5;
        
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(9);
        violationPages.forEach(page => {
          const pageUrl = page.url.length > 60 ? page.url.substring(0, 60) + '...' : page.url;
          this.doc.text(`• ${pageUrl}`, this.margin + 10, this.currentY);
          this.currentY += 4;
        });
      }
    }

    this.currentY += 10; // Space before next violation
  }

  // Add pages summary
  addPagesSummary(pages) {
    if (!pages || pages.length === 0) return;

    this.addSectionHeader('Pages Scanned Summary');
    
    pages.forEach((page, index) => {
      this.checkPageBreak(30);
      
      // Page header
      this.doc.setFillColor(240, 248, 255);
      this.doc.rect(this.margin, this.currentY - 2, this.pageWidth - (this.margin * 2), 15, 'F');
      
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...this.colors.secondary);
      const pageTitle = `Page ${index + 1}: ${page.url.length > 50 ? page.url.substring(0, 50) + '...' : page.url}`;
      this.doc.text(pageTitle, this.margin + 5, this.currentY + 8);
      this.currentY += 18;

      // Page stats
      const pageViolations = page.violations || [];
      const violationsBySeverity = {
        critical: pageViolations.filter(v => v.impact === 'critical').length,
        serious: pageViolations.filter(v => v.impact === 'serious').length,
        moderate: pageViolations.filter(v => v.impact === 'moderate').length,
        minor: pageViolations.filter(v => v.impact === 'minor').length
      };

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      this.doc.setTextColor(...this.colors.dark);
      
      this.doc.text(`Total Violations: ${pageViolations.length}`, this.margin + 10, this.currentY);
      this.currentY += 5;
      
      Object.entries(violationsBySeverity).forEach(([severity, count]) => {
        if (count > 0) {
          this.doc.text(`• ${severity.charAt(0).toUpperCase() + severity.slice(1)}: ${count}`, this.margin + 10, this.currentY);
          this.currentY += 4;
        }
      });

      this.currentY += 8;
    });
  }

  // Check if we need a page break
  checkPageBreak(requiredSpace) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }

  // Add footer with page numbers
  addFooter() {
    const pageCount = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Footer line
      this.doc.setDrawColor(...this.colors.gray);
      this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);
      
      // Page number
      this.doc.setFontSize(10);
      this.doc.setTextColor(...this.colors.gray);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 8,
        { align: 'center' }
      );
      
      // Generation date
      this.doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        this.pageWidth - this.margin,
        this.pageHeight - 8,
        { align: 'right' }
      );
    }
  }

  // Generate complete comprehensive report
  generateReport(reportData, metadata, rawViolations = null, pages = null) {
    // Cover page
    this.addHeader('Comprehensive Accessibility Audit Report');
    
    // Executive summary
    this.addInfoBox('Website Information', {
      'URL': metadata.websiteUrl,
      'Scan Date': new Date(metadata.generatedAt).toLocaleDateString(),
      'Total Violations': metadata.totalViolations,
      'Violation Types': metadata.uniqueViolationTypes
    });

    this.addSectionHeader('Executive Summary');
    this.addParagraph(reportData.executiveSummary);

    // Compliance Status
    this.addSectionHeader('Compliance Status');
    if (reportData.complianceStatus) {
      Object.entries(reportData.complianceStatus).forEach(([key, value]) => {
        this.addParagraph(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 11);
      });
    }

    // Critical Findings from AI
    if (reportData.criticalFindings && reportData.criticalFindings.length > 0) {
      this.addSectionHeader('Critical Findings');
      reportData.criticalFindings.forEach((finding, index) => {
        this.addParagraph(`${index + 1}. ${finding.finding}`, 12);
        this.addParagraph(`Business Impact: ${finding.businessImpact}`);
        this.addParagraph(`Legal Risk: ${finding.legalRisk}`);
        this.currentY += 5;
      });
    }

    // NEW: Detailed violations section with raw scan data
    if (rawViolations && rawViolations.length > 0) {
      // Start new page for detailed violations
      this.doc.addPage();
      this.currentY = this.margin + 10;
      this.addDetailedViolationsSection(rawViolations, pages);
    }

    // NEW: Pages summary if available
    if (pages && pages.length > 0) {
      this.doc.addPage();
      this.currentY = this.margin + 10;
      this.addPagesSummary(pages);
    }

    // AI Analysis (if available)
    if (reportData.detailedAnalysis && reportData.detailedAnalysis.length > 0) {
      this.doc.addPage();
      this.currentY = this.margin + 10;
      this.addSectionHeader('AI Analysis & Recommendations');
      
      reportData.detailedAnalysis.forEach((analysis, index) => {
        this.addSectionHeader(`${index + 1}. ${analysis.violationType}`);
        this.addParagraph(`User Impact: ${analysis.userImpact}`);
        this.addParagraph(`Business Risk: ${analysis.businessRisk}`);
        
        if (analysis.remediationSteps && analysis.remediationSteps.length > 0) {
          this.addSectionHeader('Remediation Steps');
          this.addBulletList(analysis.remediationSteps);
        }
      });
    }

    // Implementation Roadmap
    this.doc.addPage();
    this.currentY = this.margin + 10;
    this.addSectionHeader('Implementation Roadmap');
    
    if (reportData.implementationRoadmap) {
      Object.entries(reportData.implementationRoadmap).forEach(([phase, details]) => {
        this.addSectionHeader(details.title);
        this.addParagraph(`Estimated Effort: ${details.effort}`);
        if (details.items && details.items.length > 0) {
          this.addBulletList(details.items);
        }
      });
    }

    // Resource Requirements
    this.addSectionHeader('Resource Requirements');
    if (reportData.resourceRequirements) {
      Object.entries(reportData.resourceRequirements).forEach(([key, value]) => {
        this.addParagraph(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 11);
      });
    }

    // Add footers
    this.addFooter();

    return this.doc;
  }
}

// Helper function to generate and download comprehensive report
export const generateComprehensiveReportPDF = async (reportData, metadata, filename = 'accessibility-comprehensive-report.pdf', rawViolations = null, pages = null) => {
  const pdfGenerator = new ComprehensiveReportPDF();
  const doc = pdfGenerator.generateReport(reportData, metadata, rawViolations, pages);
  
  // Download the PDF
  doc.save(filename);
  
  return doc;
};