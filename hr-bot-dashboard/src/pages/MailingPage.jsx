import React from 'react';
import styles from './MailingPage.module.css';
import { useAppContext } from '../context/AppContext';
import { HiOutlineClock, HiOutlineInboxIn } from 'react-icons/hi';

const LogItem = ({ item }) => {
  const hasError = !!item.error;
  const itemClasses = `${styles.logItem} ${hasError ? styles.errorItem : ''}`;

  return (
    <div className={itemClasses}>
      <div className={styles.itemHeader}>
        <h3>{item.title}</h3>
        <span>{item.time}</span>
      </div>
      <div className={styles.itemMeta}>
        <span>Агенція: {item.agency}</span>
        <span>Група: {item.group}</span>
      </div>
      {hasError && (
        <div className={styles.errorMessage}>
          Помилка: {item.error}
        </div>
      )}
    </div>
  );
}

function MailingPage() {
  const { mailingLog } = useAppContext();

  return (
    <main className={styles.mailingPage}>
      <h1>Розсилка повідомлень</h1>

      <div className={styles.logHeader}>
        <HiOutlineClock />
        <span>Лог розсилки в реальному часі</span>
      </div>

      <div className={styles.logList}>
        {/* Додано перевірку, чи існує mailingLog, щоб уникнути помилок */}
        {mailingLog && mailingLog.length > 0 ? (
          mailingLog.map(item => (
            <LogItem key={item.id} item={item} />
          ))
        ) : (
          <div className={styles.placeholder}>
            <HiOutlineInboxIn />
            <p>Лог розсилки порожній</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default MailingPage;
