import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../../global";
import BarChart from '../TransactionsBarChart/index.js';
import './index.css';

function TransactionsTable() {
  const [month, setMonth] = useState("March");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ sold: 0, notSold: 0, total: 0 });

  const updateStats = () => {
    let soldCount = 0;
    let notSoldCount = 0;
    let sum = 0;

    transactions.forEach(transaction => {
      sum += transaction.price;
      if (transaction.sold) soldCount++;
      else notSoldCount++;
    });

    setStats({ sold: soldCount, notSold: notSoldCount, total: sum });
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await axios.get(`${API}/get-database/${month}`);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions", error);
      }
    };

    fetchTransactions();
  }, [month]);

  useEffect(() => {
    updateStats();
  }, [transactions]);

  return (
    <div className="card-container">
      <div className="select-section">
        <div>
          <input
            className="input"
            placeholder="Search transaction"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <select className="input" value={month} onChange={(e) => setMonth(e.target.value)}>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      <table className="table-display">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Date of Sale</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions
              .filter(transaction => {
                const searchTerm = search.toLowerCase();
                return !searchTerm || transaction.title.toLowerCase().includes(searchTerm) || 
                  transaction.description.toLowerCase().includes(searchTerm) || 
                  String(transaction.price).includes(searchTerm);
              })
              .map(transaction => (
                <tr key={transaction._id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.price}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.sold ? "True" : "False"}</td>
                  <td>{transaction.dateOfSale}</td>
                  <td>
                    <img className="image" src={transaction.image} alt={transaction.title} />
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="8">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="statistics">
        <h1>
          Statistics - <span>{month}</span>
        </h1>
        <h3>
          Total Sale: <span>{stats.total}</span>
        </h3>
        <h3>
          Total Sold Items: <span>{stats.sold}</span>
        </h3>
        <h3>
          Total Not Sold Items: <span>{stats.notSold}</span>
        </h3>
      </div>
      <BarChart />
    </div>
  );
}

export default TransactionsTable;


 