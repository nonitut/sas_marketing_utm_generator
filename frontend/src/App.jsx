import React, { useState } from "react";
import LoginPage from "./LoginPage";
import DashboardPage from "./UTMPage";

function App() {
  const [user, setUser] = useState(null); // null = не залогинен

  if (!user) return <LoginPage onLogin={setUser} />;

  return <DashboardPage user={user} />;
}

export default App;
