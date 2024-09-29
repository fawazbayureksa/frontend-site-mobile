import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // For dropdown functionality

const Sale: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [customer, setCustomer] = useState<number | undefined>();
  const [editId, setEditId] = useState<number>(0);
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [newRowProduct, setNewRowProduct] = useState([
    {
      product_id: 0,
      quantity: '',
      sub_total: 0,
    },
  ]);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchSalesData();
  }, []);

  const fetchCustomers = async () => {
    const response = await fetch('https://047e-158-140-182-97.ngrok-free.app/api/customers');
    const data = await response.json();
    setCustomers(data.data);
  };

  const fetchProducts = async () => {
    const response = await fetch('https://047e-158-140-182-97.ngrok-free.app/api/products');
    const data = await response.json();
    setProducts(data.data); // Assuming the resp
  };

  const fetchSalesData = async () => {
    const response = await fetch('https://047e-158-140-182-97.ngrok-free.app/api/sales');
    const data = await response.json();
    setSales(data.data);
  };

  const handleProductChange = (index: number, value: number) => {
    const updatedProducts = [...newRowProduct];
    updatedProducts[index].product_id = value;
    setNewRowProduct(updatedProducts);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const updatedProducts = [...newRowProduct];
    if (updatedProducts[index].product_id === 0) return;

    const productPrice = products.find((product) => product.id === updatedProducts[index].product_id).price;
    updatedProducts[index].quantity = value;
    updatedProducts[index].sub_total = value ? parseInt(value) * productPrice : 0;
    setNewRowProduct(updatedProducts);
  };

  const addRow = () => {
    setNewRowProduct([...newRowProduct, { product_id: 0, quantity: '', sub_total: 0 }]);
  };

  const removeRow = (index: number) => {
    const updatedProducts = newRowProduct.filter((_, i) => i !== index);
    setNewRowProduct(updatedProducts);
  };

  const saveSale = async () => {
    if (!customer) {
      Alert.alert('Error', 'Please select a customer');
      return;
    }

    if (newRowProduct.some((product) => product.product_id === 0)) {
      Alert.alert('Error', 'Please select products');
      return;
    }

    const saleData = {
      customer_id: customer,
      products: newRowProduct,
      sub_total: newRowProduct.reduce((acc, item) => acc + item.sub_total, 0),
    };

    // if (editId) {
    //   await updateSale(editId, saleData);
    // } else {
      await createSale(saleData);
    // }

    fetchSalesData();
    resetForm();
    Alert.alert('Success', 'Sale saved successfully!');
  };

  const createSale = async (saleData: any) => {
    console.log(saleData);
    try {
      const response = await fetch('https://047e-158-140-182-97.ngrok-free.app/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(saleData)
      });
      const data = await response.json();
      if (response.status === 201) {
        return data.data;
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      Alert.alert('Error', 'Error creating sale');
    }
  };

  const resetForm = () => {
    setNewRowProduct([{ product_id: 0, quantity: '', sub_total: 0 }]);
    setCustomer(undefined);
    setEditId(0);
  };

  
  const deleteSale = async (saleId: number) => {
    try {
      const response = await fetch(`https://047e-158-140-182-97.ngrok-free.app/api/sales/${saleId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.status === 200) {
        fetchSalesData();
        Alert.alert('Success', 'Sale deleted successfully!');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      Alert.alert('Error', 'Error deleting sale');
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sale</Text>

      <View style={styles.formContainer}>
        {/* Customer Picker */}
        <View style={styles.pickerContainer}>
          <Text>Customer</Text>
          <Picker selectedValue={customer} onValueChange={(itemValue) => setCustomer(itemValue)}>
            <Picker.Item label="-- Choose Customer --" value={0} />
            {customers.map((cust) => (
              <Picker.Item key={cust.id} label={cust.name} value={cust.id} />
            ))}
          </Picker>
        </View>

        {/* Product Rows */}
        {newRowProduct.map((row, index) => (
          <View style={styles.productRow} key={index}>
            <View style={styles.pickerContainer}>
              <Text>Product</Text>
              <View style={{flexDirection: 'row', alignItems: 'center',width: 150}}>
                <Picker selectedValue={row.product_id} onValueChange={(value) => handleProductChange(index, value)} style={{flex: 1, marginLeft: 10}}>
                  <Picker.Item label="-- Choose Product --" value={0} />
                  {products.map((product) => (
                    <Picker.Item key={product.id} label={product.product_name} value={product.id} />
                  ))}
                </Picker>              
                </View>
            </View>
                <TextInput
                style={styles.inputItem}
                placeholder="Qty"
                keyboardType="numeric"
                value={row.quantity.toString()}
                onChangeText={(value) => handleQuantityChange(index, value)}
                />

                <TextInput style={styles.input} placeholder="Sub Total" value={row.sub_total.toString()} editable={false} />
            {newRowProduct.length > 1 && (
              <Button title="X" onPress={() => removeRow(index)} color="red" />
            )}
          </View>
        ))}
        <View style={{marginVertical:5}}>
            <Button title="Add Product" onPress={addRow} />
        </View>
        <View style={{marginVertical:5}}>
            <Button title="Save Sale" onPress={saveSale} />
        </View>
      </View>

      {/* Sales Table */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Sales</Text>
        {sales.map((sale, index) => (
          <View key={sale.id} style={styles.saleRow}>
            {/* <Text style={styles.tableText}>{index + 1}</Text> */}
            <Text style={styles.tableText}>{sale.customer.name}</Text>
            <Text style={{fontSize:10,width:'20%'}}>
                {sale.item_sale.map((itemSale: any) => (
                    itemSale.product.product_name + ' x ' + itemSale.qty + '\n'
                ))}            
            </Text>
            <Text style={styles.tableText}>{sale.sub_total}</Text>
            <Button title="Delete" onPress={() => deleteSale(sale.id)} color="red" />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Sale;

// Styles (Customize as needed)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 30,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    marginRight: 5,
    width: 60,
    height:40,
    borderRadius: 10,
    color: 'black',
  },
  inputItem: {
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    width: 50,
    height:40,
    borderRadius: 10,
    color: 'black',

  },
  tableContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  saleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
  },
  tableText: {
    width: '20%',
  },
});
