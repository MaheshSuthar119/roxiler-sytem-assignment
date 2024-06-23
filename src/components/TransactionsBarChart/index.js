import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../global";
import "./index.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
    },
  },
};

const BarChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [month, setMonth] = useState("March");

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get(`${API}/bar-chart/${month}`);
        const result = response.data.result;

        const labels = Object.keys(result);
        const data = Object.values(result);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Number of Items",
              data: data,
              backgroundColor: "lightblue",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching bar chart data", error);
      }
    };

    fetchBarChartData();
  }, [month]);

  return (
    <div>
      <div className="card-graph-container">
        <div className="select">
          <select className="input" value={month} onChange={(e) => setMonth(e.target.value)}>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      <h1>
        Bar Chart Stats - <span className="month">{month}</span>
      </h1>
      <div className="bar">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

export default BarChart;


 