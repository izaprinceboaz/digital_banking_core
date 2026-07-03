import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import { createAccount, getMyAccounts } from '../../services/accountService'



export default function Accounts() {
    const navigate = useNavigate();

    const [balance, setBalance] = useState(0);
    const [currency, setCurrency] = useState("");
    const [accountType, setAccountType] = useState("");

    const handleCreateAccount = async () => {
        const data = {
            balance: balance || 0,
            currency: currency,
            accountType: accountType
        };
        await createAccount(data);
    };

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

    const [accounts, setAccounts] = useState<any[]>([]);

    useEffect(() => {
        getMyAccounts().then((data) => {
            setAccounts(data);
            if (data.length > 0) {
                localStorage.setItem("accountNumber", data[0].accountNumber);
            }
        }).catch(console.error);
    }, []);
    

    return (
        <div>
            <h1>Accounts</h1>
            <h2>Create Account</h2>
            <input type="number" placeholder="Balance" value={balance} onChange={(e) => setBalance(parseFloat(e.target.value) || 0)} />
            <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <option value="">Select type</option>
                <option value="SAVINGS">SAVINGS</option>
                <option value="WITHDRAWAL">WITHDRAWAL</option>
                <option value="DEPOSIT">DEPOSIT</option>
            </select>

            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="">Select currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="RWF">RWF</option>
            </select>
            <button onClick={handleCreateAccount}>Create Account</button>
            <h2>My Accounts</h2>
                        <table>
                <thead>
                    <tr>
                        <th>Account Number</th>
                        <th>Balance</th>
                        <th>Currency</th>
                        <th>Account Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account) => (
                        <tr key={account.accountNumber}>
                            <td>{account.accountNumber}</td>
                            <td>{account.balance}</td>
                            <td>{account.currency}</td>
                            <td>{account.accountType}</td>
                            <td>{account.status}</td>
                        </tr>
                        ))}
                </tbody>
            </table>
            <button onClick={handleLogout}>Log out</button>
        </div>
        
    )
}