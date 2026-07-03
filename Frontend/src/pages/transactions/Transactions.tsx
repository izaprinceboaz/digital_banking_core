import { createTransaction, findTransactionsByAccountNumber, transfer } from "../../services/transactionService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout} from "../../services/authService";

export default function Transactions() {
  const [senderAccountNumber, setSenderAccountNumber] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");
  const [accountNumber, setAccountNumber] = useState(localStorage.getItem("accountNumber") ?? "");


  const handleCreateTransaction = async () => {
      const data = {
          senderAccountNumber: senderAccountNumber,
          receiverAccountNumber: receiverAccountNumber,
          amount: amount,
          description: description,
          type: type,
          currency: currency
      };
      await transfer(data);
  };

  const navigate = useNavigate();

  function handleLogout() {

    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      logout(refreshToken).catch((err) => {
        console.error("Logout failed:", err);
      });
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }    
    const [transactions, setTransactions] = useState<any[]>([]);


    useEffect(() => {
      if(accountNumber) {
        findTransactionsByAccountNumber(accountNumber).then(setTransactions).catch(console.error);
      }
    }, [accountNumber]);

    return (
        <div>
            <h1>Transactions</h1>
            <input type="text" placeholder="Sender Account Number" value={senderAccountNumber} onChange={(e) => setSenderAccountNumber(e.target.value)} />
            <input type="text" placeholder="Receiver Account Number" value={receiverAccountNumber} onChange={(e) => setReceiverAccountNumber(e.target.value)} />
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
            <input type="text" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
            <button onClick={handleCreateTransaction}>Create Transaction</button>

            <h2>My Transactions</h2>
            <table>
              <thead>
                <tr>
                  <td>Sender Account Number</td>
                  <td>Receiver Account Number</td>
                  <td>Amount</td>
                  <td>Description</td>
                  <td>Type</td>
                  <td>Currency</td>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.senderAccountNumber}</td>
                    <td>{transaction.receiverAccountNumber}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <input
              type="text"
              placeholder="Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
            <button onClick={() => findTransactionsByAccountNumber(accountNumber).then(setTransactions)}>
              Get Transactions
            </button>
            <button onClick={handleLogout}>Log out</button> 
        </div>
    );
}