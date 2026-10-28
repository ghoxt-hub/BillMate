import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Bill {
  id: string;
  name: string;
  amount: string;
  date: string;
  category: string;
  icon: string;
  color: string;
  bg: string;
  status: string;
}

interface BillContextType {
  bills: Bill[];
  addBill: (bill: Bill) => void;
  markAsPaid: (id: string) => void;
  deleteBill: (id: string) => void; // <-- Added
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export const BillProvider = ({ children }: { children: ReactNode }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadBills = async () => {
      try {
        const storedBills = await AsyncStorage.getItem('@billmate_bills');
        if (storedBills !== null) {
          setBills(JSON.parse(storedBills));
        }
      } catch (error) {
        console.error('Failed to load bills from storage', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadBills();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const saveBills = async () => {
        try {
          await AsyncStorage.setItem('@billmate_bills', JSON.stringify(bills));
        } catch (error) {
          console.error('Failed to save bills to storage', error);
        }
      };
      saveBills();
    }
  }, [bills, isLoaded]);

  const addBill = (newBill: Bill) => {
    setBills((prevBills) => [newBill, ...prevBills]);
  };

  const markAsPaid = (id: string) => {
    setBills((prevBills) => 
      prevBills.map((bill) => 
        bill.id === id ? { ...bill, status: 'Paid' } : bill
      )
    );
  };

  // NEW: Filter out the bill with the matching ID
  const deleteBill = (id: string) => {
    setBills((prevBills) => prevBills.filter((bill) => bill.id !== id));
  };

  return (
    <BillContext.Provider value={{ bills, addBill, markAsPaid, deleteBill }}>
      {children}
    </BillContext.Provider>
  );
};

export const useBills = () => {
  const context = useContext(BillContext);
  if (!context) throw new Error('useBills must be used within a BillProvider');
  return context;
};