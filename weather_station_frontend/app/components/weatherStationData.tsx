"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { unstable_noStore } from "next/cache";
import { useAsyncList } from "@react-stately/data";
import WeatherCard from "./weatherCard";

type WeatherItem = {
  weather_station: "string";
  temperature: "number";
  humidity: "number";
  pressure: "number";
  date: "string";
};

type Item = {
  [key: string]: string | number | Date;
};

export default function WeatherStationData({ res }: { res: any }) {
  const data = res.weather_data;
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;
  const pages = Math.ceil(data.length / rowsPerPage);
  const [latestReading, setLatestReading] = useState<WeatherItem>(data[0]);

  let list = useAsyncList<Item>({
    async load({ signal }) {
      return {
        items: data,
      };
    },
    async sort({ items, sortDescriptor }) {
      if (sortDescriptor.column === "date") {
        return {
          items: items.sort((a, b) => {
            if (sortDescriptor && sortDescriptor.column) {
              let first = new Date(a[sortDescriptor.column]);
              let second = new Date(b[sortDescriptor.column]);
              let cmp = first < second ? -1 : 1;

              if (sortDescriptor.direction === "descending") {
                cmp *= -1;
              }

              return cmp;
            }
            return 0;
          }),
        };
      }
      return {
        items: items.sort((a, b) => {
          if (!sortDescriptor || !sortDescriptor.column) {
            return 0;
          }
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (String(first) || first) < (String(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return list.items.slice(start, end);
  }, [page, list.items]);

  return (
    <>
      <div className="grid grid-cols-3 gap-10 py-10">
        <WeatherCard name="Temperature" value={latestReading.temperature} />
        <WeatherCard name="Humidity" value={latestReading.humidity} />
        <WeatherCard name="Pressure" value={latestReading.pressure} />
      </div>
      <Table
        isStriped
        aria-label="Weather station data"
        className="pb-6"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="temperature" allowsSorting>
            Temperature
          </TableColumn>
          <TableColumn key="humidity" allowsSorting>
            Humidity
          </TableColumn>
          <TableColumn key="pressure" allowsSorting>
            Pressure
          </TableColumn>
          <TableColumn key="date" allowsSorting align="end">
            Date
          </TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={(item as { date: string }).date}>
              {(columnKey) => (
                <TableCell>
                  {columnKey != "date"
                    ? getKeyValue(item, columnKey).toFixed(2)
                    : new Date(getKeyValue(item, columnKey)).toLocaleString()}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
