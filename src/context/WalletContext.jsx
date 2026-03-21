import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    // Start with 0 as requested, or maybe a small welcome bonus
    const [balance, setBalance] = useState(() => {
        const saved = localStorage.getItem('gramai_wallet_balance');
        return saved ? parseFloat(saved) : 500.00; // Giving 500 as initial demo credit
    });

    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('gramai_wallet_tx');
        return saved ? JSON.parse(saved) : [
            { id: 1, type: 'credit', amount: 500, title: 'Welcome Bonus', date: new Date().toISOString() }
        ];
    });

    useEffect(() => {
        localStorage.setItem('gramai_wallet_balance', balance.toString());
        localStorage.setItem('gramai_wallet_tx', JSON.stringify(transactions));
    }, [balance, transactions]);

    const addFunds = (amount, title = 'Deposit') => {
        if (amount <= 0) return;
        setBalance(prev => prev + amount);
        setTransactions(prev => [
            { id: Date.now(), type: 'credit', amount, title, date: new Date().toISOString() },
            ...prev
        ]);
        toast.success(`₹${amount} Added to Wallet!`);
    };

    const spendFunds = (amount, title = 'Service Payment') => {
        if (amount > balance) {
            toast.error("Insufficient Wallet Balance!");
            return false;
        }
        setBalance(prev => prev - amount);
        setTransactions(prev => [
            { id: Date.now(), type: 'debit', amount, title, date: new Date().toISOString() },
            ...prev
        ]);
        toast.info(`₹${amount} Deducted from Wallet.`);
        return true;
    };

    return (
        <WalletContext.Provider value={{ balance, transactions, addFunds, spendFunds }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) throw new Error("useWallet must be used within WalletProvider");
    return context;
};
