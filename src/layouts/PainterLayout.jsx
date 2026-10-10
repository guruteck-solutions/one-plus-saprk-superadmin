import React, { useState } from "react";

import PainterNavbar from "../components/PainterNavbar.jsx";
import PainterSidebar from "../components/PainterSidebar.jsx";

import "../css/painter/PainterLayout.css";

const PainterLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="painter-layout">
      <PainterNavbar onMenuClick={handleMenuClick} />

      <PainterSidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

      <main className="painter-layout-content">
        {children}
      </main>
    </div>
  );
};

export default PainterLayout;