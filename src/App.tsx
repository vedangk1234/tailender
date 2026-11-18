import { Routes, Route } from "react-router-dom";
import Landing from "@/components/Landing";
import Game from "@/Game";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/play" element={<Game />} />
      {/* Unknown paths fall back to the landing page. */}
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
