/**
 * Round to a given number of decimal places using banker's rounding
 */
function roundTo(value, decimals = 2) {
  const factor = Math.pow(10, decimals)
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/**
 * Calculate EMI using the standard formula:
 * EMI = [P × R × (1+R)^N] / [(1+R)^N − 1]
 * P = Principal, R = Monthly Interest Rate, N = Tenure in months
 */
export function calculateEMI(principal, annualRate, tenureMonths) {
  if (principal == null || annualRate == null || tenureMonths == null || principal <= 0 || tenureMonths <= 0) return 0
  if (annualRate === 0) return roundTo(principal / tenureMonths, 2)

  const r = annualRate / 12 / 100
  const n = tenureMonths
  const factor = Math.pow(1 + r, n)
  return roundTo((principal * r * factor) / (factor - 1), 2)
}

/**
 * Total interest paid over the full tenure (no prepayment)
 */
export function calculateTotalInterest(principal, emi, tenureMonths) {
  return roundTo(emi * tenureMonths - principal, 2)
}

/**
 * Generate a precise amortization schedule, optionally with annual prepayments.
 * Uses running balance to avoid accumulated rounding errors.
 */
export function generateAmortizationSchedule(principal, annualRate, tenureMonths, prepayment = 0) {
  if (!principal || !tenureMonths || principal <= 0 || tenureMonths <= 0 || annualRate < 0) return []

  const r = annualRate === 0 ? 0 : annualRate / 12 / 100
  const emi = calculateEMI(principal, annualRate, tenureMonths)
  const schedule = []
  let balance = principal

  for (let month = 1; month <= tenureMonths && balance > 0.01; month++) {
    const interestPaid = roundTo(balance * r, 2)
    let principalPaid = roundTo(emi - interestPaid, 2)

    // Last payment - settle remaining balance exactly
    if (principalPaid >= balance || month === tenureMonths) {
      principalPaid = roundTo(balance, 2)
    }

    // Annual prepayment (applied at end of each year, not exceeding balance)
    let prepayApplied = 0
    if (prepayment > 0 && month % 12 === 0) {
      prepayApplied = Math.min(prepayment, balance - principalPaid)
    }

    balance = roundTo(balance - principalPaid - prepayApplied, 2)

    schedule.push({
      month,
      emi: roundTo(principalPaid + interestPaid, 2),
      principal: roundTo(principalPaid, 2),
      interest: roundTo(interestPaid, 2),
      balance: Math.max(0, balance),
      prepay: prepayApplied,
      totalPaid: roundTo((principalPaid + interestPaid) * month, 2)
    })

    if (balance <= 0.01) break
  }

  return schedule
}

/**
 * Aggregate monthly schedule into yearly buckets
 */
export function getYearlySummary(schedule) {
  const summary = []
  for (let i = 0; i < schedule.length; i += 12) {
    const yearSlice = schedule.slice(i, i + 12)
    const year = Math.floor(i / 12) + 1
    summary.push({
      year,
      principal: roundTo(yearSlice.reduce((s, r) => s + r.principal, 0), 2),
      interest: roundTo(yearSlice.reduce((s, r) => s + r.interest, 0), 2),
      total: roundTo(yearSlice.reduce((s, r) => s + r.emi, 0), 2),
      balance: yearSlice[yearSlice.length - 1]?.balance ?? 0
    })
  }
  return summary
}

/**
 * Format as Indian Rupee currency
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.round(amount))
}

/**
 * Format a number in Indian numbering system
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(Math.round(num))
}

/**
 * Convert months to a human-readable string
 */
export function formatTenure(months) {
  const years = Math.floor(months / 12)
  const rem = months % 12
  if (years === 0) return `${rem} month${rem !== 1 ? 's' : ''}`
  if (rem === 0) return `${years} year${years !== 1 ? 's' : ''}`
  return `${years} yr${years !== 1 ? 's' : ''} ${rem} mo`
}

/**
 * Validate calculator input values - returns an object of field-level error strings
 */
export function validateInputs(values) {
  const errors = {}
  const { loanAmount, interestRate, tenure, processingFee, prepaymentAmount } = values

  if (loanAmount == null || loanAmount < 10000) errors.loanAmount = 'Minimum loan amount is ₹10,000'
  if (loanAmount > 100000000) errors.loanAmount = 'Maximum loan amount is ₹10 Cr'

  if (interestRate == null || interestRate < 0.5) errors.interestRate = 'Minimum interest rate is 0.5%'
  if (interestRate > 30) errors.interestRate = 'Maximum interest rate is 30%'

  if (tenure == null || tenure < 1) errors.tenure = 'Minimum tenure is 1 month'
  if (tenure > 360) errors.tenure = 'Maximum tenure is 360 months (30 years)'

  if (processingFee < 0) errors.processingFee = 'Processing fee cannot be negative'
  if (processingFee > 5) errors.processingFee = 'Processing fee cannot exceed 5%'

  if (prepaymentAmount < 0) errors.prepaymentAmount = 'Prepayment cannot be negative'
  if (prepaymentAmount > loanAmount) errors.prepaymentAmount = 'Prepayment cannot exceed loan amount'

  return errors
}

/**
 * Generate CSV content from amortization schedule
 */
export function generateScheduleCSV(schedule, meta = {}) {
  const header = meta.title ? `${meta.title}\n\n` : ''
  const metaLines = Object.entries(meta)
    .filter(([k]) => k !== 'title')
    .map(([k, v]) => `${k},${v}`)
    .join('\n')
  const cols = ['Month', 'EMI (₹)', 'Principal (₹)', 'Interest (₹)', 'Balance (₹)']
  const rows = schedule.map(r => [r.month, Math.round(r.emi), Math.round(r.principal), Math.round(r.interest), Math.round(r.balance)])
  return header + (metaLines ? metaLines + '\n\n' : '') + [cols, ...rows].map(r => r.join(',')).join('\n')
}
