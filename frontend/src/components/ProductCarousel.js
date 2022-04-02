import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { listTopProducts } from '../actions/productActions';


const ProductCarousel = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listTopProducts());
    }, [dispatch]);

    const productTopRated = useSelector(state => state.productTopRated);
    const { loading, error, products } = productTopRated;

    return (
        loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            <Carousel pause='hover' className='bg-primary'>
                {products.map(product => (
                    <Carousel.Item key={product._id}>
                        <Link to={`/products/${product._id}`}>
                            <Image src={product.image} alt={product.name} fluid />
                            <Carousel.Caption className='carousel-caption'>
                                <h3>{product.name}</h3>
                            </Carousel.Caption>
                        </Link>
                    </Carousel.Item>
                ))}
            </Carousel>
        )
    );
};

export default ProductCarousel;