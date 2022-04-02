import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';

const PlaceOrderScreen = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);

    //Calculate Prices
    cart.itemsPrice = cart.cartItems.reduce((acc, item) => {
        return (acc + (item.price * item.qty));
    }, 0);

    cart.shippingPrice = (cart.itemsPrice > 100) ? 0 : 50;

    cart.taxPrice = Number((0.18 * cart.itemsPrice).toFixed(2));

    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2);

    const orderCreate = useSelector(state => state.orderCreate);
    const { order, success, error, loading } = orderCreate;

    useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`);
        }
    }, [success, order, navigate]);

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }));
    }

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                {loading && (<Loader />)}
                <Col md={8}>
                    <ListGroup variant='flush'>

                        <ListGroup.Item>
                            <h3>Shipping</h3>
                            <p>
                                <strong>Address: </strong>
                                <br />
                                {cart.shippingAddress.address},
                                <br />
                                {cart.shippingAddress.city},
                                <br />
                                {cart.shippingAddress.postalCode},
                                <br />
                                {cart.shippingAddress.country}
                                <br />
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h3>Payment Method</h3>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h3>Order Items</h3>
                            {cart.cartItems.length === 0 ? (
                                <Message variant='danger'>Your Cart is Empty.</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => {
                                        return (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x $ {item.price} = $ {item.qty * item.price}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        );
                                    })}
                                </ListGroup>
                            )}
                        </ListGroup.Item>

                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>

                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Price: </Col>
                                    <Col>$ {cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping: </Col>
                                    <Col>$ {cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>$ {cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total: </Col>
                                    <Col>$ {cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {error && (<Message variant='danger'>{error}</Message>)}

                            <ListGroup.Item>
                                <Row className='d-grid my-2 mx-2'>
                                    <Button type='button' className='btn-block' disabled={cart.cartItems === 0} onClick={placeOrderHandler}>Place Order</Button>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;