import React from 'react';
import { useAppContext } from '../context/AppContext';
import styles from './HomePage.module.css';

function HomePage() {
  const { isMailingActive, toggleMailing, settings, agencies, groups, accounts } = useAppContext();

  const isMailingDisabled = accounts.length === 0;

  const handleStartMailing = () => {
    if (isMailingDisabled && !isMailingActive) {
      return;
    }
    toggleMailing();
  };

  return (
    <main className={styles.mainContent}>
      <h1 className={styles.title}>Головна панель</h1>

      <div className={`${styles.card} ${styles.statusPanel}`}>
        <div>
          <p className={styles.cardLabel}>Статус розсилки:</p>
          <p className={isMailingActive ? styles.statusActive : styles.statusInactive}>
            {isMailingActive ? 'АКТИВНА' : 'НЕ АКТИВНА'}
          </p>
        </div>
        
        {/* --- ЗМІНЕНО: Використовуємо data-tooltip замість title --- */}
        <div 
          className={styles.buttonWrapper} 
          data-tooltip={isMailingDisabled ? "Спочатку додайте хоча б один Facebook аккаунт" : null}
        >
          <button 
            className={`
              ${styles.actionButton} 
              ${isMailingActive ? styles.stopButton : ''}
              ${isMailingDisabled && !isMailingActive ? styles.disabledButton : ''}
            `}
            onClick={handleStartMailing}
          >
            {isMailingActive ? 'Зупинити розсилку' : 'Почати розсилку'}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Статистика поточного сеансу:</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.cardLabel}>Відправлено:</span>
            <span className={styles.statValue}>0</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.cardLabel}>Залишилось:</span>
            <span className={styles.statValue}>0</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.cardLabel}>Помилки:</span>
            <span className={styles.statValue}>0</span>
          </div>
        </div>
      </div>
      
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Поточні налаштування розсилки</h3>
        <div className={styles.settingsInfo}>
            <p>Затримка між повідомленнями: <strong>{settings.delay} хвилин</strong></p>
            <p>Активних вакансій: <strong>{agencies.reduce((acc, agency) => acc + agency.vacancies.length, 0)}</strong></p>
            <p>Цільових груп: <strong>{groups.length}</strong></p>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
