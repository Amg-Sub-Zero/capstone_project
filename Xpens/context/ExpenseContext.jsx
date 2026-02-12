import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [income, setIncome] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      const savedBudgets = await AsyncStorage.getItem('budgets');
      const savedIncome = await AsyncStorage.getItem('income');
      
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
      if (savedIncome) setIncome(parseFloat(savedIncome));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...transaction
    };
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    saveData('transactions', updated);
  };

  const deleteTransaction = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    saveData('transactions', updated);
  };

  const setBudget = (category, amount) => {
    const updated = { ...budgets, [category]: amount };
    setBudgets(updated);
    saveData('budgets', updated);
  };

  const updateIncome = (amount) => {
    setIncome(amount);
    AsyncStorage.setItem('income', amount.toString());
  };

  const getExpensesByCategory = () => {
    const expenses = transactions.filter(t => t.type === 'expense');
    return expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) + income;
  };

  return (
    <ExpenseContext.Provider value={{
      transactions,
      budgets,
      income,
      addTransaction,
      deleteTransaction,
      setBudget,
      updateIncome,
      getExpensesByCategory,
      getTotalExpenses,
      getTotalIncome
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => useContext(ExpenseContext);
