// client/src/components/Dashboard/ChartCard.jsx
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ChartCard = ({ title, data, type = 'line' }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#333' } },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: '#555' }, grid: { color: 'rgba(200, 200, 200, 0.2)' } },
      y: { ticks: { color: '#555' }, grid: { color: 'rgba(200, 200, 200, 0.2)' } }
    }
  };

  const ChartComponent = type === 'line' ? Line : Bar;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <ChartComponent options={options} data={data} />
    </div>
  );
};

export default ChartCard;