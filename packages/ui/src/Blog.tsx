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
        } else {
          // This handles server errors (400, 401, 500, etc.)
          setError(data.error || "Something went wrong");
          setMessage("");
        }
      } catch (err) {
        // This only handles actual network errors (connection failed, etc.)
        setError("Network error. Please try again.");
        setMessage("");
      }
    };

    fetchBlog();
  }, [navigate, apiUrl]); // Add apiUrl to dependencies

  return (
    <>
      <div>
        {error && <p className="text-red-300">{error}</p>}
        {message && <p className="text-green-300">{message}</p>}
        Welcome to the Blog!
      </div>
    </>
  );
}

