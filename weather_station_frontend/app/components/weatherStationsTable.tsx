import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ChipProps,
  Button,
} from "@nextui-org/react";
import { unstable_noStore } from "next/cache";

type WeatherStation = {
  id: number;
  name: string;
  surname: string;
  phone_number: string;
  is_active: boolean;
};

export default async function WeatherStationsTable() {
  const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    inactive: "default",
  };

  unstable_noStore();
  let res = await fetch("http://192.168.0.197:8000/api/weather_station/");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  let data = await res.json();

  return (
    <Table isStriped aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>IS ACTIVE</TableColumn>
        <TableColumn>DETAILS</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map((weatherStaion: WeatherStation) => (
          <TableRow key={weatherStaion.id}>
            <TableCell>{weatherStaion.name}</TableCell>
            <TableCell>
              <Chip
                className="capitalize"
                color={
                  statusColorMap[
                    weatherStaion.is_active ? "active" : "inactive"
                  ]
                }
                size="sm"
                variant="flat"
              >
                {weatherStaion.is_active ? "active" : "inactive"}
              </Chip>
            </TableCell>
            <TableCell>
              <Button>
                <a href={`/weather-stations/${weatherStaion.id}`}>Details</a>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
