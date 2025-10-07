import { useState, useEffect } from "react";

// ----------------------------------------------------------------------

export default function useLocalStorage(key: any, defaultValue: any) {
  const [value, setValue] = useState(() => {
    const storedValue =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;
    return storedValue === null ? defaultValue : JSON.parse(storedValue);
  });

  useEffect(() => {
    const listener = (e: any) => {
      if (
        typeof window !== "undefined" &&
        e.storageArea === localStorage &&
        e.key === key
      ) {
        setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
      }
    };
    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [key, defaultValue]);

  const setValueInLocalStorage = (newValue: any) => {
    setValue((currentValue: any) => {
      const result =
        typeof newValue === "function" ? newValue(currentValue) : newValue;
      if (typeof window !== "undefined")
        localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  };

  return [value, setValueInLocalStorage];
}
