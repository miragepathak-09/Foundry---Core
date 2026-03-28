import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Item, Match, ItemType, ItemStatus, WalletState, Transaction } from './types';
import { calculateDistance, calculateKeywordSimilarity } from './lib/utils';

// Mock Firebase for local-only operation
const auth = { currentUser: null as any };
const db = {} as any;
const onAuthStateChanged = (auth: any, callback: any) => {
  callback(null);
  return () => {};
};
const doc = (...args: any[]) => ({});
const getDoc = async (...args: any[]) => ({ exists: () => false, data: () => null });
const setDoc = async (...args: any[]) => {};
const onSnapshot = (q: any, callback: any, errorCallback: any) => {
  callback({ docs: [] });
  return () => {};
};
const collection = (...args: any[]) => ({});
const query = (...args: any[]) => ({});
const where = (...args: any[]) => ({});
const orderBy = (...args: any[]) => ({});
const addDoc = async (...args: any[]) => ({ id: 'mock-id' });
const updateDoc = async (...args: any[]) => {};
const deleteDoc = async (...args: any[]) => {};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

interface AppContextType {
  user: User | null;
  isAuthReady: boolean;
  items: Item[];
  matches: Match[];
  setUser: (user: User | null) => void;
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'status'>) => void;
  resolveItem: (id: string) => void;
  updateItemStatus: (id: string, status: ItemStatus, loanedTo?: string) => void;
  location: { lat: number; lng: number } | null;
  setLocation: (loc: { lat: number; lng: number }) => void;
  updateKarma: (amount: number) => void;
  verifyUser: () => void;
  mockAITagging: (title: string, description: string) => string[];
  neighbors: User[];
  setNeighbors: (neighbors: User[]) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  verifyCitizenship: (data: { 
    name: string; 
    idNumber: string; 
    address: string; 
    issueDistrict: string;
    verificationHash: string;
    isAuthentic: boolean 
  }) => Promise<void>;
  wallet: WalletState;
  topUp: (amount: number, provider: string) => void;
  initiateRental: (item: Item) => void;
  completeHandshake: (transactionId: string) => void;
  requestPayout: (amount: number, method: 'eSewa' | 'Khalti' | 'IME Pay') => void;
  error: FirestoreErrorInfo | null;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [neighbors, setNeighbors] = useState<User[]>([
    { id: 'n1', uid: 'FD-1022-V', name: 'Saroj Mahat', email: 'saroj@example.com', neighborhood: 'Baneshwor', karma: 850, level: 4, isVerified: true, idVerified: true, biometricsRegistered: true, photoURL: 'https://i.pravatar.cc/150?u=saroj' },
    { id: 'n2', uid: 'FD-4491-V', name: 'Anish Giri', email: 'anish@example.com', neighborhood: 'Koteshwor', karma: 620, level: 3, isVerified: true, idVerified: true, biometricsRegistered: false, photoURL: 'https://i.pravatar.cc/150?u=anish' },
    { id: 'n3', uid: 'FD-8821-V', name: 'Prerana K.C.', email: 'prerana@example.com', neighborhood: 'Patan', karma: 940, level: 5, isVerified: true, idVerified: true, biometricsRegistered: true, photoURL: 'https://i.pravatar.cc/150?u=prerana' },
    { id: 'n4', uid: 'FD-3310-V', name: 'Sunil Thapa', email: 'sunil@example.com', neighborhood: 'Thamel', karma: 410, level: 2, isVerified: true, idVerified: true, biometricsRegistered: false, photoURL: 'https://i.pravatar.cc/150?u=sunil' },
    { id: 'n5', uid: 'FD-7722-V', name: 'Ramesh Adhikari', email: 'ramesh@example.com', neighborhood: 'Boudha', karma: 1200, level: 6, isVerified: true, idVerified: true, biometricsRegistered: true, photoURL: 'https://i.pravatar.cc/150?u=ramesh' }
  ]);
  const [error, setError] = useState<FirestoreErrorInfo | null>(null);

  const handleFirestoreError = useCallback((error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    }
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    setError(errInfo);
  }, []);

  const clearError = () => setError(null);

  const [wallet, setWallet] = useState<WalletState>({
    available: 3700, // Sum of earnings
    escrow: 1200,    // Active Sony A7R rental
    history: [
      { id: 't1', ref: '#TXN-991', itemId: 'i1', itemName: 'DJI Mavic 3 Pro', amount: 1500, type: 'earning', status: 'completed', timestamp: Date.now() - 86400000 * 2, hash: '0x123...', counterparty: 'Saroj M.' },
      { id: 't2', ref: '#TXN-992', itemId: 'i2', itemName: 'Camping Tent', amount: 500, type: 'earning', status: 'completed', timestamp: Date.now() - 86400000 * 4, hash: '0x456...', counterparty: 'Anish' },
      { id: 't3', ref: '#TXN-993', itemId: 'i3', itemName: 'Power Drill', amount: 300, type: 'earning', status: 'completed', timestamp: Date.now() - 86400000 * 7, hash: '0x789...', counterparty: 'Prerana' },
      { id: 't4', ref: '#TXN-994', itemId: 'i4', itemName: 'Sony A7R IV', amount: 1200, type: 'earning', status: 'completed', timestamp: Date.now() - 86400000 * 10, hash: '0xabc...', counterparty: 'Sunil' },
      { id: 't5', ref: '#TXN-995', itemId: 'i5', itemName: 'Projector', amount: 200, type: 'earning', status: 'completed', timestamp: Date.now() - 86400000 * 15, hash: '0xdef...', counterparty: 'Ramesh' }
    ]
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch or create user in Firestore
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUser(userSnap.data() as User);
          } else {
            // New user - will be handled by onboarding
            const newUser: User = {
              id: firebaseUser.uid,
              uid: `FD-${Math.floor(Math.random() * 9000) + 1000}-X`,
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email || '',
              neighborhood: 'Unknown',
              karma: 0,
              level: 1,
              isVerified: false,
              idVerified: false,
              biometricsRegistered: false,
              photoURL: firebaseUser.photoURL || undefined
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Items Listener
  useEffect(() => {
    if (!isAuthReady || !auth.currentUser) return;

    const path = 'items';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
      setItems(newItems);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [isAuthReady, user]);


  // Autonomous Geolocation - Default to Kathmandu for Demo
  useEffect(() => {
    // Set default location immediately for the demo/presenter mode
    const defaultLoc = { lat: 27.7172, lng: 85.3240 };
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLoc);
        },
        () => {
          // Default to Kathmandu if denied or unavailable
          setLocation(defaultLoc);
        }
      );
    } else {
      setLocation(defaultLoc);
    }
  }, []);

  // Safe Zone Geofencing Logic
  useEffect(() => {
    if (!location || items.length === 0) return;

    const lastItem = items[items.length - 1];
    if (lastItem.type === 'lost' && lastItem.status === 'active') {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        lastItem.coordinates.lat,
        lastItem.coordinates.lng
      );

      if (distance <= 0.5) { // 500m
        if (Notification.permission === 'granted') {
          new Notification('Safe Zone Alert!', {
            body: `A "Lost" item (${lastItem.title}) was posted within 500m of your location!`,
            icon: '/favicon.ico'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }
    }
  }, [items, location]);

  const updateKarma = useCallback((amount: number) => {
    setUser(prev => prev ? { ...prev, karma: prev.karma + amount } : null);
  }, []);

  const verifyUser = useCallback(() => {
    setUser(prev => prev ? { ...prev, level: 2, isVerified: true } : null);
  }, []);

  const mockAITagging = (title: string, description: string): string[] => {
    const text = (title + ' ' + description).toLowerCase();
    const tags: string[] = [];
    if (text.includes('apple') || text.includes('iphone') || text.includes('mac')) tags.push('Brand: Apple');
    if (text.includes('samsung') || text.includes('galaxy')) tags.push('Brand: Samsung');
    if (text.includes('silver') || text.includes('grey')) tags.push('Silver');
    if (text.includes('gold')) tags.push('Gold');
    if (text.includes('phone') || text.includes('laptop') || text.includes('electronics')) tags.push('Electronics');
    if (text.includes('wallet') || text.includes('keys') || text.includes('bag')) tags.push('Personal Item');
    return tags.length > 0 ? tags : ['General'];
  };

  const addItem = async (newItemData: Omit<Item, 'id' | 'createdAt' | 'status'>) => {
    if (!user) return;

    const path = 'items';
    const id = Math.random().toString(36).substr(2, 9);
    const newItem: Item = {
      ...newItemData,
      id,
      userId: user.id,
      createdAt: Date.now(),
      status: 'active',
      isNew: true,
      tags: mockAITagging(newItemData.title, newItemData.description),
      authorName: user.name,
      neighborhood: user.neighborhood
    };

    try {
      await setDoc(doc(db, path, id), newItem);
      // Karma for reporting
      updateKarma(10);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    }
  };

  const resolveItem = async (id: string) => {
    const path = 'items';
    try {
      await updateDoc(doc(db, path, id), { status: 'resolved' });
      updateKarma(50); // +50 for Returns
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
    }
  };

  const updateItemStatus = async (id: string, status: ItemStatus, loanedTo?: string) => {
    const path = 'items';
    try {
      await updateDoc(doc(db, path, id), { 
        status, 
        loanedTo, 
        loanedAt: status === 'on-loan' ? Date.now() : undefined 
      });
      if (status === 'on-loan') updateKarma(10); // +10 for successful Lending
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
    }
  };

  const verifyCitizenship = useCallback(async (data: { 
    name: string; 
    idNumber: string; 
    address: string; 
    issueDistrict: string;
    verificationHash: string;
    isAuthentic: boolean 
  }) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        name: data.name,
        isVerified: data.isAuthentic,
        idVerified: data.isAuthentic,
        verificationDetails: {
          idNumber: data.idNumber,
          issueDistrict: data.issueDistrict,
          address: data.address,
          verificationHash: data.verificationHash
        }
      };
      await setDoc(doc(db, 'users', user.id), updatedUser);
      setUser(updatedUser);
    }
  }, [user]);

  const topUp = (amount: number, provider: string) => {
    const newTx: Transaction = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      itemId: 'topup',
      itemName: `Top-up via ${provider}`,
      amount,
      type: 'earning',
      status: 'completed',
      timestamp: Date.now(),
      hash: `0x${Math.random().toString(16).substr(2, 16)}`,
      counterparty: provider
    };

    setWallet(prev => ({
      ...prev,
      available: prev.available + amount,
      history: [newTx, ...prev.history]
    }));
  };

  const initiateRental = (item: Item) => {
    const totalAmount = (item.pricePerDay || 0) + (item.deposit || 0);
    if (wallet.available < totalAmount) return;

    const newTx: Transaction = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      itemId: item.id,
      itemName: `Rental: ${item.title}`,
      amount: totalAmount,
      type: 'rental',
      status: 'escrow',
      timestamp: Date.now(),
      hash: `0x${Math.random().toString(16).substr(2, 16)}`,
      counterparty: item.authorName || 'Verified Owner'
    };

    setWallet(prev => ({
      ...prev,
      available: prev.available - totalAmount,
      escrow: prev.escrow + totalAmount,
      history: [newTx, ...prev.history]
    }));

    updateItemStatus(item.id, 'rented', user?.id);
  };

  const completeHandshake = (transactionId: string) => {
    setWallet(prev => {
      const tx = prev.history.find(t => t.id === transactionId);
      if (!tx || tx.status !== 'escrow') return prev;

      const updatedHistory = prev.history.map(t => 
        t.id === transactionId ? { ...t, status: 'completed' as const } : t
      );

      return {
        ...prev,
        escrow: prev.escrow - tx.amount,
        history: updatedHistory
      };
    });
  };

  const requestPayout = (amount: number, method: 'eSewa' | 'Khalti' | 'IME Pay') => {
    if (amount > wallet.available) return;
    
    const newTxn: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ref: `#PAY-${Math.floor(Math.random() * 9000) + 1000}`,
      itemId: 'payout',
      itemName: `Payout to ${method}`,
      amount: amount,
      type: 'payout',
      status: 'processing',
      timestamp: Date.now(),
      hash: '0x' + Math.random().toString(16).substr(2, 32),
      counterparty: user?.phone || '98********',
      payoutMethod: method
    };

    setWallet(prev => ({
      ...prev,
      available: prev.available - amount,
      history: [newTxn, ...prev.history]
    }));
  };

  return (
    <AppContext.Provider value={{ 
      user, isAuthReady, items, matches, setUser, addItem, resolveItem, updateItemStatus, location, setLocation, updateKarma, verifyUser, mockAITagging, neighbors, setNeighbors,
      activeTab, setActiveTab, verifyCitizenship,
      wallet, topUp, initiateRental, completeHandshake, requestPayout,
      error, clearError
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
