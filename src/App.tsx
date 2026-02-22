import { AppProvider } from './context/AppProvider'
import { useParkData } from './hooks/useParkData'

function DataLoader() {
  useParkData()
  return null
}

export default function App() {
  return (
    <AppProvider>
      <DataLoader />
      <div className="p-4">
        <h1 className="text-2xl font-bold text-green-600">Dog Parks in Pinellas</h1>
        <p className="text-gray-500 mt-2">Loading parks...</p>
      </div>
    </AppProvider>
  )
}
