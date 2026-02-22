import { useState } from 'react'
import { AppProvider } from './context/AppProvider'
import { AppShell } from './components/layout/AppShell'
import { useParkData } from './hooks/useParkData'
import { useVisitToggle } from './hooks/useVisitToggle'
import { Toast } from './components/shared/Toast'

function AppContent() {
  useParkData()
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const toggleVisit = useVisitToggle(msg => setToastMsg(msg))
  return (
    <>
      <AppShell onToggleVisit={toggleVisit} />
      {toastMsg && <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
