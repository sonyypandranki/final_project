import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LostFoundItem } from '../types/item';

const STORAGE_KEY = 'lost-found-items';

type ItemsContextValue = {
  items: LostFoundItem[];
  addItem: (item: Omit<LostFoundItem, 'id' | 'createdAt'>) => LostFoundItem;
  removeItem: (id: string) => void;
  searchItems: (query: string) => LostFoundItem[];
  getItemsByCategory: (category: string) => LostFoundItem[];
  getRecentItems: (limit?: number) => LostFoundItem[];
};

const ItemsContext = createContext<ItemsContextValue | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<LostFoundItem[]>([]);

  // Load items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        setItems(parsedItems);
      } catch (error) {
        console.error('Error loading items:', error);
      }
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<LostFoundItem, 'id' | 'createdAt'>) => {
    const newItem: LostFoundItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const searchItems = (query: string) => {
    if (!query.trim()) return items;
    
    const lowerQuery = query.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery) ||
      item.location.toLowerCase().includes(lowerQuery)
    );
  };

  const getItemsByCategory = (category: string) => {
    return items.filter(item => item.category === category);
  };

  const getRecentItems = (limit: number = 4) => {
    return items
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  };

  const value = useMemo<ItemsContextValue>(() => ({
    items,
    addItem,
    removeItem,
    searchItems,
    getItemsByCategory,
    getRecentItems,
  }), [items]);

  return React.createElement(ItemsContext.Provider, { value }, children);
};

export const useItems = (): ItemsContextValue => {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error('useItems must be used within an ItemsProvider');
  return ctx;
};