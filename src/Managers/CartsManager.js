    import fs from 'fs/promises';

    export class CartManager {
    constructor(path) {
        this.path = path;
        ;
    }

    async getAllCarts() {
        try {
        const data = await fs.readFile(this.path, 'utf8');
        return JSON.parse(data);
        } catch (error) {
        throw new Error('Error reading carts file');
        }
    }

    async getCartById(cartId) {
        try {
        const data = await fs.readFile(this.path, 'utf8');
        const carts = JSON.parse(data);
        console.log(carts)
        const cartaenv= carts.find(cart => cart.id === Number(cartId));
        console.log(cartaenv);
        return cartaenv
        } catch (error) {
        throw new Error('Error reading carts file');
        }
    }

    async createCart() {
        try {
        const data = await fs.readFile(this.path, 'utf8');
        console.log(data);
        let carts = JSON.parse(data);
        const newCart = { 
            id: carts.length ? carts[carts.length - 1].id + 1 : 1, 
            products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
        const data = await fs.readFile(this.path, 'utf8');
        let carts = JSON.parse(data);
        console.log(carts)
        console.log(cartId,productId)
        const index = carts.findIndex(cart => cart.id === Number(cartId));
        if (index === -1) {
            throw new Error('Cart not found');
        }
        const existingProductIndex = carts[index].products.findIndex(item => item.product === productId);
        if (existingProductIndex !== -1) {
            carts[index].products[existingProductIndex].quantity += quantity;
        } else {
            carts[index].products.push({ product: productId, quantity });
        }
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return carts[index];
        } catch (error) {
            console.log(error);
        }
    }
    }