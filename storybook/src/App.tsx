import React from "react";
import Sidebar from "./components/sidebar/Sidebar";

const App: React.FC = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 20 }}>메인 콘텐츠 영역</div>
    </div>
  );
};

export default App;
