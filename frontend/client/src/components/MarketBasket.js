import React,{Component, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal, Button} from 'react-bootstrap';
import * as xlsx from "xlsx";
import { saveAs } from 'file-saver';
import { HashLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { API_URL } from 'config';

function ProductView() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [editedDate, setEditedDate] = useState({});
    const [editedVendor, setEditedVendor] = useState({});
    const [editedSKU, setEditedSKU] = useState({});
    const [editedInvoiceNumber, setEditedInvoiceNumber] = useState({});
    const [editedDescription, setEditedDescription] = useState({});
    const [editedQuantity, setEditedQuantity] = useState({});
    const [editedPrice, setEditedPrice] = useState({});
    const [editedTotal, setEditedTotal] = useState({});
    const [editedIssue, setEditedIssue] = useState({});
    const [editedErrorColumn, setErrorColumn] = useState({});
    const [editedError, setEditedError] = useState({});
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    //Setting text to enter into the search bar 
    const [inputValue, setInputValue] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [selectedOption, setSelectedOption] = useState("all");
    const [issueProducts, setIssueProducts] = useState([]);
    const [issueProductsCurrentPage, setIssueProductsCurrentPage] = useState(1);
    const [issueProductsTotalPages, setIssueProductsTotalPages] = useState(0);
    const { user } = useSelector(state => state.user);
    const textareaRef = useRef(null);

    //check current page
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');
        const initialPage = pageParam ? parseInt(pageParam) : 1;
        setCurrentPage(initialPage);
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [currentPage, inputValue]);

    const fetchProducts = async () => {
        try {
        const response = await axios.get(API_URL + '/backend/market-basket/', {
            params: {
                page: currentPage,
                page_size: 50,
                value: inputValue
            }
        });
        // console.log(response.data);
        // console.log(response.data.rows);
        setProducts(response.data.rows);
        const totalRows = response.data.total_rows;
        const pageSize = 50;
        //Total pages is returning the number of pages based off the tables 
        const totalPages = Math.ceil(totalRows / pageSize);
        setTotalPages(totalPages);
        // Update URL with page number
        const url = new URL(window.location.href);
        url.searchParams.set('page', currentPage);
        window.history.pushState({ path: url.href }, '', url.href);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        fetchIssueProducts();
    }, [issueProductsCurrentPage, inputValue]);

    const fetchIssueProducts = async () => {
        try {
        const response = await axios.get(API_URL + '/backend/issue-market-basket/', {
            params: {
                page: issueProductsCurrentPage,
                page_size: 50,
                value: inputValue
            }
        });
        // console.log(response.data);
        // console.log(response.data.rows);
        setIssueProducts(response.data.rows);
        const totalRows = response.data.total_rows;
        const pageSize = 50;
        //Total pages is returning the number of pages based off the tables 
        const totalPages = Math.ceil(totalRows / pageSize);
        setIssueProductsTotalPages(totalPages);
        // Update URL with page number
        const url = new URL(window.location.href);
        url.searchParams.set('page', issueProductsCurrentPage);
        window.history.pushState({ path: url.href }, '', url.href);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handleIssueProductPageChange = page => {
        setIssueProductsCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset current page to 1
        setInputValue(searchInput); // Set inputValue to the value of searchInput
    };

    const handleFieldChange = (event, fieldName, productId, state, setState) => {
       
        const { value } = event.target;
        
        // Create a new state object
        const updatedState = Object.assign({}, state);
        
        // Access the existing product object
        const product = updatedState[productId];

        // Create a new product object with update field
        const updatedProduct = Object.assign({}, product, { [fieldName]: value });

        // Update the product in the new state object
        updatedState[productId] = updatedProduct;

        setState(updatedState);
        setSelectedRowId(productId);
    }

    const handleGoogle = (productId) => {
        const product = products.find(item => item.id == productId);
        if (product) {
            // Create a search query string
            const query = `${product.vendor_cln || ""} ${product.sku_cln || ""} ${product.description_cln || ""} product`;
            
            // Encode the query for a URL
            const encodedQuery = encodeURIComponent(query);
            
            // Construct the Google search URL
            const searchURL = `https://www.google.com/search?q=${encodedQuery}`;
            
            // Open the search URL in a new tab
            window.open(searchURL, '_blank');  
        } else {
            // Handle the case when no matching product is found
            alert("Product not found");
        }
    }


    const handleEditAPI = (issue) => {
        // const textareaValue = textareaRef.current.value.trim();
        // if (textareaValue === '') {
        //     alert('Please fill in the Note field before saving.');
        // } 
        // else {
        //     const formData = {
        //         firstName: user.first_name,
        //         lastName: user.last_name,
        //         id: editedProduct.id,
        //         date: editedProduct.date_cln,
        //         vendor: editedProduct.vendor_cln,
        //         sku: editedProduct.sku_cln,
        //         invoice_number: editedProduct.invoice_number_cln,
        //         description: editedProduct.description_cln,
        //         quantity: editedProduct.quantity_cln,
        //         price: editedProduct.price_cln,
        //         total: editedProduct.total_cln,
        //         note: textareaValue,
        //     };
    
        //     axios
        //         .post(API_URL + '/backend/edit-form/', formData)
        //         .then((response) => {
        //             if (response.status === 200) {
        //                 alert('Form submitted successfully');
        //             } else {
        //                 alert('Form submission failed');
        //             }
        //         })
        //         .catch((error) => {
        //             console.error('Error:', error);
        //             alert('An error occurred while submitting the form');
        //         });    
        // }
        if (!selectedRowId) {
            // No row is currently being edited
            return;
        }

        // Find the edited product based on the editedRowId
        let editedProduct = "";
        if (!issue.issue) {
            editedProduct = products.find((product) => product.id === selectedRowId);
        }
        else {
            editedProduct = issueProducts.find((product) => product.id === selectedRowId);
        }
        // console.log(editedProduct);
        if (!editedProduct) {
            // Edited product not found
            return;
        }

         // Gather the edited data for the specific row
        const editedData = {
            id: editedProduct.id,
            date_cln: editedDate[editedProduct.id] !== undefined ? editedDate[editedProduct.id].date : editedProduct.date_cln,
            vendor_cln: editedVendor[editedProduct.id] !== undefined ? editedVendor[editedProduct.id].vendor : editedProduct.vendor_cln,
            sku_cln: editedSKU[editedProduct.id] !== undefined ? editedSKU[editedProduct.id].sku : editedProduct.sku_cln,
            invoice_number_cln: editedInvoiceNumber[editedProduct.id] !== undefined ? editedInvoiceNumber[editedProduct.id].invoice_number : editedProduct.invoice_number_cln,
            description_cln: editedDescription[editedProduct.id] !== undefined ? editedDescription[editedProduct.id].description : editedProduct.description_cln,
            quantity_cln: editedQuantity[editedProduct.id] !== undefined ? editedQuantity[editedProduct.id].quantity : editedProduct.quantity_cln,
            price_cln: editedPrice[editedProduct.id] !== undefined ? editedPrice[editedProduct.id].price : editedProduct.price_cln,
            total_cln: editedTotal[editedProduct.id] !== undefined ? editedTotal[editedProduct.id].total : editedProduct.total_cln,
            issue_cln: editedIssue[editedProduct.id] !== undefined ? editedIssue[editedProduct.id].issue : editedProduct.issue_cln,
            error_column: editedErrorColumn[editedProduct.id] !== undefined ? editedErrorColumn[editedProduct.id].error_column : editedProduct.error_column,
            error: editedError[editedProduct.id] !== undefined ? editedError[editedProduct.id].error : editedProduct.error,
        };

        // console.log(editedData);

        //Call the API to send the JSON file to the Django backend
        axios
            .put(API_URL + '/backend/update-market-basket/', editedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    // Successful API response
                    const currentPageUrl = window.location.href; // Get the current page URL
                    window.location.href = currentPageUrl; // Reload the current page
                } else {
                    // Error in API response
                    throw new Error('Error in API response');
                }
            })
            .catch((error) => {
            // Handle any errors
                console.error(error);
                alert('An error occurred. Please checking your input(s)  again!'); // Display error notification
            });
    };
    
    const handleDeleteAPI = (issue) => {
        // const textareaValue = textareaRef.current.value.trim();
        // if (textareaValue === '') {
        //     alert('Please fill in the Note field before saving.');
        // } 
        // else {
        //     const formData = {
        //         firstName: user.first_name,
        //         lastName: user.last_name,
        //         id: deletedProduct.id,
        //         date: deletedProduct.date_cln,
        //         vendor: deletedProduct.vendor_cln,
        //         sku: deletedProduct.sku_cln,
        //         invoice_number: deletedProduct.invoice_number_cln,
        //         description: deletedProduct.description_cln,
        //         quantity: deletedProduct.quantity_cln,
        //         price: deletedProduct.price_cln,
        //         total: deletedProduct.total_cln,
        //         note: textareaValue,
        //     };

        //     axios
        //         .post(API_URL + '/backend/delete-form/', formData)
        //         .then((response) => {
        //             if (response.status === 200) {
        //                 alert('Form submitted successfully');
        //             } else {
        //                 alert('Form submission failed');
        //             }
        //         })
        //         .catch((error) => {
        //             console.error('Error:', error);
        //             alert('An error occurred while submitting the form');
        //         });
        // }
        // console.log(selectedRowId);
        if (!selectedRowId) {
        // No row is currently being edited
            return;
        }

        let deletedProduct = "";
        if (!issue.issue) {
            deletedProduct = products.find((product) => product.id === selectedRowId);
        }
        else {
            deletedProduct = issueProducts.find((product) => product.id === selectedRowId);
        }

        if (!deletedProduct) {
            // Edited product not found
            return;
        }

        // Gather the edited data for the specific row
        const deletedData = {
            id: deletedProduct.id,
        };

        // console.log(deletedData);

        //Call the API to send the JSON file to the Django backend
        axios
            .delete(API_URL + '/backend/delete-market-basket/', {
                data: deletedData,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    // Successful API response
                    const currentPageUrl = window.location.href; // Get the current page URL
                    window.location.href = currentPageUrl; // Reload the current page
                } else {
                    // Error in API response
                    throw new Error('Error in API response');
                }
            })
            .catch((error) => {
            // Handle any errors
                console.error(error);
                alert('An error occurred. Please try again!'); // Display error notification
            });
    };
    

    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);                                                                                                                                 
    const handleClose2 = () => setShow2(false);
    const handleShow2 = (productId) => {
        setSelectedRowId(productId);
        setShow2(true);
    };   

    function EditModal(issue) {
        return (
            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to edit this product?
                    {/* <form>
                        <label>
                            First Name:
                            <input type="text" value={user.first_name} readOnly></input> 
                        </label>
                        <label>
                            Last Name:
                            <input type="text" value={user.last_name} readOnly></input> 
                        </label>
                        <label>
                            Note: 
                            <br></br>
                            <textarea rows={4} cols={60} ref={textareaRef}></textarea> 
                        </label> 
                    </form> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose1}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleEditAPI(issue)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    function DeleteModal(issue) {
        return (
            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this product?
                    {/* <form>
                        <label>
                            First Name:
                            <input type="text" value={user.first_name} readOnly></input> 
                        </label>
                        <label>
                            Last Name:
                            <input type="text" value={user.last_name} readOnly></input> 
                        </label>
                        <label>
                            Note:
                            <br></br>
                            <textarea rows={4} cols={60} ref={textareaRef}></textarea> 
                        </label>
                    </form> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleDeleteAPI(issue)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
    

    const ProductExportButton =  () => {
        const [allProducts, setAllProducts] = useState([]);
        const [loading, setLoading] = useState(false);
        const [exportReady, setExportReady] = useState(false);
        const [show3, setShow3] = useState(false); // Initialize the modal visibility state

        const handleShow3 = () => {
            setShow3(true); // Show the modal
        };

        const handleClose3 = () => {
            setShow3(false); // Close the modal
        };

        const fetchProducts = async () => {
            setLoading(true); // Enable loading icon
            handleShow3(); // Show the modal
            try {
                let productArray = [];
                let page = 1;
                while (page <= totalPages) {
                    const response = await axios.get(API_URL + '/backend/market-basket/', {
                        params: {
                            page: page,
                            page_size: 50,
                            value: inputValue
                        }
                    });
                    const pageProducts = response.data.rows;
                    if (pageProducts.length === 0) {
                        break; // No more products to fetch
                    }
                    productArray = productArray.concat(pageProducts);
                    page++;
                }
                setAllProducts(productArray);
                // console.log('test');
                // console.log(productArray);
                } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false); // Disable loading when products are fetched
                setExportReady(true); // Set exportReady to true after loading is done
            }
        }

        const exportToExcel = () => {
          // Create a new workbook
          const workbook = xlsx.utils.book_new();
      
          // Convert product data to a worksheet
          const worksheet = xlsx.utils.json_to_sheet(allProducts);
      
          // Add the worksheet to the workbook
          xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');
      
          // Generate Excel file buffer
          const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
      
          // Convert buffer to Blob
          const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
      
          // Save the Blob as an Excel file
          saveAs(blob, 'products_market_basket.xlsx');
          setExportReady(false);
          handleClose3();
        };
        
        return (
            <div>
               <button onClick={fetchProducts}>Export to Excel</button>
                <Modal show={show3} onHide={handleClose3} backdrop="static">
                    <Modal.Header style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Modal.Title style={{textAlign: 'center'}}>Excel File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        {loading && !exportReady ? (
                            <div>
                                <HashLoader loading={true} size={100} color='#018EBD' />
                            </div>
                        ) : exportReady ? (
                            <div>
                                <Button variant="primary"  onClick={exportToExcel}>Download Excel</Button>
                            </div>
                        ) : (
                            <Button variant="secondary" onClick={handleClose3}>Close</Button>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        );
    };

    function Table(products, issue) {
        if (issue === undefined) {
            issue = false;
        }
    
        return (
            <div>
            {/* <SearchFilter/> */}
            <div className="searchFilter">
                <input value={searchInput} style={{border: "solid 1px"}}  name="firstName" onChange={e => setSearchInput(e.target.value)} />   
                <button onClick={handleSearch}>Search</button>
                <button onClick={() => {
                    setInputValue('');
                    setSearchInput('');
                    setCurrentPage(1);
                }}>Reset</button>
                <p>value: {searchInput}</p>
            </div>
            <div>
                <ProductExportButton />
            </div>
            <br></br>
            <table>
                <thead>
                <tr>
                    <th hidden>ID</th>
                    <th>Date</th>
                    <th>Vendor</th>
                    <th>SKU</th>
                    <th>Invoice Number</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Error List</th>
                    <th hidden>Issue</th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {!issue && products.map(product => (
                    <tr key={product.id}>
                        <td hidden>{product.id}</td>
                        <td className={product.error_column.includes('date_cln') || product.date_cln === '' ? 'red' : ''}> 
                            <input
                                type="text" 
                                value={editedDate[product.id] !== undefined ? editedDate[product.id].date : product.date_cln}
                                onChange={(event) => handleFieldChange(event, 'date', product.id, editedDate, setEditedDate)}
                                className="input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={editedVendor[product.id] !== undefined ? editedVendor[product.id].vendor : product.vendor_cln}
                                onChange={(event) => handleFieldChange(event, 'vendor', product.id, editedVendor, setEditedVendor)}
                            />
                        </td>
                        <td className={product.error_column.includes('sku_cln') || product.sku_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedSKU[product.id] !== undefined ? editedSKU[product.id].sku : product.sku_cln}
                                onChange={(event) => handleFieldChange(event, 'sku', product.id, editedSKU, setEditedSKU)}
                                style={{width: '200px'}}
                            />
                        </td>
                        <td className={product.error_column.includes('invoice_number_cln') || product.invoice_number_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedInvoiceNumber[product.id] !== undefined ? editedInvoiceNumber[product.id].invoice_number : product.invoice_number_cln}
                                onChange={(event) => handleFieldChange(event, 'invoice_number', product.id, editedInvoiceNumber, setEditedInvoiceNumber)}
                                style={{width: '200px'}}
                            />
                        </td>
                        <td className={product.error_column.includes('description_cln') || product.description_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedDescription[product.id] !== undefined ? editedDescription[product.id].description : product.description_cln}
                                onChange={(event) => handleFieldChange(event, 'description', product.id, editedDescription, setEditedDescription)}
                                style={{width: '800px'}}
                            />
                        </td>
                        <td className={product.error_column.includes('quantity_cln') || product.quantity_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedQuantity[product.id] !== undefined ? editedQuantity[product.id].quantity : product.quantity_cln}
                                onChange={(event) => handleFieldChange(event, 'quantity', product.id, editedQuantity, setEditedQuantity)}
                                style={{width: '100px'}}
                            />
                        </td>
                        <td className={product.error_column.includes('price_cln') || product.price_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedPrice[product.id] !== undefined ? editedPrice[product.id].price : product.price_cln}
                                onChange={(event) => handleFieldChange(event, 'price', product.id, editedPrice, setEditedPrice)}
                                style={{width: '100px'}}
                            />
                        </td>
                        <td className={product.error_column.includes('total_cln') || product.total_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedTotal[product.id] !== undefined ? editedTotal[product.id].total : product.total_cln}
                                onChange={(event) => handleFieldChange(event, 'total', product.id, editedTotal, setEditedTotal)}
                                style={{width: '100px'}}
                            />
                        </td>
                        <td>
                        <textarea
                            value={product.error ? product.error.split('. ').join('.\n') : ''}
                            readOnly
                            rows={4}
                            style={{width: '350px'}}
                        />
                        </td>
                        <td hidden>
                            <input type='text' value={product.cln}></input>
                        </td>
                        <td><button onClick={handleShow1}>Edit</button></td>
                        <td><button onClick={() => handleShow2(product.id)}>Delete</button></td>
                        <td><button onClick={() => handleGoogle(product.id)}>Google</button></td>
                    </tr>
                ))}

                {issue && issueProducts.map(product => (
                    <tr key={product.id}>
                        <td hidden>{product.id}</td>
                        <td className={product.error_column.includes('date_cln') || product.date_cln === '' ? 'red' : ''}> 
                            <input
                                type="text" 
                                value={editedDate[product.id] !== undefined ? editedDate[product.id].date : product.date_cln}
                                onChange={(event) => handleFieldChange(event, 'date', product.id, editedDate, setEditedDate)}
                                className="input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={editedVendor[product.id] !== undefined ? editedVendor[product.id].vendor : product.vendor_cln}
                                onChange={(event) => handleFieldChange(event, 'vendor', product.id, editedVendor, setEditedVendor)}
                            />
                        </td>
                        <td className={product.error_column.includes('sku_cln') || product.sku_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedSKU[product.id] !== undefined ? editedSKU[product.id].sku : product.sku_cln}
                                onChange={(event) => handleFieldChange(event, 'sku', product.id, editedSKU, setEditedSKU)}
                                style={{width: '200px'}}
                            />
                        </td>
                        <td className={product.error_column.includes('invoice_number_cln') || product.invoice_number_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedInvoiceNumber[product.id] !== undefined ? editedInvoiceNumber[product.id].invoice_number : product.invoice_number_cln}
                                onChange={(event) => handleFieldChange(event, 'invoice_number', product.id, editedInvoiceNumber, setEditedInvoiceNumber)}
                                style={{width: '200px'}}
                            />
                        </td>
                        <td className={product.error_column.includes('description_cln') || product.description_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedDescription[product.id] !== undefined ? editedDescription[product.id].description : product.description_cln}
                                onChange={(event) => handleFieldChange(event, 'description', product.id, editedDescription, setEditedDescription)}
                                style={{width: '800px'}}
                            />
                        </td>
                        <td className={product.error_column.includes('quantity_cln') || product.quantity_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedQuantity[product.id] !== undefined ? editedQuantity[product.id].quantity : product.quantity_cln}
                                onChange={(event) => handleFieldChange(event, 'quantity', product.id, editedQuantity, setEditedQuantity)}
                                style={{width: '100px'}}
                            />
                        </td>
                        <td className={product.error_column.includes('price_cln') || product.price_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedPrice[product.id] !== undefined ? editedPrice[product.id].price : product.price_cln}
                                onChange={(event) => handleFieldChange(event, 'price', product.id, editedPrice, setEditedPrice)}
                                style={{width: '100px'}}
                            />
                        </td>
                        <td className={product.error_column.includes('total_cln') || product.total_cln === '' ? 'red' : ''}>
                            <input
                                type="text"
                                value={editedTotal[product.id] !== undefined ? editedTotal[product.id].total : product.total_cln}
                                onChange={(event) => handleFieldChange(event, 'total', product.id, editedTotal, setEditedTotal)}
                                style={{width: '100px'}}
                            />
                        </td>
                        <td>
                            <textarea
                                value={product.error ? product.error.split('. ').join('.\n') : ''}
                                readOnly
                                rows={4}
                                style={{width: '350px'}}
                            />
                        </td>
                        <td hidden>
                            <input type='text' value={product.issue_cln}></input>
                        </td>
                        <td><button onClick={handleShow1}>Edit</button></td>
                        <td><button onClick={() => handleShow2(product.id)}>Delete</button></td>
                        <td><button onClick={handleGoogle}>Google</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <EditModal />
            <DeleteModal />
            <br></br>
            {/* Pagination */}
           
            {
                !issue && totalPages > 0 && (
                    <div className="pagination">
                    {currentPage > 1 && (
                        <>
                            <button className="pagination-button" onClick={() => handlePageChange(1)}>
                                First
                            </button>
                            <button className="pagination-button" onClick={() => handlePageChange(currentPage - 1)}>
                            &#8592; Prev
                            </button>
                        </>
                    )}

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
                        if (totalPages > 5 && Math.abs(currentPage - page) > 2) {
                        // Display ellipsis when the page is beyond the range of currentPage +/- 2
                        if (page === 1 || page === totalPages) {
                            return (
                            <button key={page} className="pagination-ellipsis" disabled>
                                ...
                            </button>
                            );
                        }
                        return null;
                        }

                        return (
                        <button
                            key={page}
                            className={`pagination-button ${page === currentPage ? "active" : ""}`}
                            onClick={() => handlePageChange(page)}
                            disabled={page === currentPage}
                        >
                            {page}
                        </button>
                        );
                    })}

                    {currentPage < totalPages && (
                        <>
                            <button className="pagination-button" onClick={() => handlePageChange(currentPage + 1)}>
                            Next &#8594;
                            </button>
                            <button className="pagination-button" onClick={() => handlePageChange(totalPages)}>
                            Last
                            </button>
                        </>
                    )}
                    </div>
                )
            }
            {
                issue && issueProductsTotalPages > 0 && (
                    <div className="pagination">
                    {issueProductsCurrentPage > 1 && (
                        <>
                            <button className="pagination-button" onClick={() => handleIssueProductPageChange(1)}>
                                First
                            </button>
                            <button className="pagination-button" onClick={() => handleIssueProductPageChange(issueProductsCurrentPage - 1)}>
                            &#8592; Prev
                            </button>
                        </>
                    )}

                    {Array.from({ length: issueProductsTotalPages }, (_, index) => index + 1).map((page) => {
                        if (issueProductsTotalPages > 5 && Math.abs(issueProductsCurrentPage - page) > 2) {
                        // Display ellipsis when the page is beyond the range of currentPage +/- 2
                        if (page === 1 || page === issueProductsTotalPages) {
                            return (
                            <button key={page} className="pagination-ellipsis" disabled>
                                ...
                            </button>
                            );
                        }
                        return null;
                        }

                        return (
                        <button
                            key={page}
                            className={`pagination-button ${page === issueProductsCurrentPage ? "active" : ""}`}
                            onClick={() => handleIssueProductPageChange(page)}
                            disabled={page === issueProductsCurrentPage}
                        >
                            {page}
                        </button>
                        );
                    })}

                    {issueProductsCurrentPage < issueProductsTotalPages && (
                        <>
                            <button className="pagination-button" onClick={() => handleIssueProductPageChange(issueProductsCurrentPage + 1)}>
                            Next &#8594;
                            </button>
                            <button className="pagination-button" onClick={() => handleIssueProductPageChange(issueProductsTotalPages)}>
                            Last
                            </button>
                        </>
                    )}
                    </div>
                )
            }

        </div>
        )
    }

    return (
        <div>
            <label>
                <input
                    type="radio"
                    value="all"
                    checked={selectedOption === "all"}
                    onChange={() => setSelectedOption("all")}
                />
                All
            </label> &ensp;
            <label>
            <input
                type="radio"
                value="issue"
                checked={selectedOption === "issue"}
                onChange={() => setSelectedOption("issue")}
            />
            Issue
            </label>
            {selectedOption === "all" && Table(products, false)}
            {selectedOption === "issue" && Table(issueProducts, true)}
        </div>
    );
}

export default function MarketBasket() {
    // const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([]);
  
    useEffect(() => {
      fetchItems();
    }, []);
  
    const fetchItems = async () => {
      try {
        const response = await axios.get(API_URL + '/backend/analyst/');
        setItems(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    // check authenticed user to get access this page
    const { isAuthenticated, user} = useSelector(state => state.user);
	if (isAuthenticated && user !== null)   
        return (
            <div>
                <ProductView />
            </div>
        );
  }