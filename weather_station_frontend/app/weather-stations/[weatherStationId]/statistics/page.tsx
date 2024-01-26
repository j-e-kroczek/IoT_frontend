"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import { AreaChart, Card, Title } from "@tremor/react";
import useSWR from "swr";
import WeatherStationData from "@/app/components/weatherStationData";
import WeatherChart from "@/app/components/weatherChart";

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function WeatherStatistics({
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

  const [humidityDataWithDate, setHumidityDataWithDate] = useState([]);
  const [temperatureDataWithDate, setTemperatureDataWithDate] = useState([]);
  const [pressureDataWithDate, setPressureDataWithDate] = useState([]);

  useEffect(() => {
    console.log(data);
    if (data) {
      setHumidityDataWithDate(
        data.weather_data
          ? data.weather_data
              .map((item: any) => {
                return { humidity: item.humidity, date: item.date };
              })
              .reverse()
          : []
      );
      setTemperatureDataWithDate(
        data.weather_data
          ? data.weather_data
              .map((item: any) => {
                return { temperature: item.temperature, date: item.date };
              })
              .reverse()
          : []
      );
      setPressureDataWithDate(
        data.weather_data
          ? data.weather_data
              .map((item: any) => {
                return { pressure: item.pressure, date: item.date };
              })
              .reverse()
          : []
      );
    }
  }, [data]);

  useEffect(() => {
    console.log(humidityDataWithDate);
  }, [humidityDataWithDate]);

  useEffect(() => {
    console.log(temperatureDataWithDate);
  }, [temperatureDataWithDate]);

  useEffect(() => {
    console.log(pressureDataWithDate);
  }, [pressureDataWithDate]);

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
            Weather statistics - {data.station_name}
          </h1>
          <div className="flex flex-col">
            <WeatherChart
              data={temperatureDataWithDate}
              title={"Temperature"}
              name="temperature"
              unit="°C"
              color="red"
              minValue={0}
            />
            <WeatherChart
              data={humidityDataWithDate}
              title={"Humidity"}
              name="humidity"
              unit="%"
              color="blue"
              minValue={0}
            />
            <WeatherChart
              data={pressureDataWithDate}
              title={"Pressure"}
              name="pressure"
              unit="hPa"
              color="orange"
              minValue={900}
            />
          </div>
        </>
      )}
    </main>
  );
}
