export function PostCard({ post }: any) {
  // Add null check
  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <>
      <article className="rounded-lg shadow-sm overflow-hidden border bg-white">
        <img
          src="https://picsum.photos/400/200"
          alt="Post cover"
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-1">
            {post.title || "Untitled"}
          </h2>
          <p className="text-sm text-gray-700 mb-3">
            {post.content
              ? post.content.substring(0, 150) + "..."
              : "No content available"}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="https://picsum.photos/40"
                alt="Author avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="text-sm font-medium">
                  {post.author?.name || "Unknown Author"}
                </div>
                <div className="text-xs text-gray-500">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : "Unknown date"}{" "}
                  · {Math.ceil(post.content.length / 100)} min read
                </div>
              </div>
            </div>

            <a
              href={`/post/${post.id}`}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              aria-label={`Read more about ${post.title || "this post"}`}
            >
              Read more
            </a>
          </div>
        </div>
      </article>
    </>
  );
}
