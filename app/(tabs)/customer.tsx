import React from 'react'
import { Text, View, ScrollView, StyleSheet, Alert, Modal, TextInput, Button, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Picker } from '@react-native-picker/picker';

export default function Customer() {
  const [customers, setCustomers] = useState<Array<{ id: number; name: string; domicile: string; gender: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(0);
  const [name, setName] = useState('');
  const [domicile, setDomicile] = useState('');
  const [gender, setGender] = useState('1');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      console.log('Fetching customers...');
      const response = await fetch('https://047e-158-140-182-97.ngrok-free.app/api/customers');
      const data = await response.json();
      setCustomers(data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const createCustomer = async (customerData: { name: string; domicile: string; gender: string }) => {
    try {
      console.log('Creating new customer...');
      const response = await fetch('https://047e-158-140-182-97.ngrok-free.app/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });
      const data = await response.json();
      if (response.status === 200) {
        getData();
      } else {
        Alert.alert('Success', data.message);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      Alert.alert('Error', 'Error creating customer');
    }
  };

 const deleteCustomer = async (customer:any) => {
    Alert.alert(
      'Remove',
      `Are you sure you want to remove ${customer.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              await fetch(
                `https://047e-158-140-182-97.ngrok-free.app/api/customers/${customer.id}`,
                {
                  method: 'DELETE',
                }
              );
              getData();
            } catch (error) {
              console.error('Error removing customer:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  }

  const editCustomer = async (customer:any) => {
    setEditId(customer.id);
    setName(customer.name);
    setDomicile(customer.domicile);
    setGender(customer.gender.toString());
    setModalVisible(true)
  }

  const updateCustomer = async (e:any) => {
      e.preventDefault();
      const response = await fetch(`https://047e-158-140-182-97.ngrok-free.app/api/customers/${editId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              name,
              domicile,
              gender
          })
      });
      const data = await response.json();
      if (response.status === 200) {
          const updatedCustomers = customers.map(customer => {
              if (customer.id === editId) {
                  return {...data.data};
              }
              return customer;
          });
          setCustomers(updatedCustomers);
          setEditId(0);
          setName('');
          setDomicile('');
          setGender('');
          setModalVisible(false);
      } else {
          alert(data.message);
      }
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Customers</ThemedText>
      </ThemedView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
          >
          <ThemedText style={styles.buttonText}>Create new </ThemedText>
        </TouchableOpacity>
          </View>
      <ThemedView style={styles.customerListContainer}>
        {!loading &&
          customers.map((customer) => (
            <TouchableOpacity style={styles.customerItem} key={customer.id} onPress={() => editCustomer(customer)}>
              <ThemedText style={styles.customerName}>{customer.name}</ThemedText>
              <ThemedText style={styles.customerInfo}>{customer.domicile}</ThemedText>
              <ThemedText style={styles.customerInfo}>{customer.gender === '1' ? 'Male' : 'Female'}</ThemedText>
              <TouchableOpacity
                style={{backgroundColor: '#0a7ea4', borderRadius: 5, padding: 5}}
                onPress={() => deleteCustomer(customer)}
              >
                <ThemedText style={{color: 'white', textAlign: 'center'}}>Delete</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
      </ThemedView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editId > 0 ? 'Edit Customer' : 'Create New Customer'}</Text>
            <View style={styles.inputGroup}>
              <Text>Name:</Text>
              <TextInput value={name} onChangeText={setName} style={styles.input} />
            </View>
            <View style={styles.inputGroup}>
              <Text>Domicile:</Text>
              <TextInput value={domicile} onChangeText={setDomicile} style={styles.input} />
            </View>
            <View style={styles.inputGroup}>
              <Text>Gender:</Text>
              <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)}>
                <Picker.Item label="Male" value="1" />
                <Picker.Item label="Female" value="2" />
              </Picker>
            </View>
            <View style={styles.buttonGroup}>
              <Button title="Close" onPress={() => setModalVisible(false)} />
              <Button
                title={editId > 0 ? 'Edit' : 'Create'}
                onPress={(e) => editId > 0 ? updateCustomer(e) : createCustomer({ name, domicile, gender })}
                color="#841584"
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
)}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 10,
    paddingTop: 40,
  },
  customerListContainer: {
    flex: 1,
    paddingTop: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  customerItem: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  customerName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  customerInfo: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
    marginRight: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize:14
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    'alignContent': 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', padding: 20, backgroundColor: 'white', borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  inputGroup: { marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ced4da', padding: 10, borderRadius: 4, marginVertical: 5 },
  productPrice: { fontSize: 16, color: '#495057', marginVertical: 4 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },

});

