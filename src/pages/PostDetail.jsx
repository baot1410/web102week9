import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../client"

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      setError(error.message)
      console.error("Error fetching post:", error)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchPost(), fetchComments()])
      setLoading(false)
    }

    loadData()
  }, [id])

  const handleUpvote = async () => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ upvotes: post.upvotes + 1 })
        .eq("id", id)

      if (error) throw error
      setPost({ ...post, upvotes: post.upvotes + 1 })
    } catch (error) {
      console.error("Error upvoting post:", error)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()

    if (!newComment.trim()) return

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            post_id: id,
            content: newComment.trim(),
            created_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) throw error

      setComments([...comments, ...data])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleEdit = () => {
    navigate(`/edit/${id}`)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const { error } = await supabase.from("posts").delete().eq("id", id)

        if (error) throw error
        navigate("/")
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    }
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Posted less than 1 hour ago"
    if (diffInHours < 24) return `Posted ${diffInHours} hours ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "Posted 1 day ago"
    return `Posted ${diffInDays} days ago`
  }

  const isVideoUrl = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com"))
  }

  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  }

  if (loading) {
    return <div className="loading">Loading post...</div>
  }

  if (error || !post) {
    return <div className="error">Error loading post: {error || "Post not found"}</div>
  }

  return (
    <div>
      <div className="post-card" style={{ cursor: "default" }}>
        <div className="post-header">
          <div className="post-time">{formatTime(post.created_at)}</div>
        </div>

        <h1 className="post-title" style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          {post.title}
        </h1>

        {post.content && (
          <div className="post-content" style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
            {post.content}
          </div>
        )}

        {/* Display image_url if it's not a video URL, with adjusted styling */}
        {post.image_url && !isVideoUrl(post.image_url) && (
          <img
            src={post.image_url || "/placeholder.svg"}
            alt={post.title}
            className="post-image"
            style={{ maxWidth: "400px", height: "auto", objectFit: "contain", display: "block", marginBottom: "1rem" }}
            onError={(e) => {
              e.target.style.display = "none"
            }}
          />
        )}

        {/* Display video_url if it's a valid video URL */}
        {post.video_url && isVideoUrl(post.video_url) && (
          <iframe
            src={getEmbedUrl(post.video_url)}
            className="post-video"
            style={{
              width: "250x",
              height: "250px",
              aspectRatio: "1 / 1", // Ensures it's not stretched at 50x50
              border: "none",
              borderRadius: "10px",
              marginBottom: "1rem",
              display: "block", // Ensures left alignment
            }}
            frameBorder="0"
            allowFullScreen
            title={post.title}
          />
        )}

        <div className="post-footer">
          <button className="upvote-button" onClick={handleUpvote}>
            ▲ {post.upvotes}
          </button>

          <div className="post-actions">
            <button className="action-button edit" onClick={handleEdit}>
              Edit
            </button>
            <button className="action-button delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="comments-section">
        <form className="comment-form" onSubmit={handleAddComment}>
          <textarea
            className="comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit" className="comment-button">
            Comment
          </button>
        </form>

        {comments.length > 0 && (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-content">{comment.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetail
