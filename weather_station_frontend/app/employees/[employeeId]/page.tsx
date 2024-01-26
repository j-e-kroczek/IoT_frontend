"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import useSWR from "swr";
import EmployeeWorkTimeTable from "@/app/components/employeeWorkTimeTable";

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function EmployeeWorkTime({
  params,
}: {
  params: { employeeId: string };
}) {
  const {
    data: workTimes,
    error: WorkTimesError,
    isLoading: isWorkTimesLoading,
  } = useSWR(
    "http://" +
      process.env.API_URL +
      ":8000/api/work_space/?employee=" +
      params.employeeId,
    fetcher,
    { refreshInterval: 5000 }
  );

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

  const employee = workTimes?.[0]?.employee;
  const data = workTimes?.map((workTime: any) => {
    return {
      id: workTime.id,
      start_date: workTime.start_date,
      end_date: workTime.end_date ? workTime.end_date : "",
      start_station: weatherStations?.find(
        (item: any) => item.id === workTime.start_station.id
      )?.name,
      end_station: weatherStations?.find(
        (item: any) => workTime.end_station ? item.id === workTime.end_station.id : item.id === workTime.start_station.id
      )?.name,
    };
  });

  console.log(data);

  return (
    <main
      className="p-4 md:p-5 mx-auto max-w-7xl"
      style={{ marginTop: "-64px", paddingTop: "94px" }}
    >
      {isWorkTimesLoading || isWeatherStationsLoading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress aria-label="Loading..." color="primary" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center flex-wrap">
            <h1 className="text-4xl opacity-70 my-4">
              {employee.name + " " + employee.surname} - Work time
            </h1>
          </div>
          <EmployeeWorkTimeTable data={data} />
        </>
      )}
    </main>
  );
}
