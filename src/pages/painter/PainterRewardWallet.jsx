import React, { useEffect, useState } from "react";
import {
  Wallet,
  IndianRupee,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import "../../css/painter/PainterRewardWallet.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterRewardWallet = () => {
  const [wallet, setWallet] = useState({
    currentPoints: 0,
    currentCashBalance: 0,
    lifetimeEarnings: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRewardWallet = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/reward-wallet`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch reward wallet"
        );
      }

      setWallet({
        currentPoints: data.wallet?.currentPoints || 0,
        currentCashBalance:
          data.wallet?.currentCashBalance || 0,
        lifetimeEarnings:
          data.wallet?.lifetimeEarnings || 0,
      });

      setTransactions(
        Array.isArray(data.transactions)
          ? data.transactions
          : []
      );
    } catch (err) {
      console.error("Reward wallet error:", err);
      toast.error(
        err.message || "Failed to load reward wallet"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardWallet();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTransactionLabel = (transaction) => {
    if (transaction.description) {
      return transaction.description;
    }

    if (transaction.reference) {
      return `Reward - ${transaction.reference}`;
    }

    return "Reward Transaction";
  };

  const getStatusClass = (status) => {
    return String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  if (loading) {
    return (
      <div className="painter-reward-wallet-page">
        <div className="painter-reward-wallet-loading">
          Loading reward wallet...
        </div>
      </div>
    );
  }

  return (
    <div className="painter-reward-wallet-page">
      {/* Header */}
      <div className="painter-reward-wallet-header">
        <div>
          <h1>Reward Wallet</h1>
          <p>
            Manage your points, cash rewards and wallet
            transactions
          </p>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="painter-reward-wallet-summary">
        <div className="painter-reward-wallet-card">
          <div className="painter-reward-wallet-card-icon">
            <Wallet size={22} />
          </div>

          <div className="painter-reward-wallet-card-content">
            <span>Points Wallet</span>
            <strong>{wallet.currentPoints}</strong>
            <small>Available Points</small>
          </div>
        </div>

        <div className="painter-reward-wallet-card">
          <div className="painter-reward-wallet-card-icon">
            <IndianRupee size={22} />
          </div>

          <div className="painter-reward-wallet-card-content">
            <span>Cash Wallet</span>
            <strong>
              ₹{wallet.currentCashBalance.toLocaleString("en-IN")}
            </strong>
            <small>Available Cash</small>
          </div>
        </div>

        <div className="painter-reward-wallet-card">
          <div className="painter-reward-wallet-card-icon">
            <TrendingUp size={22} />
          </div>

          <div className="painter-reward-wallet-card-content">
            <span>Lifetime Earnings</span>
            <strong>
              {wallet.lifetimeEarnings.toLocaleString("en-IN")}
            </strong>
            <small>Total Earnings</small>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="painter-reward-wallet-transactions">
        <div className="painter-reward-wallet-section-header">
          <div>
            <h2>Wallet Transactions</h2>
            <p>Recent reward wallet activity</p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="painter-reward-wallet-empty">
            <Wallet size={32} />
            <h3>No transactions found</h3>
            <p>
              Your reward wallet transactions will appear
              here.
            </p>
          </div>
        ) : (
          <div className="painter-reward-wallet-table-wrapper">
            <table className="painter-reward-wallet-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction</th>
                  <th>Points</th>
                  <th>Cash</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => {
                  const isCredit =
                    transaction.transactionType === "ADD" ||
                    transaction.transactionType === "APPROVE" ||
                    transaction.transactionType === "RELEASE";

                  return (
                    <tr key={transaction._id}>
                      <td>
                        {formatDate(transaction.createdAt)}
                      </td>

                      <td>
                        <div className="painter-reward-wallet-transaction-info">
                          <div
                            className={`painter-reward-wallet-transaction-icon ${
                              isCredit
                                ? "credit"
                                : "debit"
                            }`}
                          >
                            {isCredit ? (
                              <ArrowDownLeft size={16} />
                            ) : (
                              <ArrowUpRight size={16} />
                            )}
                          </div>

                          <div>
                            <strong>
                              {getTransactionLabel(
                                transaction
                              )}
                            </strong>

                            {transaction.reference && (
                              <span>
                                Ref: {transaction.reference}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={
                            transaction.points > 0
                              ? "painter-reward-wallet-credit"
                              : ""
                          }
                        >
                          {transaction.points > 0
                            ? `+${transaction.points}`
                            : "-"}
                        </span>
                      </td>

                      <td>
                        {transaction.cashAmount > 0
                          ? `₹${Number(
                              transaction.cashAmount
                            ).toLocaleString("en-IN")}`
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`painter-reward-wallet-status ${getStatusClass(
                            transaction.status
                          )}`}
                        >
                          {transaction.status || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PainterRewardWallet;
