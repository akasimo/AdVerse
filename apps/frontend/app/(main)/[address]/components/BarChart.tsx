import { useAnalyzedWallet } from "@/store";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, YAxis, Legend } from "recharts";

interface CustomBarChartProps {
  data: any;
  title: string;
  dataKey: string;
  total_usage?: number;
}

export default function CustomBarChart({
  data,
  title,
  dataKey,
  total_usage,
}: CustomBarChartProps) {
  console.log(data);

  return (
    <div className="m-4 inline-block rounded-lg border border-gray-400 bg-white/30 p-12 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h5 className="mb-6">{title}</h5>
        {total_usage && (
          <div>
            <p className="font-bold underline">Total Usages</p>
            <p className="inline-block rounded bg-primary/10 px-2 py-1 font-bold text-primary">
              {total_usage}
            </p>
          </div>
        )}
      </div>

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
