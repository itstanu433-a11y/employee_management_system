import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DepartmentChart = () => {
  const data = [
    { name: 'IT', value: 5 },
    { name: 'HR', value: 3 },
    { name: 'Finance', value: 4 },
    { name: 'Marketing', value: 2 },
  ];

  const COLORS = ['#1e3a8a', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DepartmentChart;
