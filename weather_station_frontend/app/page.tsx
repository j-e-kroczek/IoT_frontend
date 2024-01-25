"use client";
import * as React from "react";
import { Image } from "@nextui-org/react";
function App() {
  React.useEffect(() => {
    console.log(process.env.API_URL);
  }, []);
  return (
    <main
      className="p-4 md:p-5 mx-auto max-w-7xl h-full"
      style={{ marginTop: "-64px", paddingTop: "94px" }}
    >
      <div className="flex flex-col h-5/6 justify-center items-center opacity-70 text-center">
        <Image
          src="/images/logo.png"
          alt="Weather Station Logo"
          width={170}
          height={170}
        />
        <p className="text-7xl py-4">Weather Station</p>
        <p className="text-xl py-4">
          Website for viewing weather station data.
        </p>
      </div>
    </main>
  );
}

export default App;
