import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProducts } from '../actions/productActions';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

const HomeScreen = () => {

    let { keyword, pageNumber } = useParams();

    pageNumber = pageNumber || 1;

    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList);
    const { loading, error, products, page, pages } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch, keyword, pageNumber]);

    return (
        <>
            {!keyword ? (<Row className='mt-4 mb-5'><ProductCarousel /></Row>) : <Link to={`/`} className='btn btn-primary'>Go Back</Link>}
            <h1>Latest Products</h1>
            {(loading) ? (<Loader />) : (error) ? (<Message variant='danger'>{error}</Message>) : (
                <>
                    <Row>
                        {products.map(product => {
                            return (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            );
                        })}
                    </Row>
                    <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
                </>)
            }
        </>
    );
};

export default HomeScreen;
