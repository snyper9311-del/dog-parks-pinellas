import { AppProvider } from './context/AppProvider'
import { AppShell } from './components/layout/AppShell'
import { useParkData } from './hooks/useParkData'

function AppContent() {
  useParkData()
  // onToggleVisit will be wired to useVisitToggle in Phase 5
  // For now pass a no-op so the table renders
  function handleToggleVisit(_parkId: string) {}
  return <AppShell onToggleVisit={handleToggleVisit} />
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
