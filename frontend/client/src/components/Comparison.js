import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

export default function Comparison({ products }) {
    const { id1, id2 } = useParams();
    const product1 = products.find((product) => product.id === parseInt(id1));
    const product2 = products.find((product) => product.id === parseInt(id2));

    return (
        <div style={{textAlign: 'center'}}>
            <br></br>
            <h2>Product Comparison</h2>
            <div className="product-grid">
                <div className="product-display">
                    <h3>{product1.title}</h3>
                    <p>Manufacturer: {product1.manufacturer}</p>
                    <p>Description: {product1.description}</p>
                    <p>Category: {product1.category}</p>
                    <p>Sub-Category: {product1['sub-category']}</p>
                    <p>Color: {product1.color}</p>
                    <p>Price: ${product1.price}</p>
                </div>
                <div className="product-display">
                    <h3>{product2.title}</h3>
                    <p>Manufacturer: {product2.manufacturer}</p>
                    <p>Description: {product2.description}</p>
                    <p>Category: {product2.category}</p>
                    <p>Sub-Category: {product2['sub-category']}</p>
                    <p>Color: {product2.color}</p>
                    <p>Price: ${product2.price}</p>
                </div>
            </div>
        </div>
    )
}