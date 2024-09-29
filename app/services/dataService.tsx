import { useState, useEffect } from 'react';

const useFetchCustomers = (url: string) => {
  const [customers, setCustomers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        console.log('Fetching customers...');
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.data);
        setCustomers(data.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [url]);

  return { customers, loading };
};

export default useFetchCustomers;

// Usage
const useFetchProducts = (url: string) => {
  const [products, setProducts] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        console.log('Fetching products...');
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.data); // Assuming the response is an object with a `data` field
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [url]);

  return { products, loading };
};

export { useFetchProducts };
