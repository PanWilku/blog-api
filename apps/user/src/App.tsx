import "./style.css";
import { SignIn, SignUp, Blog, Post } from "@blog/ui";
import { Routes, Route } from "react-router-dom";
import { API_URL } from "../lib/api";

export default function App() {
  return (
    <>
      <div className="flex w-full min-h-screen p-4 bg-gray-900">
        <Routes>
          <Route
            path="/"
            element={<SignIn logoSrc="/blog.svg" apiUrl={API_URL} />}
          />
          <Route
            path="/sign-up"
            element={<SignUp logoSrc="/blog.svg" apiUrl={API_URL} />}
          />
          <Route
            path="/blog"
            element={
              <>
                <Blog logoSrc="/blog.svg" apiUrl={API_URL} />
              </>
            }
          />
          <Route path="/post/:postid" element={<Post apiUrl={API_URL} />} />
        </Routes>
      </div>
    </>
  );
}
