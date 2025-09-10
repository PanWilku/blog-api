import './style.css'
import { SignIn, SignUp, Blog } from "@blog/ui"
import { Routes, Route } from "react-router-dom";
import { api, API_URL } from "../lib/api";

export default function App() {
  return <>
    <div className="flex w-full min-h-screen p-4 bg-gray-900 justify-center items-center ">
      <Routes>
        <Route path="/" element={<SignIn logoSrc="/blog.svg" apiUrl={API_URL} />} />
        <Route path="/sign-up" element={<SignUp logoSrc="/blog.svg" apiUrl={API_URL} />} />
        <Route path="/blog" element={<Blog apiUrl={API_URL} />} />
      </Routes>
    </div>
  </>;
}
