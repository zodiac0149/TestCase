import { useState } from 'react';

export const useAsyncAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async (action) => {
    setLoading(true);
    setError('');
    try {
      return await action();
    } catch (err) {
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run, setError };
};
