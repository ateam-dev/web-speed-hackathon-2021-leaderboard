import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCallback, useState } from "react";
import { strToColor } from "~/libs/str-to-color";

type Props = {
  data: {
    name: string;
    id: string;
    data: { createdAt: number; score: number }[];
  }[];
};

export const Chart = ({ data }: Props) => {
  const [hovering, serHovering] = useState<string | null>(null);
  const mouseEnter = useCallback((e: { value: string }) => {
    serHovering(e.value);
  }, []);
  const mouseLeave = useCallback(() => {
    serHovering(null);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={500} height={300}>
        <CartesianGrid />
        <XAxis
          dataKey="createdAt"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(unixTime) =>
            new Date(unixTime).toLocaleString().slice(0, -3)
          }
          type="number"
        />
        <YAxis dataKey="score" />
        <Tooltip
          labelStyle={{ color: "gray" }}
          labelFormatter={(unixTime) =>
            new Date(unixTime).toLocaleString().slice(0, -3)
          }
        />
        <Legend onMouseOver={mouseEnter} onMouseOut={mouseLeave} />
        {data.map(({ id, name, data }) => (
          <Line
            type="monotone"
            stroke={strToColor(id)}
            dataKey={"score"}
            data={data}
            name={name}
            key={id}
            connectNulls
            strokeWidth={3}
            opacity={hovering === null ? 1 : hovering !== name ? 0.1 : 1}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
