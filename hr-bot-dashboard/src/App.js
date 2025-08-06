import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import StatisticsPage from './pages/StatisticsPage';
import VacanciesPage from './pages/VacanciesPage';
import GroupsPage from './pages/GroupsPage';
import MailingPage from './pages/MailingPage';
import SettingsPage from './pages/SettingsPage';
import './styles.css';

// Для кращої структури, переміщуємо сторінки в папку `pages`
// А менші компоненти залишаться в `components`

function App() {
  const [activePage, setActivePage] = useState('Головна');

  const renderPage = () => {
    switch (activePage) {
      case 'Головна': return <HomePage />;
      case 'Аккаунт': return <AccountPage />;
      case 'Статистика': return <StatisticsPage />;
      case 'Вакансії': return <VacanciesPage />;
      case 'Групи': return <GroupsPage />;
      case 'Розсилка': return <MailingPage />;
      case 'Налаштування': return <SettingsPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="content-container">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
