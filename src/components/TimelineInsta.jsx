import { useState } from 'react'
import './TimelineInsta.css'

function TimelineInsta({ post }) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [isSaved, setIsSaved] = useState(post.isSaved || false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (commentText.trim()) {
      console.log('Comment:', commentText)
      setCommentText('')
    }
  }

  // 시간 포맷팅 함수
  const formatTimeAgo = (timestamp) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`

    const date = new Date(timestamp)
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  return (
    <div className="timeline-insta">
      {/* 헤더 */}
      <div className="timeline-header">
        <div className="timeline-user-info">
          <div className="timeline-avatar">
            <img src={post.userAvatar || 'https://via.placeholder.com/40'} alt={post.username} />
          </div>
          <div className="timeline-user-details">
            <span className="timeline-username">{post.username || '사용자'}</span>
            <span className="timeline-location">{post.location}</span>
          </div>
        </div>
        <button className="timeline-more-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>
      </div>

      {/* 이미지 */}
      <div className="timeline-image">
        <img src={post.imageUrl || 'https://via.placeholder.com/600'} alt="post" />
      </div>

      {/* 액션 버튼 */}
      <div className="timeline-actions">
        <div className="timeline-actions-left">
          <button className={`timeline-action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? '#ed4956' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button className="timeline-action-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          <button className="timeline-action-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <button className={`timeline-action-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      {/* 좋아요 수 */}
      <div className="timeline-likes">
        <span>좋아요 <strong>{(post.likes || 0) + (isLiked ? 1 : 0)}개</strong></span>
      </div>

      {/* 캡션 */}
      <div className="timeline-caption">
        <span className="timeline-caption-username">{post.username}</span>
        <span className="timeline-caption-text">{post.caption || ''}</span>
      </div>

      {/* 댓글 */}
      {post.comments && post.comments.length > 0 && (
        <div className="timeline-comments">
          {!showAllComments && post.comments.length > 2 && (
            <button
              className="timeline-view-comments"
              onClick={() => setShowAllComments(true)}
            >
              댓글 {post.comments.length}개 모두 보기
            </button>
          )}

          {(showAllComments ? post.comments : post.comments.slice(0, 2)).map((comment, index) => (
            <div key={index} className="timeline-comment">
              <span className="timeline-comment-username">{comment.username}</span>
              <span className="timeline-comment-text">{comment.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* 시간 */}
      <div className="timeline-timestamp">
        {formatTimeAgo(post.timestamp || Date.now())}
      </div>

      {/* 댓글 입력 */}
      <form className="timeline-comment-form" onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="댓글 달기..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="timeline-comment-input"
        />
        {commentText.trim() && (
          <button type="submit" className="timeline-comment-submit">
            게시
          </button>
        )}
      </form>
    </div>
  )
}

export default TimelineInsta
