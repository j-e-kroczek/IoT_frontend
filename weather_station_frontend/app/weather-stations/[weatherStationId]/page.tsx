"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ChipProps,
  Button,
  Pagination,
  getKeyValue,
  CircularProgress,
} from "@nextui-org/react";
import useSWR from "swr";
import WeatherStationData from "@/app/components/weatherStationData";

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function WeatherStations({
  params,
}: {
  params: { weatherStationId: string };
}) {
  const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    inactive: "default",
  };

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
      className="p-4 md:p-5 mx-auto max-w-7xl h-screen"
      style={{ marginTop: "-64px", paddingTop: "94px" }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress aria-label="Loading..." color="primary" />
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold	 py-4">
            Weather station - {data.station_name}
          </h1>
          <WeatherStationData res={data} />
        </>
      )}
    </main>
  );
}
