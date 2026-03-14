import { useState, useEffect } from "react";
import axios from "axios";

// ── Custom Hook: useFetch ─────────────────────────────────────
// Reusable hook for fetching data from any API
// Uses: useState, useEffect, axios
export const useFetch = (url) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // Reset state on url change
    setLoading(true);
    setError(null);

    // ES6 Arrow Function — fetch data using axios
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // re-fetch when url changes

  return { data, loading, error };
};

// ── Custom Hook: useLocalStorage ─────────────────────────────
// Reusable hook to sync state with localStorage
// Uses: useState, useEffect
export const useLocalStorage = (key, initialValue) => {
  // useState — initialize from localStorage if available
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // ES6 Arrow Function — update both state and localStorage
  const setValue = (value) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("localStorage error:", err);
    }
  };

  return [storedValue, setValue];
};

// ── Custom Hook: useForm ──────────────────────────────────────
// Reusable hook for form state + validation
// Uses: useState, useRef
export const useForm = (initialValues, validate) => {
  const [values, setValues]   = useState(initialValues);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  // ES6 Arrow Function — handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    // ES6 Spread — update only changed field
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ES6 Arrow Function — mark field as touched on blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  };

  // ES6 Arrow Function — validate all on submit
  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
    }
    onSubmit(values);
  };

  // Reset form
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm };
};
