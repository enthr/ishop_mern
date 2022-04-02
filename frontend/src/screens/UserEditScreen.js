import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditScreen = () => {

    const { id: userId } = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userDetails = useSelector(state => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdate = useSelector(state => state.userUpdate);
    const { loading: updateLoading, error: updateError, success: updateSuccess } = userUpdate;

    useEffect(() => {
        if (!userInfo) {
            navigate('/login', { replace: true });
        }

        if (!userInfo.isAdmin) {
            navigate('/', { replace: true });
        }

        if (updateSuccess) {
            dispatch({ type: USER_UPDATE_RESET });
            navigate('/admin/userlist', { replace: true });
        } else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId));
            } else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);
            }
        }

    }, [dispatch, user, userId, navigate, updateSuccess, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({ _id: userId, name, email, isAdmin }));
    }

    return (
        <>
            <Button className='btn btn-primary my-3' onClick={() => navigate('/admin/userlist')}>Go Back</Button>
            <FormContainer>
                <h1>Edit User</h1>
                {updateLoading && (<Loader />)}
                {updateError && (<Message variant='danger'>{updateError}</Message>)}
                {loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>) : (
                    <Form onSubmit={submitHandler} className='d-grid gap-3 mt-5'>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='isadmin'>
                            <Form.Check type='checkbox' label='Is Admin' checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
                        </Form.Group>
                        <Button type='submit' variant='primary'>Update</Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default UserEditScreen;
