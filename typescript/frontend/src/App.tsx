import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import ProductsList from './components/ProductsList';
import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import session from './services/session';
import cart from './services/cart';
import Cart from './components/Cart';

function App() {
    let [loggedIn, setLoggedIn] = useState<boolean>(false);
    let [cartCount, setCartCount] = useState<number>(0);

    useEffect(() => {
        session.check().then(res => {
            setLoggedIn(res);
        }).catch(error => {
            session.destroy();
        });

        cart.init();
        setCartCount(cart.getCount());
    }, []);

    return (
        <>
            <Navbar loggedIn={loggedIn} cartCount={cartCount}></Navbar>
            <Header></Header>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <ProductsList loggedIn={loggedIn} setCartCount={setCartCount}/> } />
                    <Route path="/category/:categoryid" element={ <ProductsList loggedIn={loggedIn} setCartCount={setCartCount}/> } />
                    <Route path="/register" element = { <RegisterForm /> } />
                    <Route path="/login" element = { <LoginForm /> } />
                    <Route path="/cart" element = { <Cart setCartCount={setCartCount}/> } />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
