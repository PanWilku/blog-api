import { Routes, Route } from "react-router-dom";
import { API_URL } from "../lib/api";
import { LogIn } from "./LogIn";
import { Dashboard } from "./Dashbaord";

export default function App() {
  return (
    <>
      <div className="flex h-screen bg-gray-600">
        <Routes>
          <Route path="/" element={<LogIn apiUrl={API_URL} />} />
          <Route path="/dashboard" element={<Dashboard apiUrl={API_URL} />} />
        </Routes>
      </div>
    </>
  );
}
