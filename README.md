 FinanceFlow  Modern Finance Dashboard

A clean, modern, and interactive finance tracking application built with React.js and Plain CSS. This project focuses on highquality UI/UX, smooth animations, and robust state management without the use of external UI or animation libraries.

  Features

 1. Dashboard Overview
 Summary Cards: Realtime calculation of Total Balance, Income, and Expenses.
 Animated Counts: Numerical values animate from zero to target on load for a premium feel.
 SVG Charts: Custombuilt, lightweight SVG line and donut charts with CSS drawing animations.
 Trend Indicators: Visual cues showing percentage changes in financial metrics.

 2. Transaction Management
 Search & Filter: Instant search by description and multicategory/type filtering.
 Sort Functionality: Sort transactions by date or amount in ascending/descending order.
 Responsive Table: Mobilefriendly table layout with smooth hover effects.
 RoleBased Controls: Features like "Add" and "Delete" are dynamically enabled/disabled based on the user's role (Admin/Viewer).

 3. Financial Insights
 KPI Analysis: Automated calculation of top spending category, average transaction value, and savings rate.
 Monthly Comparison: Visual bars comparing current performance against historical data.
 AI Recommendation: Generated suggestions based on user spending habits.

 4. Advanced UI/UX
 Custom Animations: Pure CSS + React `requestAnimationFrame` for transitions, skeletons, and microinteractions.
 Dark Mode: Complete systemwide dark mode support with smooth transitions.
 Responsive Design: Fully optimized for mobile, tablet, and desktop viewports.
 Loading Skeletons: Integrated skeleton states to provide feedback during data processing.

  Technical Decisions

 State Management
 Context API & useReducer: Centralized state management for transactions, filters, and user roles. This approach ensures scalability and separates business logic from UI components.
 Local Storage Persistence: Data is automatically saved to local storage, ensuring user activity is preserved across sessions.

 Styling & Animations
 Vanilla CSS: Used CSS variables (custom properties) for a flexible and maintainable design system.
 CSS Keyframes: Leveraged for entrance animations (`fadeIn`, `scaleIn`, `slideIn`) and loading skeletons.
 SVG Path Manipulation: Used `strokedasharray` and `strokedashoffset` for animated charts.

 Component Architecture
 Functional Components: Modern React patterns using hooks (`useState`, `useEffect`, `useMemo`, `useReducer`, `useContext`).
 Atomic Design Principles: Reusable components like `SummaryCard`, `Modal`, and `Layout` to maintain a DRY (Don't Repeat Yourself) codebase.

  Setup & Installation

1. Install Dependencies:
   ```bash
   npm install
   ```

2. Run Development Server:
   ```bash
   npm run dev
   ```

3. Build for Production:
   ```bash
   npm run build
   ```

  Role Simulation
 Admin: Full access to add and delete transactions.
 Viewer: Readonly access. Actions like "Add Transaction" and "Delete" are disabled and provide visual feedback explaining why.
 Switcher: Use the toggle in the header to instantly switch roles and see the UI update dynamically.

