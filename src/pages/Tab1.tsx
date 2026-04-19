import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonIcon,
  IonText,
  IonSpinner,
} from '@ionic/react';
import { arrowUpCircle, arrowDownCircle, trashOutline, calendarOutline, personCircleOutline, logOutOutline } from 'ionicons/icons';
import { useTransactions } from '../context/transaction';
import { useAuth } from '../context/auth';
import dayjs from 'dayjs';
import './Tab1.css';

const Tab1: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
    isLoading,
  } = useTransactions();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getDateLabel = (timestamp: number): string => {
    const date = dayjs(timestamp);
    const today = dayjs().startOf('day');
    const yesterday = today.subtract(1, 'day');

    if (date.isSame(today, 'day')) {
      return `Today (${date.format('D MMMM YYYY')})`;
    } else if (date.isSame(yesterday, 'day')) {
      return `Yesterday (${date.format('D MMMM YYYY')})`;
    } else {
      return date.format('dddd, D MMMM YYYY');
    }
  };

  const groupTransactionsByDate = (transactions: any[]) => {
    const groups: { [key: string]: any[] } = {};
    transactions.forEach((transaction) => {
      const dateKey = dayjs(transaction.timestamp).format('YYYY-MM-DD');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });
    return groups;
  };

  const handleAddTransaction = async () => {
    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addTransaction(transactionType, parseFloat(amount), description.trim());
      setDescription('');
      setAmount('');
    } catch (error) {
      console.error('Failed to add transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Finance Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {/* User Profile Card */}
        <IonCard className="profile-card">
          <IonCardContent className="profile-content">
            <div className="profile-info">
              <IonIcon icon={personCircleOutline} className="profile-icon" />
              <div className="profile-text">
                <h3 className="profile-name">{user?.name || 'User'}</h3>
                <p className="profile-email">{user?.email || ''}</p>
              </div>
              <IonButton fill="clear" onClick={logout} className="profile-logout-btn">
                <IonIcon icon={logOutOutline} />
                <IonLabel>Logout</IonLabel>
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Summary Card */}
        <IonCard className="summary-card">
          <IonCardContent>
            <h2 className="summary-title">This Month Summary</h2>
            <div className="summary-row">
              <span className="summary-label income">Income:</span>
              <span className="summary-value income">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label expense">Expenses:</span>
              <span className="summary-value expense">{formatCurrency(totalExpense)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span className="summary-label">Balance:</span>
              <span className={`summary-value ${balance >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(balance)}
              </span>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Add Transaction Form */}
        <IonCard className="add-transaction-card">
          <IonCardContent>
            <h3 className="form-title">Add Transaction</h3>

            <IonSegment
              value={transactionType}
              onIonChange={(e) => setTransactionType(e.detail.value as 'income' | 'expense')}
              className="type-segment"
            >
              <IonSegmentButton value="income">
                <IonIcon icon={arrowUpCircle} />
                <IonLabel>Income</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="expense">
                <IonIcon icon={arrowDownCircle} />
                <IonLabel>Expense</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            <IonInput
              className="form-input"
              placeholder="Description"
              value={description}
              onIonInput={(e) => setDescription(e.detail.value || '')}
            />

            <IonInput
              className="form-input"
              type="number"
              placeholder="Amount"
              value={amount}
              onIonInput={(e) => setAmount(e.detail.value || '')}
            />

            <IonButton
              expand="block"
              onClick={handleAddTransaction}
              disabled={isSubmitting || !description.trim() || !amount}
              className={transactionType === 'income' ? 'btn-income' : 'btn-expense'}
            >
              {isSubmitting ? <IonSpinner name="crescent" /> : `Add ${transactionType === 'income' ? 'Income' : 'Expense'}`}
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Transactions List */}
        <div className="transactions-section">
          <h3 className="section-title">
            <IonIcon icon={calendarOutline} />
            This Month's Transactions
          </h3>

          {isLoading ? (
            <div className="loading-container">
              <IonSpinner name="crescent" />
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions this month yet.</p>
              <p>Add your first transaction above!</p>
            </div>
          ) : (
            Object.keys(groupedTransactions).map((dateKey) => (
              <div key={dateKey} className="date-group">
                <div className="date-header">
                  {getDateLabel(groupedTransactions[dateKey][0].timestamp)}
                </div>
                <IonList className="transaction-list">
                  {groupedTransactions[dateKey].map((transaction) => (
                    <IonItem
                      key={transaction.id}
                      className={`transaction-item ${transaction.type}`}
                      lines="none"
                    >
                      <div className="transaction-content" slot="start">
                        <IonIcon
                          icon={transaction.type === 'income' ? arrowUpCircle : arrowDownCircle}
                          className={`transaction-icon ${transaction.type}`}
                        />
                        <div className="transaction-details">
                          <div className="transaction-description">{transaction.description}</div>
                          <div className="transaction-time">
                            {dayjs(transaction.timestamp).format('HH:mm')}
                          </div>
                        </div>
                      </div>
                      <div className="transaction-amount" slot="end">
                        <IonText className={transaction.type}>
                          {transaction.type === 'expense' ? '-' : '+'}
                          {formatCurrency(transaction.amount)}
                        </IonText>
                        <IonButton
                          fill="clear"
                          size="small"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="delete-btn"
                        >
                          <IonIcon icon={trashOutline} slot="icon-only" />
                        </IonButton>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              </div>
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
