import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useScrollPosition'
import { useCalculator } from '../context/CalculatorContext'
import { formatCurrency, generateScheduleCSV } from '../utils/calculations'
import { Search, Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react'

const ITEMS_PER_PAGE = 12

async function exportPDF(schedule, values, results) {
  // Dynamically import to keep initial bundle small
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Header
  doc.setFontSize(20)
  doc.setTextColor(37, 99, 235)
  doc.text('LoanVix — Repayment Schedule', 14, 18)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 25)

  // Summary box
  const summaryY = 32
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  const summaryData = [
    ['Loan Amount', `₹${Math.round(values.loanAmount).toLocaleString('en-IN')}`],
    ['Interest Rate', `${values.interestRate}% p.a.`],
    ['Tenure', `${values.tenure} months`],
    ['Monthly EMI', `₹${Math.round(results.emi).toLocaleString('en-IN')}`],
    ['Total Interest', `₹${Math.round(results.totalInterest).toLocaleString('en-IN')}`],
    ['Total Payment', `₹${Math.round(results.totalPayment).toLocaleString('en-IN')}`]
  ]
  summaryData.forEach(([label, val], i) => {
    const col = i < 3 ? 0 : 1
    const row = i % 3
    doc.text(`${label}: ${val}`, 14 + col * 95, summaryY + row * 6)
  })

  // Table
  autoTable(doc, {
    startY: summaryY + 22,
    head: [['Month', 'EMI (₹)', 'Principal (₹)', 'Interest (₹)', 'Balance (₹)']],
    body: schedule.map(r => [
      r.month,
      Math.round(r.emi).toLocaleString('en-IN'),
      Math.round(r.principal).toLocaleString('en-IN'),
      Math.round(r.interest).toLocaleString('en-IN'),
      Math.round(r.balance).toLocaleString('en-IN')
    ]),
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 18 },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    },
    margin: { left: 14, right: 14 }
  })

  doc.save('loanvix-repayment-schedule.pdf')
}

function exportCSV(schedule, values, results) {
  const meta = {
    'Loan Amount': `₹${Math.round(values.loanAmount).toLocaleString('en-IN')}`,
    'Interest Rate': `${values.interestRate}%`,
    'Tenure': `${values.tenure} months`,
    'Monthly EMI': `₹${Math.round(results.emi).toLocaleString('en-IN')}`,
    'Total Interest': `₹${Math.round(results.totalInterest).toLocaleString('en-IN')}`
  }
  const csv = generateScheduleCSV(schedule, { title: 'LoanVix Repayment Schedule', ...meta })
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'loanvix-repayment-schedule.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function Schedule() {
  const [ref, isInView] = useInView()
  const { values, results } = useCalculator()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pdfLoading, setPdfLoading] = useState(false)

  const filteredSchedule = useMemo(() => {
    if (!searchTerm.trim()) return results.schedule
    const term = searchTerm.toLowerCase()
    return results.schedule.filter(row =>
      row.month.toString().includes(term) ||
      Math.round(row.emi).toString().includes(term) ||
      Math.round(row.principal).toString().includes(term) ||
      Math.round(row.interest).toString().includes(term) ||
      Math.round(row.balance).toString().includes(term)
    )
  }, [results.schedule, searchTerm])

  const totalPages = Math.ceil(filteredSchedule.length / ITEMS_PER_PAGE)
  const paginatedSchedule = filteredSchedule.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }, [])

  const handlePdfExport = async () => {
    setPdfLoading(true)
    try {
      await exportPDF(results.schedule, values, results)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <section id="schedule" ref={ref} className="py-16 lg:py-24 bg-white" aria-labelledby="schedule-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4 border border-blue-100">
            Schedule
          </span>
          <h2 id="schedule-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-balance leading-tight">
            Detailed <span className="gradient-text">repayment schedule</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500">
            Complete month-by-month breakdown with principal, interest, and outstanding balance.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center mb-6"
        >
          {/* Search */}
          <div className="relative w-full sm:flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by month or amount..."
              className="input pl-9 w-full"
              aria-label="Search repayment schedule"
            />
          </div>

          {/* Export buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => exportCSV(results.schedule, values, results)}
              className="btn btn-secondary flex-1 sm:flex-none text-sm px-3 sm:px-4 py-2.5"
              aria-label="Export schedule as CSV"
              disabled={results.schedule.length === 0}
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={handlePdfExport}
              className="btn btn-primary flex-1 sm:flex-none text-sm px-3 sm:px-4 py-2.5"
              aria-label="Export schedule as PDF"
              disabled={pdfLoading || results.schedule.length === 0}
            >
              {pdfLoading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <FileText className="w-4 h-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{pdfLoading ? 'Generating...' : 'PDF'}</span>
            </button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {results.schedule.length === 0 ? (
            <div className="table-container p-12 text-center text-gray-400">
              <p className="text-base font-medium">No schedule to display — please enter valid loan values.</p>
            </div>
          ) : (
            <div className="table-container">
              <div style={{ maxHeight: '460px', overflowY: 'auto' }}>
                <table aria-label="Loan repayment schedule">
                  <thead>
                    <tr>
                      <th scope="col" className="text-center">Month</th>
                      <th scope="col" className="text-right">EMI</th>
                      <th scope="col" className="text-right">Principal</th>
                      <th scope="col" className="text-right">Interest</th>
                      <th scope="col" className="text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSchedule.map((row) => (
                      <tr key={row.month} className="hover:bg-gray-50 transition-colors">
                        <td className="text-center font-medium text-gray-900">{row.month}</td>
                        <td className="text-right font-semibold text-gray-900">{formatCurrency(row.emi)}</td>
                        <td className="text-right text-blue-600">{formatCurrency(row.principal)}</td>
                        <td className="text-right text-emerald-600">{formatCurrency(row.interest)}</td>
                        <td className="text-right text-gray-500">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="flex items-center justify-between mt-5"
          >
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredSchedule.length)} of {filteredSchedule.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-40 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 px-2" aria-live="polite">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-40 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Summary footer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8"
        >
          {[
            { label: 'First EMI', value: formatCurrency(results.schedule[0]?.emi ?? 0) },
            { label: 'Last EMI', value: formatCurrency(results.schedule[results.schedule.length - 1]?.emi ?? 0) },
            { label: 'Total Payments', value: results.schedule.length, isCount: true },
            { label: 'Final Balance', value: '₹0', isRaw: true }
          ].map((item) => (
            <div key={item.label} className="card p-4 sm:p-5 text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                {item.isCount ? item.value : item.isRaw ? item.value : item.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
