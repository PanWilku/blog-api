import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type BlogProps = {
  apiUrl?: string;
};

export function Blog({ apiUrl }: BlogProps) {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      const token = localStorage.getItem("token");
      
      // If no token, redirect to sign in
      if (!token) {
        setError("Please sign in to access the blog");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/blog`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          setError("");
        } else if (response.status === 401) {
          // Token expired or invalid - clear it and redirect to login
          localStorage.removeItem("token");
          setError("Session expired. Please sign in again.");
          setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
        } else {
          // Other server errors
          setError(data.error || "Something went wrong");
          setMessage("");
        }
      } catch (err) {
        // Network errors
        setError("Network error. Please try again.");
        setMessage("");
            }
          };

          fetchBlog();
        }, [navigate, apiUrl]);

        // Add state for blog posts and pagination
        const [posts, setPosts] = useState<any[]>([]);
        const [currentPage, setCurrentPage] = useState(1);
        const postsPerPage = 5;

        useEffect(() => {
          const fetchPosts = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
        const response = await fetch(`${apiUrl}/posts?page=${currentPage}&limit=${postsPerPage}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();

        if (response.ok) {
          setPosts(data.posts || []);
        } else {
          setError(data.error || "Failed to fetch posts");
        }
            } catch (err) {
        setError("Network error while fetching posts.");
            }
          };

          fetchPosts();
        }, [currentPage, apiUrl]);

        const totalPages = Math.ceil(posts.length / postsPerPage); // Assuming posts array has total count, adjust if API provides it

  return (
    <>
      <div className="container mx-auto px-4 py-8">
  {error && <p className="text-red-300 mb-4">{error}</p>}
  {message && <p className="text-green-300 mb-4">{message}</p>}

  <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    {posts.map((post) => (
      <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
        {/* Sample Card Component - Replace with actual card later */}
        // <Card title={post.title} content={post.content} />
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
        <button className="mt-2 text-blue-500 hover:underline">Read More</button>
      </div>
    ))}
  </div>

  {/* Simple Pagination */}
  <div className="flex justify-center space-x-2">
    <button
      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
    >
      Previous
    </button>
    <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
    <button
      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>

  <div className="mt-4">
    <button
      onClick={() => {
        localStorage.removeItem("token");
        navigate("/");
      }}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  </div>
      </div>
    </>
  );
}

