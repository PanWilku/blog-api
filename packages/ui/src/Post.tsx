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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="max-w-[900px] mx-auto my-6 p-5 font-sans">
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

        <article className="mt-4 leading-relaxed text-base text-gray-900 prose prose-sm md:prose lg:prose-lg">
          {post?.content ? (
            <div className="whitespace-pre-wrap">{post.content}</div>
          ) : (
            <div className="text-gray-500">No content available.</div>
          )}
        </article>

        <section className="mt-8">
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
                      {comment?.author?.name ??
                        comment?.author?.email ??
                        "Anonymous"}
                    </div>
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
        </section>
      </div>
    </>
  );
}
