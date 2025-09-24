import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { API_URL } from "./../../user/lib/api";
import { LogIn } from "./LogIn";
import { BrowserRouter } from "react-router-dom";

type SignInProps = {
  apiUrl?: string;
};

export default function App() {
  return (
    <>
      <div className="flex h-screen bg-gray-600">
        <Routes>
          <Route path="/" element={<LogIn apiUrl={API_URL} />} />
        </Routes>
      </div>
    </>
  );
}
