import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "@/pages/LandingPage";
import SuccessPage from "@/pages/SuccessPage";
import DownloadPage from "@/pages/DownloadPage";

function App() {
  return (
    <div className="App font-sans">
      <BrowserRouter>
        <Toaster position="top-center" richColors closeButton />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/success/:orderId" element={<SuccessPage />} />
          <Route path="/download/:orderId" element={<DownloadPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
