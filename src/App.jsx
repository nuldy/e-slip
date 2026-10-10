import { useState } from "react"
import { LoginPage } from "@/pages/LoginPage"
import { SlipListPage } from "@/pages/SlipListPage"
import { SlipFormPage } from "@/pages/SlipFormPage"

/**
 * Dummy data mirroring the mobile app's example slips.
 */
const INITIAL_SLIPS = [
  {
    id: "100112610080002",
    customer: "Customer C",
    total: 70000,
    status: "EXPIRED",
  },
  {
    id: "100112610080001",
    customer: "Customer B",
    total: 190000,
    status: "PAID",
  },
]

/**
 * Prototype user credentials mapping.
 * In a real app this would come from an API.
 */
const PROTOTYPE_USERS = {
  sales01: { password: "admin123", outletId: "10011" },
}

/**
 * Root application component.
 * Manages page navigation via state-based conditional rendering
 * and holds all shared application state (user session, slips data).
 */
function App() {
  const [currentPage, setCurrentPage] = useState("login")
  const [user, setUser] = useState(null)
  const [slips, setSlips] = useState(INITIAL_SLIPS)

  /**
   * Handles login attempt with prototype credential validation.
   * @param {{ salesId: string, password: string }} credentials
   */
  function handleLogin({ salesId, password }) {
    const knownUser = PROTOTYPE_USERS[salesId]

    if (knownUser && knownUser.password === password) {
      setUser({ salesId, outletId: knownUser.outletId })
      setCurrentPage("list")
    } else {
      alert("ID sales atau password salah. Gunakan: sales01 / admin123")
    }
  }

  /**
   * Handles logout by clearing user session and returning to login.
   */
  function handleLogout() {
    setUser(null)
    setCurrentPage("login")
  }

  /**
   * Handles saving a new slip and navigating back to the list.
   * @param {object} newSlip - The new slip data from the form
   */
  function handleSaveSlip(newSlip) {
    setSlips((prev) => [newSlip, ...prev])
    setCurrentPage("list")
  }

  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} />
  }

  if (currentPage === "form") {
    return (
      <SlipFormPage
        onSave={handleSaveSlip}
        onCancel={() => setCurrentPage("list")}
      />
    )
  }

  return (
    <SlipListPage
      user={user}
      slips={slips}
      onCreateSlip={() => setCurrentPage("form")}
      onLogout={handleLogout}
    />
  )
}

export default App
