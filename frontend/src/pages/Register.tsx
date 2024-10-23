import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  country: string;
}

const countries = ['UK', 'US', 'New Zealand'];

const Register = () => {
  const { register, handleSubmit } = useForm<RegisterFormInputs>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        data,
      );
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Handle error
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name')} placeholder="Name" required />
        <input
          {...register('email')}
          placeholder="Email"
          type="email"
          required
        />
        <input
          {...register('password')}
          placeholder="Password"
          type="password"
          required
        />
        <select {...register('country')} required>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>.
      </p>
    </div>
  );
};

export default Register;
