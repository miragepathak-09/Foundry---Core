import { useState, useCallback } from 'react';
import { Transaction, WalletState } from '../types';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    available: 2400,
    escrow: 1500,
    history: [
      {
        id: 'tx-1',
        itemId: 'item-2',
        itemName: 'Bosch Drill',
        amount: 250,
        type: 'rental',
        status: 'completed',
        timestamp: Date.now() - 86400000,
        hash: '0x7a2f8b9c4d1e3f5a6b7c8d9e0f1a2b3c',
        counterparty: 'Sita Gurung'
      },
      {
        id: 'tx-2',
        itemId: 'item-2',
        itemName: 'Bosch Drill (Deposit)',
        amount: 1500,
        type: 'deposit',
        status: 'escrow',
        timestamp: Date.now() - 86400000,
        hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
        counterparty: 'Sita Gurung'
      }
    ]
  });

  const lockInEscrow = useCallback((amount: number, itemId: string, itemName: string, counterparty: string) => {
    const txId = Math.random().toString(36).substr(2, 9);
    const hash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    const newTx: Transaction = {
      id: txId,
      itemId,
      itemName,
      amount,
      type: 'deposit',
      status: 'escrow',
      timestamp: Date.now(),
      hash,
      counterparty
    };

    setWallet(prev => ({
      ...prev,
      available: prev.available - amount,
      escrow: prev.escrow + amount,
      history: [newTx, ...prev.history]
    }));
  }, []);

  const releaseFromEscrow = useCallback((txId: string) => {
    setWallet(prev => {
      const tx = prev.history.find(t => t.id === txId);
      if (!tx) return prev;

      return {
        ...prev,
        escrow: prev.escrow - tx.amount,
        available: prev.available + tx.amount,
        history: prev.history.map(t => t.id === txId ? { ...t, status: 'completed' } : t)
      };
    });
  }, []);

  return { wallet, lockInEscrow, releaseFromEscrow };
};
