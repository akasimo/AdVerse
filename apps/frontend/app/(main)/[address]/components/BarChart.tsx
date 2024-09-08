import { useAnalyzedWallet } from "@/store";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, YAxis, Legend } from "recharts";

interface CustomBarChartProps {
  data: any;
  title: string;
  dataKey: string;
}

export default function CustomBarChart({
  data,
  title,
  dataKey,
}: CustomBarChartProps) {
  console.log(data);

  return (
    <div className="m-4 inline-block rounded-lg border border-gray-400 bg-white/30 p-12 shadow-sm backdrop-blur-md">
      <h5 className="mb-6">{title}</h5>
      <BarChart width={500} height={350} data={data} barSize={40}>
        <Bar dataKey={dataKey} fill="#8884d8" />
        <XAxis dataKey="name" interval={0} fontSize={12} />
        <YAxis />
        <Tooltip
          cursor={{
            opacity: 0.1,
          }}
        />
        <Legend />
      </BarChart>
    </div>
  );
}
