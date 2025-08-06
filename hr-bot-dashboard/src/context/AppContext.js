import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'hr-bot-app-data';

const loadInitialState = () => {
  const defaultState = {
    accounts: [],
    agencies: [],
    groups: [],
    settings: { delay: 5, apiKey: '' },
    mailingLog: [],
  };

  try {
    const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedStateJSON) {
      const savedState = JSON.parse(savedStateJSON);
      return { ...defaultState, ...savedState };
    }
  } catch (e) {
    console.error("Failed to load state from localStorage", e);
  }
  
  return defaultState;
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const initialState = loadInitialState();
  const [isMailingActive, setIsMailingActive] = useState(false);
  const [accounts, setAccounts] = useState(initialState.accounts);
  const [agencies, setAgencies] = useState(initialState.agencies);
  const [groups, setGroups] = useState(initialState.groups);
  const [settings, setSettings] = useState(initialState.settings);
  const [mailingLog, setMailingLog] = useState(initialState.mailingLog);

  useEffect(() => {
    const stateToSave = {
      accounts,
      agencies,
      groups,
      settings,
      mailingLog,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [accounts, agencies, groups, settings, mailingLog]);


  const toggleMailing = () => setIsMailingActive(!isMailingActive);

  // Акаунти
  const addAccount = (login, password) => {
    const newAccount = { id: uuidv4(), login, addedAt: new Date().toLocaleString('uk-UA').replace(',', '') };
    setAccounts([...accounts, newAccount]);
  };

  // --- ЗМІНЕНО: Додано логіку зупинки розсилки ---
  const deleteAccount = (id) => {
    const newAccounts = accounts.filter(acc => acc.id !== id);
    setAccounts(newAccounts);
    // Якщо видалили останній акаунт, зупиняємо розсилку
    if (newAccounts.length === 0) {
      setIsMailingActive(false);
    }
  };

  // --- ЗМІНЕНО: Додано логіку зупинки розсилки ---
  const deleteAllAccounts = () => {
    setAccounts([]);
    // При видаленні всіх акаунтів завжди зупиняємо розсилку
    setIsMailingActive(false);
  };

  // Агенції та Вакансії
  const addAgency = (name) => {
    const newAgency = { id: uuidv4(), name, vacancies: [] };
    setAgencies([...agencies, newAgency]);
  };
  const deleteAgency = (agencyId) => setAgencies(agencies.filter(a => a.id !== agencyId));
  const editAgency = (agencyId, newName) => {
    setAgencies(agencies.map(a => a.id === agencyId ? { ...a, name: newName } : a));
  };
  const addVacancy = (agencyId, name, description) => {
    const newVacancy = { id: uuidv4(), name, description };
    setAgencies(agencies.map(a => a.id === agencyId ? { ...a, vacancies: [...a.vacancies, newVacancy] } : a));
  };
  const deleteVacancy = (agencyId, vacancyId) => {
    setAgencies(agencies.map(a => a.id === agencyId ? { ...a, vacancies: a.vacancies.filter(v => v.id !== vacancyId) } : a));
  };
  const editVacancy = (agencyId, vacancyId, name, description) => {
    setAgencies(agencies.map(a => a.id === agencyId ? { ...a, vacancies: a.vacancies.map(v => v.id === vacancyId ? { ...v, name, description } : v) } : a));
  };

  // Групи
  const addGroup = (name, link) => {
    const newGroup = { id: uuidv4(), name, link };
    setGroups([...groups, newGroup]);
  };
  const deleteGroup = (id) => setGroups(groups.filter(group => group.id !== id));
  
  // Лог
  const addLogEntry = (entry) => {
      const newEntry = {id: uuidv4(), ...entry, time: new Date().toLocaleTimeString('uk-UA')};
      setMailingLog(prevLog => [newEntry, ...prevLog]);
  }

  // Налаштування
  const saveSettings = (newSettings) => setSettings({ ...settings, ...newSettings });

  const value = {
    isMailingActive, toggleMailing,
    accounts, addAccount, deleteAccount, deleteAllAccounts,
    agencies, addAgency, deleteAgency, editAgency, addVacancy, deleteVacancy, editVacancy,
    groups, addGroup, deleteGroup,
    settings, saveSettings,
    mailingLog, addLogEntry,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
