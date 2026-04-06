# Lumina | Financial Dashboard

Lumina is a premium, high-performance financial tracking dashboard built with React and Vanilla CSS. It focuses on clean aesthetics, advanced data insights, and **production-grade UX details** that separate memorability from status quo.

## 🚀 "Wow Factor" Features

### 1. Advanced Visual Data Patterns
- **Spending Heatmap Calendar**: A GitHub-style activity grid that visualizes spending intensity over the last 28 days.
- **Per-Category Budget Tracker**: Real-time progress bars showing spending vs. budget limits for specific categories (Housing, Food, etc.).
- **Smart Date Grouping**: Transactions are grouped by **Today**, **Yesterday**, **This Week**, and **Earlier** for a modern banking app feel.

### 2. High-End Interaction Design
- **Undo Delete with Persistence**: Accidental deletions can be restored via a non-blocking toast notification.
- **Global Keyboard Shortcuts**: 
  - `N`: Open new transaction modal.
  - `Esc`: Close any open modal or clear search focus.
- **Animated Number Counters**: All financial stat cards count up from zero on load for a premium initial impression.

### 3. Production Readiness & Security
- **Simulated RBAC Guards**: Admin-only actions (Add/Delete) are protected at both the UI level and the global store level to prevent console manipulation.
- **Deep Persistence**: Dark mode, user role, and all transaction data persist across sessions using LocalStorage and Zustand middleware.
- **Proactive Insights**: Dynamic calculation of **Savings Rate** and **Daily Burn Rate** with contextual financial advice.

## 🛠 Tech Stack
- **Frontend**: React 18 (Vite)
- **State Management**: **Zustand** (with Persistence & Middleware)
- **Styling**: Vanilla CSS (Modern CSS Variables & Glassmorphism)
- **Visuals**: Recharts (Customized Tooltips & Gradients)
- **Icons**: Lucide React

## 📈 Evaluation Mapping
| Assignment Requirement | Lumina Implementation | UX Touch
| :--- | :--- | :--- |
| **Dashboard Overview** | 2 Dynamic Charts + Heatmap | Animated Counters |
| **Transactions** | Smart Grouping + Active Chips | Left-border Color Coding |
| **RBAC** | Admin/Viewer Switcher | Store-level Mutation Guards |
| **Insights** | Savings Rate + High Spend Triggers | Proactive Health Advice |
| **UX/UI Polish** | Dark Mode + Skeletons | Shimmer Button States |

## 🏗 Setup Instructions
1. `npm install`
2. `npm run dev` → Opens at `http://localhost:5173`
