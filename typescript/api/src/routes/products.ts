import express from 'express';
import { body } from 'express-validator';
import validationHandler from '../middleware/validationHandler';
import product from '../services/product';
import Response from '../utils/response';
import category from '../services/category';

const router = express.Router();

const postValidators = [
    body('category').isString().withMessage('Category should be a string'),
    body('name').isString().isLength({min: 1}).withMessage('Category name missing'),
    body('price').isNumeric().withMessage('Price should be a number')
];

interface IProduct {
    name: string,
    price: number,
    id: string
};

class ProductsResponse extends Response {
    public products: Array<IProduct> = []
};

router.get('/products/:category?', async (req: express.Request, res: express.Response) => {
    let response = new ProductsResponse();

    let categoryId = req.params.category;
    let products = categoryId ? await product.findByCategory(categoryId) : await product.findAll();

    for(let product of products) {
        response.products.push({
            name: product.name,
            price: product.price,
            id: product._id.toString()
        });
    }

    res.status(200).json(response.products);
});

router.get('/product/:id?', async (req: express.Request, res: express.Response) => {
    let response = new ProductsResponse();

    let productRecord = await product.findById(req.params.id)

    if(!productRecord) {
        response.appendError("Incorrect product ID");
        return res.status(400).json(response);
    }

    response.products.push({
        name: productRecord.name,
        price: productRecord.price,
        id: productRecord._id.toString()
    });

    res.status(200).json(response);
});

router.post('/products', postValidators, validationHandler, async(req: express.Request, res: express.Response) => {
    let response = new ProductsResponse();
    if(!await category.findById(req.body.category)) {
        response.appendError('Wrong category id');
        return res.status(400).json(response);
    }

    await product.create(req.body.name, req.body.price, req.body.category);
    response.products.push({
        name: req.body.name,
        price: req.body.price,
        id: ""
    });

    res.status(200).json(response);
});

module.exports = router;