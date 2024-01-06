import { useEffect, useState } from 'react';
import IProduct from '../types/IProduct';
import product from '../services/product';
import ProductCard from './ProductCard';
import { useParams } from 'react-router-dom';

export default function ProductsList(props: { loggedIn: boolean, setCartCount: React.Dispatch<React.SetStateAction<number>> }) {
    let [products, setProducts] = useState<Array<IProduct>>([]);
    let { categoryid } = useParams<{ categoryid?: string }>();
    categoryid = categoryid ? categoryid : '';

    useEffect(() => {
        product.get(categoryid).then((response: any) => {
            setProducts(response.data);
        });
    }, [categoryid]);

    return (
        <section className="py-5">
            <div className="container px-4 px-lg-5 mt-5">
                <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    { products && products.map((product, index) => (
                        <ProductCard name={product.name} price={product.price} id={product.id} loggedIn={props.loggedIn} key={index} setCartCount={props.setCartCount}></ProductCard>
                    ))}
                </div>
            </div>
        </section>
    );
}