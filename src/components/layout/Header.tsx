import { ViewToggle } from '../controls/ViewToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-green-700">🐾 Dog Parks in Pinellas</h1>
          <p className="text-xs text-gray-400 hidden sm:block">Pinellas County, FL</p>
        </div>
        <ViewToggle />
      </div>
    </header>
  )
}
