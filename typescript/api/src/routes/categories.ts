import express, { response } from 'express';
import category from '../services/category';
import { body } from 'express-validator';
import Response from '../utils/response';
import validationHandler from '../middleware/validationHandler';

const router = express.Router();

interface ICategory {
    name: string,
    id: string
}

class CategoriesResponse extends Response {
    public categories: Array<ICategory> = []
};

router.get('/categories', async (req: express.Request, res: express.Response) => {
    let response = new CategoriesResponse();

    let categories = await category.getAllCategories();
    for(let category of categories) {
        response.categories.push({ name: category.name, id: category._id.toString() });
    }

    res.status(200).json(response);
});

router.post(`/categories`, body('name').isString().withMessage('Name should be a string'), validationHandler, async (req: express.Request, res: express.Response) => {
    let response = new CategoriesResponse();
    let result = await category.create(req.body.name);
    if(result.length > 0) {
        response.appendError(result);
        return res.status(400).json(response);
    }

    response.categories.push({
        name: req.body.name,
        id: ""
    });

    return res.status(200).json(response);
});

module.exports = router;