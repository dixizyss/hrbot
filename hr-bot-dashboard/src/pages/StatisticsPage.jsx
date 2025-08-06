import React, { useState } from 'react';
import styles from './StatisticsPage.module.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

// Порожні дані для графіка
const emptyChartData = {
  labels: [],
  datasets: [
    {
      label: 'Активність',
      data: [],
      backgroundColor: 'rgba(99, 95, 199, 0.7)',
      borderRadius: 5,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: '#A0A0A0' },
    },
    x: {
      grid: { display: false },
      ticks: { color: '#A0A0A0' },
    },
  },
};

const filterButtons = ['За 24 години', 'За тиждень', 'За місяць'];

function StatisticsPage() {
  const [activeFilter, setActiveFilter] = useState('За місяць');

  return (
    <main className={styles.statisticsPage}>
      <h1>Статистика розсилки</h1>

      <div className={styles.filterGroup}>
        {filterButtons.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Графік активності</h2>
        <div className={styles.chartContainer}>
            <Bar options={chartOptions} data={emptyChartData} />
            <div className={styles.chartPlaceholder}>
                <p>Немає даних для відображення</p>
            </div>
        </div>
      </div>
      
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Детальна статистика</h2>
        <div className={styles.details}>
            {/* Ці дані тепер будуть оновлюватися динамічно */}
            <p>Всього відправлено: <strong>0 повідомлень</strong></p>
            <p>Найактивніша агенція: <strong>-</strong></p>
            <p>Найпопулярніша вакансія: <strong>-</strong></p>
            <p>Шлях до логів: <strong className={styles.path}>Hr Bot\Data\SendingLogs</strong></p>
        </div>
      </div>
    </main>
  );
}

export default StatisticsPage;
