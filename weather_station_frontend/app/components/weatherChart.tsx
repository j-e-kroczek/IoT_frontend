"use client";
import { AreaChart, Card, Title } from "@tremor/react";
import { DateRangePicker } from "@tremor/react";
import React, { useEffect, useState } from "react";

interface WeatherChartProps {
  value: number;
  date: string;
}

function getFormatedDateAndHour(date: string) {
  let dateObj = new Date(date);
  let dateStr = dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  let hourStr = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  return dateStr + " " + hourStr;
}

export default function WeatherChart({
  data,
  title,
  name,
  unit,
  color,
  minValue,
}: {
  data: WeatherChartProps[];
  title: string;
  name: string;
  unit: string;
  color: string;
  minValue: number;
}) {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [chartData, setChartData] = useState<WeatherChartProps[]>([]);
  const handleDateChange = (value: any) => {
    console.log(value);
    let fromDate = new Date();
    let toDate = new Date();
    if (value.from && value.to) {
      fromDate = value.from.setHours(0, 0, 0, 0);
      toDate = value.to.setHours(23, 59, 59, 999);
    } else if (value.from) {
      fromDate = value.from.setHours(0, 0, 0, 0);
      toDate = value.from.setHours(23, 59, 59, 999);
    } else if (value.to) {
      fromDate = value.to.setHours(0, 0, 0, 0);
      toDate = value.to.setHours(23, 59, 59, 999);
    }
    setDateRange([fromDate, toDate]);
  };

  useEffect(() => {
    console.log(dateRange);
    if (dateRange) {
      setChartData(
        data
          .filter((item) => {
            let date = new Date(item.date);
            return date >= dateRange[0] && date <= dateRange[1];
          })
          .map((item) => ({
            ...item,
            date: getFormatedDateAndHour(item.date),
          }))
      );
    }
  }, [dateRange]);

  const customTooltip = (props: any) => {
    const { payload, active } = props;
    if (!active || !payload) return null;
    return (
      <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
        {payload.map((category: any, idx: any) => (
          <div key={idx} className="flex flex-1 space-x-2.5">
            <div
              className={`w-1 flex flex-col bg-${category.color}-500 rounded`}
            />
            <div className="space-y-1">
              <p className="text-tremor-content-emphasis">
                {getFormatedDateAndHour(category.payload.date)}
              </p>
              <p className="text-tremor-content">{category.dataKey}</p>
              <p className="font-medium text-tremor-content-emphasis">
                {category.value.toFixed(2)} {unit}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    setChartData(
      data.map((item) => ({
        ...item,
        date: getFormatedDateAndHour(item.date),
      }))
    );
  }, [data]);

  return (
    <>
      <Card className="my-5">
        <div className="flex justify-between items-center">
          <Title>
            {title} {unit}
          </Title>
          <DateRangePicker onValueChange={handleDateChange} />
        </div>
        <AreaChart
          className="h-72 mt-4"
          data={chartData}
          index="date"
          categories={[name]}
          colors={[color]}
          yAxisWidth={40}
          customTooltip={customTooltip}
          minValue={minValue}
        />
      </Card>
    </>
  );
}
