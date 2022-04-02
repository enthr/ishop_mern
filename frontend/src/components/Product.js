import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Rating from './Rating';

const Product = ({ product }) => {
    return (
        <Card className='my-3 p-3 rounded'>
            <Link to={`/products/${product._id}`}>
                <Card.Img src={product.image} variant='top' />
            </Link>
            <Card.Body>
                <Card.Title as='div' className='removeLinkColor'>
                    <strong><Link to={`/products/${product._id}`}>{product.name}</Link></strong>
                </Card.Title>
                <Card.Text as='div'>
                    <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
                </Card.Text>
                <Card.Text as='h3'>$ {product.price}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Product;
