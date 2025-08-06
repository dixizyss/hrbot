import React, { useState } from 'react';
import styles from './AccountPage.module.css';
import { useAppContext } from '../context/AppContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { HiOutlineUserGroup, HiPlus, HiOutlineTrash, HiExclamationCircle, HiOutlineRefresh, HiCheckCircle } from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg';

// Компонент форми додавання (без змін)
const AddAccountForm = ({ onAdd, onCancel }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Невідома помилка сервера');
      }
      onAdd(login, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.addForm} onSubmit={handleSubmit}>
      <h4>Новий аккаунт Facebook</h4>
      <input type="text" placeholder="Логін" value={login} onChange={(e) => setLogin(e.target.value)} className={styles.input} disabled={isLoading} />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} disabled={isLoading} />
      {error && (<div className={styles.errorMessage}><HiExclamationCircle />{error}</div>)}
      <div className={styles.formActions}>
        <button type="submit" className={styles.formButton} disabled={isLoading}>{isLoading ? <CgSpinner className={styles.spinner} /> : 'Додати аккаунт'}</button>
        <button type="button" onClick={onCancel} className={`${styles.formButton} ${styles.cancelButton}`} disabled={isLoading}>Скасувати</button>
      </div>
    </form>
  );
};

function AccountPage() {
  const { accounts, addAccount, deleteAccount, deleteAllAccounts } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, accountId: null, type: null });
  // --- НОВИЙ СТАН ДЛЯ ПЕРЕВІРКИ ---
  const [checkingStatus, setCheckingStatus] = useState({}); // { accountId: 'loading' | 'success' | 'error', message: '...' }

  const handleAddAccount = (login, password) => {
    addAccount(login, password);
    setIsAdding(false);
  };

  const openDeleteModal = (id) => setModalState({ isOpen: true, accountId: id, type: 'single' });
  const openDeleteAllModal = () => setModalState({ isOpen: true, accountId: null, type: 'all' });

  const handleConfirm = () => {
    if (modalState.type === 'single') deleteAccount(modalState.accountId);
    else if (modalState.type === 'all') deleteAllAccounts();
    handleCloseModal();
  };

  const handleCloseModal = () => setModalState({ isOpen: false, accountId: null, type: null });
  const getModalMessage = () => {
    if (modalState.type === 'single') return "Ви точно хочете вийти з цього аккаунту?";
    if (modalState.type === 'all') return "Ви точно хочете вийти з УСІХ аккаунтів?";
    return "";
  };

  // --- НОВА ФУНКЦІЯ ДЛЯ ПЕРЕВІРКИ ---
  const handleCheckAccount = async (accountId, login) => {
    setCheckingStatus({ ...checkingStatus, [accountId]: { status: 'loading' } });
    try {
      const response = await fetch('http://127.0.0.1:8000/api/check-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Помилка перевірки');
      
      setCheckingStatus({ ...checkingStatus, [accountId]: { status: 'success', message: data.message } });
    } catch (err) {
      setCheckingStatus({ ...checkingStatus, [accountId]: { status: 'error', message: err.message } });
    }
  };

  return (
    <>
      <ConfirmationModal isOpen={modalState.isOpen} onClose={handleCloseModal} onConfirm={handleConfirm} message={getModalMessage()} />
      <main className={styles.accountPage}>
        <header className={styles.header}>
          <h1>Аккаунти Facebook</h1>
          <div className={styles.headerActions}>
            <div className={styles.activeStatus}><HiOutlineUserGroup /><span>{accounts.length} активних</span></div>
            {accounts.length > 0 && (<button onClick={openDeleteAllModal} className={styles.deleteAllButton}><HiOutlineTrash/> Видалити всі</button>)}
          </div>
        </header>
        
        <div className={styles.accountList}>
          {accounts.map(acc => {
            const status = checkingStatus[acc.id];
            return (
              <div key={acc.id} className={styles.accountItem}>
                <div className={styles.accountInfo}>
                  <div className={`${styles.avatar} ${status?.status === 'success' ? styles.avatarSuccess : ''} ${status?.status === 'error' ? styles.avatarError : ''}`}>
                    {status?.status === 'loading' && <CgSpinner className={styles.spinner} />}
                  </div>
                  <div>
                    <p className={styles.accountLogin}>{acc.login}</p>
                    <p className={styles.accountTime}>Увійшов: {acc.addedAt}</p>
                    {status && <p className={`${styles.statusMessage} ${styles[status.status]}`}>{status.message}</p>}
                  </div>
                </div>
                <div className={styles.accountActions}>
                  <button className={styles.actionButton} onClick={() => handleCheckAccount(acc.id, acc.login)} disabled={status?.status === 'loading'}>
                    <HiOutlineRefresh />
                  </button>
                  <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => openDeleteModal(acc.id)}>
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {isAdding ? (
          <AddAccountForm onAdd={handleAddAccount} onCancel={() => setIsAdding(false)} />
        ) : (
          <div className={styles.addAccountBlock} onClick={() => setIsAdding(true)}>
            <div className={styles.plusIconLg}><HiPlus /></div>
            <h3>Додати новий аккаунт</h3>
            <p>Додайте ще один Facebook аккаунт для розсилки</p>
          </div>
        )}
      </main>
    </>
  );
}

export default AccountPage;
