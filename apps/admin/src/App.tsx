import { Routes, Route } from "react-router-dom";
import { SignIn } from "@blog/ui";
import { API_URL } from "../lib/api";

export default function App() {
  return (
    <div className="flex w-full min-h-screen bg-gray-900 justify-center">
      <Routes>
        <Route
          path="/"
          element={<SignIn logoSrc="/blog.svg" apiUrl={API_URL} />}
        />
      </Routes>
    </div>
  );
}
