import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Products({ products}) {
    const { subCategory } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [subProducts, setSubProducts] = useState([]);
    const [selectedManufacturers, setSelectedManufacturers] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [comparedProducts, setComparedProducts] = useState([]);
 
    useEffect(() => {
        const newProducts = products.filter((product) => product['sub-category'] === subCategory);
        setSubProducts(newProducts);
      }, [subCategory]);

    const getDistinctManufacturer = (selectedSubCategory) => {
        const newProducts = products.filter((product) => product['sub-category'] === selectedSubCategory);
        return [...new Set(newProducts.map((product) => product.manufacturer))].sort();
    }
    const distinctManufacturers = subCategory ? getDistinctManufacturer(subCategory) : [];

    const getDistinctColors = (selectedSubCategory) => {
        const newProducts = products.filter((product) => product['sub-category'] === selectedSubCategory);
        return [...new Set(newProducts.map((product) => product.color))].sort();
    }
    const distinctColors = subCategory ? getDistinctColors(subCategory) : [];

    // const handleCategoryFilter = () => {
    //     const newProducts = products.filter(
    //         (product) =>
    //           (!selectedCategory || product.category === selectedCategory) &&
    //           (!selectedSubCategory || product['sub-category'] === selectedSubCategory) &&
    //           (!minPrice || product.price >= parseFloat(minPrice)) &&
    //           (!maxPrice || product.price <= parseFloat(maxPrice))
    //       );
    //       setFilteredProducts(newProducts);
    // }

    // const handleSubCategoryFilter = () => {
    //     handleCategoryFilter();
    // }

    // // const handlePriceFilter = () => {
    // //     handleCategoryFilter();
    // // };

    const handleManufacturer = (e) => {
        const value = e.target.value;
        // setSelectedManufacturers(prevSelected => [...prevSelected, value]);
        if (selectedManufacturers.includes(value)) {
            setSelectedManufacturers(prevSelected => prevSelected.filter(item => item !== value));
          } else {
            setSelectedManufacturers(prevSelected => prevSelected.concat(value));
        }
    }

    const handleColor = (e) => {
        const value = e.target.value;
        if (selectedColors.includes(value)) {
            setSelectedColors(prevSelected => prevSelected.filter(item => item !== value));
          } else {
            setSelectedColors(prevSelected => prevSelected.concat(value));
        }
    }

    const handleFilter = () => {
        if (!selectedColors.length && !selectedManufacturers.length && !minPrice && !maxPrice) {
            setFilteredProducts([])
        }
        else {
            const newProducts = subProducts.filter(
                (product) =>
                    (!selectedManufacturers.length || selectedManufacturers.includes(product.manufacturer)) &&
                    (!selectedColors.length || selectedColors.includes(product.color)) &&
                    (!minPrice || product.price >= parseFloat(minPrice)) &&
                    (!maxPrice || product.price <= parseFloat(maxPrice))
            );
            setFilteredProducts(newProducts);
        }
    }

    const handlePriceReset = () => {
        setMinPrice('');
        setMaxPrice('');
    }

    const handleRemoveManufacturerFilter = () => {
        setSelectedManufacturers([]);
    };

    const handleRemoveColorFilter = () => {
        setSelectedColors([]);
      };
    
    const handleRemovePriceFilter = () => {
        handlePriceReset();
    };

    const handleSortBy = (e) => {
        const value = e.target.value;
        const sortedProducts = [...(filteredProducts.length > 0 ? filteredProducts : subProducts)];

        if (value === "atoz") {
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        } else if (value === "ztoa") {
            sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        } else if (value === "lowtohigh") {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (value === "hightolow") {
            sortedProducts.sort((a, b) => b.price - a.price);
        }

        if (filteredProducts.length > 0) {
            setFilteredProducts([...sortedProducts]); 
        } else {
            setSubProducts([...sortedProducts]);
        }
    }

    const handleComparison = (productId) => {
        const isSelected = comparedProducts.includes(productId);
        // If the product is not selected and the limit is not reached, add it
        if (!isSelected && comparedProducts.length < 2) {
            setComparedProducts([...comparedProducts, productId]);
        } else if (isSelected) {
            // If the product is selected, remove it
            setComparedProducts(comparedProducts.filter((id) => id !== productId));
        }
    }

    // console.log(comparedProducts);
 
    useEffect(() => {
        handleFilter();
    }, [selectedManufacturers, selectedColors, minPrice, maxPrice]);

    return (
        <>
            <br></br>
            <div className="filter-bar">
                {selectedManufacturers.length > 0 && (
                    <button onClick={handleRemoveManufacturerFilter} style={{marginRight: '5px'}}>Manufacturer</button>
                )}
                {selectedColors.length > 0 && (
                    <button onClick={handleRemoveColorFilter} style={{marginRight: '5px'}}>Color</button>
                )}
                 {(minPrice || maxPrice) && (
                    <button onClick={handleRemovePriceFilter} style={{marginRight: '5px'}}>Price</button>
                )}
            </div>
            <div className="two-column-layout">
                <div className="column left-column">
                    <h3>Manufacturer</h3>
                    <ul className="list">
                        {distinctManufacturers.map(manufacturer => (
                        <li key={manufacturer}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={manufacturer}
                                    checked={selectedManufacturers.includes(manufacturer)}
                                    onChange={e => handleManufacturer(e)}
                                    style={{ marginRight: '5px' }}
                                />
                                {manufacturer}
                            </label>
                        </li>
                        ))}
                    </ul>
                    <p></p>
                    <h3>Color</h3>
                    <ul className="list">
                        {distinctColors.map(color => (
                        <li key={color}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={color}
                                    checked={selectedColors.includes(color)}
                                    onChange={e => handleColor(e)}
                                    style={{ marginRight: '5px' }}
                                />
                                {color}
                            </label>
                        </li>
                        ))}
                    </ul>
                    <p></p>
                    <h3>Price Range</h3>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{position: 'absolute', left: '25px'}}>$ </span>
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            style={{border: '1px solid black', width: '30%', paddingLeft: '15px', marginRight: '5px'}}
                        />
                        <span style={{position: 'absolute', left: '7.3%'}}>$ </span>
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            style={{border: '1px solid black', width: '30%', paddingLeft: '15px', marginRight: '5px'}}
                        />
                        {/* <button onClick={handlePriceFilter}>Go</button> */}
                        <button onClick={handlePriceReset}>Reset</button>
                    </div>
                </div>
                <div className="column right-column">
                    <div className="compare">
                        {comparedProducts.length === 2 && (
                             <Link to={`/comparison/${comparedProducts[0]}/${comparedProducts[1]}`}><button>Compare</button></Link>
                        )}
                    </div>
                    <div className="sort-by">
                        <h5 style={{ marginRight: '10px' }}>Sort By</h5>
                        <select onChange={e => handleSortBy(e)}>
                            <option value="atoz">Product Name A to Z</option>
                            <option value="ztoa">Product Name Z to A</option>
                            <option value="lowtohigh">Price Low to High</option>
                            <option value="hightolow">Price High to Low</option>
                        </select>
                    </div>
                    <h2>Product Page</h2>
                    <div className="product-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <div className="product-page" key={index}>
                                    <input 
                                        type="checkbox" 
                                        checked={comparedProducts.includes(product.id)}
                                        onChange={() => handleComparison(product.id)}>
                                    </input>
                                    <h3>{product.title}</h3>
                                    <p>Manufacturer: {product.manufacturer}</p>
                                    <p>Description: {product.description}</p>
                                    <p>Category: {product.category}</p>
                                    <p>Sub-Category: {product['sub-category']}</p>
                                    <p>Color: {product.color}</p>
                                    <p>Price: ${product.price}</p>
                                </div>
                            ))
                        ) : (
                            subProducts.map((product) => (
                                <div className="product-page" key={product.id}>
                                    <input 
                                        type="checkbox" 
                                        checked={comparedProducts.includes(product.id)}
                                        onChange={() => handleComparison(product.id)}>
                                    </input>
                                    <h3>{product.title}</h3>
                                    <p>Manufacturer: {product.manufacturer}</p>
                                    <p>Description: {product.description}</p>
                                    <p>Category: {product.category}</p>
                                    <p>Sub-Category: {product['sub-category']}</p>
                                    <p>Color: {product.color}</p>
                                    <p>Price: ${product.price}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}