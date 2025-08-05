import { useState, useEffect } from "react"
import { supabase } from "../client"
import PostCard from "../components/PostCard"

function Home({ searchTerm }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderBy, setOrderBy] = useState("created_at")

  const fetchPosts = async () => {
    try {
      setLoading(true)
      let query = supabase.from("posts").select("*").order(orderBy, { ascending: false })

      if (searchTerm && searchTerm.trim()) {
        query = query.ilike("title", `%${searchTerm.trim()}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      setError(error.message)
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [orderBy, searchTerm])

  if (loading) {
    return <div className="loading">Loading match highlights...</div>
  }

  if (error) {
    return <div className="error">Error loading posts: {error}</div>
  }

  return (
    <div>
      <h1 className="page-title">Latest Match Highlights</h1>

      <div className="controls">
        <button
          className={`control-button ${orderBy === "created_at" ? "active" : ""}`}
          onClick={() => setOrderBy("created_at")}
        >
          Newest
        </button>
        <button
          className={`control-button ${orderBy === "upvotes" ? "active" : ""}`}
          onClick={() => setOrderBy("upvotes")}
        >
          Most Popular
        </button>
      </div>

      {searchTerm && (
        <div style={{ textAlign: "center", marginBottom: "1rem", color: "#6b7280" }}>
          {posts.length > 0
            ? `Found ${posts.length} result${posts.length === 1 ? "" : "s"} for "${searchTerm}"`
            : `No results found for "${searchTerm}"`}
        </div>
      )}

      {posts.length === 0 && !searchTerm ? (
        <div className="no-posts">
          <h3>No match highlights found</h3>
          <p>Be the first to share an amazing goal or highlight!</p>
        </div>
      ) : posts.length === 0 && searchTerm ? (
        <div className="no-posts">
          <h3>No results found</h3>
          <p>Try searching with different keywords</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdate={fetchPosts} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
