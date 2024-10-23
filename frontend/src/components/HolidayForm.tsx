import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import moment from 'moment-timezone';

interface HolidayFormInputs {
  destination: string;
  startDateTime: string;
  endDateTime: string;
  timezone: string;
}

const timezones = moment.tz.names();

const HolidayForm = ({
  setHolidays,
}: {
  setHolidays: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const { register, handleSubmit, reset } = useForm<HolidayFormInputs>();
  const { token } = useAuth();

  const onSubmit = async (data: HolidayFormInputs) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/holidays`,
        data,
        {
          headers: { 'x-auth-token': token },
        },
      );
      setHolidays((prev) => [...prev, res.data]);
      reset();
    } catch (err) {
      console.error(err);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('destination')} placeholder="Destination" required />
      <input {...register('startDateTime')} type="datetime-local" required />
      <input {...register('endDateTime')} type="datetime-local" required />
      <select {...register('timezone')} required>
        {timezones.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
          </option>
        ))}
      </select>
      <button type="submit">Add Holiday</button>
    </form>
  );
};

export default HolidayForm;
