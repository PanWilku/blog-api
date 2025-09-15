import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type BlogProps = {
  logoSrc?: string;
  apiUrl?: string;
};

export function Blog({ logoSrc, apiUrl }: BlogProps) {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); // Separate state for user
  const [posts, setPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchBlog = async () => {
      const token = localStorage.getItem("token");

      // Debug: Check if token exists and decode it
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("Token payload:", payload);
          console.log("Token expires at:", new Date(payload.exp * 1000));
          console.log("Current time:", new Date());
          console.log("Token expired?", payload.exp * 1000 < Date.now());
        } catch (e) {
          console.log("Error decoding token:", e);
        }
      }

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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          setUser(data.user); // Set user data separately
          console.log("User data received:", data.user); // Add this debug line
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

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     try {
  //       const response = await fetch(
  //         `${apiUrl}/posts?page=${currentPage}&limit=${postsPerPage}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       const data = await response.json();

  //       if (response.ok) {
  //         setPosts(data.posts || []);
  //       } else {
  //         setError(data.error || "Failed to fetch posts");
  //       }
  //     } catch (err) {
  //       setError("Network error while fetching posts.");
  //     }
  //   };

  //   fetchPosts();
  // }, [currentPage, apiUrl]);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 3-column layout: 1/5 - 3/5 - 1/5 */}
      <div className="grid grid-cols-5 gap-4 min-h-screen">
        {/* Left Sidebar - 1/5 width */}
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
          <img src={logoSrc} alt="Your Company" className="h-16 w-auto mb-4" />
          <nav className="space-y-2">
            <div className="text-gray-300 text-sm font-medium">Navigation</div>
            <button className="block w-full text-left text-gray-400 hover:text-white py-1">
              Dashboard
            </button>
            <button className="block w-full text-left text-gray-400 hover:text-white py-1">
              Posts
            </button>
            <button className="block w-full text-left text-gray-400 hover:text-white py-1">
              Settings
            </button>
          </nav>
        </div>

        {/* Main Content - 3/5 width */}
        <div className="col-span-3">
          {/* Error/Success messages */}
          {error && <p className="text-red-300 text-center mb-4">{error}</p>}
          {message && (
            <p className="text-green-300 text-center mb-4">{message}</p>
          )}

          {/* Blog Posts Title */}
          <h1 className="text-3xl font-bold mb-6 text-white">Blog Posts</h1>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700">
                  {post.content?.substring(0, 100)}...
                </p>
                <button className="mt-2 text-blue-500 hover:underline">
                  Read More
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center space-x-2 mb-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Right Sidebar - 1/5 width */}
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-300 text-sm font-medium mb-4">Account</div>
          <div className="space-y-4">
            <div className="text-gray-400 text-sm">
              <div>Hello, {user?.name || "Loading..."}!</div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
