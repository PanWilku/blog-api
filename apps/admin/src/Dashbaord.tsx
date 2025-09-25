//create a simple dashboard to be able to upload a new post, and set if it should be published or not
import React, { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  author?: {
    name: string;
    email: string;
  };
}

interface DashboardProps {
  apiUrl: string;
}

export function Dashboard({ apiUrl }: DashboardProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Add this
  const postsPerPage = 5; // Add this
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0); // Add this

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/post?page=${currentPage}&limit=${postsPerPage}`, // Use pagination params
        {
          method: "GET", // Move method to the correct place
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data.posts || []);
      setTotalPostsCount(data.totalPostsCount || 0); // Add this
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const postData = {
      title,
      content,
      published: isPublished,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/admin/createpost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      // Reset form
      setTitle("");
      setContent("");
      setIsPublished(false);
      setSuccess("Post created successfully!");

      // Refresh posts list
      fetchPosts();
    } catch (error) {
      console.error(error);
      setError("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/admin/publish/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to publish post");

      setSuccess("Post published successfully!");
      fetchPosts(); // Refresh the list
    } catch (error) {
      console.error("Error publishing post:", error);
      setError("Failed to publish post");
    }
  };

  const handleUnpublish = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/admin/unpublish/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to unpublish post");

      setSuccess("Post unpublished successfully!");
      fetchPosts(); // Refresh the list
    } catch (error) {
      console.error("Error unpublishing post:", error);
      setError("Failed to unpublish post");
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/admin/deletepost/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete post");

      setSuccess("Post deleted successfully!");
      fetchPosts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post");
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalPostsCount / postsPerPage)); // Add this

  return (
    <div className="min-h-screen bg-gray-50 p-6 justify-center flex w-screen overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your blog posts and content</p>
        </div>
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Logout
          </button>
        </div>
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Post Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Create New Post
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter post title..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Write your post content..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="publish"
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="publish"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Publish immediately
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {loading ? "Creating..." : "Create Post"}
                </button>
              </form>
            </div>
          </div>

          {/* Posts List */}
          <div className="lg:col-span-2 mb-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  All Posts ({totalPostsCount}) {/* Show total count */}
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {posts.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No posts yet. Create your first post!
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {post.title}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                post.published
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {post.content.substring(0, 150)}
                            {post.content.length > 150 && "..."}
                          </p>

                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span>By {post.author?.name}</span>
                            <span>•</span>
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center ml-4 h-full max-lg:flex-wrap gap-2 max-lg:justify-end">
                          {!post.published && (
                            <button
                              onClick={() => handlePublish(post.id)}
                              className="inline-flex w-20 items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors cursor-pointer"
                            >
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Publish
                            </button>
                          )}

                          {post.published && (
                            <button
                              onClick={() => handleUnpublish(post.id)}
                              className="inline-flex w-20 items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors cursor-pointer"
                            >
                              Unpublish
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(post.id)}
                            className="inline-flex w-20 items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors cursor-pointer"
                          >
                            <svg
                              className="w-3 h-3 mr-1"
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
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-gray-200">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Previous
                    </button>

                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
