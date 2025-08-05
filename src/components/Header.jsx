import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

function Header({ onSearch }) {
  const [searchInput, setSearchInput] = useState("")
  const location = useLocation()
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchInput.trim())
    }
  }

  const handleInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    navigate("/")
    if (onSearch) {
      onSearch("") // Clear search when going home
    }
  }

  const handleHomeClick = (e) => {
    e.preventDefault()
    navigate("/")
    if (onSearch) {
      onSearch("") // Clear search when going home
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <a href="/" className="logo" onClick={handleLogoClick}>
          ⚽ Instant Goals
        </a>

        <form className="search-container" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by title..."
            className="search-input"
            value={searchInput}
            onChange={handleInputChange}
          />
        </form>

        <nav className="nav-links">
          <a href="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`} onClick={handleHomeClick}>
            Home
          </a>
          <Link to="/create" className={`nav-link ${location.pathname === "/create" ? "active" : ""}`}>
            Create New Post
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
