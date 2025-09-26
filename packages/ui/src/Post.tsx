import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

type PostProps = {
  apiUrl?: string;
};

export function Post({ apiUrl }: PostProps) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [commentContent, setCommentContent] = useState<string>("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const { postid } = useParams<any>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${apiUrl}/post/${postid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch post");

        const data = await response.json();
        setPost(data.post);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postid]);

  async function addComment(e: React.FormEvent) {
    e.preventDefault(); // Prevent form submission

    if (!commentContent.trim()) return; // Don't submit empty comments

    const token = localStorage.getItem("token");
    setSubmittingComment(true);

    try {
      const response = await fetch(`${apiUrl}/comment/${postid}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      const data = await response.json();

      // Add the new comment to the post
      setPost((prevPost: any) => ({
        ...prevPost,
        comments: [...(prevPost.comments || []), data.comment],
      }));

      // Clear the form
      setCommentContent("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  }

  async function handleDeleteComment(comment: any) {
    const token = localStorage.getItem("token");
    const cid = comment.id;
    if (!window.confirm("Delete this comment?")) return;

    try {
      const response = await fetch(`${apiUrl}/comment/${cid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete comment");
      setPost((prevPost: any) => ({
        ...prevPost,
        comments: (prevPost.comments || []).filter((c: any) => c.id !== cid),
      }));
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError((err as Error)?.message ?? "Failed to delete comment");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {post?.title ?? "Untitled post"}
                </h1>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    post?.published
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {post?.published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 items-center text-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {post?.author?.name?.charAt(0).toUpperCase() ?? "A"}
                    </span>
                  </div>
                  <span className="font-medium">
                    {post?.author?.name ??
                      post?.author?.email ??
                      "Unknown author"}
                  </span>
                </div>
                <span>•</span>
                <time dateTime={post?.createdAt}>
                  {post?.createdAt
                    ? new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown date"}
                </time>
                {post?.updatedAt && (
                  <>
                    <span>•</span>
                    <span className="text-blue-200 text-sm">
                      Updated {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm cursor-pointer"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Post content card */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          {post?.imgUrl && (
            <img
              src={post.imgUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <div className="prose prose-lg max-w-none">
            {post?.content ? (
              <div className="text-gray-800 leading-8 whitespace-pre-wrap">
                {post.content}
              </div>
            ) : (
              <div className="text-gray-500 italic text-center py-8">
                No content available.
              </div>
            )}
          </div>
        </article>

        {/* Comments section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {post?.comments?.length ?? 0}
            </span>
          </div>

          {/* Comment form */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Add a comment
            </h3>
            <form onSubmit={addComment} className="space-y-3">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-4 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none placeholder-gray-500"
                rows={4}
                placeholder="Share your thoughts about this post..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                disabled={submittingComment}
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {commentContent.length}/500 characters
                </span>
                <button
                  type="submit"
                  disabled={submittingComment || !commentContent.trim()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {submittingComment ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Posting...
                    </span>
                  ) : (
                    "Post Comment"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Comments list */}
          {post?.comments?.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment: any, idx: number) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {comment?.author?.name?.charAt(0).toUpperCase() ?? "A"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {comment?.author?.name ?? "Anonymous"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(
                            comment.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {comment?.author?.id === post?.user?.id && (
                      <button
                        onClick={() => handleDeleteComment(comment)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-300 hover:border-red-600 rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="text-gray-800 leading-6 whitespace-pre-wrap pl-13">
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No comments yet
              </h3>
              <p className="text-gray-500">
                Be the first to share your thoughts!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
