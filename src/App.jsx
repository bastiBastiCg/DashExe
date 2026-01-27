import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Dashboard />
      </main>
    </div>
  )
}

export default App
