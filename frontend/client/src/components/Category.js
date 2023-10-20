import {useState} from 'react';
import { Link } from 'react-router-dom';

export default function Category({ products }) {
    const [showAllCategories, setShowAllCategories] = useState(false);

     // Get the distinct categories
    const distinctCategories = [...new Set(products.map((product) => product.category))].sort();

    // Show only the first 5 categories if showAllCategories is false
    const displayedCategories = showAllCategories ? distinctCategories : distinctCategories.slice(0, 5);

    // Manually choose the top 4 product IDs 
    const topProductIds = [1, 3, 4, 6];

    // Show only top products
    const topProducts = products.filter((product) => topProductIds.includes(product.id));

    return (
        <>
            <div className="two-column-layout">
                <div className="column left-column">
                    <h2>All Categories</h2>
                    <ul className="list">
                        {displayedCategories.map((category) => (
                            <li className="box" key={category}>
                                <Link to={`/sub-category/${category}`}>{category}</Link>
                            </li>
                        ))}
                    </ul>
                    {!showAllCategories && (
                        <a href="#" onClick={() => setShowAllCategories(true)}>Show All Categories</a>
                    )}
                </div>
                <div className="column right-column">
                    <h2>Top Products</h2>
                    <div className="product-grid">
                        {topProducts.map((product) => (
                            <div className="product" key={product.id}>
                                <h3>{product.title}</h3>
                                <p>Manufacturer: {product.manufacturer}</p>
                                <p>Description: {product.description}</p>
                                <p>Category: {product.category}</p>
                                <p>Sub-Category: {product['sub-category']}</p>
                                <p>Color: {product.color}</p>
                                <p>Price: ${product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}