import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Button, Dimensions, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');


type Product = {
  id: number;
  code: string;
  product_name: string;
  category: string;
  price: number;
};
const Product = () => {

    const [products, setProducts] = useState<Product[]>([]);    // const [modal, setModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // Form state
    const [code, setCode] = useState('');
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(true);
    
    // State to store products

    useEffect(() => {
      getData();
    }, []);

    // Function to fetch data from API
    const getData = async () => {
      try {
        console.log('Fetching products...');
        const response = await fetch('https://047e-158-140-182-97.ngrok-free.app/api/products');
        const data = await response.json();
        setProducts(data.data); // Assuming the response is an object with a `data` field
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const createProduct = async (e:any) => {
      e.preventDefault();
      const response = await fetch('https://047e-158-140-182-97.ngrok-free.app/api/products', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              code,
              product_name: productName,
              category,
              price
          })
      });
      const data = await response.json();
      if (response.status === 200) {
          setProducts([...products, data.data]);
          setCode('');
          setProductName('');
          setCategory('');
          setPrice('');
          setModalVisible(false);
      } else {
          alert(data.message);
      }
    }

    const deleteProduct = async (id:number) => {
        try {
            console.log('Deleting product...');
            const response = await fetch(`https://047e-158-140-182-97.ngrok-free.app/api/products/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.status === 200) {
                setProducts(products.filter(item => item.id !== id));
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }


    const editProduct = async (product:any) => {
      setEditId(product.id);
      setCode(product.code);
      setProductName(product.product_name);
      setCategory(product.category);
      setPrice(product.price.toString());
      setModalVisible(true)
    }
  
  const updateProduct = async (e:any) => {
      e.preventDefault();
      const response = await fetch(`https://047e-158-140-182-97.ngrok-free.app/api/products/${editId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              code,
              product_name: productName,
              category,
              price
          })
      });
      const data = await response.json();
      if (response.status === 200) {
          const updatedProducts = products.map(product => {
              if (product.id === editId) {
                  return {...data.data};
              }
              return product;
          });
          setProducts(updatedProducts);
          setEditId(0);
          setCode('');
          setProductName('');
          setCategory('');
          setPrice('');
          setModalVisible(false);
      } else {
          alert(data.message);
      }
  }

    
    return (
        <ScrollView style={styles.container}>
            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">Product</ThemedText>
            </ThemedView>
          <ThemedView style={styles.buttonContainer}>
            <Button title="Create New Product" onPress={() => setModalVisible(true)} color="#2196F3" />
          </ThemedView>
            <ThemedView style={styles.productListContainer}>
                {!loading && products.map((item) => (
                        <TouchableOpacity style={styles.productItem} key={item.id} onPress={() => editProduct(item)}>
                            <ThemedText style={styles.productDescription}>{item?.code}</ThemedText>
                            <ThemedText style={styles.productName}>{item?.product_name}</ThemedText>
                            <ThemedText style={styles.productDescription}>Price :{item?.price} </ThemedText>
                            <TouchableOpacity
                              style={{backgroundColor: '#0a7ea4', borderRadius: 5, padding: 5}}
                              onPress={() => deleteProduct(item.id)}
                            >
                              <ThemedText style={{color: 'white', textAlign: 'center'}}>Delete</ThemedText>
                            </TouchableOpacity>
                        </TouchableOpacity>
                ))}
            </ThemedView>
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{editId ? 'Edit Product' : 'Create New Product'}</Text>
                    <View style={styles.inputGroup}>
                      <Text>Code:</Text>
                      <TextInput value={code} onChangeText={setCode} style={styles.input} />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text>Product Name:</Text>
                      <TextInput value={productName} onChangeText={setProductName} style={styles.input} />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text>Category:</Text>
                      <TextInput value={category} onChangeText={setCategory} style={styles.input} />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text>Price:</Text>
                      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
                    </View>
                    <View style={styles.buttonGroup}>
                      <Button title="Close" onPress={() => setModalVisible(false)} />
                      <Button
                        title={editId ? 'Edit' : 'Create'}
                        onPress={editId ? updateProduct : createProduct}
                        color="#841584"
                      />
                    </View>
                  </View>
                </View>
              </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      gap: 8,
      marginLeft:10,
      paddingTop:40 ,
    },
    productListContainer: {
      flex: 1,
      paddingTop: 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',

      },
    headerContainer: {
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      marginTop: 10,
      fontSize: 26,
      fontWeight: 'bold',
      color: '#333',
    },
    titleText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    productItem: {
      flex: 1,
      margin: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      width: width * 0.9,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    productName: {
      marginTop: 10,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    productDescription: {
      fontSize: 14,
      color: '#666',
      marginVertical: 5,
    },
    addButton: {
      backgroundColor: '#FF6347',
      borderRadius: 5,
      marginTop: 10,
    },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '90%', padding: 20, backgroundColor: 'white', borderRadius: 10 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    inputGroup: { marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ced4da', padding: 10, borderRadius: 4, marginVertical: 5 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end',paddingRight:30 },
    productPrice: { fontSize: 16, color: '#495057', marginVertical: 4 },
    buttonGroup: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  });

export default Product;
