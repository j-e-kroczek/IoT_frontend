"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, ChipProps } from "@nextui-org/react";
import { unstable_noStore } from "next/cache";
import WeatherStationsTable from "../components/weatherStationsTable";

type WeatherStation = {
  id: number;
  name: string;
  surname: string;
  phone_number: string;
  is_active: boolean;
};

export default function WeatherStations() {
  return (
    <main className="p-4 md:p-5 mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold	 py-4">Weather stations</h1>
        <WeatherStationsTable />
    </main>
  );
}
