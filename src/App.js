import TransactionsTable from "./components/TransactionsTable";
import "./App.css";
import Paper from "@mui/material/Paper";


function App() {
  const bgstyles = {
    borderRadius: "0px",
    minHeight: "100vh",
  };
  return (
    <div className="cont">
    
      <Paper sx={bgstyles} elevation={4}>
        <div className="app">
        <h1 className="main-head">Transaction <br></br>Dashboard</h1>
            <TransactionsTable />
   
        </div>
      </Paper>
    
    </div>
  );
}

export default App;