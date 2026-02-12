import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useExpense } from '../../context/ExpenseContext';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const { getTotalIncome, getTotalExpenses, getExpensesByCategory, budgets } = useExpense();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = totalIncome - totalExpenses;
  const expensesByCategory = getExpensesByCategory();

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.title}>Financial Summary</Text>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={[styles.balanceAmount, balance < 0 && styles.negative]}>
            ${balance.toFixed(2)}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.summaryItem}>
            <Ionicons name="arrow-down-circle" size={24} color="#4CAF50" />
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryAmount}>${totalIncome.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="arrow-up-circle" size={24} color="#f44336" />
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={styles.summaryAmount}>${totalExpenses.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.categoryCard}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        {categories.map(category => {
          const spent = expensesByCategory[category] || 0;
          const budget = budgets[category] || 0;
          const percentage = budget > 0 ? (spent / budget) * 100 : 0;
          const isOverBudget = spent > budget && budget > 0;

          return (
            <View key={category} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={[styles.categoryAmount, isOverBudget && styles.overBudget]}>
                  ${spent.toFixed(2)} {budget > 0 && `/ $${budget.toFixed(2)}`}
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
  summaryCard: {
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
    marginBottom: 15,
    color: '#333',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  negative: {
    color: '#f44336',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 3,
  },
  categoryCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoryItem: {
    marginBottom: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  overBudget: {
    color: '#f44336',
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
});
