import { useNavigate } from "react-router-dom"

function PostCard({ post, onPostUpdate }) {
  const navigate = useNavigate()

  // Edit and Delete actions are removed from PostCard as per request
  // const handleEdit = (e) => {
  //   e.stopPropagation()
  //   navigate(`/edit/${post.id}`)
  // }

  // const handleDelete = async (e) => {
  //   e.stopPropagation()
  //   if (window.confirm("Are you sure you want to delete this post?")) {
  //     try {
  //       const { error } = await supabase.from("posts").delete().eq("id", post.id)

  //       if (error) throw error
  //       onPostUpdate()
  //     } catch (error) {
  //       console.error("Error deleting post:", error)
  //     }
  //   }
  // }

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

  return (
    <div className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
      <div className="post-header">
        <div className="post-time">{formatTime(post.created_at)}</div>
      </div>

      <h3 className="post-title">{post.title}</h3>

      {/* Content, Image, and Video are removed from PostCard as per request */}
      {/* {post.content && <p className="post-content">{post.content.substring(0, 150)}...</p>} */}
      {/* {post.image_url && !isVideoUrl(post.image_url) && (
        <img
          src={post.image_url || "/placeholder.svg"}
          alt={post.title}
          className="post-image"
          onError={(e) => {
            e.target.style.display = "none"
          }}
        />
      )} */}
      {/* {post.image_url && isVideoUrl(post.image_url) && (
        <iframe
          src={getEmbedUrl(post.image_url)}
          className="post-video"
          frameBorder="0"
          allowFullScreen
          title={post.title}
        />
      )} */}

      <div className="post-footer">
        <div className="upvote-count">
          {post.upvotes} {post.upvotes === 1 ? "upvote" : "upvotes"}
        </div>

        {/* Edit and Delete buttons are removed from PostCard as per request */}
        {/* <div className="post-actions">
          <button className="action-button edit" onClick={handleEdit}>
            Edit
          </button>
          <button className="action-button delete" onClick={handleDelete}>
            Delete
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default PostCard
