"use client";
import * as React from "react";

function App() {
  React.useEffect(() => {
    console.log(process.env.API_URL);
  }, []);
  return (
    <main
      className="p-4 md:p-5 mx-auto max-w-7xl h-screen"
      style={{ marginTop: "-64px", paddingTop: "94px" }}
    >
      Hello
    </main>
  );
}

export default App;
