import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { parse } from "path";
interface WeatherCardProps {
  name: string;
  value: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ name, value }) => {
  let img;
  let floatVal = parseFloat(value);
  let unit;
  switch (name) {
    case "Temperature":
      unit = "°C";
      if (floatVal > 40) {
        img = "/images/temperature-very-hot.png";
      } else if (floatVal > 30) {
        img = "/images/temperature-hot.png";
      } else if (floatVal > 22) {
        img = "/images/temperature-warm.png";
      } else if (floatVal > 18) {
        img = "/images/temperature-optimal.png";
      } else if (floatVal > 10) {
        img = "/images/temperature-little-cool.png";
      } else if (floatVal > 0) {
        img = "/images/temperature-cool.png";
      } else if (floatVal > -10) {
        img = "/images/temperature-cold.png";
      } else {
        img = "/images/temperature-very-cold.png";
      }
      break;
    case "Humidity":
      unit = "%";
      if (floatVal > 60) {
        img = "/images/humidity-3.png";
      } else if (floatVal > 40) {
        img = "/images/humidity-2.png";
      } else {
        img = "/images/humidity-1.png";
      }
      break;
    case "Pressure":
      unit = "hPa";
      if (floatVal > 1020) {
        img = "/images/pressure-3.png";
      } else if (floatVal > 1000) {
        img = "/images/pressure-2.png";
      } else {
        img = "/images/pressure-1.png";
      }
      name = "Pressure (hPa)";
      break;
  }
  return (
    <Card className="p-4 w-100">
      <div className="flex justify-center items-center h-full">
        <Image alt="Card background pe-5" src={img} width={100} />
        <div className="ps-5 pe-4 flex justify-center">
          <h4 className="text-5xl pe-1">{floatVal.toFixed(2)}</h4>
          <h4 className="text-xl">{unit}</h4>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;
