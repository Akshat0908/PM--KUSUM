import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "@/pages/LandingPage";
import ConfirmationPage from "@/pages/ConfirmationPage";

function App() {
  return (
    <div className="App font-sans">
      <BrowserRouter>
        <Toaster position="top-center" richColors closeButton />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/confirm" element={<ConfirmationPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
