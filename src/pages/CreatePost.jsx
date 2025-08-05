import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../client"

function CreatePost() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("") // New state for video URL
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            title: title.trim(),
            content: content.trim(),
            image_url: imageUrl.trim(),
            video_url: videoUrl.trim(), // Save video URL
            upvotes: 0,
            created_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) throw error

      navigate("/")
    } catch (error) {
      setError(error.message)
      console.error("Error creating post:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Share a Match Highlight</h1>

      <div className="form-container">
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Amazing goal by Messi in El Clasico"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content (Optional)</label>
            <textarea
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the highlight, match context, or your thoughts..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Video URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? "Creating Post..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
