import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../../global";
import BarChart from '../TransactionsBarChart/index.js'
import './index.css'
function TransactionsTable() {
  let [month, setMonth] = useState("March");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  let [sold, setSold] = useState(0);
  let [notSold, setNotSold] = useState(0);
  let [total, setTotal] = useState(0);
  console.log(month);
  function status() {
    let soldcount = 0;
    let notsoldcount = 0;
    let sum = 0;
    for (let i of transactions) {
      console.log(i.sold);
      sum = sum + i.price;
      if (i.sold === true) {
        soldcount++;
      } else if (i.sold === false) {
        notsoldcount++;
      }
    }
    console.log(soldcount, notsoldcount, total);
    setSold(soldcount);
    setNotSold(notsoldcount);
    setTotal(sum);
  }
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await axios.get(`${API}/get-database/${month}`);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions", error);
      }
    }

    fetchTransactions();
  }, [month]);
  useEffect(() => {
    setNotSold(0);
    setSold(0);
    setTotal(0);
    status();
  }, [transactions]);
  return (
    <div className="cardcontainer">
      <div className="selectsection">
      <div>
          <input
            className="inputst"
            placeholder="Search transaction"
            onChange={(e) => setSearch(e.target.value)}
          ></input>
        </div>
        
        <div>
          <select className="inputst" onChange={(e) => setMonth(e.target.value)}>
            <option value={"January"}>January </option>
            <option value={"February"}>February</option>
            <option value={"March"}selected > March</option>
            <option value={"April"}>April</option>
            <option value={"May"}>May</option>
            <option value={"June"}>June</option>
            <option value={"July"} >July</option>
            <option value={"August"}>August</option>
            <option value={"September"}>September</option>
            <option value={"October"}>October</option>
            <option value={"November"}>November</option>
            <option value={"December"}>December</option>
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
            <th>Dateofsale</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(transactions) && transactions.length > 0 ? (
            transactions
              .filter((item) => {
                return search.toLowerCase() === ""
                  ? item
                  : item.title.toLowerCase().includes(search.toLowerCase()) ||
                      item.description
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      String(item.price).includes(search);
              })
              .map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.price}</td>
                  <td>{transaction.category}</td>

                  <td>{transaction.sold === true ? "True" : "False"}</td>
                  <td>{transaction.dateOfSale}</td>
                  <td>
                    <img className="image" src={transaction.image} />
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="3">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="Statistics">
        <h1>
          Statistics-<span>{month}</span>
        </h1>
        <h3>
          Total Sale : <span>{total}</span>
        </h3>
        <h3>
          Total Sold Items :<span>{sold}</span>
        </h3>
        <h3>
          Total Not Sold Items :<span>{notSold}</span>
        </h3>
      </div>
      <BarChart/>
    </div>
  );
}

export default TransactionsTable;