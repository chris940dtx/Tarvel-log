import React, { createContext, useContext } from "react";

const GuestContext = createContext();

export const GuestProvider = ({ children, createGuestUser }) => {
    return (
      <GuestContext.Provider value={{ createGuestUser }}>
        {children}
      </GuestContext.Provider>
    );
  };

export const useGuest = () => {
    const context = useContext(GuestContext);
    if (!context) {
      throw new Error('useGuest must be used within a GuestProvider');
    }
    return context;
  };