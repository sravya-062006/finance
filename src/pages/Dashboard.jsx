import React, { useMemo } from 'react'
import { TrendingUp, TrendingDown, Wallet, ArrowUpCircle, ArrowDownCircle, PieChart as PieIcon, LineChart as LineIcon } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import { useCountUp } from '../hooks/useCountUp'
import '../styles/Dashboard.css'

const SummaryCard = ({ label, value, type, trend, icon: Icon, color }) => {
  const animatedValue = useCountUp(value)
  const isPositive = trend > 0

  return (
    <div className={`card animate-fade-in`}>
      <div className="card-header">
        <div className="card-icon" style={{ backgroundColor: `${color}20`, color: color }}>
          <Icon size={24} />
        </div>
        <div className={`card-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <div>
        <p className="card-label">{label}</p>
        <h2 className="card-value">
          {value < 0 ? '-' : ''}${Math.abs(animatedValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
      </div>
    </div>
  )
}

const SimpleLineChart = ({ data }) => {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min

  // Coordinates for the points
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((d - min) / range) * 90 - 5 // Leave some padding
  }))

  // Create SVG path using cubic bezier for smoothing
  const getPath = () => {
    return points.reduce((path, point, i) => {
      if (i === 0) return `M ${point.x},${point.y}`

      const prev = points[i - 1]
      const centerX = (prev.x + point.x) / 2
      return `${path} C ${centerX},${prev.y} ${centerX},${point.y} ${point.x},${point.y}`
    }, '')
  }

  const linePath = getPath()
  const areaPath = `${linePath} L 100,105 L 0,105 Z`

  return (
    <div className="chart-container">
      <div className="line-chart-wrapper">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="line-chart">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map(v => (
            <line key={v} x1="0" y1={v} x2="100" y2={v} className="chart-grid-line" />
          ))}

          <path d={areaPath} className="chart-area" />
          <path d={linePath} className="chart-line" />

          {/* Subtle points on the line */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="2"
              className="chart-point"
              style={{ animationDelay: `${i * 0.1 + 1.5}s` }}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

const SimpleDonutChart = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0)
  const radius = 35
  const circumference = 2 * Math.PI * radius

  let accumulatedPercent = 0

  return (
    <div className="donut-chart-container">
      <div className="donut-chart">
        <svg viewBox="0 0 100 100" className="donut-svg">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="donut-segment-bg"
          />
          {data.map((item, i) => {
            const percent = (item.value / total) * 100
            const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
            accumulatedPercent += percent

            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                className="donut-segment"
                stroke={item.color}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{ transitionDelay: `${i * 0.1}s` }}
              />
            )
          })}
        </svg>
        <div className="donut-center-text">
          <p className="subtitle">Total Spent</p>
          <p className="title">${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      <div className="chart-legend">
        {data.map((item, i) => (
          <div key={item.name} className="legend-item animate-fade-in" style={{ animationDelay: `${i * 0.1 + 0.5}s` }}>
            <div className="legend-color" style={{ backgroundColor: item.color }}></div>
            <div className="legend-info">
              <span className="legend-name">{item.name}</span>
              <span className="legend-value">${item.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { state } = useFinance()
  const { transactions } = state

  const summary = useMemo(() => {
    const balance = transactions.reduce((acc, curr) => acc + curr.amount, 0)
    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0)
    const expenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0))

    return {
      balance,
      income,
      expenses,
      balanceTrend: 12.5, // Mocked trends for demonstration
      incomeTrend: 8.2,
      expenseTrend: -2.4
    }
  }, [transactions])

  const categoryData = useMemo(() => {
    const categories = Array.from(new Set(transactions.filter(t => t.type === 'expense').map(t => t.category)))
    const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444']

    return categories.map((cat, i) => ({
      name: cat,
      value: Math.abs(transactions.filter(t => t.category === cat && t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0)),
      color: colors[i % colors.length]
    }))
  }, [transactions])

  // Mock balance trend data for line chart
  const balanceTrendData = [1200, 2500, 2100, 3100, 2800, 4200, 3900, 4800, 5200, 5000]

  return (
    <div>
      <div className="dashboard-grid">
        <SummaryCard
          label="Total Balance"
          value={summary.balance}
          trend={summary.balanceTrend}
          icon={Wallet}
          color="#6366f1"
        />
        <SummaryCard
          label="Total Income"
          value={summary.income}
          trend={summary.incomeTrend}
          icon={ArrowUpCircle}
          color="#10b981"
        />
        <SummaryCard
          label="Total Expenses"
          value={summary.expenses}
          trend={summary.expenseTrend}
          icon={ArrowDownCircle}
          color="#ef4444"
        />
      </div>

      <div className="chart-section">
        <div className="card chart-card animate-scale-in">
          <h3 className="chart-title"><LineIcon size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Balance Trend (Last 30 Days)</h3>
          <SimpleLineChart data={balanceTrendData} />

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <span>Mar 01</span>
            <span>Mar 10</span>
            <span>Mar 20</span>
            <span>Mar 30</span>
            <span>Apr 03</span>
          </div>
        </div>

        <div className="card chart-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="chart-title"><PieIcon size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Spending by Category</h3>
          <SimpleDonutChart data={categoryData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
