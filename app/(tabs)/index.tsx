import { Image, StyleSheet, Platform, ScrollView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';

export default function HomeScreen() {

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    getData();
}, []);

const getData = async () => {
    const response = await fetch('https://990f-103-133-68-7.ngrok-free.app/api/dashboard');
    const data = await response.json();
    setTotalProducts(data.data.products)
    setTotalCustomers(data.data.customers) 
    setTotalSales(data.data.transactions)
}

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.cardContainer}>
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Total Products</ThemedText>
            <ThemedText style={styles.cardText}>{totalProducts}</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Total Customers Card */}
        <ThemedView style={styles.cardContainer}>
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Total Customers</ThemedText>
            <ThemedText style={styles.cardText}>{totalCustomers}</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Total Sales Card */}
        <ThemedView style={styles.cardContainer}>
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Total Sale</ThemedText>
            <ThemedText style={styles.cardText}>{totalSales}</ThemedText>
          </ThemedView>
        </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginLeft:10,
    paddingTop:40 ,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  cardContainer: {
    flex: 1,
    margin: 5,
    paddingHorizontal:10
  },
  card: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 10,
  },
  cardText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
