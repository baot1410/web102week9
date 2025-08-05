import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"
import Header from "./components/Header"
import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"
import PostDetail from "./pages/PostDetail"
import EditPost from "./pages/EditPost"
import "./App.css"

function App() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  return (
    <Router>
      <div className="app">
        <Header onSearch={handleSearch} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home searchTerm={searchTerm} />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
