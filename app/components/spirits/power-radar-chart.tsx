import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface PowerRatingsData {
  offense: number;
  defense: number;
  control: number;
  fear: number;
  utility: number;
}

interface PowerRadarChartProps {
  ratings: PowerRatingsData;
}

export function PowerRadarChart({ ratings }: PowerRadarChartProps) {
  const data = [
    { axis: "Offense", value: ratings.offense, fullMark: 5 },
    { axis: "Defense", value: ratings.defense, fullMark: 5 },
    { axis: "Control", value: ratings.control, fullMark: 5 },
    { axis: "Fear", value: ratings.fear, fullMark: 5 },
    { axis: "Utility", value: ratings.utility, fullMark: 5 },
  ];

  return (
    <div className="min-h-[250px] w-full max-w-[300px] mx-auto">
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
          <PolarAngleAxis
            dataKey="axis"
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 11,
              fontWeight: 500,
            }}
            tickLine={false}
          />
          <Radar
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
