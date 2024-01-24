"use client";

import React, { useEffect, useState } from "react";
import WeatherStationsTable from "../components/weatherStationsTable";
import { CircularProgress } from "@nextui-org/react";
import useSWR from "swr";

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function WeatherStations() {
  const {
    data: data,
    error: error,
    isLoading: isLoading,
  } = useSWR(
    "http://" + process.env.API_URL + ":8000/api/weather_station/",
    fetcher,
    {
      refreshInterval: 5000,
    }
  );
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
          <h1 className="text-4xl font-bold	 py-4">Weather stations</h1>
          <WeatherStationsTable data={data} />
        </>
      )}
    </main>
  );
}
