import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Filter, Trash2, Edit2, ArrowUpDown, Calendar, DollarSign, Tag, Info, AlertCircle } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import '../styles/Transactions.css'

const Modal = ({ isOpen, onClose, onSubmit, role, initialData }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Shopping',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amount: Math.abs(initialData.amount).toString()
      })
    } else {
      setFormData({
        description: '',
        amount: '',
        category: 'Shopping',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      })
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description || !formData.amount) return
    
    onSubmit({
      ...formData,
      id: initialData ? initialData.id : Date.now(),
      amount: formData.type === 'expense' ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount))
    })
    
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: '24px' }}>{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>
        
        {role === 'Viewer' && (
          <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <AlertCircle size={16} />
            <span>You are in Viewer mode. Please switch to Admin to add transactions.</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input 
              name="description" 
              className="form-control" 
              placeholder="e.g. Starbucks Coffee" 
              value={formData.description}
              onChange={handleChange}
              disabled={role === 'Viewer'}
              required
            />
          </div>
          
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Amount ($)</label>
              <input 
                name="amount" 
                type="number" 
                step="0.01" 
                className="form-control" 
                placeholder="0.00" 
                value={formData.amount}
                onChange={handleChange}
                disabled={role === 'Viewer'}
                required
              />
            </div>
            <div>
              <label className="form-label">Type</label>
              <select name="type" className="form-control" value={formData.type} onChange={handleChange} disabled={role === 'Viewer'}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="category" className="form-control" value={formData.category} onChange={handleChange} disabled={role === 'Viewer'}>
              <option value="Shopping">Shopping</option>
              <option value="Food">Food</option>
              <option value="Housing">Housing</option>
              <option value="Income">Income</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Transportation">Transportation</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input name="date" type="date" className="form-control" value={formData.date} onChange={handleChange} disabled={role === 'Viewer'} required />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="add-btn" disabled={role === 'Viewer'}>
            {initialData ? 'Save Changes' : 'Add Transaction'}
          </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const TransactionSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map(i => (
      <tr key={i}>
        <td style={{ padding: '16px' }}><div className="skeleton" style={{ height: '16px', width: '80%' }}></div></td>
        <td style={{ padding: '16px' }}><div className="skeleton" style={{ height: '16px', width: '60%' }}></div></td>
        <td style={{ padding: '16px' }}><div className="skeleton" style={{ height: '24px', width: '70px', borderRadius: '12px' }}></div></td>
        <td style={{ padding: '16px' }}><div className="skeleton" style={{ height: '16px', width: '40%' }}></div></td>
        <td style={{ padding: '16px' }}><div className="skeleton" style={{ height: '32px', width: '32px', borderRadius: '8px' }}></div></td>
      </tr>
    ))}
  </>
)

const Transactions = () => {
  const { state, dispatch } = useFinance()
  const { transactions, filters, role, loading } = state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const handleSearch = (e) => {
    dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })
  }

  const handleFilter = (name, value) => {
    dispatch({ type: 'SET_FILTER', payload: { [name]: value } })
  }

  const handleDelete = (id) => {
    if (role !== 'Admin') return
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    }
  }

  const handleAddOrEdit = (data) => {
    if (editingTransaction) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: data })
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: data })
    }
  }

  const openAddModal = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const openEditModal = (transaction) => {
    if (role !== 'Admin') return
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(filters.search.toLowerCase())
        const matchesCategory = filters.category === 'All' || t.category === filters.category
        const matchesType = filters.type === 'All' || t.type === filters.type
        return matchesSearch && matchesCategory && matchesType
      })
      .sort((a, b) => {
        const factor = filters.sortOrder === 'desc' ? -1 : 1
        if (filters.sortBy === 'date') return (new Date(a.date) - new Date(b.date)) * factor
        if (filters.sortBy === 'amount') return (a.amount - b.amount) * factor
        return 0
      })
  }, [transactions, filters])

  const categories = ['All', ...new Set(transactions.map(t => t.category))].sort()

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Transactions</h1>
        <button 
          className="add-btn" 
          onClick={openAddModal}
          disabled={role === 'Viewer'}
          title={role === 'Viewer' ? 'Switch to Admin to add' : ''}
        >
          <Plus size={20} />
          <span>Add New</span>
        </button>
      </div>

      <div className="controls-bar">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search transactions..." 
            value={filters.search}
            onChange={handleSearch}
          />
        </div>

        <select 
          className="filter-select"
          value={filters.category}
          onChange={(e) => handleFilter('category', e.target.value)}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select 
          className="filter-select"
          value={filters.type}
          onChange={(e) => handleFilter('type', e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select 
          className="filter-select"
          value={filters.sortOrder}
          onChange={(e) => handleFilter('sortOrder', e.target.value)}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <div className="card table-card">
        {filteredTransactions.length === 0 && !loading ? (
          <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Info size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3>No transactions found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Date</th>
                <th>Description</th>
                <th><Tag size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Category</th>
                <th><DollarSign size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <TransactionSkeleton /> : (
                filteredTransactions.map(t => (
                  <tr key={t.id} className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t.date}</td>
                    <td style={{ fontWeight: 500 }}>{t.description}</td>
                    <td>
                      <span className="category-tag" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                        {t.category}
                      </span>
                    </td>
                    <td className={`amount-text ${t.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                      {t.type === 'income' ? '+' : ''} ${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ display: 'flex', alignItems: 'center' }}>
                      <button 
                        className="edit-btn" 
                        onClick={() => openEditModal(t)}
                        disabled={role === 'Viewer'}
                        title={role === 'Viewer' ? 'Admin only' : 'Edit'}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(t.id)}
                        disabled={role === 'Viewer'}
                        title={role === 'Viewer' ? 'Admin only' : 'Delete'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddOrEdit}
        role={role}
        initialData={editingTransaction}
      />
    </div>
  )
}

export default Transactions
