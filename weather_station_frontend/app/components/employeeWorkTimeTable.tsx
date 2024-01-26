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

type WorkTime = {
  id: string;
  start_date: string;
  end_date: string;
  start_station: string;
  end_station: string;
};

type Item = {
  [key: string]: string | Date | Date | string | string;
};

export default function EmployeeWorkTimeTable({ data }: { data: WorkTime[] }) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;
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
        isStriped
        aria-label="Employee work time table"
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
          <TableColumn key="start_date" allowsSorting>
            Start date
          </TableColumn>
          <TableColumn key="end_date" allowsSorting>
            End date
          </TableColumn>
          <TableColumn key="start_station" allowsSorting>
            Start station
          </TableColumn>
          <TableColumn key="end_station" allowsSorting>
            End station
          </TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={(item as { date: string }).date}>
              {(columnKey) => (
                <TableCell>
                  {columnKey != "start_date" && columnKey != "end_date"
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
