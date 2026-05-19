import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const JoiningTrendChart = () => {
  const data = [
    { month: 'Jan', employees: 1 },
    { month: 'Feb', employees: 0 },
    { month: 'Mar', employees: 1 },
    { month: 'Apr', employees: 0 },
    { month: 'May', employees: 0 },
    { month: 'Jun', employees: 1 },
    { month: 'Jul', employees: 0 },
    { month: 'Aug', employees: 1 },
    { month: 'Sep', employees: 0 },
    { month: 'Oct', employees: 0 },
    { month: 'Nov', employees: 1 },
    { month: 'Dec', employees: 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="employees" fill="#1e3a8a" name="New Joiners" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default JoiningTrendChart;
