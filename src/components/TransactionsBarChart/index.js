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

const BarChart = (props) => {
  const [barChartData, setBarChartData] = useState({});
  const [data, setData] = useState([]);
  const [lab, setLab] = useState([]);
  const [month, setMonth] = useState("March");
  

  useEffect(() => {
    async function fetchBarChartData() {
      try {
        const response = await axios.get(`${API}/bar-chart/${month}`);
        console.log(response.data.result);

        // Set state variables directly from the response
        setBarChartData(response.data.result);
        setLab(Object.keys(response.data.result));
        setData(Object.values(response.data.result));

        console.log(lab);
        console.log(barChartData);
      } catch (error) {
        console.error("Error fetching bar chart data", error);
      }
    }

    fetchBarChartData();
  }, [month]);

  return (
    <div>
      <div className="cardgraphcontainer">
        <div className="select">
        
          <select className="inputst" onChange={(e) => setMonth(e.target.value)}>
            {/* Use defaultValue instead of selected */}
            <option value={"January"}>January</option>
            <option value={"February"}>February</option>
            <option value={"March"} selected>
              March
            </option>
            <option value={"April"}>April</option>
            <option value={"May"}>May</option>
            <option value={"June"}>June</option>
            <option value={"July"}>July</option>
            <option value={"August"}>August</option>
            <option value={"September"}>September</option>
            <option value={"October"}>October</option>
            <option value={"November"}>November</option>
            <option value={"December"}>December</option>
          </select>
        </div>
      </div>
      <h1>
        Bar Cart Stats-<span className="month">{month}</span>
      </h1>
      
      <div className="bar">
      <Bar 
        options={options}
        data={{
          labels: lab,
          datasets: [
            {
              label: "Number of Items",
              data: data,
              backgroundColor: "lightblue",
            },
          ],
        }}
      />
      </div>
    </div>
  );
}

export default BarChart;