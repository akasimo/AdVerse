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

// Define the WalletData type
type WalletData = {
  username: string;
  vaultId: string;
  platformUsage: Record<string, number>;
  timeSpent: Record<string, number>;
  transactionCategories: Record<string, number>;
  walletPortfolio: Record<string, number>;
  degenScore: number;
};

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

export default function Home() {
  const [query, setQuery] = useState('');
  const [walletData, setWalletData] = useState<null | WalletData>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock API response for testing
  const mockWalletData = {
    username: 'john_doe',
    vaultId: 'ABC1234567',
    platformUsage: {
      Radium: 40,
      Serum: 35,
      Bonfida: 20,
      MangoMarkets: 5
    },
    timeSpent: {
      Radium: 50,
      Serum: 30,
      Bonfida: 10,
      MangoMarkets: 10
    },
    transactionCategories: {
      GameFi: 30,
      DeFi: 40,
      NFT: 20,
      Others: 10
    },
    walletPortfolio: {
      Solana: 500,
      USDC: 300,
      BTC: 150,
      ETH: 50
    },
    degenScore: 85
  };

  // Simulate fetching wallet data (mocking the API call)
  const fetchWalletData = async (username: string) => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockWalletData);
      }, 1000); // Simulate 1 second delay
    }).then((data) => {
      setWalletData(data as WalletData); // Set the mock wallet data
      setIsLoading(false);
    });
  };

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      fetchWalletData(query); // Use mock data
    }
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

        {isLoading && <p className={styles.loading}>Loading wallet data...</p>}

        {/* Show vault ID and charts if wallet data is available */}
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
