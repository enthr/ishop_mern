import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listUsers, deleteUser } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';

const UserListScreen = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userList = useSelector(state => state.userList);
    const { loading, error, users } = userList;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector(state => state.userDelete);
    const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = userDelete;

    useEffect(() => {
        if (!userInfo) {
            navigate('/login', { replace: true });
        }

        if (!userInfo.isAdmin) {
            navigate('/', { replace: true });
        }

        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers());
        } else {
            navigate('/login', { replace: true });
        }
        
    }, [dispatch, userInfo, navigate, deleteSuccess]);

    const deleteHandler = (id) => {
        if (window.confirm('Are You Sure ?')) {
            dispatch(deleteUser(id));
        }
    }

    return (
        <>
            <h1>Users</h1>
            {deleteLoading && <Loader />}
            {loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>) : (
                <Table striped bordered hover responsive className='table-md text-center'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => {
                            return (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.isAdmin ? (
                                            <i className='fas fa-check' style={{ color: 'green' }}></i>
                                        ) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                            <Button variant='info' className='btn-sm'>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                    <td>
                                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
            {deleteSuccess && (<Message variant='success'>User Deleted Successfully</Message>)}
            {deleteError && (<Message variant='danger'>{deleteError}</Message>)}
        </>
    );
}

export default UserListScreen;