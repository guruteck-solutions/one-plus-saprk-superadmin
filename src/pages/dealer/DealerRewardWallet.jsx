import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Coins, Wallet, Clock, Gift, TrendingUp, History } from "lucide-react";
import "../../css/dealer/DealerRewardWallet.css";


const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerRewardWallet = () => {
    const navigate = useNavigate();

    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRewardWallet();
        fetchRewardTransactions();
    }, []);

    const fetchRewardWallet = async () => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            const response = await fetch(
                `${API_BASE_URL}/api/rewards/wallet/${user?._id || user?.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch reward wallet");
            }

            setWallet(data.wallet);
        } catch (error) {
            console.error("Reward wallet error:", error);
            setError(error.message || "Failed to load reward wallet");
        }
    };

    const fetchRewardTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            const response = await fetch(
                `${API_BASE_URL}/api/rewards/transactions?userId=${user?._id || user?.id}&userType=DEALER`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setTransactions(data.transactions || []);
            }
        } catch (error) {
            console.error("Reward transactions error:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalPointsEarned = transactions
        .filter(
            (item) =>
                item.rewardType === "POINTS" &&
                ["ADD", "APPROVE", "RELEASE"].includes(item.transactionType)
        )
        .reduce((total, item) => total + Number(item.points || 0), 0);

    const totalCashEarned = transactions
        .filter(
            (item) =>
                item.rewardType === "CASH" &&
                ["ADD", "APPROVE", "RELEASE"].includes(item.transactionType)
        )
        .reduce((total, item) => total + Number(item.cashAmount || 0), 0);

    const lastReward = transactions.length > 0 ? transactions[0] : null;

    const monthlyRewards = transactions
        .filter((item) => {
            const transactionDate = new Date(item.createdAt);
            const currentDate = new Date();

            return (
                transactionDate.getMonth() === currentDate.getMonth() &&
                transactionDate.getFullYear() === currentDate.getFullYear() &&
                item.transactionType === "ADD"
            );
        })
        .reduce(
            (total, item) =>
                total +
                Number(item.points || 0) +
                Number(item.cashAmount || 0),
            0
        );

    if (loading) {
        return (
            <div className="dealer-reward-wallet-page">
                <div className="dealer-reward-wallet-loading">
                    Loading reward wallet...
                </div>
            </div>
        );
    }

    return (
        <div className="dealer-reward-wallet-page">
            <div className="dealer-reward-wallet-header">
                <div className="dealer-reward-wallet-header-left">
                    

                    <div>
                        <h1>Reward Wallet</h1>
                        <p>View your available rewards and reward activity</p>
                    </div>
                </div>

                <button
                    type="button"
                    className="dealer-reward-wallet-redeem-btn"
                    onClick={() => navigate("/dealer/reward-redemption")}
                >
                    Redeem Reward
                    <ArrowRight size={18} />
                </button>
            </div>

            {error && (
                <div className="dealer-reward-wallet-error">
                    {error}
                </div>
            )}

            <div className="dealer-reward-wallet-cards">
                <div className="dealer-reward-wallet-card">
                    <div className="dealer-reward-wallet-card-icon">
                        <Coins size={22} />
                    </div>
                    <div>
                        <span>Available Reward Points</span>
                        <strong>{wallet?.currentPoints || 0}</strong>
                    </div>
                </div>

                <div className="dealer-reward-wallet-card">
                    <div className="dealer-reward-wallet-card-icon">
                        <Wallet size={22} />
                    </div>
                    <div>
                        <span>Available Cash Rewards</span>
                        <strong>₹{wallet?.currentCashBalance || 0}</strong>
                    </div>
                </div>

                <div className="dealer-reward-wallet-card">
                    <div className="dealer-reward-wallet-card-icon">
                        <Clock size={22} />
                    </div>
                    <div>
                        <span>Pending Rewards</span>
                        <strong>₹{wallet?.pendingRewards || 0}</strong>
                    </div>
                </div>

                <div className="dealer-reward-wallet-card">
                    <div className="dealer-reward-wallet-card-icon">
                        <Gift size={22} />
                    </div>
                    <div>
                        <span>Redeemed Rewards</span>
                        <strong>₹{wallet?.redeemedAmount || 0}</strong>
                    </div>
                </div>

                <div className="dealer-reward-wallet-card">
                    <div className="dealer-reward-wallet-card-icon">
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <span>Lifetime Rewards</span>
                        <strong>₹{wallet?.lifetimeEarnings || 0}</strong>
                    </div>
                </div>
            </div>

            <div className="dealer-reward-wallet-analytics">
                <div className="dealer-reward-wallet-section">
                    <div className="dealer-reward-wallet-section-title">
                        <h2>Reward Analytics</h2>
                    </div>

                    <div className="dealer-reward-wallet-analytics-grid">
                        <div>
                            <span>Total Points Earned</span>
                            <strong>{totalPointsEarned}</strong>
                        </div>

                        <div>
                            <span>Total Cash Earned</span>
                            <strong>₹{totalCashEarned}</strong>
                        </div>

                        <div>
                            <span>Monthly Rewards</span>
                            <strong>{monthlyRewards}</strong>
                        </div>

                        <div>
                            <span>Last Reward</span>
                            <strong>
                                {lastReward
                                    ? `${lastReward.rewardType === "POINTS"
                                        ? `${lastReward.points} Points`
                                        : `₹${lastReward.cashAmount}`}`
                                    : "No Reward"}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="dealer-reward-wallet-section">
                    <div className="dealer-reward-wallet-section-title">
                        <h2>Reward Transaction History</h2>

                        <button
                            type="button"
                            onClick={() => navigate("/dealer/reward-redemption-history")}
                        >
                            <History size={17} />
                            View History
                        </button>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="dealer-reward-wallet-empty">
                            No reward transactions found.
                        </div>
                    ) : (
                        <div className="dealer-reward-wallet-table-wrapper">
                            <table className="dealer-reward-wallet-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Transaction</th>
                                        <th>Reward</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.slice(0, 5).map((transaction) => (
                                        <tr key={transaction._id}>
                                            <td>
                                                {new Date(transaction.createdAt).toLocaleDateString()}
                                            </td>

                                            <td>{transaction.rewardType}</td>

                                            <td>{transaction.transactionType}</td>

                                            <td>
                                                {transaction.rewardType === "POINTS"
                                                    ? `${transaction.points} Points`
                                                    : `₹${transaction.cashAmount}`}
                                            </td>

                                            <td>
                                                <span
                                                    className={`dealer-reward-wallet-status dealer-reward-wallet-status-${transaction.status.toLowerCase()}`}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DealerRewardWallet;