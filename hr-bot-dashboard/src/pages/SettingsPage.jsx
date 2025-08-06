import React, { useState, useEffect } from 'react';
import styles from './SettingsPage.module.css';
import { useAppContext } from '../context/AppContext';
import { HiOutlineClock, HiOutlineKey, HiOutlineSortAscending, HiCheckCircle } from 'react-icons/hi';

// Допоміжний компонент для блоків
const SettingsCard = ({ icon, title, children }) => (
  <div className={styles.card}>
    <h2 className={styles.cardTitle}>{icon}{title}</h2>
    {children}
  </div>
);

// Компонент для поля вводу з кнопкою збереження
const SettingsInput = ({ initialValue, onSave, children }) => {
  const [value, setValue] = useState(initialValue);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    onSave(value);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  return (
    <div className={styles.inputGroup}>
      {children(value, setValue)}
      <button className={styles.button} onClick={handleSave}>
        {showConfirmation ? <><HiCheckCircle/> Збережено</> : 'Зберегти'}
      </button>
    </div>
  );
};


function SettingsPage() {
  const { settings, saveSettings, agencies } = useAppContext();
  const allVacancies = agencies.flatMap(agency => agency.vacancies.map(v => ({...v, agencyName: agency.name})));

  return (
    <main className={styles.settingsPage}>
      <h1>Налаштування</h1>

      <SettingsCard icon={<HiOutlineClock />} title="Налаштування часу затримки">
        <p className={styles.description}>
          Вкажіть час затримки між відправками повідомлень (в хвилинах)
        </p>
        <SettingsInput
          initialValue={settings.delay}
          onSave={(delay) => saveSettings({ delay: Number(delay) })}
        >
          {(value, setValue) => (
            <>
              <input 
                type="number" 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={styles.input}
              />
              <span className={styles.inputLabel}>хвилин</span>
            </>
          )}
        </SettingsInput>
        <div className={styles.recommendations}>
            <h4>Рекомендовані налаштування:</h4>
            <ul>
                <li>5-10 хвилин для низького ризику блокування</li>
                <li>10-20 хвилин для мінімального ризику</li>
                <li>Не рекомендується встановлювати менше 3 хвилин</li>
            </ul>
        </div>
      </SettingsCard>

      <SettingsCard icon={<HiOutlineKey />} title="API ключ 2captcha">
        <SettingsInput
            initialValue={settings.apiKey}
            onSave={(apiKey) => saveSettings({ apiKey })}
        >
            {(value, setValue) => (
                <input 
                    type="text" 
                    placeholder="Введіть API ключ 2captcha"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`${styles.input} ${styles.apiKeyInput}`}
                />
            )}
        </SettingsInput>
        <p className={styles.description}>
            API ключ зберігається локально в браузері та використовується для автоматичного проходження капчі Facebook
        </p>
      </SettingsCard>

      <SettingsCard icon={<HiOutlineSortAscending />} title="Пріоритет вакансій">
        <p className={styles.description}>
            Встановіть пріоритети для розсилки оголошень. Вакансії з вищим пріоритетом будуть розсилатися першими.
        </p>
        {allVacancies.length > 0 ? (
            <div className={styles.priorityList}>
                {allVacancies.map((vac, index) => (
                    <div key={vac.id} className={styles.priorityItem}>
                        <span>{index + 1}. {vac.name} ({vac.agencyName})</span>
                        {/* Тут можна додати логіку drag-n-drop */}
                    </div>
                ))}
            </div>
        ) : (
            <div className={styles.placeholder}>
                <p>Наразі немає доступних вакансій для налаштування пріоритетів</p>
                <p className={styles.placeholderSub}>
                    Створіть агенції та вакансії в розділі "Вакансії" для налаштування пріоритетів
                </p>
            </div>
        )}
      </SettingsCard>
    </main>
  );
}

export default SettingsPage;
