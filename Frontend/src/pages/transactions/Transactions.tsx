import { getMyAccounts } from "../../services/accountService";
import { findTransactionsByAccountNumber, transfer } from "../../services/transactionService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../../services/authService";

export default function Transactions() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  const [senderAccountNumber, setSenderAccountNumber] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");

  const navigate = useNavigate();

  // load user's accounts on mount
  useEffect(() => {
    getMyAccounts().then((data) => {
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccount(data[0].accountNumber); // auto-select first account
      }
    }).catch(console.error);
  }, []);

  // load transactions whenever selected account changes
  useEffect(() => {
    if (selectedAccount) {
      findTransactionsByAccountNumber(selectedAccount)
        .then(setTransactions)
        .catch(console.error);
    }
  }, [selectedAccount]);

  const handleTransfer = async () => {
    await transfer({ senderAccountNumber: selectedAccount, receiverAccountNumber, amount, type, description, currency });
    findTransactionsByAccountNumber(selectedAccount).then(setTransactions);
  };

  function handleLogout() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) logout(refreshToken).catch(console.error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }

  return (
    <div>
      <h1>Transactions</h1>

      {/* Account selector */}
      <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
        {accounts.map((a) => (
          <option key={a.accountNumber} value={a.accountNumber}>
            {a.accountNumber} ({a.currency} — {a.accountType})
          </option>
        ))}
      </select>

      {/* Transfer form */}
      <h2>New Transfer</h2>
      <input placeholder="Receiver Account Number" value={receiverAccountNumber} onChange={(e) => setReceiverAccountNumber(e.target.value)} />
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
      <input placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
      <button onClick={handleTransfer}>Send</button>

      {/* Transaction history */}
      <h2>My Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Sender</th><th>Receiver</th><th>Amount</th><th>Description</th><th>Currency</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.senderAccountNumber}</td>
              <td>{t.receiverAccountNumber}</td>
              <td>{t.amount}</td>
              <td>{t.description}</td>
              <td>{t.currency}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
