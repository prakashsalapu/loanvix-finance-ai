import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useScrollPosition'
import { useCalculator } from '../context/CalculatorContext'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import {
  Download,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const ITEMS_PER_PAGE = 12

const formatAmount = (value) => {
  return `₹${Math.round(value).toLocaleString('en-IN')}`
}

export default function Schedule() {

  const [ref, isInView] = useInView()

  const { results } = useCalculator()

  const [searchTerm, setSearchTerm] = useState('')

  const [currentPage, setCurrentPage] = useState(1)

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  const generateDate = (monthIndex) => {

    const date = new Date(startDate)

    date.setMonth(date.getMonth() + monthIndex)

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric' 
    })

  }

  const enhancedSchedule = useMemo(() => {

    return results.schedule.map((row, index) => ({
      ...row,
      paymentDate: generateDate(index)
    }))

  }, [results.schedule, startDate])

  const filteredSchedule = useMemo(() => {

    if (!searchTerm.trim()) {
      return enhancedSchedule
    }

    const term = searchTerm.toLowerCase()

   return enhancedSchedule.filter((row) =>

      row.paymentDate.toLowerCase().includes(term) ||
      Math.round(row.emi).toString().includes(term) ||
      Math.round(row.principal).toString().includes(term) ||
      Math.round(row.interest).toString().includes(term) ||
      Math.round(row.balance).toString().includes(term)

    )

  }, [enhancedSchedule, searchTerm])

  const totalPages = Math.ceil(
    filteredSchedule.length / ITEMS_PER_PAGE
  )

  const paginatedSchedule = filteredSchedule.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSearch = useCallback((e) => {

    setSearchTerm(e.target.value)

    setCurrentPage(1)

  }, [])

  const downloadCSV = () => {

    const headers = [
      'Month',
      'Date',
      'EMI',
      'Principal',
      'Interest',
      'Balance'
    ]

    const rows = enhancedSchedule.map((row) => [
      row.month,
      row.paymentDate,
      Math.round(row.emi),
      Math.round(row.principal),
      Math.round(row.interest),
      Math.round(row.balance)
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.join(','))
    ].join('\n')

    const blob = new Blob(
      [csvContent],
      { type: 'text/csv;charset=utf-8;' }
    )

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url

    link.download = 'loanvix-schedule.csv'

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)

  }

  const downloadPDF = () => {

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const primary = [37, 99, 235]
    const gray = [107, 114, 128]

    const pageWidth =
      doc.internal.pageSize.getWidth()

    const pageHeight =
      doc.internal.pageSize.getHeight()

    

    // HEADER

    doc.setFont('helvetica', 'bold')

    doc.setFontSize(22)

    doc.setTextColor(...primary)

    doc.text('LoanVix', 14, 18)

    doc.setFontSize(11)

    doc.setTextColor(...gray)

    doc.text(
      'Loan Repayment Statement',
      14,
      25
    )

    // LINE

    doc.setDrawColor(230)

    doc.line(14, 30, 196, 30)

    // SUMMARY

    doc.setFontSize(10)

    doc.setTextColor(40)

    const summaryY = 40

    const loanAmount =
      (results.schedule[0]?.balance || 0) +
      (results.schedule[0]?.principal || 0)

    const monthlyEmi =
      results.schedule[0]?.emi || 0

    const summary = [

      [
        'Loan Amount',
        `${Math.round(loanAmount).toLocaleString('en-IN')}`
      ],

      [
        'Monthly EMI',
        `${Math.round(monthlyEmi).toLocaleString('en-IN')}`
      ],

      [
        'Total Months',
        `${results.schedule.length}`
      ],

      [
        'Generated',
        new Date().toLocaleDateString('en-IN')
      ]

    ]

    summary.forEach((item, index) => {

      const x = index % 2 === 0 ? 14 : 110

      const y =
        summaryY + Math.floor(index / 2) * 8

      doc.setFont('helvetica', 'bold')

      doc.text(`${item[0]}:`, x, y)

      doc.setFont('helvetica', 'normal')

      doc.text(`${item[1]}`, x + 35, y)

    })

    // TABLE

    autoTable(doc, {

      startY: 60,

      theme: 'grid',

      head: [[
        'Month',
        'Date',
        'EMI',
        'Principal',
        'Interest',
        'Balance'
      ]],

      body: enhancedSchedule.map((row) => [

        row.month,

        row.paymentDate,

        `${Math.round(row.emi).toLocaleString('en-IN')}`,

        `${Math.round(row.principal).toLocaleString('en-IN')}`,

        `${Math.round(row.interest).toLocaleString('en-IN')}`,

        `${Math.round(row.balance).toLocaleString('en-IN')}`

      ]),

      styles: {

        font: 'helvetica',

        fontStyle: 'normal',

        fontSize: 9,

        cellPadding: 3,

        overflow: 'linebreak',

        valign: 'middle',

        halign: 'right',

        textColor: [31, 41, 55],

        lineColor: [229, 231, 235],

        lineWidth: 0.2

      },

      headStyles: {

        fillColor: primary,

        textColor: 255,

        fontStyle: 'bold',

        halign: 'center',

        fontSize: 10

      },

      alternateRowStyles: {

        fillColor: [249, 250, 251]

      },

      columnStyles: {

        0: {
          halign: 'center',
          cellWidth: 18
        },

        1: {
          halign: 'center',
          cellWidth: 30
        },

        2: {
          halign: 'right',
          cellWidth: 32
        },

        3: {
          halign: 'right',
          cellWidth: 32
        },

        4: {
          halign: 'right',
          cellWidth: 32
        },

        5: {
          halign: 'right',
          cellWidth: 40
        }

      },

      margin: {
        left: 14,
        right: 14
      },


    })

    // FOOTER

    const pageCount =
      doc.internal.getNumberOfPages()

    for (let i = 1; i <= pageCount; i++) {

      doc.setPage(i)

      doc.setFontSize(8)

      doc.setTextColor(120)

      doc.text(
        `Page ${i} of ${pageCount}`,
        180,
        290
      )

      doc.text(
  'Generated by LoanVix',
  14,
  286
)

    doc.setFontSize(7)

    doc.setTextColor(140)

    doc.text(
      'This repayment statement is system generated for informational purposes only and does not require a physical signature.',
      14,
      291
    )

    }

    doc.save('loanvix-bank-statement.pdf')

  }

  return (

    <section
      id="schedule"
      ref={ref}
      className="py-16 lg:py-24 bg-white"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >

          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4 border border-blue-100">
            Schedule
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Detailed{' '}
            <span className="gradient-text">
              repayment schedule
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-500">
            Complete month-by-month breakdown with principal,
            interest, and outstanding balance.
          </p>

        </motion.div>

        {/* CONTROLS */}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6"
        >

          <div className="flex flex-col sm:flex-row gap-4 w-full">

            {/* DATE */}

            <div className="w-full sm:w-72">

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min="2000-01-01"
                max="2100-12-31"
                className="input w-full"
              />

            </div>

            {/* SEARCH */}

            <div className="flex-1">

              <input
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by Date or Amount..."
                className="input w-full"
              />

            </div>

          </div>

          {/* EXPORT BUTTONS */}

          <div className="flex gap-2 w-full sm:w-auto">

            <button
              onClick={downloadCSV}
              className="btn btn-secondary flex-1 sm:flex-none text-sm px-4 py-2.5"
            >

              <Download className="w-4 h-4" />

              CSV

            </button>

            <button
              onClick={downloadPDF}
              className="btn btn-primary flex-1 sm:flex-none text-sm px-4 py-2.5"
            >

              <FileText className="w-4 h-4" />

              PDF

            </button>

          </div>

        </motion.div>

        {/* TABLE */}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >

          <div className="table-container overflow-hidden">

            <div className="overflow-x-auto">

              <div
                style={{
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}
              >

                <table className="min-w-full">

                  <thead className="sticky top-0 bg-white z-10">

                    <tr>

                      <th className="text-center">
                        Month
                      </th>

                      <th className="text-center">
                        Date
                      </th>

                      <th className="text-right">
                        EMI
                      </th>

                      <th className="text-right">
                        Principal
                      </th>

                      <th className="text-right">
                        Interest
                      </th>

                      <th className="text-right">
                        Balance
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {paginatedSchedule.map((row) => (

                      <tr
                        key={`${row.month}-${row.paymentDate}`}
                        className="hover:bg-gray-50 transition-colors"
                      >

                        <td className="text-center font-medium text-gray-900">
                          {row.month}
                        </td>

                        <td className="text-center text-gray-600">
                          {row.paymentDate}
                        </td>

                        <td className="text-right font-semibold text-gray-900">
                          {formatAmount(row.emi)}
                        </td>

                        <td className="text-right text-blue-600">
                          {formatAmount(row.principal)}
                        </td>

                        <td className="text-right text-emerald-600">
                          {formatAmount(row.interest)}
                        </td>

                        <td className="text-right text-gray-500">
                          {formatAmount(row.balance)}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </motion.div>

        {/* PAGINATION */}

        {totalPages > 1 && (

          <div className="flex items-center justify-between mt-5">

            <p className="text-sm text-gray-500">

              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}

              –

              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredSchedule.length
              )}

              {' '}of {filteredSchedule.length}

            </p>

            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-100"
              >

                <ChevronLeft className="w-4 h-4" />

              </button>

              <span className="text-sm font-medium text-gray-700 px-2">

                {currentPage} / {totalPages}

              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-100"
              >

                <ChevronRight className="w-4 h-4" />

              </button>

            </div>

          </div>

        )}

      </div>

    </section>

  )
}