// frontend/src/pages/Login.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
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
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type="submit">Login</button>
      </form>
      <p>
  Don&#39;t have an account? <a href="/register">Register here</a>.
</p>
    </div>
  );
};

export default Login;
