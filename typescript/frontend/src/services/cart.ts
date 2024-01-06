interface ICart {
    items: Object
};

const cart = {
    init: () => {
        let cartData = localStorage.getItem("cart");
        if(!cartData) localStorage.setItem("cart", JSON.stringify({ items: {} }));
    },
    addItem: (itemId: string) => {
        let cartObject: ICart = JSON.parse(localStorage.getItem("cart") || '');
        //@ts-ignore
        if(!cartObject.items[itemId]) cartObject.items[itemId] = 0;
        //@ts-ignore
        cartObject.items[itemId]++;

        localStorage.setItem("cart", JSON.stringify(cartObject));
    },
    getCount: () => {
        let cartObject: ICart = JSON.parse(localStorage.getItem("cart") || '');
        let counter = 0;
        
        for(const [key, value] of Object.entries(cartObject.items)) {
            counter += value;
        }

        return counter;
    },
    setCount: (itemId: string, count: number) => {
        let cartObject: ICart = JSON.parse(localStorage.getItem("cart") || '');
        //@ts-ignore
        if(!cartObject.items[itemId]) cartObject.items[itemId] = 0;
        //@ts-ignore
        cartObject.items[itemId] = count;
        localStorage.setItem("cart", JSON.stringify(cartObject));
    },
    getItemCount: (itemId: string) => {
        let cartObject: ICart = JSON.parse(localStorage.getItem("cart") || '');
        //@ts-ignore
        return cartObject.items[itemId] || 0;
    },
    getItems: () => {
        let cartObject: ICart = JSON.parse(localStorage.getItem("cart") || '');
        return cartObject.items;
    },
    removeItem: (itemId: string) => {
        let cartObject: ICart = JSON.parse(localStorage.getItem("cart") || '');
        //@ts-ignore
        delete cartObject.items[itemId];
        localStorage.setItem("cart", JSON.stringify(cartObject));
    }
};

export default cart;