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
} from "@nextui-org/react";
import useSWR from "swr";
import WeatherStationData from "@/app/components/weatherStationData";

type WeatherStation = {
  id: number;
  name: string;
  surname: string;
  phone_number: string;
  is_active: boolean;
};

type WeatherItem = {
  weather_station: "string";
  temperature: "number";
  humidity: "number";
  pressure: "number";
  date: Date;
};

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
    "http://192.168.0.197:8000/api/weather_station/" +
      params.weatherStationId +
      "/data/",
    fetcher,
    { refreshInterval: 5000 }
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <main className="p-4 md:p-5 mx-auto max-w-7xl">
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <h1 className="text-4xl font-bold	 py-4">
            Weather station - {data.station_name}
          </h1>
          <WeatherStationData data={data.weather_data} />
        </>
      )}
    </main>
  );
}
