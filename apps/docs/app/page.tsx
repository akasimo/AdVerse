'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { Bar, Line, Pie, Doughnut, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Register chart components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

type WalletData = {
  username: string;
  vaultId: string;
  platformUsage: Record<string, number>;
  timeSpent: Record<string, number>;
  transactionCategories: Record<string, number>;
  walletPortfolio: Record<string, number>;
  degenScore: number;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Backend'den cüzdan verisi almak için fetch fonksiyonu
  const fetchWalletData = async (username: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://207.154.208.36:3000/analyze-wallet', {
          walletAddress: username
      });
      console.log(response.data); // Verileri yazdırın
  } catch (error) {
      console.error('API isteği başarısız oldu:', error); // Hataları yakalayın ve gösterin
  }
  
  };

  // Arama kutusundaki değeri alıp backend'e istek gönderme
  const handleSearch = () => {
    if (query.trim()) {
      fetchWalletData(query); // Backend'e istek yap
    }
  };

  // Input değişikliklerini yönetme
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Solana User Wallet Dashboard</h1>

        {/* Search Bar */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a user's wallet..."
          className={styles.inputSearch}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>

        {isLoading && <p className={styles.loading}>Veriler yükleniyor...</p>}

        {/* Gelen wallet verilerini göster */}
        {walletData && (
          <>
            <div className={styles.vaultInfo}>
              <h2>Vault ID: {walletData.vaultId}</h2>
            </div>

            <div className={styles.chartRow}>
              {/* Platform Usage vs Frequency */}
              <div className={styles.chartContainerSmall}>
                <h3 className={styles.chartTitle}>Platform Usage</h3>
                <Bar
                  data={{
                    labels: Object.keys(walletData.platformUsage),
                    datasets: [
                      {
                        label: 'Usage Frequency',
                        data: Object.values(walletData.platformUsage),
                        backgroundColor: ['#bb86fc', '#6200ee', '#03dac6', '#ff0266'],
                      },
                    ],
                  }}
                />
              </div>

              {/* Platform Usage vs Time */}
              <div className={styles.chartContainerSmall}>
                <h3 className={styles.chartTitle}>Time Spent</h3>
                <Line
                  data={{
                    labels: Object.keys(walletData.timeSpent),
                    datasets: [
                      {
                        label: 'Time Spent (Hours)',
                        data: Object.values(walletData.timeSpent),
                        borderColor: '#bb86fc',
                        backgroundColor: 'rgba(187, 134, 252, 0.2)',
                        borderWidth: 2,
                      },
                    ],
                  }}
                />
              </div>

              {/* Transaction Categories */}
              <div className={styles.chartContainerSmall}>
                <h3 className={styles.chartTitle}>Transaction Categories</h3>
                <Pie
                  data={{
                    labels: Object.keys(walletData.transactionCategories),
                    datasets: [
                      {
                        data: Object.values(walletData.transactionCategories),
                        backgroundColor: ['#bb86fc', '#6200ee', '#03dac6', '#ff0266'],
                      },
                    ],
                  }}
                />
              </div>

              {/* Wallet Portfolio */}
              <div className={styles.chartContainerSmall}>
                <h3 className={styles.chartTitle}>Wallet Portfolio</h3>
                <Doughnut
                  data={{
                    labels: Object.keys(walletData.walletPortfolio),
                    datasets: [
                      {
                        data: Object.values(walletData.walletPortfolio),
                        backgroundColor: ['#bb86fc', '#6200ee', '#03dac6', '#ff0266'],
                      },
                    ],
                  }}
                />
              </div>

              {/* Wallet Degen Score */}
              <div className={styles.chartContainerSmall}>
                <h3 className={styles.chartTitle}>Degen Score</h3>
                <PolarArea
                  data={{
                    labels: ['Degen Score'],
                    datasets: [
                      {
                        data: [walletData.degenScore],
                        backgroundColor: ['#bb86fc'],
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
