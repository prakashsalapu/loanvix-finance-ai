/**
 * EMI Increase Analysis Calculations
 * Calculates impact of increasing monthly EMI on loan tenure, interest, and savings
 */

function roundTo(value, decimals = 2) {
  const factor = Math.pow(10, decimals)
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/**
 * Calculate new tenure based on increased EMI
 * Uses month-by-month calculation with running balance
 * 
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate
 * @param {number} newEMI - New EMI amount
 * @returns {object} - { tenure, totalInterest, totalRepayment, schedule }
 */
export function calculateNewTenureWithIncreasedEMI(principal, annualRate, newEMI) {
  if (!principal || principal <= 0 || !newEMI || newEMI <= 0 || annualRate < 0) {
    return {
      tenure: 0,
      totalInterest: 0,
      totalRepayment: 0,
      schedule: []
    }
  }

  const r = annualRate === 0 ? 0 : annualRate / 12 / 100
  const schedule = []
  let balance = principal
  let month = 0
  let totalInterest = 0

  // Limit to prevent infinite loops (max 360 months)
  while (balance > 0.01 && month < 360) {
    month++
    const interestPaid = roundTo(balance * r, 2)
    let principalPaid = roundTo(newEMI - interestPaid, 2)

    // If EMI is too low, it won't pay down the principal
    if (principalPaid <= 0) {
      return {
        tenure: 0,
        totalInterest: 0,
        totalRepayment: 0,
        schedule: [],
        error: 'EMI is too low to pay down the principal'
      }
    }

    // Last payment - settle remaining balance exactly
    if (principalPaid >= balance) {
      principalPaid = balance
    }

    balance = roundTo(balance - principalPaid, 2)
    totalInterest += interestPaid

    schedule.push({
      month,
      emi: roundTo(principalPaid + interestPaid, 2),
      principal: roundTo(principalPaid, 2),
      interest: roundTo(interestPaid, 2),
      balance: Math.max(0, balance)
    })

    if (balance <= 0.01) break
  }

  return {
    tenure: month,
    totalInterest: roundTo(totalInterest, 2),
    totalRepayment: roundTo(principal + totalInterest, 2),
    schedule
  }
}

/**
 * Calculate comprehensive EMI increase analysis
 * 
 * @param {object} currentLoan - { principal, annualRate, tenure, currentEMI, currentTotalInterest }
 * @param {number} emiIncrease - Amount to increase EMI by
 * @returns {object} - Complete analysis with savings metrics
 */
export function analyzeEMIIncrease(currentLoan, emiIncrease) {
  const {
    principal,
    annualRate,
    tenure: currentTenure,
    currentEMI,
    currentTotalInterest
  } = currentLoan

  // Validate inputs
  if (!principal || principal <= 0 || !currentEMI || currentEMI <= 0) {
    return {
      isValid: false,
      error: 'Invalid loan parameters'
    }
  }

  if (emiIncrease <= 0) {
    return {
      isValid: false,
      error: 'EMI increase must be greater than 0'
    }
  }

  const newEMI = roundTo(currentEMI + emiIncrease, 2)

  // Calculate new tenure and interest with increased EMI
  const optimizedLoan = calculateNewTenureWithIncreasedEMI(principal, annualRate, newEMI)

  if (optimizedLoan.error) {
    return {
      isValid: false,
      error: optimizedLoan.error
    }
  }

  // Calculate savings
  const interestSaved = roundTo(currentTotalInterest - optimizedLoan.totalInterest, 2)
  const monthsReduced = currentTenure - optimizedLoan.tenure
  const yearsReduced = roundTo(monthsReduced / 12, 2)
  const totalSavings = interestSaved
  const repaymentSavings = roundTo(
    (currentEMI * currentTenure) - (newEMI * optimizedLoan.tenure),
    2
  )

  return {
    isValid: true,
    currentLoan: {
      principal: roundTo(principal, 2),
      emi: roundTo(currentEMI, 2),
      tenure: currentTenure,
      totalInterest: roundTo(currentTotalInterest, 2),
      totalRepayment: roundTo(principal + currentTotalInterest, 2)
    },
    optimizedLoan: {
      principal: roundTo(principal, 2),
      emi: newEMI,
      tenure: optimizedLoan.tenure,
      totalInterest: optimizedLoan.totalInterest,
      totalRepayment: optimizedLoan.totalRepayment
    },
    savings: {
      interestSaved,
      monthsReduced,
      yearsReduced,
      totalSavings,
      repaymentSavings,
      emiIncrease: roundTo(emiIncrease, 2),
      percentageInterestReduction: roundTo(
        ((interestSaved / currentTotalInterest) * 100),
        2
      )
    }
  }
}

/**
 * Generate dynamic insights based on analysis
 * 
 * @param {object} analysis - Result from analyzeEMIIncrease
 * @returns {array} - Array of insight objects with title and description
 */
export function generateInsights(analysis) {
  if (!analysis.isValid) return []

  const insights = []
  const { savings, currentLoan, optimizedLoan } = analysis

  // Insight 1: Interest savings magnitude
  if (savings.interestSaved > 500000) {
    insights.push({
      type: 'excellent',
      title: 'Excellent optimization opportunity detected',
      description: `By increasing your EMI by ₹${savings.emiIncrease.toLocaleString('en-IN')}, you can save ₹${savings.interestSaved.toLocaleString('en-IN')} in interest.`,
      icon: 'TrendingUp'
    })
  } else if (savings.interestSaved > 200000) {
    insights.push({
      type: 'good',
      title: 'Strong savings potential',
      description: `An additional ₹${savings.emiIncrease.toLocaleString('en-IN')} monthly can save ₹${savings.interestSaved.toLocaleString('en-IN')} in interest.`,
      icon: 'TrendingUp'
    })
  }

  // Insight 2: Tenure reduction
  if (savings.monthsReduced > 24) {
    insights.push({
      type: 'excellent',
      title: 'Become debt-free sooner',
      description: `You can become debt-free ${savings.yearsReduced} years earlier by increasing your EMI. That's ${savings.monthsReduced} months of freedom!`,
      icon: 'Zap'
    })
  } else if (savings.monthsReduced > 12) {
    insights.push({
      type: 'good',
      title: 'Reduce your loan duration',
      description: `Increasing your EMI can reduce your loan tenure by ${savings.monthsReduced} months.`,
      icon: 'Clock'
    })
  }

  // Insight 3: Small increase, big impact
  if (savings.emiIncrease <= 2000 && savings.interestSaved > 100000) {
    insights.push({
      type: 'tip',
      title: 'Small increases create big savings',
      description: `Even a modest ₹${savings.emiIncrease.toLocaleString('en-IN')} increase in your monthly EMI can lead to substantial long-term savings.`,
      icon: 'Lightbulb'
    })
  }

  // Insight 4: Percentage reduction
  if (savings.percentageInterestReduction > 20) {
    insights.push({
      type: 'highlight',
      title: 'Significant interest reduction',
      description: `This strategy reduces your total interest by ${savings.percentageInterestReduction}%, which is substantial.`,
      icon: 'BarChart3'
    })
  }

  // Insight 5: Total financial benefit
  if (savings.totalSavings > 300000) {
    insights.push({
      type: 'success',
      title: 'Major financial benefit',
      description: `Total financial benefit: ₹${savings.totalSavings.toLocaleString('en-IN')} saved and ${savings.monthsReduced} months of loan duration reduced.`,
      icon: 'CheckCircle'
    })
  }

  return insights
}
