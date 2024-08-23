import React, { createContext, useContext, useReducer } from 'react';

const DataContext = createContext();

const initialState = {
  categories: [],
};

const dataReducer = (state, action) => {
    switch (action.type) {
      case 'SET_CATEGORIES':
        return { ...state, categories: action.payload };
      default:
        return state;
    }
};

const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData doit être utilisé dans un DataProvider');
  }
  return context;
};

export { DataProvider, useData };
