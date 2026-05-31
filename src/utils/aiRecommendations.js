/**
 * AI Insights & Recommendation Engine
 * Generates intelligent recommendations and health scores based on loan data
 */

function roundTo(value, decimals = 2) {
  const factor = Math.pow(10, decimals)
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/**
 * Calculate Loan Health Score (0-100)
 * Considers tenure, interest rate, interest-to-principal ratio, etc.
 */
export function calculateLoanHealthScore(loan, analysis) {
  let score = 50 // Base score

  const {
    principal,
    annualRate,
    tenure,
    emi,
    totalInterest
  } = loan

  // Factor 1: Tenure efficiency (max +20 points)
  // Lower tenure = better score
  const optimalTenure = 60 // 5 years as baseline
  const tenureEfficiency = Math.max(0, 20 * (1 - Math.min(tenure, optimalTenure * 2) / (optimalTenure * 2)))
  score += tenureEfficiency

  // Factor 2: Interest rate competitiveness (max +15 points)
  // Lower rate = better score
  const avgRate = 8.5 // Average market rate
  const rateScore = Math.max(0, 15 * (1 - Math.min(annualRate, 15) / 15))
  score += rateScore

  // Factor 3: Interest-to-principal ratio (max +15 points)
  // Lower ratio = better score
  const interestRatio = totalInterest / principal
  const ratioScore = Math.max(0, 15 * (1 - Math.min(interestRatio, 2) / 2))
  score += ratioScore

  // Factor 4: Optimization opportunity (max +20 points)
  // High savings potential = lower score (more room for improvement)
  if (analysis?.scenarios && analysis?.bestScenario) {
    const bestScenarioObj = analysis.scenarios.find(s => s.id === analysis.bestScenario)
    if (bestScenarioObj && bestScenarioObj.id !== 'current' && bestScenarioObj.savings?.interestSaved > 0) {
      const potentialSavings = bestScenarioObj.savings.interestSaved
      const savingsPercentage = (potentialSavings / totalInterest) * 100
      const optimizationScore = Math.max(0, 20 * Math.min(savingsPercentage / 50, 1))
      score += optimizationScore
    }
  }

  // Factor 5: EMI affordability (max +10 points)
  // Assuming 40% of gross salary as EMI cap
  // Higher EMI ratio = lower score
  const emiAffordabilityScore = 10 // Default to 10

  return Math.round(Math.min(100, Math.max(0, score)))
}

/**
 * Generate AI-powered recommendations based on loan and scenario analysis
 */
export function generateRecommendations(loan, scenarios) {
  if (!scenarios || scenarios.length === 0) {
    return []
  }

  const recommendations = []
  const baseline = scenarios[0] // Assuming first is current/baseline
  const { principal, annualRate, tenure, emi, totalInterest } = loan

  // Recommendation 1: Best overall strategy
  const bestScenario = scenarios.reduce((best, current, idx) => {
    if (idx === 0) return best
    return current.savings.interestSaved > best.savings.interestSaved ? current : best
  }, scenarios[0])

  if (bestScenario.id !== 'current' && bestScenario.savings.interestSaved > 0) {
    recommendations.push({
      id: 'best-strategy',
      priority: 'high',
      title: `${bestScenario.name} is your best option`,
      description: `This strategy can save you ₹${bestScenario.savings.interestSaved.toLocaleString('en-IN')} in interest and reduce your tenure by ${bestScenario.savings.monthsReduced} months.`,
      action: bestScenario.name,
      savingsAmount: bestScenario.savings.interestSaved,
      icon: 'TrendingUp'
    })
  }

  // Recommendation 2: Specific EMI Increase recommendation
  const emiScenario = scenarios.find(s => s.type === 'emi-increase')
  if (emiScenario && emiScenario.savings.interestSaved > 100000) {
    const emiIncrease = emiScenario.metrics.emi - emi
    recommendations.push({
      id: 'emi-increase',
      priority: 'medium',
      title: `Increase EMI by ₹${emiIncrease.toLocaleString('en-IN')}`,
      description: `Increasing your EMI can save ₹${emiScenario.savings.interestSaved.toLocaleString('en-IN')} and close your loan ${emiScenario.savings.yearsReduced} years earlier.`,
      action: 'Try EMI Increase',
      savingsAmount: emiScenario.savings.interestSaved,
      icon: 'Zap'
    })
  }

  // Recommendation 3: Yearly Prepayment recommendation
  const prepaymentScenario = scenarios.find(s => s.type === 'yearly-prepayment')
  if (prepaymentScenario && prepaymentScenario.savings.interestSaved > 100000) {
    const yearlyPrepay = prepaymentScenario.metrics.yearlyPrepayment || 100000
    recommendations.push({
      id: 'yearly-prepayment',
      priority: 'medium',
      title: `Set aside ₹${yearlyPrepay.toLocaleString('en-IN')} yearly`,
      description: `Annual prepayments can save ₹${prepaymentScenario.savings.interestSaved.toLocaleString('en-IN')} and reduce tenure by ${prepaymentScenario.savings.yearsReduced} years.`,
      action: 'Try Prepayment',
      savingsAmount: prepaymentScenario.savings.interestSaved,
      icon: 'Target'
    })
  }

  // Recommendation 4: Large interest-to-principal ratio warning
  const interestRatio = totalInterest / principal
  if (interestRatio > 1.5) {
    recommendations.push({
      id: 'high-interest',
      priority: 'high',
      title: 'You\'re paying more in interest than principal',
      description: `Your interest cost is ${roundTo(interestRatio * 100, 0)}% of the principal. Consider accelerating payments to reduce this burden.`,
      action: 'Review Strategies',
      savingsAmount: bestScenario.savings.interestSaved,
      icon: 'AlertCircle'
    })
  }

  // Recommendation 5: Tenure reduction opportunity
  if (bestScenario.savings.yearsReduced > 2) {
    recommendations.push({
      id: 'tenure-reduction',
      priority: 'medium',
      title: `Become debt-free ${roundTo(bestScenario.savings.yearsReduced, 0)} years earlier`,
      description: `With the right strategy, you can close your loan in ${roundTo((tenure - bestScenario.savings.monthsReduced) / 12, 1)} years instead of ${roundTo(tenure / 12, 1)} years.`,
      action: 'Explore Options',
      savingsAmount: bestScenario.savings.interestSaved,
      icon: 'Clock'
    })
  }

  // Recommendation 6: Combined strategy advantage
  const combinedScenario = scenarios.find(s => s.type === 'combined')
  if (
    combinedScenario &&
    combinedScenario.savings.interestSaved > (bestScenario.savings.interestSaved * 1.1)
  ) {
    recommendations.push({
      id: 'combined-advantage',
      priority: 'high',
      title: 'Maximum savings with combined approach',
      description: `Using both EMI increase and yearly prepayments together can save you ₹${(combinedScenario.savings.interestSaved - bestScenario.savings.interestSaved).toLocaleString('en-IN')} more than a single strategy.`,
      action: 'View Combined Strategy',
      savingsAmount: combinedScenario.savings.interestSaved,
      icon: 'Layers'
    })
  }

  // Sort by priority (high first)
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Get health score interpretation
 */
export function getHealthScoreInterpretation(score) {
  if (score >= 80) {
    return {
      level: 'Excellent',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      description: 'Your loan is well-optimized. Continue current strategy.'
    }
  } else if (score >= 60) {
    return {
      level: 'Good',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Decent loan structure. Consider optimization options.'
    }
  } else if (score >= 40) {
    return {
      level: 'Fair',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'Your loan has room for improvement. Review strategies.'
    }
  } else {
    return {
      level: 'Poor',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'High optimization opportunity. Act now to save significantly.'
    }
  }
}

/**
 * Generate insights summary
 */
export function generateInsightsSummary(loan, analysis, recommendations) {
  const { tenure, totalInterest, principal } = loan
  const interestRatio = roundTo((totalInterest / principal) * 100, 1)
  const yearsToRepay = roundTo(tenure / 12, 1)

  return {
    totalInterestPayable: totalInterest,
    interestAsPercentageOfPrincipal: interestRatio,
    yearsToRepay,
    monthlyOutflow: loan.emi,
    potentialSavings: analysis?.bestScenario?.savings?.interestSaved || 0,
    potentialTenureReduction: analysis?.bestScenario?.savings?.monthsReduced || 0,
    recommendationCount: recommendations.length,
    topRecommendation: recommendations[0] || null
  }
}
