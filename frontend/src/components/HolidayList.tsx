import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const HolidayList = ({
  holidays,
  setHolidays,
}: {
  holidays: any[];
  setHolidays: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const { token } = useAuth();

  const deleteHoliday = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/holidays/${id}`,
        {
          headers: { 'x-auth-token': token },
        },
      );
      setHolidays((prev) => prev.filter((holiday) => holiday._id !== id));
    } catch (err) {
      console.error(err);
      // Handle error
    }
  };

  return (
    <ul>
      {holidays.map((holiday) => (
        <li key={holiday._id}>
          {holiday.destination} from {holiday.startDateTime.local} to{' '}
          {holiday.endDateTime.local}
          <button onClick={() => deleteHoliday(holiday._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default HolidayList;
