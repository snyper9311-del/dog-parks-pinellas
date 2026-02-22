import { AppProvider } from './context/AppProvider'
import { AppShell } from './components/layout/AppShell'
import { useParkData } from './hooks/useParkData'
import { useVisitToggle } from './hooks/useVisitToggle'

function AppContent() {
  useParkData()
  const toggleVisit = useVisitToggle()
  return <AppShell onToggleVisit={toggleVisit} />
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
