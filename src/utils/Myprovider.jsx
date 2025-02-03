import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Create a context
const MyContext = createContext();

// Create a provider component that will wrap your app and provide the context to any component that needs it 
export const MyProvider = ({ children }) => {
  const [data, setData] = useState("");  // State to store the data that will be shared with other components 

  // This value will be accessible by any component that consumes the context 
  return (
    // Pass the data and setData to the value prop of the context provider 
    <MyContext.Provider value={{ data, setData }}>
      {children}
    </MyContext.Provider>
  );
};

MyProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default MyContext;
