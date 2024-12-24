import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:2000/api/products'; // Define the API URL

const Product = () => {
    const [products, setProducts] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'จำนวนสินค้า',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getRandomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor}`;
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const sortedProducts = data.sort((a, b) => b.total - a.total); // Sort products by total
            setProducts(sortedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error fetching products');
        } finally {
            setLoading(false);
        }
    };

    const prepareChartData = () => {
        const labels = products.map(product => product.Product_Name);
        const dataValues = products.map(product => product.total);
        const backgroundColors = products.map(() => getRandomColor());
        const borderColors = products.map(() => getRandomColor());

        setChartData({
            labels,
            datasets: [
                {
                    label: 'จำนวนสินค้า',
                    data: dataValues,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                },
            ],
        });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            prepareChartData();
        }
    }, [products]);

    if (loading) return <p>กำลังโหลดข้อมูลผลิตภัณฑ์...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ width: '60%', margin: '20px auto' }}>
            <h2>ข้อมูลผลิตภัณฑ์</h2>
            <Bar data={chartData} options={{ responsive: true }} />
            <ProductTable products={products} />
        </div>
    );
};

const ProductTable = ({ products }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
            <tr>
                <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Product Name</th>
                <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Total</th>
            </tr>
        </thead>
        <tbody>
            {products.length > 0 ? (
                products.map((product, index) => (
                    <ProductRow key={index} product={product} />
                ))
            ) : (
                <tr>
                    <td colSpan="2" style={{ textAlign: 'center', border: '1px solid #dddddd', padding: '8px' }}>
                        ไม่มีข้อมูลผลิตภัณฑ์
                    </td>
                </tr>
            )}
        </tbody>
    </table>
);

const ProductRow = ({ product }) => (
    <tr>
        <td style={{ border: '1px solid #dddddd', padding: '8px' }}>
            {product.Product_Name || 'N/A'}
        </td>
        <td 
            style={{
                border: '1px solid #dddddd', 
                padding: '8px', 
                color: product.total < 10 ? 'red' : 'black' // Change text color if below 10
            }}
        >
            {product.total || 'N/A'} 
            {product.total < 10 && (
                <span style={{ fontWeight: 'bold' }}>(สินค้าใกล้หมด)</span>
            )}
        </td>
    </tr>
);

export default Product;