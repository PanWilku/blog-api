import './style.css'
import { SignIn, SignUp } from "@blog/ui"
import { Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";
import { api, API_URL } from "../lib/api";

export default function App() {
  const [msg, setMsg] = useState<string>("loading...");

  useEffect(() => {
    api.index().then((data) => setMsg(data.message));
  }, []);

  return <>
    <div className="flex w-full min-h-screen p-4 bg-gray-900 justify-center items-center ">
      <Routes>
        <Route path="/" element={<SignIn logoSrc="/blog.svg" links={["/sign-up"]} />} />
        <Route path="/sign-up" element={<SignUp logoSrc="/blog.svg" links={["/"]} action={`${API_URL}/sign-up`} />} />
      </Routes>
    </div>
  </>;
}
