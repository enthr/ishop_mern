import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions';
import { useNavigate, useParams } from 'react-router-dom';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import Paginate from '../components/Paginate';

const ProductListScreen = () => {

    let { pageNumber } = useParams();
    pageNumber = pageNumber || 1;

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList);
    const { loading, error, products, pages, page } = productList;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const productDelete = useSelector(state => state.productDelete);
    const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = productDelete;

    const productCreate = useSelector(state => state.productCreate);
    const { loading: createLoading, error: createError, success: createSuccess, product: createdProduct } = productCreate;

    useEffect(() => {
        if (!userInfo) {
            navigate('/login', { replace: true });
        }

        if (!userInfo.isAdmin) {
            navigate('/', { replace: true });
        }

        dispatch({ type: PRODUCT_CREATE_RESET });

        if (createSuccess) {
            navigate(`/admin/product/${createdProduct._id}/edit`);
        } else {
            dispatch(listProducts('', pageNumber));
        }
    }, [dispatch, userInfo, navigate, deleteSuccess, createSuccess, createdProduct, pageNumber]);

    const deleteHandler = (id) => {
        if (window.confirm('Are You Sure ?')) {
            dispatch(deleteProduct(id));
        }
    }

    const createProductHandler = () => {
        if (window.confirm('Are You Sure ?')) {
            dispatch(createProduct());
        }
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <h1>Products</h1>
                    </Col>
                    <Col className='text-end'>
                        <Button className='my-3' onClick={createProductHandler}>Create Product</Button>
                    </Col>
                </Row>
            </Container>
            {deleteLoading && (<Loader />)}
            {createLoading && (<Loader />)}
            {loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>) : (
                <>
                    <Table striped bordered hover responsive className='table-md text-center'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => {
                                return (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>$ {product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td>
                                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                <Button variant='info' className='btn-sm'>
                                                    <i className='fas fa-edit'></i>
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                        <td>
                                            <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} isAdmin={true} />
                </>
            )}
            {deleteSuccess && (<Message variant='success'>Product Deleted Successfully</Message>)}
            {deleteError && (<Message variant='danger'>{deleteError}</Message>)}
            {createSuccess && (<Message variant='success'>Product Created Successfully</Message>)}
            {createError && (<Message variant='danger'>{createError}</Message>)}
        </>
    );
}

export default ProductListScreen;