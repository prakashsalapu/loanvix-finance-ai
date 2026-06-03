/**
 * Scenario Comparison Engine
 * Generates and compares multiple loan optimization strategies
 */

import { analyzeEMIIncrease } from './emiIncreaseCalculations'
import { analyzeYearlyPrepayment } from './yearlyPrepaymentCalculations'

function roundTo(value, decimals = 2) {
  const factor = Math.pow(10, decimals)
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/**
 * Generate all comparison scenarios
 * @param {object} loan - Current loan data
 * @param {number} emiIncrease - EMI increase amount (optional)
 * @param {number} yearlyPrepayment - Yearly prepayment amount (optional)
 * @returns {object} - All scenarios with comparison metrics
 */
export function generateScenarios(loan, emiIncrease = 2000, yearlyPrepayment = 100000) {
  const { principal, annualRate, tenure, emi, totalInterest } = loan

  // Scenario 1: Current Loan (Baseline)
  const currentScenario = {
    id: 'current',
    name: 'Current Loan',
    description: 'No changes - continue with current EMI',
    type: 'baseline',
    metrics: {
      emi,
      tenure,
      totalInterest,
      totalRepayment: principal + totalInterest,
      monthsToRepay: tenure,
      yearsToRepay: roundTo(tenure / 12, 1)
    },
    savings: {
      interestSaved: 0,
      monthsReduced: 0,
      yearsReduced: 0
    }
  }

  // Scenario 2: Increased EMI
  let emiScenario = {
    id: 'emi-increase',
    name: 'Increased EMI',
    description: `Increase monthly EMI by ₹${emiIncrease.toLocaleString('en-IN')}`,
    type: 'emi-increase',
    metrics: {},
    savings: {}
  }

  const emiAnalysis = analyzeEMIIncrease(
    { principal, annualRate, tenure, currentEMI: emi, currentTotalInterest: totalInterest },
    emiIncrease
  )

  if (emiAnalysis.isValid) {
    emiScenario.metrics = {
      emi: emiAnalysis.optimizedLoan.emi,
      tenure: emiAnalysis.optimizedLoan.tenure,
      totalInterest: emiAnalysis.optimizedLoan.totalInterest,
      totalRepayment: emiAnalysis.optimizedLoan.totalRepayment,
      monthsToRepay: emiAnalysis.optimizedLoan.tenure,
      yearsToRepay: roundTo(emiAnalysis.optimizedLoan.tenure / 12, 1)
    }
    emiScenario.savings = {
      interestSaved: emiAnalysis.savings.interestSaved,
      monthsReduced: emiAnalysis.savings.monthsReduced,
      yearsReduced: emiAnalysis.savings.yearsReduced
    }
  }

  // Scenario 3: Yearly Prepayment
  let prepaymentScenario = {
    id: 'yearly-prepayment',
    name: 'Yearly Prepayment',
    description: `Apply ₹${yearlyPrepayment.toLocaleString('en-IN')} prepayment yearly`,
    type: 'yearly-prepayment',
    metrics: {},
    savings: {}
  }

  const prepaymentAnalysis = analyzeYearlyPrepayment(
    { principal, annualRate, tenure, emi, totalInterest },
    yearlyPrepayment
  )

  if (prepaymentAnalysis.isValid) {
    prepaymentScenario.metrics = {
      emi,
      tenure: prepaymentAnalysis.optimizedLoan.tenure,
      totalInterest: prepaymentAnalysis.optimizedLoan.totalInterest,
      totalRepayment: prepaymentAnalysis.optimizedLoan.totalRepayment,
      monthsToRepay: prepaymentAnalysis.optimizedLoan.tenure,
      yearsToRepay: roundTo(prepaymentAnalysis.optimizedLoan.tenure / 12, 1),
      yearlyPrepayment: yearlyPrepayment,
      totalPrepaymentRequired: prepaymentAnalysis.savings.totalPrepaymentRequired
    }
    prepaymentScenario.savings = {
      interestSaved: prepaymentAnalysis.savings.interestSaved,
      monthsReduced: prepaymentAnalysis.savings.monthsReduced,
      yearsReduced: prepaymentAnalysis.savings.yearsReduced
    }
  }

  // Scenario 4: Combined Strategy (EMI Increase + Yearly Prepayment)
  let combinedScenario = {
    id: 'combined',
    name: 'Combined Strategy',
    description: `EMI +₹${emiIncrease.toLocaleString('en-IN')} + ₹${yearlyPrepayment.toLocaleString('en-IN')} yearly`,
    type: 'combined',
    metrics: {},
    savings: {}
  }

  // For combined, first apply EMI increase to get new base EMI, then apply prepayment
  if (emiAnalysis.isValid) {
    const combinedAnalysis = analyzeYearlyPrepayment(
      {
        principal,
        annualRate,
        tenure: emiAnalysis.optimizedLoan.tenure,
        emi: emiAnalysis.optimizedLoan.emi,
        totalInterest: emiAnalysis.optimizedLoan.totalInterest
      },
      yearlyPrepayment
    )

    if (combinedAnalysis.isValid) {
      combinedScenario.metrics = {
        emi: emiAnalysis.optimizedLoan.emi,
        tenure: combinedAnalysis.optimizedLoan.tenure,
        totalInterest: combinedAnalysis.optimizedLoan.totalInterest,
        totalRepayment: combinedAnalysis.optimizedLoan.totalRepayment,
        monthsToRepay: combinedAnalysis.optimizedLoan.tenure,
        yearsToRepay: roundTo(combinedAnalysis.optimizedLoan.tenure / 12, 1),
        yearlyPrepayment,
        totalPrepaymentRequired: combinedAnalysis.savings.totalPrepaymentRequired
      }
      combinedScenario.savings = {
        interestSaved: currentScenario.metrics.totalInterest - combinedAnalysis.optimizedLoan.totalInterest,
        monthsReduced: currentScenario.metrics.tenure - combinedAnalysis.optimizedLoan.tenure,
        yearsReduced: roundTo(
          (currentScenario.metrics.tenure - combinedAnalysis.optimizedLoan.tenure) / 12,
          2
        )
      }
    }
  }

  // Compile all scenarios
  const scenarios = [
    currentScenario,
    emiAnalysis.isValid ? emiScenario : null,
    prepaymentAnalysis.isValid ? prepaymentScenario : null,
    emiAnalysis.isValid ? combinedScenario : null
  ].filter(Boolean)

  // Determine best strategy by interest savings
  const bestScenario = scenarios.reduce((best, current) => {
    if (current.id === 'current') return best
    return current.savings.interestSaved > best.savings.interestSaved ? current : best
  }, scenarios[0])

  return {
    scenarios,
    bestScenario: bestScenario.id,
    baseline: currentScenario
  }
}

/**
 * Format scenario data for comparison table
 */
export function formatScenarioComparison(scenarios) {
  return scenarios.map(scenario => ({
    name: scenario.name,
    description: scenario.description,
    monthlyEMI: scenario.metrics.emi,
    tenure: scenario.metrics.tenure,
    totalInterest: scenario.metrics.totalInterest,
    totalRepayment: scenario.metrics.totalRepayment,
    interestSaved: scenario.savings.interestSaved,
    monthsReduced: scenario.savings.monthsReduced,
    isBest: false
  }))
}

/**
 * Calculate comparison percentages
 */
export function getComparisonPercentages(baseline, scenario) {
  if (baseline.tenure === scenario.tenure && baseline.totalInterest === scenario.totalInterest) {
    return {
      tenureChange: 0,
      interestChange: 0
    }
  }

  return {
    tenureChange: roundTo(
      ((baseline.tenure - scenario.tenure) / baseline.tenure) * 100,
      1
    ),
    interestChange: roundTo(
      ((baseline.totalInterest - scenario.totalInterest) / baseline.totalInterest) * 100,
      1
    )
  }
}
