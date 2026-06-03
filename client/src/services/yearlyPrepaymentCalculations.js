/**
 * Yearly Prepayment Analysis Calculations
 * Handles prepayment strategy analysis with month-by-month tracking
 */

function roundTo(value, decimals = 2) {
  const factor = Math.pow(10, decimals)
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/**
 * Calculate amortization schedule with yearly prepayments
 * @param {number} principal - Original loan amount
 * @param {number} annualRate - Annual interest rate
 * @param {number} tenure - Tenure in months
 * @param {number} yearlyPrepayment - Annual prepayment amount (applied at end of each year)
 * @returns {object} - { schedule, tenure, totalInterest, totalRepayment, loanClosureDate }
 */
export function calculateWithYearlyPrepayment(principal, annualRate, tenure, yearlyPrepayment = 0) {
  if (!principal || principal <= 0 || !tenure || tenure <= 0 || annualRate < 0) {
    return {
      schedule: [],
      tenure: 0,
      totalInterest: 0,
      totalRepayment: 0,
      loanClosureDate: null
    }
  }

  const r = annualRate === 0 ? 0 : annualRate / 12 / 100
  // Calculate original EMI without prepayment
  const emi = principal <= 0 ? 0 : calculateEMI(principal, annualRate, tenure)
  
  const schedule = []
  let balance = principal
  let month = 0
  let totalInterest = 0

  while (balance > 0.01 && month < 600) { // Max 50 years safety limit
    month++
    const interestPaid = roundTo(balance * r, 2)
    let principalPaid = roundTo(emi - interestPaid, 2)

    if (principalPaid <= 0) {
      return {
        schedule: [],
        tenure: 0,
        totalInterest: 0,
        totalRepayment: 0,
        loanClosureDate: null,
        error: 'EMI is insufficient to pay down principal'
      }
    }

    if (principalPaid >= balance) {
      principalPaid = balance
    }

    // Apply yearly prepayment at end of each year (month 12, 24, 36, etc.)
    let prepayApplied = 0
    if (yearlyPrepayment > 0 && month % 12 === 0) {
      prepayApplied = Math.min(yearlyPrepayment, Math.max(0, balance - principalPaid))
    }

    balance = roundTo(balance - principalPaid - prepayApplied, 2)
    totalInterest += interestPaid

    schedule.push({
      month,
      year: Math.ceil(month / 12),
      emi: roundTo(principalPaid + interestPaid, 2),
      principal: roundTo(principalPaid, 2),
      interest: roundTo(interestPaid, 2),
      prepayment: prepayApplied,
      balance: Math.max(0, balance)
    })

    if (balance <= 0.01) break
  }

  // Calculate loan closure date (assuming today as reference)
  const today = new Date()
  const loanClosureDate = new Date(today.getFullYear(), today.getMonth() + month, today.getDate())

  return {
    schedule,
    tenure: month,
    totalInterest: roundTo(totalInterest, 2),
    totalRepayment: roundTo(principal + totalInterest, 2),
    loanClosureDate,
    totalPrepaymentApplied: roundTo(
      schedule.reduce((sum, row) => sum + row.prepayment, 0),
      2
    )
  }
}

/**
 * Analyze yearly prepayment impact
 * @param {object} loan - { principal, annualRate, tenure, emi, totalInterest }
 * @param {number} yearlyPrepayment - Yearly prepayment amount
 * @returns {object} - Comprehensive analysis
 */
export function analyzeYearlyPrepayment(loan, yearlyPrepayment) {
  const { principal, annualRate, tenure, emi: currentEMI, totalInterest: currentTotalInterest } = loan

  if (!principal || principal <= 0 || yearlyPrepayment <= 0) {
    return {
      isValid: false,
      error: 'Invalid loan or prepayment parameters'
    }
  }

  // Calculate without prepayment
  const currentLoan = {
    tenure,
    totalInterest: currentTotalInterest,
    totalRepayment: principal + currentTotalInterest,
    schedule: [] // Can be populated if needed
  }

  // Calculate with prepayment
  const optimizedLoan = calculateWithYearlyPrepayment(principal, annualRate, tenure, yearlyPrepayment)

  if (optimizedLoan.error) {
    return {
      isValid: false,
      error: optimizedLoan.error
    }
  }

  const monthsReduced = currentLoan.tenure - optimizedLoan.tenure
  const yearsReduced = roundTo(monthsReduced / 12, 2)
  const interestSaved = roundTo(currentTotalInterest - optimizedLoan.totalInterest, 2)
  const repaymentSaved = roundTo(
    (currentEMI * currentLoan.tenure + yearlyPrepayment * Math.ceil(currentLoan.tenure / 12)) -
    optimizedLoan.totalRepayment,
    2
  )

  return {
    isValid: true,
    yearlyPrepayment: roundTo(yearlyPrepayment, 2),
    currentLoan: {
      principal: roundTo(principal, 2),
      tenure: currentLoan.tenure,
      emi: roundTo(currentEMI, 2),
      totalInterest: roundTo(currentTotalInterest, 2),
      totalRepayment: roundTo(currentLoan.totalRepayment, 2),
      loanClosureDate: getCurrentLoanClosureDate(currentLoan.tenure)
    },
    optimizedLoan: {
      principal: roundTo(principal, 2),
      tenure: optimizedLoan.tenure,
      emi: roundTo(currentEMI, 2), // EMI stays same
      totalInterest: optimizedLoan.totalInterest,
      totalRepayment: optimizedLoan.totalRepayment,
      loanClosureDate: optimizedLoan.loanClosureDate,
      totalPrepaymentApplied: optimizedLoan.totalPrepaymentApplied
    },
    savings: {
      interestSaved,
      monthsReduced,
      yearsReduced,
      repaymentSaved,
      percentageInterestReduction: roundTo(
        (interestSaved / currentTotalInterest) * 100,
        2
      ),
      yearlyPrepaymentAmount: yearlyPrepayment,
      totalPrepaymentRequired: roundTo(
        yearlyPrepayment * Math.ceil(optimizedLoan.tenure / 12),
        2
      )
    },
    schedule: optimizedLoan.schedule
  }
}

/**
 * Calculate loan closure date based on tenure
 */
function getCurrentLoanClosureDate(tenureMonths) {
  const today = new Date()
  const closureDate = new Date(today.getFullYear(), today.getMonth() + tenureMonths, today.getDate())
  return closureDate
}

/**
 * Helper to calculate EMI (from main calculations)
 */
function calculateEMI(principal, annualRate, tenureMonths) {
  if (principal <= 0 || tenureMonths <= 0) return 0
  if (annualRate === 0) return roundTo(principal / tenureMonths, 2)

  const r = annualRate / 12 / 100
  const n = tenureMonths
  const factor = Math.pow(1 + r, n)
  return roundTo((principal * r * factor) / (factor - 1), 2)
}
