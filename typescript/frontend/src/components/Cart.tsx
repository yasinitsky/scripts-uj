import { useEffect, useState } from "react";
import CartItem from "./CartItem";
import cart from "../services/cart";

export default function Cart(props: { setCartCount: React.Dispatch<React.SetStateAction<number>> }) {
    let [cartItems, setCartItems] = useState<Array<string>>([]);

    useEffect(() => {
        let items = [];
        let cartItemsFromMemory = cart.getItems();
        for(const [key, value] of Object.entries(cartItemsFromMemory)) {
            items.push(key);
        }
        
        setCartItems(items);
    }, [cartItems]);

    return (
        <div className="container px-4 px-lg-5 mt-5">
            <ul className="list-group">
                { cartItems && cartItems.map((value, index) => (<CartItem id={value} setCartCount={props.setCartCount} key={index}/>))}
            </ul>
        </div>
    );
}