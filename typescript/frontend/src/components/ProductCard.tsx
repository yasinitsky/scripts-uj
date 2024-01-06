import cart from "../services/cart";

export default function ProductCard(props: { name: string, price: number, id: string, loggedIn: boolean, setCartCount: React.Dispatch<React.SetStateAction<number>>}) {
    const addToCart = (e: any) => {
        cart.addItem(props.id);
        props.setCartCount(cart.getCount());
    }

    return (
        <div className="col mb-5">
            <div className="card h-100">
                <img className="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
                <div className="card-body p-4">
                    <div className="text-center">
                        <h5 className="fw-bolder">{props.name}</h5>
                        ${ props.price }
                    </div>
                </div>
                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div className="text-center"><button className={ "btn btn-outline-dark mt-auto " + (props.loggedIn ? "" : "disabled") } onClick={addToCart}>Add to cart</button></div>
                </div>
            </div>
        </div>
    );
};