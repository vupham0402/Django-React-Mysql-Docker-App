import 'App.css';
import Navbar from 'components/NavBar'
import EyeproImage from 'components/EyeproImage';
import MarketBasket from 'components/MarketBasket';
import MappingTable from 'components/MappingTables';
import Login from 'containers/Login'; 
import Register from 'containers/Register';
import Home from 'containers/Home';
import Dashboard from 'containers/Dashboard';
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from 'features/user';
import Category from 'components/Category';
import SubCategory from 'components/SubCategory';
import Products from 'components/Products';
import Comparison from 'components/Comparison';


function App() {
  const dispatch = useDispatch();
	useEffect(() => {
		dispatch(checkAuth());
	}, []);

  const products = [
    {'id': 1, 'title': 'product1', 'manufacturer': 'bard', 'description': 'product1', 'category': 'apparel', 'sub-category': 'shoes', 'price': 10, 'color': 'red'},
    {'id': 2, 'title': 'product2', 'manufacturer': 'cardinal', 'description': 'product2', 'category': 'utensils', 'sub-category': 'basins', 'price': 20, 'color': 'yellow'},
    {'id': 3, 'title': 'product3', 'manufacturer': 'oasis', 'description': 'product3', 'category': 'textiles', 'sub-category': 'sheets', 'price': 30, 'color': 'green'},
    {'id': 4, 'title': 'product4', 'manufacturer': 'mckesson', 'description': 'product4', 'category': 'ostomy', 'sub-category': 'barriers', 'price': 40, 'color': 'red'},
    {'id': 5, 'title': 'product5', 'manufacturer': 'eyepro', 'description': 'product5', 'category': 'instruments', 'sub-category': 'forceps', 'price': 50, 'color': 'yellow'},
    {'id': 6, 'title': 'product6', 'manufacturer': 'eyepro', 'description': 'product6', 'category': 'gloves', 'sub-category': 'exam', 'price': 60, 'color': 'green'},
    {'id': 7, 'title': 'product7', 'manufacturer': 'eyepro', 'description': 'product7', 'category': 'implants', 'sub-category': 'pessaries', 'price': 10, 'color': 'red'},
    {'id': 8, 'title': 'product8', 'manufacturer': 'eyepro', 'description': 'product8', 'category': 'implants', 'sub-category': 'eye', 'price': 20, 'color': 'yellow'},
    {'id': 9, 'title': 'product9', 'manufacturer': 'eyepro', 'description': 'product9', 'category': 'implants', 'sub-category': 'ear', 'price': 30, 'color': 'green'},
    {'id': 10, 'title': 'product10', 'manufacturer': 'eyepro', 'description': 'product10', 'category': 'implants', 'sub-category': 'stens', 'price': 40, 'color': 'red'},
    {'id': 11, 'title': 'product11', 'manufacturer': 'mckesson', 'description': 'product11', 'category': 'implants', 'sub-category': 'nasal', 'price': 50, 'color': 'yellow'},
    {'id': 12, 'title': 'product12', 'manufacturer': 'bard', 'description': 'product12', 'category': 'implants', 'sub-category': 'accessories', 'price': 60, 'color': 'green'},
    {'id': 13, 'title': 'product13', 'manufacturer': 'eyepro', 'description': 'product13', 'category': 'implants', 'sub-category': 'shunts', 'price': 10, 'color': 'red'},
    {'id': 14, 'title': 'product14', 'manufacturer': 'mckesson', 'description': 'product14', 'category': 'implants', 'sub-category': 'stens', 'price': 20, 'color': 'red'},
    {'id': 15, 'title': 'product15', 'manufacturer': 'oasis', 'description': 'product15', 'category': 'implants', 'sub-category': 'stens', 'price': 30, 'color': 'red'},
    {'id': 16, 'title': 'product16', 'manufacturer': 'medline', 'description': 'product16', 'category': 'implants', 'sub-category': 'stens', 'price': 40, 'color': 'yellow'},
    {'id': 17, 'title': 'product17', 'manufacturer': 'bard', 'description': 'product17', 'category': 'implants', 'sub-category': 'stens', 'price': 40, 'color': 'green'},
    {'id': 18, 'title': 'product18', 'manufacturer': 'eyepro', 'description': 'product18', 'category': 'implants', 'sub-category': 'stens', 'price': 20, 'color': 'green'},
    {'id': 19, 'title': 'product19', 'manufacturer': 'mckesson', 'description': 'product19', 'category': 'implants', 'sub-category': 'stens', 'price': 20, 'color': 'yellow'},
    {'id': 20, 'title': 'product20', 'manufacturer': 'eyepro', 'description': 'product20', 'category': 'implants', 'sub-category': 'stens', 'price': 10, 'color': 'green'},
  ]

  return (
    <Router>
      <div>
        <EyeproImage />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketbasket" element={<MarketBasket />} />
          <Route path="/mappingtable" element={<MappingTable />} />
          <Route path="/category" element={<Category products={products} />} />
          <Route path="/sub-category/:category" element={<SubCategory products={products} />} />
          <Route path="/products/:subCategory" element={<Products products={products} />} />
          <Route path="/comparison/:id1/:id2" element={<Comparison products={products} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}   

export default App;

