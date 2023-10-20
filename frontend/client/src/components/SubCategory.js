import {useState} from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function SubCategory({ products }) {
    const { category } = useParams();
    const [showAllSubCategories, setShowAllSubCategories] = useState(false);

    // // Create an empty array to store unique categories
    // const distinctCategories = [];

    // // Iterate through the products
    // products.forEach((product) => {
    //     const category = product.category;

    //     // Check if the category is not already in the distinctCategories array
    //     if (!distinctCategories.includes(category)) {
    //         distinctCategories.push(category);
    //     }
    // });

     // Get the distinct categories
    const getDistinctSubCategories = (selectedCategory) => {
        const newProducts = products.filter((product) => product.category === selectedCategory);
        return [...new Set(newProducts.map((product) => product['sub-category']))].sort();
    }
    const distinctSubCategories = category ? getDistinctSubCategories(category) : [];

    // Show only the first 5 categories if showAllCategories is false
    const displayedSubCategories = showAllSubCategories ? distinctSubCategories : distinctSubCategories.slice(0, 5);

    // Manually choose the top 4 product descriptions
    const descriptionsToMatch = ['product11', 'product12', 'product13', 'product20'];

    // Show only top products
    const topProducts = products.filter((product) => distinctSubCategories.includes(product['sub-category']) && descriptionsToMatch.includes(product.description));

    return (
        <>
            <div className="two-column-layout">
                <div className="column left-column">
                    <h2>All Sub-Categories</h2>
                    <ul className="list">
                        {displayedSubCategories.map((subCategory) => (
                            <li className="box" key={subCategory}>
                                <Link to={`/products/${subCategory}`}>{subCategory}</Link>
                            </li>
                        ))}
                    </ul>
                    {!showAllSubCategories && (
                        <a href="#" onClick={() => setShowAllSubCategories(true)}>Show All Sub-Categories</a>
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