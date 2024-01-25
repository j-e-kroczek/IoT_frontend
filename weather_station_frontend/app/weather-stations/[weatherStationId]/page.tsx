"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import useSWR from "swr";
import WeatherStationData from "@/app/components/weatherStationData";

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function WeatherStations({
  params,
}: {
  params: { weatherStationId: string };
}) {
  const { data, error, isLoading } = useSWR(
    "http://" +
      process.env.API_URL +
      ":8000/api/weather_station/" +
      params.weatherStationId +
      "/data/",
    fetcher,
    { refreshInterval: 5000 }
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <main
      className="p-4 md:p-5 mx-auto max-w-7xl"
      style={{ marginTop: "-64px", paddingTop: "94px" }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress aria-label="Loading..." color="primary" />
        </div>
      ) : (
        <>
          <h1 className="text-4xl opacity-70	 py-4">
            Weather station - {data.station_name}
          </h1>
          <WeatherStationData res={data} />
        </>
      )}
    </main>
  );
}
