import React,{useState, useEffect} from 'react';
import axios from 'axios';
import * as xlsx from "xlsx";
import { saveAs } from 'file-saver';
import { HashLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { API_URL } from 'config';

export default function MappingTable() {
    const [json, setJson] = useState([]);
    const [visibleColumns, setVisibleColumns] = useState([]);
    const [columnTypes, setColumnTypes] = useState({});

    const readUploadFile = async (e) => {
        e.preventDefault();
        // Getting the data from the excel spreadsheet and converting data to JSON data
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: 'array', cellDates: true});
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                let jsonData = xlsx.utils.sheet_to_json(worksheet);
                
                // Determine the majority data type for each column and store it in columnTypes
                const columnTypes = {};
                for (const columnName of Object.keys(jsonData[0])) {
                    const columnData = jsonData.map((row) => row[columnName]);
                    const majorityType = detectMajorityColumnType(columnData);
                    columnTypes[columnName] = majorityType;
                }
                // console.log(columnTypes);
                setColumnTypes(columnTypes);

                // Loop through jsonData and convert Date objects to strings
                jsonData = jsonData.map((row) => {
                    // Convert Date objects to strings in each row
                    Object.keys(row).forEach((key) => {
                        if (row[key] instanceof Date) {
                            const date = row[key];
                            row[key] = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                        }
                    });
                    return row;
                });
                // console.log(jsonData);

                setJson(jsonData);
                const headers = Array.from(new Set(jsonData.flatMap(row => Object.keys(row))));
                setVisibleColumns(headers);
            }
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    };

    const detectMajorityColumnType = (columnData) => {
        // Initialize counters for each data type
        let typeOfPosition = {};
        let currentPositionStart = 0;
        let currentDataType = null;

        // Helper function to add a range to typeOfPosition
        const addRange = (start, end, type) => {
            if (start <= end) {
                start = start + 2;
                end = end + 2;
                typeOfPosition[`${start} to ${end}`] = type;
            }
        };

        // Iterate through rows in the column and count the data types
        for (let i = 0; i < columnData.length; i++) {
            const value = columnData[i];
            if (value === null || value === undefined || value === "") {
            // Treat empty cells as text
                if (currentDataType !== "empty") {
                    addRange(currentPositionStart, i - 1, currentDataType);
                    currentDataType = "empty";
                    currentPositionStart = i;
                }
            } else if (typeof value === 'number') {
                if (currentDataType !== "number") {
                    addRange(currentPositionStart, i - 1, currentDataType);
                    currentDataType = "number";
                    currentPositionStart = i;
                }
            } else if (value instanceof Date && !isNaN(value)) {
                if (currentDataType !== "date") {
                    addRange(currentPositionStart, i - 1, currentDataType);
                    currentDataType = "date";
                    currentPositionStart = i;
                }
            } else if (typeof value === 'string') {
                if (currentDataType !== "text") {
                    addRange(currentPositionStart, i - 1, currentDataType);
                    currentDataType = "text";
                    currentPositionStart = i;
                }
            }
        }

        // Add the last range
        addRange(currentPositionStart, columnData.length - 1, currentDataType);

        return typeOfPosition;
    };
      

    const [selectedTable, setSelectedTable] = useState('');
    const [columns, setColumns] = useState([]);
    const [newColumns, setNewColumns] = useState([]);
    

    const handleTableChange = async (event) => {
        const table_name = event.target.value;
        setSelectedTable(table_name);

        if (table_name !== '') {
            try {      
                const response = await axios.get('http://18.208.184.78:8000' + `/backend/get-columns/${table_name}/`);
                setColumns(response.data.columns);
            } catch (error) {
                console.error('Error fetching columns:', error);
            }
        } 
        else {
            setColumns([]);
        }
    };

    const [selectedTableHeaders, setSelectedTableHeaders] = useState({}); // Dictionary to store selected headers

    const handleDragStart = (event, header) => {
        event.dataTransfer.setData('text/plain', header);
    };

    const handleDrop = (event, targetColumn) => {
        event.preventDefault();
        const sourceHeader = event.dataTransfer.getData('text/plain');
        setVisibleColumns(prevColumns => prevColumns.filter(column => column !== sourceHeader));
        //console.log(sourceHeader);

        if (sourceHeader) {
            setSelectedTableHeaders((prevHeaders) => ({
                ...prevHeaders,
                [targetColumn]: sourceHeader,
            }));
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const renderSelectedTable = () => {
        return (
            <table>
                <thead>
                    <tr>
                        {columns
                        .filter(column => selectedTable === "market_basket_tmp" 
                        ? !['id', 'issue_cln', 'error_column', 'error'].includes(column)
                        : true) // Include all headers if not "market_basket_tmp"
                        .map((column, index) => (
                            <th key={index} draggable onDragStart={(e) => handleDragStart(e, column)}>
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {columns
                        .filter(column => selectedTable === "market_basket_tmp" 
                        ? !['id', 'issue_cln', 'error_column', 'error'].includes(column)
                        : true) // Include all headers if not "market_basket_tmp"
                        .map((column, index) => (
                            <td
                                key={index}
                                onDrop={(e) => handleDrop(e, column)}
                                onDragOver={handleDragOver}
                                style={{height: '50px'}}
                            >
                                {selectedTableHeaders[column]}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        );
    };

    const handleTransferData = (json, columns, selectedTableHeaders) => {
        // Create a template object with default values for each column
        const templateObject = {};
        columns.forEach((column) => {
            templateObject[column] = '';
        });
        // Create an array of objects using the template object
        const numberOfElements = json.length;
        const arrayOfObjects = [];
        for (let i = 0; i < numberOfElements; i++) {
            const newObj = {};
            for (const key in templateObject) {
                newObj[key] = templateObject[key];
            }
            arrayOfObjects.push(newObj);
        }
        // Assign the final array of objects to the 'columns' variable
        // console.log(json);
        // console.log(columns);
        // console.log(selectedTableHeaders);
        if (json.length > 0 && arrayOfObjects.length > 0 && Object.keys(selectedTableHeaders).length > 0) {
            json.forEach((item, index) => {
                for (const keyHeader in selectedTableHeaders) {
                    const sourceHeader = selectedTableHeaders[keyHeader];
                    if (item[sourceHeader] !== undefined) {
                        arrayOfObjects[index][keyHeader] = item[sourceHeader];
                    }
                }
            });
        }
        // console.log(arrayOfObjects);
        if (arrayOfObjects.length > 0) {
            alert('Transferred data successfully.')
            setNewColumns(arrayOfObjects);
        }
    }

    const exportToExcel = (newColumns) => {
        // Create a new workbook
        const workbook = xlsx.utils.book_new();

        // Convert product data to a worksheet
        const worksheet = xlsx.utils.json_to_sheet(newColumns);

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
    };

    const [items, setItems] = useState([]);
  
    useEffect(() => {
        fetchItems();
    }, []);
    
    const fetchItems = async () => {
        try {
        const response = await axios.get('http://18.208.184.78:8000' + '/backend/analyst/');
        setItems(response.data);
        } catch (error) {
        console.error('Error:', error);
        }
    };

    const [loading, setLoading] = useState(false);
    const uploadData = (newColumns, selectedTable) => {
        
        if (selectedTable === 'market_basket_tmp') {
            setLoading(true);
            newColumns = newColumns.map((product) => ({
                ...product,
                issue_cln: 0, // Set the default value for 'issue_cln' key here
                error_column: 'null', // Set the default value for 'issue_cln' key here
                error: 'null', // Set the default value for 'issue_cln' key here
            }));
            axios
            .post('http://18.208.184.78:8000' + '/backend/upload-file/', newColumns, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              console.log('Data successfully sent to backend:', response.data);
              setLoading(false);
              // Handle successful response
              alert('Upload successfully!');
              window.location.reload();
            })
            .catch((error) => {
              console.error('Error sending data to backend:', error);
              // Handle error
              alert('Upload failed. Please try again!');
            })             
        }
    };

    const { isAuthenticated, user } = useSelector(state => state.user);

	if (isAuthenticated && user !== null)
        return (
            <div>
                {/* display a file upload button shown on the market basket page for users to upload spread sheet   */}
                <br></br>
                {/* Render Loader when isLoading is true */}
                <input type="file" name="upload" id="upload" onChange={readUploadFile} />
                <br></br>
                <br></br>
                <div>
                    <select onChange={handleTableChange}>
                        <option value="">Select Table</option>
                        <option value="market_basket_tmp">Market Basket</option>
                        <option value="products">Products</option>
                    </select>
                    <button style={{margin: '10px'}} onClick={() => handleTransferData(json, columns, selectedTableHeaders)}>Transfer Data</button>
                    {/* {console.log(newColumns)} */}
                    {newColumns.length > 0 && (
                        <button style={{ margin: '10px' }} onClick={() => exportToExcel(newColumns)}>
                            Export to Excel
                        </button>
                    )}
                    {newColumns.length > 0 && (
                        loading ? (
                            <div>
                                <HashLoader loading={true} size={100} color='#018EBD' />
                            </div>
                        ) : (
                            <button style={{ margin: '10px' }} onClick={() => uploadData(newColumns, selectedTable)} disabled={loading}>
                                Upload Data
                            </button>    
                        )
                    )}
                    <p></p>
                    {selectedTable === "market_basket_tmp" && (
                    <div>
                        <h5>Please hover the tooltip to check the type of each column should match these types:</h5>
                        <ul>
                            <li>date_cln: date</li>
                            <li>vendor_cln: text</li>
                            <li>sku_cln: text</li>
                            <li>invoice_number_cln: number</li>
                            <li>description_cln: text</li>
                            <li>quantity_cln: number</li>
                            <li>price_cln: number</li>
                            <li>total_cln: number</li>
                        </ul>
                    </div>
                    )}
                    <p></p>
                    {renderSelectedTable()}
                <br></br>
                <br></br>
                <br></br>
                {/* {console.log(selectedTableHeaders)} */}
                {/* {console.log(json)} */}
                {/* {console.log(visibleColumns)} */}
                    {json.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    {visibleColumns.map((key, index) => (
                                        <th 
                                            key={index}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, key)}
                                        >
                                        {key}
                                        {columnTypes[key] && (
                                           <span className="tooltip-trigger"> &#x1F6C8;
                                                <ul className="tooltip-content">
                                                    {JSON.stringify(columnTypes[key])
                                                    .split(',')
                                                    .map((part, index) => (
                                                        <li style={{listStyle: "none"}} key={index}>{part.replace(/[{}"]/g, '').replace(/:/g, ': ')}</li>
                                                    ))}
                                                </ul>
                                            </span>
                                        )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {json.slice(0, 5).map((item, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {visibleColumns.map((key, columnIndex) => (
                                            <td key={columnIndex}>{item[key]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <p></p>
            </div>
        );
}