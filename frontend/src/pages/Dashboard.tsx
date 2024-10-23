import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HolidayList from '../components/HolidayList';
import HolidayForm from '../components/HolidayForm';
import { useAuth } from '../context/AuthContext';
import countryRulesMap from '../utils/countryRules';

const Dashboard = () => {
  const [holidays, setHolidays] = useState<any[]>([]);
  const { token, logout } = useAuth();
  const [daysOutside, setDaysOutside] = useState<number>(0);
  const [maxAbsentDays, setMaxAbsentDays] = useState<number>(180);
  const [userCountry, setUserCountry] = useState<string>('UK');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile to get country
        const userRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/profile`,
          {
            headers: { 'x-auth-token': token },
          },
        );
        const country = userRes.data.country || 'UK';
        setUserCountry(country);

        // Fetch holidays
        const holidaysRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/holidays`,
          {
            headers: { 'x-auth-token': token },
          },
        );
        setHolidays(holidaysRes.data);

        // Get country-specific rules
        const countryRules = countryRulesMap[country];

        // Calculate days outside the country
        const days = countryRules.calculateDaysOutside(holidaysRes.data);
        setDaysOutside(days);
        setMaxAbsentDays(countryRules.maxAbsentDays);
      } catch (err) {
        console.error(err);
        // Handle error
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>
        You have been outside {userCountry} for {daysOutside} days in the last
        12 months. The maximum allowed is {maxAbsentDays} days.
      </p>
      <button onClick={logout}>Logout</button>
      <HolidayForm setHolidays={setHolidays} />
      <HolidayList holidays={holidays} setHolidays={setHolidays} />
    </div>
  );
};

export default Dashboard;
