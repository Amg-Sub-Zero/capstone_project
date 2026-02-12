import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useExpense } from '../../context/ExpenseContext';
import { Ionicons } from '@expo/vector-icons';

export default function Budget() {
  const { budgets, setBudget, income, updateIncome, getExpensesByCategory } = useExpense();
  const [monthlyIncome, setMonthlyIncome] = useState(income.toString());
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState('');

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'];
  const expensesByCategory = getExpensesByCategory();

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSaveIncome = () => {
    const amount = parseFloat(monthlyIncome);
    if (isNaN(amount) || amount < 0) {
      showAlert('Error', 'Please enter a valid income amount');
      return;
    }
    updateIncome(amount);
    showAlert('Success', 'Monthly income updated!');
  };

  const handleSaveBudget = (category) => {
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount < 0) {
      showAlert('Error', 'Please enter a valid budget amount');
      return;
    }
    setBudget(category, amount);
    setEditingCategory(null);
    setBudgetAmount('');
    showAlert('Success', `Budget for ${category} updated!`);
  };

  const startEditing = (category) => {
    setEditingCategory(category);
    setBudgetAmount(budgets[category]?.toString() || '');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Monthly Income</Text>
        <View style={styles.incomeContainer}>
          <TextInput
            style={styles.incomeInput}
            placeholder="Enter monthly income"
            keyboardType="decimal-pad"
            value={monthlyIncome}
            onChangeText={setMonthlyIncome}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveIncome}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Category Budgets</Text>
        <Text style={styles.subtitle}>Set spending limits for each category</Text>

        {categories.map(category => {
          const budget = budgets[category] || 0;
          const spent = expensesByCategory[category] || 0;
          const remaining = budget - spent;
          const percentage = budget > 0 ? (spent / budget) * 100 : 0;
          const isOverBudget = spent > budget && budget > 0;

          return (
            <View key={category} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category}</Text>
                  {budget > 0 && (
                    <Text style={[styles.remainingText, isOverBudget && styles.overBudgetText]}>
                      {isOverBudget ? 'Over by' : 'Remaining'}: ${Math.abs(remaining).toFixed(2)}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => startEditing(category)}>
                  <Ionicons name="create-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
              </View>

              {editingCategory === category ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.budgetInput}
                    placeholder="Enter budget"
                    keyboardType="decimal-pad"
                    value={budgetAmount}
                    onChangeText={setBudgetAmount}
                    autoFocus
                  />
                  <TouchableOpacity 
                    style={styles.saveBudgetButton} 
                    onPress={() => handleSaveBudget(category)}
                  >
                    <Text style={styles.saveBudgetText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => setEditingCategory(null)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.budgetInfo}>
                    <Text style={styles.budgetText}>
                      Budget: ${budget.toFixed(2)}
                    </Text>
                    <Text style={styles.spentText}>
                      Spent: ${spent.toFixed(2)}
                    </Text>
                  </View>
                  {budget > 0 && (
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${Math.min(percentage, 100)}%` },
                          isOverBudget && styles.progressOverBudget
                        ]} 
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  incomeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  incomeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  remainingText: {
    fontSize: 13,
    color: '#4CAF50',
  },
  overBudgetText: {
    color: '#f44336',
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetText: {
    fontSize: 14,
    color: '#666',
  },
  spentText: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressOverBudget: {
    backgroundColor: '#f44336',
  },
  editContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  saveBudgetButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  saveBudgetText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 14,
  },
});
