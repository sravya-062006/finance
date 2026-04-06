import React, { createContext, useContext, useReducer, useEffect } from 'react'

const FinanceContext = createContext()

const initialState = {
  transactions: [],
  filters: {
    search: '',
    category: 'All',
    type: 'All',
    sortBy: 'date',
    sortOrder: 'desc'
  },
  role: 'Admin', // Default to Admin for testing
  loading: true
}

const financeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, loading: false }
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] }
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) }
    case 'UPDATE_TRANSACTION':
      return { 
        ...state, 
        transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) 
      }
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'SET_ROLE':
      return { ...state, role: action.payload }
    default:
      return state
  }
}

const mockTransactions = [
  { id: 1, date: '2026-04-01', description: 'Groceries Store', amount: -120.50, category: 'Food', type: 'expense' },
  { id: 2, date: '2026-04-01', description: 'Monthly Salary', amount: 5000.00, category: 'Income', type: 'income' },
  { id: 3, date: '2026-03-28', description: 'Rent Payment', amount: -1500.00, category: 'Housing', type: 'expense' },
  { id: 4, date: '2026-03-25', description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', type: 'expense' },
  { id: 5, date: '2026-03-20', description: 'Amazon Purchase', amount: -65.40, category: 'Shopping', type: 'expense' },
  { id: 6, date: '2026-03-15', description: 'Gym Membership', amount: -45.00, category: 'Health', type: 'expense' },
  { id: 7, date: '2026-03-10', description: 'Freelance Project', amount: 1200.00, category: 'Income', type: 'income' },
  { id: 8, date: '2026-03-05', description: 'Coffee Shop', amount: -5.50, category: 'Food', type: 'expense' },
  { id: 9, date: '2026-03-01', description: 'Gas Station', amount: -60.00, category: 'Transportation', type: 'expense' },
  { id: 10, date: '2026-02-25', description: 'Electricity Bill', amount: -85.20, category: 'Utilities', type: 'expense' }
]

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState)

  useEffect(() => {
    // Simulate API fetch
    const stored = localStorage.getItem('finance_data')
    if (stored) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: JSON.parse(stored) })
    } else {
      setTimeout(() => {
        dispatch({ type: 'SET_TRANSACTIONS', payload: mockTransactions })
      }, 1000)
    }
  }, [])

  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem('finance_data', JSON.stringify(state.transactions))
    }
  }, [state.transactions, state.loading])

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => useContext(FinanceContext)
