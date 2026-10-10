import { useState } from "react"
import { LoginPage } from "@/pages/LoginPage"
import { SlipListPage } from "@/pages/SlipListPage"
import { SlipFormPage } from "@/pages/SlipFormPage"
import { INITIAL_SLIPS, PROTOTYPE_USERS } from "@/utils/constants"

/**
 * Root application component.
 * Manages high-level page routing and shared state (user session & e-slips).
 */
export default function App() {
  const [currentPage, setCurrentPage] = useState("login")
  const [user, setUser] = useState(null)
  const [slips, setSlips] = useState(INITIAL_SLIPS)

  /**
   * Validates credentials against prototype users and establishes session.
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
   * Clears user session and navigates back to login page.
   */
  function handleLogout() {
    setUser(null)
    setCurrentPage("login")
  }

  /**
   * Appends a newly created slip and returns to the list view.
   * @param {object} newSlip
   */
  function handleSaveSlip(newSlip) {
    setSlips((prev) => [newSlip, ...prev])
    setCurrentPage("list")
  }

  /**
   * Navigation handler for switching views.
   * @param {'login' | 'list' | 'form'} page
   */
  function handleNavigate(page) {
    setCurrentPage(page)
  }

  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} />
  }

  if (currentPage === "form") {
    return (
      <SlipFormPage
        user={user}
        onSave={handleSaveSlip}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <SlipListPage
      user={user}
      slips={slips}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  )
}
