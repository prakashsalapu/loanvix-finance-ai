/**
 * Professional Prepayment Analysis Report Generator (PDF)
 * Creates bank-statement style PDF reports with comprehensive analysis
 */

import jsPDF from 'jspdf'

/**
 * Generate and download prepayment analysis report as PDF
 */
export async function generatePrepaymentReportPDF(loan, analysis, scenarios, healthScore, recommendations) {
  try {
    // Validate inputs
    if (!loan || !analysis || !analysis.scenarios || analysis.scenarios.length === 0) {
      throw new Error('Invalid loan or analysis data')
    }
    
    if (!Array.isArray(recommendations)) {
      console.warn('Recommendations is not an array, using empty array')
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    let yPosition = margin

    // ===== HEADER SECTION =====
    doc.setFillColor(59, 130, 246) // Blue
    doc.rect(0, 0, pageWidth, 40, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont(undefined, 'bold')
    doc.text('₹ LoanVix', margin, yPosition + 12)

    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text('PREPAYMENT ANALYSIS REPORT', margin, yPosition + 20)
    doc.text(`Generated on ${formatDate(new Date())}`, pageWidth - margin - 60, yPosition + 20)

    yPosition += 35

    // ===== EXECUTIVE SUMMARY =====
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Executive Summary', margin, yPosition)
    yPosition += 8

    // Health score section
    const scoreColor = getScoreColor(healthScore)
    doc.setFillColor(...scoreColor)
    doc.rect(margin, yPosition, 50, 15, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont(undefined, 'bold')
    doc.text(`${healthScore}`, margin + 25, yPosition + 10, { align: 'center' })
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text('Loan Health Score', margin + 25, yPosition + 13.5, { align: 'center' })

    // Key metrics
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    
    // Get the best scenario object
    const bestScenarioForMetrics = analysis.scenarios[analysis.bestScenarioIndex] || analysis.scenarios[0]
    
    const metrics = [
      { label: 'Current Tenure', value: `${(loan.tenure / 12).toFixed(1)} years` },
      { label: 'Total Interest', value: `₹${formatCurrency(loan.totalInterest)}` },
      { label: 'Potential Savings', value: `₹${formatCurrency(bestScenarioForMetrics?.savings?.interestSaved || 0)}` }
    ]

    let metricsX = margin + 65
    metrics.forEach((metric, idx) => {
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)
      doc.text(metric.label, metricsX, yPosition + 3)
      doc.setFont(undefined, 'bold')
      doc.setFontSize(11)
      doc.text(metric.value, metricsX, yPosition + 9)
      metricsX += 50
    })

    yPosition += 25

    // ===== LOAN COMPARISON TABLE =====
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Loan Comparison Analysis', margin, yPosition)
    yPosition += 10

    // Table headers
    doc.setFontSize(9)
    doc.setFont(undefined, 'bold')
    doc.setFillColor(240, 240, 240)
    const tableHeaders = ['Metric', 'Current Loan', 'Best Strategy', 'Difference']
    const colWidths = [45, 40, 40, 40]
    let tableX = margin

    tableHeaders.forEach((header, idx) => {
      doc.rect(tableX, yPosition, colWidths[idx], 8, 'F')
      doc.setTextColor(0, 0, 0)
      doc.text(header, tableX + 2, yPosition + 5.5, { fontSize: 8 })
      tableX += colWidths[idx]
    })

    yPosition += 10

    // Table rows
    doc.setFont(undefined, 'normal')
    doc.setFontSize(8)
    const bestScenario = analysis.scenarios[analysis.bestScenarioIndex] || analysis.scenarios[0]
    
    // Ensure bestScenario has required properties
    if (!bestScenario || !bestScenario.metrics || !bestScenario.savings) {
      throw new Error('Invalid scenario data: missing metrics or savings')
    }
    
    const tableData = [
      {
        label: 'Monthly EMI',
        current: `₹${formatCurrency(loan.emi)}`,
        best: `₹${formatCurrency(bestScenario.metrics.emi || loan.emi)}`,
        diff: `₹${formatCurrency((bestScenario.metrics.emi || loan.emi) - loan.emi)}`
      },
      {
        label: 'Tenure',
        current: `${(loan.tenure / 12).toFixed(1)} years`,
        best: `${(bestScenario.metrics.tenure / 12).toFixed(1)} years`,
        diff: `-${(bestScenario.savings.yearsReduced || 0).toFixed(1)} years`
      },
      {
        label: 'Total Interest',
        current: `₹${formatCurrency(loan.totalInterest)}`,
        best: `₹${formatCurrency(bestScenario.metrics.totalInterest || 0)}`,
        diff: `₹${formatCurrency(bestScenario.savings.interestSaved || 0)}`
      },
      {
        label: 'Total Repayment',
        current: `₹${formatCurrency(loan.principal + loan.totalInterest)}`,
        best: `₹${formatCurrency(bestScenario.metrics.totalRepayment || 0)}`,
        diff: `₹${formatCurrency((loan.principal + loan.totalInterest) - (bestScenario.metrics.totalRepayment || 0))}`
      }
    ]

    if (!tableData || tableData.length === 0) {
      throw new Error('Failed to create table data')
    }

    tableData.forEach((row) => {
      tableX = margin
      doc.rect(tableX, yPosition, colWidths[0], 7)
      doc.text(row.label, tableX + 2, yPosition + 4.5)
      tableX += colWidths[0]

      [row.current, row.best, row.diff].forEach((value, idx) => {
        doc.rect(tableX, yPosition, colWidths[idx + 1], 7)
        doc.text(value, tableX + 2, yPosition + 4.5, { maxWidth: colWidths[idx + 1] - 4 })
        tableX += colWidths[idx + 1]
      })

      yPosition += 7
    })

    yPosition += 5

    // ===== SCENARIO DETAILS =====
    if (analysis.scenarios && Array.isArray(analysis.scenarios) && analysis.scenarios.length > 0) {
      // Add page break if needed
      if (yPosition > pageHeight - 60) {
        doc.addPage()
        yPosition = margin
      }

      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('Scenario Analysis', margin, yPosition)
      yPosition += 8

      // Display each scenario
      analysis.scenarios.slice(0, 3).forEach((scenario, idx) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage()
          yPosition = margin
        }

        doc.setFontSize(10)
        doc.setFont(undefined, 'bold')
        doc.text(`${idx + 1}. ${scenario.name || 'Scenario'}`, margin + 2, yPosition)
        yPosition += 6

        doc.setFontSize(9)
        doc.setFont(undefined, 'normal')
        doc.setTextColor(100, 100, 100)
        doc.text(scenario.description || '', margin + 4, yPosition, { maxWidth: pageWidth - 2 * margin - 4 })
        yPosition += 6

        doc.setTextColor(0, 0, 0)
        const scenarioInfo = [
          `EMI: ₹${formatCurrency(scenario.metrics?.emi || 0)}`,
          `Tenure: ${((scenario.metrics?.tenure || 0) / 12).toFixed(1)} yrs`,
          `Interest: ₹${formatCurrency(scenario.metrics?.totalInterest || 0)}`
        ]
        doc.setFontSize(8)
        scenarioInfo.forEach((info) => {
          doc.text(info, margin + 4, yPosition)
          yPosition += 4
        })

        yPosition += 4
      })
    }

    yPosition += 2

    // ===== AI RECOMMENDATIONS =====
    if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
      if (yPosition > pageHeight - 60) {
        doc.addPage()
        yPosition = margin
      }

      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('AI-Powered Recommendations', margin, yPosition)
      yPosition += 8

      recommendations.slice(0, 3).forEach((rec) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage()
          yPosition = margin
        }

        // Recommendation box
        doc.setFillColor(240, 245, 255)
        doc.rect(margin, yPosition - 1, pageWidth - 2 * margin, 20, 'F')

        doc.setFont(undefined, 'bold')
        doc.setFontSize(9)
        doc.setTextColor(0, 0, 0)
        doc.text(`${rec.title || 'Recommendation'}`, margin + 2, yPosition + 3)

        doc.setFont(undefined, 'normal')
        doc.setFontSize(8)
        doc.setTextColor(80, 80, 80)
        doc.text(rec.description || '', margin + 2, yPosition + 8, { maxWidth: pageWidth - 2 * margin - 4 })

        yPosition += 22
      })
    }

    // ===== FOOTER =====
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('This report is generated based on the provided loan parameters. Actual results may vary based on market conditions.', margin, pageHeight - 10, { maxWidth: pageWidth - 2 * margin })

    // Download PDF
    doc.save(`LoanVix_Prepayment_Report_${formatDateForFilename(new Date())}.pdf`)

    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    return false
  }
}

/**
 * Helper functions for PDF generation
 */
function formatCurrency(amount) {
  if (isNaN(amount)) return '0'
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`
  return Math.round(amount).toString()
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatDateForFilename(date) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

function getScoreColor(score) {
  if (score >= 80) return [16, 185, 129] // Emerald
  if (score >= 60) return [59, 130, 246] // Blue
  if (score >= 40) return [245, 158, 11] // Amber
  return [239, 68, 68] // Red
}
