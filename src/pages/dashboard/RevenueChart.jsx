import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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
    if (orders) {
      calculateRevenue();
    }
  }, [orders]);

  if (isLoading) return <p>Loading revenue data...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;

  const isMobile = window.innerWidth <= 480;

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
            size: isMobile ? 13 : 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Monthly Revenue (TND)',
        font: {
          size: isMobile ? 16 : 20,
        },
        color: '#1f2937',
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#fff',
        bodyColor: '#fff',
        bodyFont: {
          size: isMobile ? 14 : 12,
        },
        titleFont: {
          size: isMobile ? 15 : 13,
          weight: 'bold',
        },
        padding: isMobile ? 12 : 8,
        cornerRadius: 6,
        displayColors: false,
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
          color: '#374151',
          font: {
            size: isMobile ? 12 : 13,
          },
        },
      },
      x: {
        ticks: {
          color: '#374151',
          font: {
            size: isMobile ? 12 : 13,
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
        Monthly Revenue (TND)
      </h2>
      <div className="w-full h-[300px] md:h-[400px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
