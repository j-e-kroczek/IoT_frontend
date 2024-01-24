"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import useSWR from "swr";
import CardLogsTable from "../components/cardLogsTable";

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function CardLogs() {
  const {
    data: cardLogs,
    error: cardLogsError,
    isLoading: isCardLogsLoading,
  } = useSWR(
    "http://" + process.env.API_URL + ":8000/api/employee_card_log/",
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  const {
    data: employees,
    error: employeesError,
    isLoading: isEmployeesLoading,
  } = useSWR("http://" + process.env.API_URL + ":8000/api/employee/", fetcher, {
    refreshInterval: 5000,
  });

  const {
    data: weatherStations,
    error: weatherStationsError,
    isLoading: isWeatherStationsLoading,
  } = useSWR(
    "http://" + process.env.API_URL + ":8000/api/weather_station/",
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  const {
    data: cards,
    error: cardsError,
    isLoading: isCardsLoading,
  } = useSWR(
    "http://" + process.env.API_URL + ":8000/api/employee_card/",
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  useEffect(() => {
    console.log(cardLogs);
  }, [cardLogs]);

  const cardLogsEmployee = cardLogs?.map((cardLog: any) => {
    return {
      id: cardLog.id,
      weather_station: weatherStations?.find(
        (weatherStation: any) => weatherStation.id === cardLog.weather_station
      )?.name,
      employee: cards?.find((card: any) => card.id === cardLog.employee_card)
        ?.employee,
      date: cardLog.date,
    };
  });

  const data = cardLogsEmployee?.map((cardLog: any) => {
    const employee = employees?.find(
      (employee: any) => employee.id === cardLog.employee
    );
    return {
      weather_station: cardLog.weather_station,
      employee:
        employee?.surname + " " + employee?.name + " " + employee?.phone_number,
      date: cardLog.date,
    };
  });

  return (
    <main
      className="p-4 md:p-5 mx-auto max-w-7xl h-screen"
      style={{ marginTop: "-64px", paddingTop: "94px" }}
    >
      {isCardLogsLoading ||
      isEmployeesLoading ||
      isWeatherStationsLoading ||
      isCardsLoading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress aria-label="Loading..." />
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold	 py-4">Card logs</h1>
          <CardLogsTable data={data} />
        </>
      )}
    </main>
  );
}
