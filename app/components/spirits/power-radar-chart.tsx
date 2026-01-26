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
          <PolarGrid
            gridType="polygon"
            polarRadius={[20, 40, 60, 80]}
            stroke="oklch(0.45 0.02 90)"
            strokeOpacity={0.6}
          />
          <PolarAngleAxis
            dataKey="axis"
            tick={{
              fill: "oklch(0.75 0.02 90)",
              fontSize: 11,
              fontWeight: 500,
            }}
            tickLine={false}
          />
          <Radar
            dataKey="value"
            stroke="oklch(0.65 0.15 145)"
            strokeWidth={2}
            fill="oklch(0.55 0.15 145)"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
