import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetAllOrdersQuery } from '../../redux/features/orders/ordersApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = () => {
  const { data: orders, error, isLoading } = useGetAllOrdersQuery();
  const [revenueData, setRevenueData] = useState([]);

  const getMonth = (date) => {
    const newDate = new Date(date);
    return newDate.getMonth();
  };

  const calculateRevenue = () => {
    const monthlyRevenue = Array(12).fill(0);

    if (orders) {
      orders.forEach((order) => {
        const month = getMonth(order.createdAt);
        monthlyRevenue[month] += order.totalPrice;
      });
    }

    setRevenueData(monthlyRevenue);
  };

  useEffect(() => {
    if (orders) calculateRevenue();
  }, [orders]);

  if (isLoading) return <p>Loading revenue data...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;

  const isMobile = window.innerWidth <= 480;

  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        label: 'Revenue (TND)',
        data: revenueData,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: isMobile ? 12 : 14,
          },
        },
      },
      title: {
        display: false, // Hide chart title (we use h2 instead)
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: isMobile ? 10 : 8,
        bodyFont: {
          size: isMobile ? 14 : 12,
        },
        titleFont: {
          size: isMobile ? 15 : 13,
          weight: 'bold',
        },
        displayColors: false,
        cornerRadius: 6,
        callbacks: {
          label: function (context) {
            return ` ${context.dataset.label}: ${context.formattedValue} TND`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#4b5563',
          font: {
            size: isMobile ? 12 : 13,
          },
        },
      },
      x: {
        ticks: {
          color: '#4b5563',
          font: {
            size: isMobile ? 12 : 13,
          },
        },
      },
    },
  };

  return (
    <div
      className="w-full bg-white shadow-lg rounded-lg p-4"
      style={{ maxWidth: '100%', overflowX: 'auto' }}
    >
      <h2
        className="text-center font-bold text-gray-800 mb-4"
        style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}
      >
        Monthly Revenue (TND)
      </h2>
      <div style={{ width: '100%', height: isMobile ? '250px' : '400px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
