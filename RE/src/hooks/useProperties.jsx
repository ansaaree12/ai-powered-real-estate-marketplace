import { useQuery } from "react-query"; // Correct path for react-query
import React from "react"; // React import is unnecessary unless you use JSX in this file
import { getAllProperties } from "../utils/api"; // Adjust this path as per your project structure

const useProperties = () => {
  const { data, isError, isLoading, refetch } = useQuery(
    "allProperties",
    getAllProperties,
    { refetchOnWindowFocus: false }
  );

  // Return the object with all needed properties
  return { data, isError, isLoading, refetch };
};

export default useProperties;
