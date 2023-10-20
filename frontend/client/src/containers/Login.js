import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { resetRegistered, login } from 'features/user';

export default function Login() {
    const dispatch = useDispatch();
	const { loading, isAuthenticated, registered } = useSelector(
		state => state.user
	);

	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	useEffect(() => {
		if (registered) dispatch(resetRegistered());
	}, [registered]);

	const { username, password } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = e => {
		e.preventDefault();

		dispatch(login({ username, password }));
	};

	if (isAuthenticated) return <Navigate to='/dashboard' />;

	return (
		<>
			<h1>Log into your Account</h1>
			<form className='mt-5' onSubmit={onSubmit}>
				<div className='form-group'>
					<label className='form-label' htmlFor='username'>
						Username
					</label>
					<input
						className='form-control'
						type='text'
						name='username'
						onChange={onChange}
						value={username}
						required
					/>
				</div>
				<div className='form-group mt-3'>
					<label className='form-label' htmlFor='password'>
						Password
					</label>
					<input
						className='form-control'
						type='password'
						name='password'
						onChange={onChange}
						value={password}
						required
					/>
				</div>
				{loading ? (
					<div className='spinner-border text-primary' role='status'>
						<span className='visually-hidden'>Loading...</span>
					</div>
				) : (
					<button className='btn btn-primary mt-4'>Login</button>
				)}
			</form>
		</>
	);
}

