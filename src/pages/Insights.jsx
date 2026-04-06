import React, { useMemo } from 'react'
import { TrendingUp, Award, Zap, PieChart, Activity, CheckCircle, BarChart2 } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import '../styles/Insights.css'

const SimpleInsightCard = ({ title, value, description, icon: Icon, color, delay }) => (
  <div className="card insight-card animate-fade-in" style={{ animationDelay: `${delay}s` }}>
    <div className="insight-icon-container" style={{ backgroundColor: `${color}20`, color: color }}>
      <Icon size={32} />
    </div>
    <div className="insight-details">
      <p className="insight-title">{title}</p>
      <h3 className="insight-value">{value}</h3>
      <p className="insight-description">{description}</p>
    </div>
  </div>
)

const ComparisonCard = ({ title, current, previous, label, color, delay }) => {
  const percentage = Math.min((current / (current + previous)) * 100, 100)
  const isUp = current > previous
  
  return (
    <div className="card animate-fade-in" style={{ padding: '32px', animationDelay: `${delay}s` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{title}</h4>
        <span style={{ color: isUp ? 'var(--danger)' : 'var(--success)', fontWeight: 600, fontSize: '0.875rem' }}>
          {isUp ? '+' : ''}{((current - previous) / previous * 100).toFixed(1)}% vs Last Month
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>${current.toLocaleString()}</span>
        <span style={{ color: 'var(--text-muted)' }}>vs ${previous.toLocaleString()}</span>
      </div>
      <div className="comparison-bar-container">
        <div className="comparison-bar" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</p>
    </div>
  )
}

const Insights = () => {
  const { state } = useFinance()
  const { transactions } = state

  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const income = transactions.filter(t => t.type === 'income')
    
    // Top category
    const catTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Math.abs(curr.amount)
      return acc
    }, {})
    
    const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]
    
    // Average
    const avgSpend = expenses.length > 0 ? (expenses.reduce((acc, curr) => acc + Math.abs(curr.amount), 0) / expenses.length) : 0
    
    // Savings rate
    const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0)
    const totalExpense = expenses.reduce((acc, curr) => acc + Math.abs(curr.amount), 0)
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0

    return {
      topCategory: topCat ? topCat[0] : 'N/A',
      topValue: topCat ? topCat[1] : 0,
      avgSpend,
      savingsRate: savingsRate.toFixed(1),
      totalIncome,
      totalExpense
    }
  }, [transactions])

  return (
    <div className="insights-container">
      <div className="page-header">
        <h1>Financial Insights</h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} /> 
          <span>Updated based on recent activity</span>
        </div>
      </div>

      <div className="insight-grid">
        <SimpleInsightCard 
          title="Top Spending Hub" 
          value={data.topCategory} 
          description={`You've spent $${data.topValue.toLocaleString()} on this category.`} 
          icon={Award} 
          color="#8b5cf6" 
          delay={0.1}
        />
        <SimpleInsightCard 
          title="Average Transaction" 
          value={`$${data.avgSpend.toFixed(2)}`} 
          description="Your average expense amount this month." 
          icon={Zap} 
          color="#f59e0b" 
          delay={0.2}
        />
        <SimpleInsightCard 
          title="Savings Performance" 
          value={`${data.savingsRate}%`} 
          description={parseFloat(data.savingsRate) > 20 ? "Excellent work! Saving more than 20% is great." : "Try to reduce non-essential expenses."} 
          icon={CheckCircle} 
          color="#10b981" 
          delay={0.3}
        />
        <SimpleInsightCard 
          title="Monthly Activity" 
          value={transactions.length} 
          description="Total financial interactions recorded." 
          icon={BarChart2} 
          color="#3b82f6" 
          delay={0.4}
        />
      </div>

      <div className="insight-grid" style={{ marginTop: '24px' }}>
        <ComparisonCard 
          title="Spending Efficiency" 
          current={data.totalExpense} 
          previous={data.totalExpense * 1.15} // Mock data for comparison
          label="Your spending is lower than last month. Keep it up!" 
          color="#ec4899" 
          delay={0.5}
        />
        <ComparisonCard 
          title="Income Performance" 
          current={data.totalIncome} 
          previous={data.totalIncome * 0.9} // Mock data for comparison
          label="Growth in income detected this period." 
          color="#6366f1" 
          delay={0.6}
        />
      </div>
      
      <div className="card animate-fade-in" style={{ padding: '32px', marginTop: '24px', backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary)', animationDelay: '0.7s' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <PieChart /> AI Recommendation
        </h3>
        <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6' }}>
          Based on your current data, your highest spending is on <strong>{data.topCategory}</strong>. 
          To increase your savings rate to 30%, consider reducing {data.topCategory} by at least 15%. 
          Your income trend is positive, which provides a good buffer for future investments.
        </p>
      </div>
    </div>
  )
}

export default Insights
