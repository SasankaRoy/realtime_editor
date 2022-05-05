import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Editorpage } from "./components/Editorpage";
import { Home } from "./components/Home";
import { Toaster } from "react-hot-toast";

export const App = () => {
  return (
    <>
      <div>
      {/* usesing toaster here... */}
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              them: {
                primary: "#4aed88",
              },
            },
          }}
        />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId" element={<Editorpage />} />
        </Routes>
      </Router>
    </>
  );
};
export default App;
