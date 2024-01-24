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
  Chip,
  ChipProps,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

type Employee = {
  id: string;
  name: string;
  surname: string;
  phone_number: string;
  is_active: boolean;
};

type Item = {
  [key: string]: string | string | string | boolean;
};

export default function EmployeesTable({ data }: { data: Employee[] }) {
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

  const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    inactive: "default",
  };

  return (
    <>
      <Table
        isStriped
        aria-label="Employees table"
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
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="surname" allowsSorting>
            Surname
          </TableColumn>
          <TableColumn key="phone_number" allowsSorting>
            Phone number
          </TableColumn>
          <TableColumn key="is_active" allowsSorting align="end">
            Is active
          </TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={(item as { date: string }).date}>
              {(columnKey) => (
                <TableCell>
                  {columnKey != "is_active" ? (
                    getKeyValue(item, columnKey)
                  ) : (
                    <Chip
                      className="capitalize"
                      color={
                        statusColorMap[
                          getKeyValue(item, columnKey) ? "active" : "inactive"
                        ]
                      }
                      size="sm"
                      variant="flat"
                    >
                      {getKeyValue(item, columnKey) ? "active" : "inactive"}
                    </Chip>
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
