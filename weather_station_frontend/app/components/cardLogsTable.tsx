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

type CardLog = {
  id: "string;";
  weather_station: "string";
  employee: "string";
  date: "string";
};

type Item = {
  [key: string]: string | string | Date;
};

export default function CardLogsTable({ data }: { data: CardLog[] }) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const pages = Math.ceil(data.length / rowsPerPage);

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
      <Table
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
              color="secondary"
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
          <TableColumn key="id" allowsSorting>
            Id
          </TableColumn>
          <TableColumn key="employee" allowsSorting>
            Employee
          </TableColumn>
          <TableColumn key="date" allowsSorting align="end">
            Date
          </TableColumn>
          <TableColumn key="weather_station" allowsSorting>
            Weather station
          </TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={(item as { date: string }).date}>
              {(columnKey) => (
                <TableCell>
                  {columnKey != "date"
                    ? getKeyValue(item, columnKey)
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
