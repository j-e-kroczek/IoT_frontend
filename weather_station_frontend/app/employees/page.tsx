"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";

import useSWR from "swr";
import EmployeesTable from "../components/employeesTable";

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function Employees() {
  const {
    data: employees,
    error: error,
    isLoading: isLoading,
  } = useSWR("http://" + process.env.API_URL + ":8000/api/employee/", fetcher, {
    refreshInterval: 5000,
  });

  return (
    <main
      className="p-4 md:p-5 mx-auto max-w-7xl h-screen"
      style={{ marginTop: "-64px", paddingTop: "94px" }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress aria-label="Loading..." />
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold	 py-4">Card logs</h1>
          <EmployeesTable data={employees} />
        </>
      )}
    </main>
  );
}
