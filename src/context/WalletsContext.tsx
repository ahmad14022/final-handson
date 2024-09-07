import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

interface WalletContextType {
    wallets: any[];
    totalWallets: number;
    totalExpenseItems: number;
    totalIncome: number;
    totalOutcome: number;
    lastUpdate: string;
    loading: boolean;
    fetchWallets: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC = ({ children }) => {
    const [wallets, setWallets] = useState<any[]>([]);
    const [totalWallets, setTotalWallets] = useState(0);
    const [totalExpenseItems, setTotalExpenseItems] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalOutcome, setTotalOutcome] = useState(0);
    const [lastUpdate, setLastUpdate] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchWallets = async () => {
        try {
            const response = await axios.get('https://digistar-demo-be.vercel.app/api/wallets');
            const walletsData = response.data.data;

            // Format table data
            const formattedData = walletsData.map((item: any) => ({
                _id: item._id,
                Name: item.name,
                'Expense Items': item.expenseItems?.length ? item.expenseItems.length : 'No Expenses',
                'Created At': moment(item.createdAt).format('DD MMMM YYYY')
            }));

            // Perhitungan summary card
            const totalIncome = walletsData.reduce((sum: number, wallet: any) => {
                return sum + wallet.expenseItems
                    .filter((item: any) => item.flowType === 'income')
                    .reduce((acc: number, item: any) => acc + item.amount, 0);
            }, 0);

            const totalOutcome = walletsData.reduce((sum: number, wallet: any) => {
                return sum + wallet.expenseItems
                    .filter((item: any) => item.flowType === 'outcome')
                    .reduce((acc: number, item: any) => acc + item.amount, 0);
            }, 0);

            const totalExpenseItems = walletsData.reduce((sum: number, wallet: any) => {
                return sum + wallet.expenseItems.length;
            }, 0);

            const lastUpdate = walletsData.reduce((latest: any, wallet: any) => {
                return moment(wallet.updatedAt).isAfter(moment(latest.updatedAt)) ? wallet : latest;
            });

            setWallets(formattedData);
            setTotalWallets(walletsData.length);
            setTotalExpenseItems(totalExpenseItems);
            setTotalIncome(totalIncome);
            setTotalOutcome(totalOutcome);
            setLastUpdate(lastUpdate.updatedAt);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    return (
        <WalletContext.Provider value={{ wallets, totalWallets, totalExpenseItems, totalIncome, totalOutcome, lastUpdate, loading, fetchWallets }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWalletContext must be used within a WalletProvider');
    }
    return context;
};
