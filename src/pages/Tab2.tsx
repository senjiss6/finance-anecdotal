import React, { useState, useMemo } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonIcon,
  IonText,
  IonSpinner,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
  IonButton,
} from '@ionic/react';
import { arrowUpCircle, arrowDownCircle, chevronDownOutline, calendarOutline, cashOutline } from 'ionicons/icons';
import { useTransactions } from '../context/transaction';
import { useAuth } from '../context/auth';
import dayjs from 'dayjs';
import './Tab2.css';

interface MonthlyGroup {
  monthKey: string;
  monthLabel: string;
  income: number;
  expense: number;
  balance: number;
  transactions: any[];
}

const Tab2: React.FC = () => {
  const { user, logout } = useAuth();
  const { allTransactions, isLoading } = useTransactions();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Group transactions by month
  const groupedData = useMemo(() => {
    const groups: { [key: string]: MonthlyGroup } = {};

    allTransactions.forEach((transaction) => {
      const monthKey = transaction.monthKey;
      if (!groups[monthKey]) {
        const date = dayjs(monthKey, 'YYYY-MM');
        groups[monthKey] = {
          monthKey,
          monthLabel: date.format('MMMM YYYY'),
          income: 0,
          expense: 0,
          balance: 0,
          transactions: [],
        };
      }
      groups[monthKey].transactions.push(transaction);
      if (transaction.type === 'income') {
        groups[monthKey].income += transaction.amount;
      } else {
        groups[monthKey].expense += transaction.amount;
      }
    });

    // Calculate balance and sort by month descending
    Object.values(groups).forEach(group => {
      group.balance = group.income - group.expense;
    });

    return Object.values(groups).sort((a, b) =>
      dayjs(b.monthKey, 'YYYY-MM').unix() - dayjs(a.monthKey, 'YYYY-MM').unix()
    );
  }, [allTransactions]);

  // Filter by search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedData;
    }

    const query = searchQuery.toLowerCase();
    const result: MonthlyGroup[] = [];

    groupedData.forEach(group => {
      const filteredTransactions = group.transactions.filter(tx => {
        const descriptionMatch = tx.description.toLowerCase().includes(query);
        const dateMatch = dayjs(tx.timestamp).format('D MMMM YYYY').toLowerCase().includes(query);
        const monthMatch = group.monthLabel.toLowerCase().includes(query);
        return descriptionMatch || dateMatch || monthMatch;
      });

      if (filteredTransactions.length > 0) {
        result.push({
          ...group,
          transactions: filteredTransactions,
          income: filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
          expense: filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
          balance: filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
                   filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        });
      }
    });

    return result;
  }, [groupedData, searchQuery]);

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(monthKey)) {
        newSet.delete(monthKey);
      } else {
        newSet.add(monthKey);
      }
      return newSet;
    });
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Transaction History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {/* Search Bar */}
        <IonSearchbar
          value={searchQuery}
          onIonInput={(e) => setSearchQuery(e.detail.value || '')}
          placeholder="Search by name or date..."
          className="search-bar"
        />

        {isLoading ? (
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>Loading transactions...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={calendarOutline} className="empty-icon" />
            <p>{searchQuery ? 'No transactions found matching your search.' : 'No transactions yet.'}</p>
          </div>
        ) : (
          <div className="monthly-list">
            {filteredData.map((group) => (
              <IonCard key={group.monthKey} className="month-card">
                <IonCardContent className="month-card-content">
                  {/* Month Header */}
                  <div
                    className={`month-header ${expandedMonths.has(group.monthKey) ? 'expanded' : ''}`}
                    onClick={() => toggleMonth(group.monthKey)}
                  >
                    <div className="month-info">
                      <IonIcon icon={calendarOutline} className="month-icon" />
                      <div className="month-text">
                        <h3 className="month-title">{group.monthLabel}</h3>
                        <p className="month-count">{group.transactions.length} transaction{group.transactions.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="month-summary">
                      <div className="summary-item income">
                        <span className="summary-label">Income</span>
                        <span className="summary-value">{formatCurrency(group.income)}</span>
                      </div>
                      <div className="summary-item expense">
                        <span className="summary-label">Expense</span>
                        <span className="summary-value">{formatCurrency(group.expense)}</span>
                      </div>
                      <div className="summary-item balance">
                        <IonIcon icon={cashOutline} className="balance-icon" />
                        <span className={`summary-value ${group.balance >= 0 ? 'positive' : 'negative'}`}>
                          {formatCurrency(group.balance)}
                        </span>
                      </div>
                      <IonIcon
                        icon={chevronDownOutline}
                        className={`chevron ${expandedMonths.has(group.monthKey) ? 'rotated' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Transactions */}
                  {expandedMonths.has(group.monthKey) && (
                    <div className="month-transactions">
                      {group.transactions.map((transaction) => (
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
                              <div className="transaction-date">
                                {getDateLabel(transaction.timestamp)}
                              </div>
                            </div>
                          </div>
                          <div className="transaction-amount" slot="end">
                            <IonText className={transaction.type}>
                              {transaction.type === 'expense' ? '-' : '+'}
                              {formatCurrency(transaction.amount)}
                            </IonText>
                          </div>
                        </IonItem>
                      ))}
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
