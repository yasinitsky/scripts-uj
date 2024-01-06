import { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'
import ICategory from '../types/ICategory';
import category from '../services/category';
import session from '../services/session';

export default function Navbar(props: { loggedIn: boolean, cartCount: number }) {
    const [categories, setCategories] = useState<Array<ICategory>>([]);
    useEffect(() => {
        category.getAll().then((response: any) => {
            setCategories(response.data.categories);
        });
    }, []);

    const onLogoutClick = () => {
        session.destroy();
        document.location = '/';
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container px-4 px-lg-5">
                <a className="navbar-brand" href="/">e-shop</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item"><a className="nav-link" aria-current="page" href="/">All Products</a></li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Categories</a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                {categories && categories.map((category, index) => (
                                    <li key={index}><a className="dropdown-item" href={`/category/${category.id}`}>{category.name}</a></li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                    <form className="d-flex">
                        { props.loggedIn ?
                            <>
                                <a className="btn btn-outline-dark mx-1" href="/cart">
                                    Cart
                                    <span className="badge bg-dark text-white ms-1 rounded-pill">{props.cartCount}</span>
                                </a>
                                <a className="btn btn-outline-dark" onClick={onLogoutClick}>
                                    Logout
                                </a>
                            </>
                            :
                            <>
                                <a className="btn btn-outline-dark mx-1" href="/login">
                                    Sign In
                                </a>
                                <a className="btn btn-outline-dark" href="/register">
                                    Sign Up
                                </a>
                            </>
                        }
                    </form>
                </div>
            </div>
        </nav>
    )
}