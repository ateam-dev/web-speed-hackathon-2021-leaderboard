import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useMemo } from "react";
import { strToColor } from "~/libs/str-to-color";

type Props = {
  data: {
    name: string;
    id: string;
    data: { createdAt: number; score: number }[];
  }[];
};

export const Ranking = ({ data }: Props) => {
  const rankings = useMemo(
    () =>
      data
        .map(({ id, name, data }) => {
          const [{ score } = { score: 0 }] = data.slice(-1);
          return {
            id,
            name,
            score,
          };
        })
        .sort(({ score: a }, { score: b }) => (a > b ? -1 : 1)),
    [data]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={150} height={40} data={rankings}>
        <Bar dataKey="score" label={{ position: "top" }}>
          {rankings.map(({ id }) => (
            <Cell key={id} fill={strToColor(id)} />
          ))}
        </Bar>
        <XAxis
          dataKey="name"
          angle={45}
          textAnchor="start"
          height={150}
          interval={0}
        />
        <YAxis />
      </BarChart>
    </ResponsiveContainer>
  );
};
