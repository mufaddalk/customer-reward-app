import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import dataset from './dataset';
import './App.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  const [loadedData, setloadedData] = useState({});
  const [customerRewards, setCustomerRewards] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState("");
  const [newTransaction, setNewTransaction] = useState({ date: new Date(), amount: 0 });

  useEffect(() => {
    setloadedData({ ...dataset });
    setCustomer([...Object.keys(dataset)]);
  }, []);

  const customerSelect = (value) => {
    setCurrentCustomer(value);
    let customerData = loadedData[value];

    let monthTransaction = {
      1: {
        amounts: [],
        rewards: 0,
      },
      2: {
        amounts: [],
        rewards: 0,
      },
      3: {
        amounts: [],
        rewards: 0,
      },
    };
    for (let i of customerData) {
      let month = new Date(i['date']);
      if (month.getMonth() + 1 === 1 || month.getMonth() + 1 === 2 || month.getMonth() + 1 === 3) {
        monthTransaction[month.getMonth() + 1]['amounts'].push(i['amount']);
      }
    }
    for (let key in monthTransaction) {
      let total_month_rewards = 0;
      for (let i = 0; i < monthTransaction[key]['amounts'].length; i++) {
        let price = monthTransaction[key]['amounts'][i];
        total_month_rewards = total_month_rewards + calculateRewardPoints(price);
      }
      monthTransaction[key]['rewards'] = total_month_rewards;
    }
    setCustomerRewards({...monthTransaction});
    setTransactions([...customerData]);
  };

  const handleInputChange = (e) => {
    if (e.target.name === "date") {
      setNewTransaction({ ...newTransaction, ...{ date: e.target.value } });
    }
    if (e.target.name === "amount") {
      setNewTransaction({ ...newTransaction, ...{ amount: e.target.value } });
    }
  }

  const handleAddTransactionButton = () => {
    let data = {...loadedData};
    let month = new Date(newTransaction['date']);
    if (month.getMonth() + 1 === 1 || month.getMonth() + 1 === 2 || month.getMonth() + 1 === 3) {
      data[currentCustomer].push(newTransaction);
      setloadedData({...data});
      customerSelect(currentCustomer);
    }
    setNewTransaction({ date: new Date(), amount: 0 });
  }

  function calculateRewardPoints(price) {
    let rewards = 0;
    if (price > 100) {
      rewards = (price - 100) * 2;
    }
    if (price > 50) {
      rewards = rewards + (price - 50);
    }
    return rewards;
  }

  return (
    <div className="App">
      <header className="App-header">
        <Box mx={2}>
        <h2 style={{ textAlign: "center" }}>Customer Rewards App</h2>
        <FormControl variant='outlined' className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Select Customer</InputLabel>
          <Select onChange={e => customerSelect(e.target.value)} value={currentCustomer} label='Select Customer'>
            {customer.map((item, index) => {
              return (
                <MenuItem key={index} value={item}> {item.toUpperCase()} </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {Object.keys(customerRewards).length > 0 &&
          <>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell>Rewards</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>First Month</TableCell>
                  <TableCell>{customerRewards[1]["rewards"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Second Month</TableCell>
                  <TableCell>{customerRewards[2]["rewards"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Third Month</TableCell>
                  <TableCell>{customerRewards[3]["rewards"]}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Reward</TableCell>
                  <TableCell>{customerRewards[1]["rewards"] + customerRewards[2]["rewards"] + customerRewards[3]["rewards"]}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <h4>Customer Transactions</h4>
          {transactions.length > 0 ?
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table className="customers">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Rewards</TableCell>
                  </TableRow>

                </TableHead>
                <TableBody>
                  {transactions.map((item, index) => {
                    return <TableRow key={index}>
                      <TableCell>{item["date"]}</TableCell>
                      <TableCell>{item["amount"]}</TableCell>
                      <TableCell>{calculateRewardPoints(item["amount"])}</TableCell>
                    </TableRow>
                  })}
                </TableBody>
              </Table>
              </TableContainer>
              : <Typography variant='h5'>There are no Transactions </Typography>}
            <div>
              <h4>Add Transactions</h4>
              <h5>Add Transactions between 01/01/2021 and 03/31/2021</h5>
              <label>Date : </label>
              <input style={{height: '30px', borderRadius: '10px', border: '1px'}} type="date" name="date" value={newTransaction.date} onChange={(e) => handleInputChange(e)}></input>
              <label style={{marginLeft: '20px'}}>Amount :</label>
              <input style={{height: '30px', borderRadius: '10px', border: '1px'}} type="number" name="amount" value={newTransaction.amount} onChange={(e) => handleInputChange(e)}></input>
              <button style={{color: '#fff', height: '30px', backgroundColor: '#1E3E93', marginBottom:'70px', border: '0px', borderRadius: '5px', marginLeft: '20px'}} onClick={() => handleAddTransactionButton()}>
                Add Transaction
              </button>
            </div>
        </>
      }
      </Box>
      </header>
    </div>
  );
}

export default App;
