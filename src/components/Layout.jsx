import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  BarChart3, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Wallet,
  LogOut,
  User,
  ShieldCheck,
  Eye
} from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import '../styles/Layout.css'

const SidebarLink = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation()
  const isActive = location.pathname === to
  
  return (
    <Link 
      to={to} 
      className={`nav-link ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  )
}

const Layout = ({ children, theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { state, dispatch } = useFinance()
  const { role } = state

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  
  const setRole = (newRole) => {
    dispatch({ type: 'SET_ROLE', payload: newRole })
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="logo">
          <Wallet size={32} color="var(--primary)" />
          <h1>FinanceFlow</h1>
        </div>

        <nav className="nav-links">
          <SidebarLink 
            to="/" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          <SidebarLink 
            to="/transactions" 
            icon={ArrowLeftRight} 
            label="Transactions" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          <SidebarLink 
            to="/insights" 
            icon={BarChart3} 
            label="Insights" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        </nav>

        <div className="sidebar-footer" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
            <div style={{ padding: '8px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <User size={20} />
            </div>
            <div style={{ display: isMobileMenuOpen ? 'block' : 'none' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>Sravya</p>
              <p style={{ fontSize: '0.75rem' }}>{role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="header">
          <button className="mobile-toggle" onClick={toggleMobileMenu} style={{ display: 'none' }}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          <div style={{ flex: 1 }}></div>

          <div className="user-controls">
            {/* Role Switcher */}
            <div className="role-switcher">
              <button 
                className={`role-btn ${role === 'Admin' ? 'active' : ''}`}
                onClick={() => setRole('Admin')}
                title="Switch to Admin Role"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} />
                  <span>Admin</span>
                </div>
              </button>
              <button 
                className={`role-btn ${role === 'Viewer' ? 'active' : ''}`}
                onClick={() => setRole('Viewer')}
                title="Switch to Viewer Role"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={14} />
                  <span>Viewer</span>
                </div>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>

        <div className="page-content animate-fade-in">
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle {
            display: block !important;
            padding: 8px;
            color: var(--text-main);
          }
          .sidebar.mobile-open .logo h1, .sidebar.mobile-open .nav-link span, .sidebar.mobile-open .sidebar-footer p {
            display: block !important;
          }
          .sidebar-footer p {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

export default Layout
