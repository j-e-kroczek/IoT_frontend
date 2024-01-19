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
} from "@nextui-org/react";

type Employee = {
  id: number;
  name: string;
  surname: string;
  phone_number: string;
  is_active: boolean;
};

async function getData() {
  const res = await fetch("http://192.168.0.197:8000/api/employee/");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Employees() {
  const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    inactive: "default",
  };

  const data = await getData();

  return (
    <main className="p-4 md:p-5 mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold	 py-4">Employees</h1>
      <Table isStriped aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>SURNAME</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>IS ACTIVE</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((employee: Employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.surname}</TableCell>
              <TableCell>{employee.phone_number}</TableCell>
              <TableCell>
                <Chip
                  className="capitalize"
                  color={
                    statusColorMap[employee.is_active ? "active" : "inactive"]
                  }
                  size="sm"
                  variant="flat"
                >
                  {employee.is_active ? "active" : "inactive"}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
