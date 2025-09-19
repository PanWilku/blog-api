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
        setError(error.message);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="max-w-[900px] mx-auto w-full p-5 font-sans flex-1 flex flex-col my-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="m-0 text-2xl md:text-3xl font-semibold">
                {post?.title ?? "Untitled post"}
              </h1>
              <span
                className={`text-sm px-2 py-1 rounded-full font-medium ${
                  post?.published
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {post?.published ? "Published" : "Draft"}
              </span>
            </div>

            <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-2 items-center">
              <span>
                By{" "}
                <span className="text-gray-800 font-medium">
                  {post?.author?.name ??
                    post?.author?.email ??
                    "Unknown author"}
                </span>
              </span>
              <span className="mx-2">•</span>
              <time dateTime={post?.createdAt}>
                {post?.createdAt
                  ? new Date(post.createdAt).toLocaleString()
                  : "Unknown date"}
              </time>
              {post?.updatedAt && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-gray-400 text-xs">
                    updated {new Date(post.updatedAt).toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>

        <article className="mt-4 leading-relaxed text-base text-gray-900 prose prose-sm md:prose lg:prose-lg flex-1">
          {post?.content ? (
            <div className="whitespace-pre-wrap">{post.content}</div>
          ) : (
            <div className="text-gray-500">No content available.</div>
          )}
        </article>

        <section className="mt-8 flex-shrink-0">
          <h2 className="text-lg font-semibold mb-3">
            Comments ({post?.comments?.length ?? 0})
          </h2>

          {post?.comments?.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment: any, idx: number) => (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-lg p-3 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 font-medium">
                      {comment?.author?.name ?? "Anonymous"}
                    </div>
                    {comment?.author?.id === post?.author?.id && (
                      <div>
                        <button
                          className="group flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-300 hover:border-red-600 rounded-md transition-all duration-200 ease-in-out"
                          onClick={() => handleDeleteComment(comment)}
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
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-gray-800 text-sm whitespace-pre-wrap">
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No comments yet.</div>
          )}
          {/* Future: Add comment form here */}
          <form className="mt-4" onSubmit={addComment}>
            <textarea
              className="w-full border text-white border-gray-300 rounded-md p-2"
              rows={3}
              placeholder="Add a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={submittingComment}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={submittingComment || !commentContent.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                {submittingComment ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
