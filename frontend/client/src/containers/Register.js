import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from 'features/user';

export default function Register() {
    const dispatch = useDispatch();
	const { registered, loading } = useSelector(state => state.user);

	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		username: '',
		password: '',
	});

	const { first_name, last_name, username, password } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = e => {
		e.preventDefault();
		if (formData.password.length < 8) {
			alert('Password must be at least 8 characters long.');
		} else if (!/[0-9]/.test(formData.password)) {
			alert('Password must contain at least one digit.');
		} else if (!/[!@#$&]/.test(formData.password)) {
			alert('Password must contain at least one of @, #, $, or &.');
		} else {
			dispatch(register({ first_name, last_name, username, password }));
		}
	};

	if (registered) return <Navigate to='/login' />;

	return (
		<>
			<h1>Register for an Account</h1>
			<form className='mt-5' onSubmit={onSubmit}>
				<div className='form-group'>
					<label className='form-label' htmlFor='first_name'>
						First Name
					</label>
					<input
						className='form-control'
						type='text'
						name='first_name'
						onChange={onChange}
						value={first_name}
						required
					/>
				</div>
				<div className='form-group mt-3'>
					<label className='form-label' htmlFor='last_name'>
						Last Name
					</label>
					<input
						className='form-control'
						type='text'
						name='last_name'
						onChange={onChange}
						value={last_name}
						required
					/>
				</div>
				<div className='form-group mt-3'>
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
					<button className='btn btn-primary mt-4'>Register</button>
				)}
			</form>
		</>
	);
}