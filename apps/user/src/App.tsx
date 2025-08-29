
import { SignIn } from "@blog/ui";
import { useEffect, useState } from "react";
import { api } from "../lib/api";


export default function App() {
  const [msg, setMsg] = useState<string>("loading...");

  useEffect(() => {
    api.index().then((data) => setMsg(data.message));
  }, []);

  return <>
      <div className="flex-col w-full min-h-screen bg-gray-900 justify-center">
        <SignIn logoSrc="/blog.svg"/>
        <h1 className="text-2xl font-bold text-green-500">{msg}</h1>
      </div>
  </>;
}
