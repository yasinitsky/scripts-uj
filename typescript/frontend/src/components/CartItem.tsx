import { useEffect, useState } from "react";
import cart from "../services/cart";
import product from "../services/product";

export default function CartItem(props: { id: string, setCartCount: React.Dispatch<React.SetStateAction<number>> }) {
    let [count, setCount] = useState(cart.getItemCount(props.id));
    let [price, setPrice] = useState(0);
    let [name, setName] = useState('');

    const handleChange = (event: any) => {
        setCount(parseInt(event.target.value));
        cart.setCount(props.id, parseInt(event.target.value));
        props.setCartCount(cart.getCount());
    };

    const handleClick = (event: any) => {
        cart.removeItem(props.id);
        props.setCartCount(cart.getCount());
    };

    useEffect(() => {
        product.getOne(props.id).then(res => {
            let product = res.data.products[0];
            setPrice(product.price);
            setName(product.name);
        });
    }, []);

    return (
        <li className="list-group-item card-body">
            <h5 className="card-title">{name}</h5>
            <div className="row mt-3">
                <div className="col-auto">
                    <label className="card-text py-1">${price} x</label>
                </div>
                <div className="col-1 px-0">
                    <input type="number" className="form-control" min="1" value={count} onChange={handleChange}/>
                </div>
                <div className="col-auto">
                    = <label className="card-text py-1">${count * price}</label>
                </div>
                <div className="col-auto">
                    <button className="btn btn-outline-danger" onClick={handleClick}>Remove</button>
                </div>
            </div>
        </li>
    );
}