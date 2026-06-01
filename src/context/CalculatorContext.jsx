import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { calculateEMI, generateAmortizationSchedule, calculateTotalInterest } from '../utils/calculations'

export const CalculatorContext = createContext()

const STORAGE_KEY = 'loanvix_calculator_values'

const defaultValues = {
  loanAmount: 1100000,
  interestRate: 17.85,
  tenure: 154,
  processingFee: 1,
  prepaymentAmount: 0,
  loanType: 'home'
}

function loadStoredValues() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Validate that stored values are within acceptable ranges
      if (
        parsed.loanAmount >= 10000 && parsed.loanAmount <= 50000000 &&
        parsed.interestRate >= 1 && parsed.interestRate <= 30 &&
        parsed.tenure >= 1 && parsed.tenure <= 360
      ) {
        return { ...defaultValues, ...parsed }
      }
    }
  } catch (_) { /* ignore */ }
  return defaultValues
}

export function CalculatorProvider({ children }) {
  const [values, setValues] = useState(loadStoredValues)

  // Persist to localStorage whenever values change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    } catch (_) { /* ignore */ }
  }, [values])

  const updateValue = useCallback((key, rawValue) => {
    setValues(prev => {
      const value = Number.isNaN(rawValue) ? prev[key] : rawValue
      return { ...prev, [key]: value }
    })
  }, [])

  const resetValues = useCallback(() => {
    setValues(defaultValues)
    try { localStorage.removeItem(STORAGE_KEY) } catch (_) {}
  }, [])

  const results = useMemo(() => {
    const { loanAmount, interestRate, tenure, processingFee, prepaymentAmount } = values

    // Guard against invalid inputs
    if (loanAmount < 1 || interestRate < 0.01 || tenure < 1) {
      return { emi: 0, totalInterest: 0, totalPayment: 0, processingFeeAmount: 0, schedule: [], effectiveAmount: 0, interestSavingsWithPrepayment: 0, reducedTenure: 0 }
    }

    const emi = calculateEMI(loanAmount, interestRate, tenure)
    const totalInterest = calculateTotalInterest(loanAmount, emi, tenure)
    const totalPayment = loanAmount + totalInterest
    const processingFeeAmount = Math.round((loanAmount * processingFee) / 100)
    const schedule = generateAmortizationSchedule(loanAmount, interestRate, tenure, prepaymentAmount)

    // Calculate interest savings if prepayment > 0
    let interestSavingsWithPrepayment = 0
    let reducedTenure = 0
    if (prepaymentAmount > 0) {
      const originalInterest = calculateTotalInterest(loanAmount, emi, tenure)
      const prepaySchedule = generateAmortizationSchedule(loanAmount, interestRate, tenure, prepaymentAmount)
      const prepayInterest = prepaySchedule.reduce((sum, row) => sum + row.interest, 0)
      interestSavingsWithPrepayment = Math.max(0, Math.round(originalInterest - prepayInterest))
      reducedTenure = tenure - prepaySchedule.length
    }

    return {
      emi,
      totalInterest,
      totalPayment,
      processingFeeAmount,
      schedule,
      effectiveAmount: totalPayment + processingFeeAmount,
      interestSavingsWithPrepayment,
      reducedTenure
    }
  }, [values])

  return (
    <CalculatorContext.Provider value={{ values, updateValue, resetValues, results }}>
      {children}
    </CalculatorContext.Provider>
  )
}

export function useCalculator() {
  const context = useContext(CalculatorContext)
  if (!context) throw new Error('useCalculator must be used within a CalculatorProvider')
  return context
}
