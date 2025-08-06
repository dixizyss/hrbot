// src/components/Sidebar.jsx
import React from 'react';
import styles from './Sidebar.module.css';
import {
  HiHome, HiUser, HiChartBar, HiBriefcase,
  HiUserGroup, HiPaperAirplane, HiCog
} from 'react-icons/hi';

const navItems = [
  { icon: <HiHome />, name: 'Головна' },
  { icon: <HiUser />, name: 'Аккаунт' },
  { icon: <HiChartBar />, name: 'Статистика' },
  { icon: <HiBriefcase />, name: 'Вакансії' },
  { icon: <HiUserGroup />, name: 'Групи' },
  { icon: <HiPaperAirplane />, name: 'Розсилка' },
  { icon: <HiCog />, name: 'Налаштування' },
];

// Компонент тепер приймає props: activePage і setActivePage
function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>HR Bot</h2>
      </div>
      <nav className={styles.nav}>
        <ul>
          {navItems.map((item) => (
            <li
              key={item.name}
              // Динамічно визначаємо активний клас
              className={`${styles.navItem} ${activePage === item.name ? styles.active : ''}`}
              // При кліку змінюємо активну сторінку в App.js
              onClick={() => setActivePage(item.name)}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.name}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;