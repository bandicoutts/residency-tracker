import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface ProfileFormInputs {
  country: string;
}

const countries = ['UK', 'US', 'New Zealand'];

const Profile = () => {
  const { register, handleSubmit, setValue } = useForm<ProfileFormInputs>();
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/profile`,
          {
            headers: { 'x-auth-token': token },
          },
        );
        setValue('country', res.data.country);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token, setValue]);

  const onSubmit = async (data: ProfileFormInputs) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        data,
        {
          headers: { 'x-auth-token': token },
        },
      );
      // Handle success
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register('country')} required>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
