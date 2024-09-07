import React, { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Button from '@/components/Button';
import LabeledInput from '@/components/LabeledInput';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/id';
import Head from 'next/head';

const columns = ['Name', 'Expense Items', 'Created At'];

type InputValues = {
    Name: string;
    'Expense Items': string;
    'Created At': string;
};

const Page = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState<{ [key: string]: string } | null>(null);
    const [inputValues, setInputValues] = useState<InputValues>({
        Name: '',
        'Expense Items': '',
        'Created At': '',
    });

    // State untuk summary
    const [totalWallets, setTotalWallets] = useState(0);
    const [totalExpenseItems, setTotalExpenseItems] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalOutcome, setTotalOutcome] = useState(0);
    const [lastUpdate, setLastUpdate] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://digistar-demo-be.vercel.app/api/wallets');
                const wallets = response.data.data;

                // Format table data
                const formattedData = wallets.map((item: any) => ({
                    _id: item._id,
                    Name: item.name,
                    'Expense Items': item.expenseItems?.length ? item.expenseItems.length : 'No Expenses',
                    'Created At': moment(item.createdAt).format('DD MMMM YYYY')
                }));

                // Perhitungan summary
                const totalIncome = wallets.reduce((sum: number, wallet: any) => {
                    return sum + wallet.expenseItems
                        .filter((item: any) => item.flowType === 'income')
                        .reduce((acc: number, item: any) => acc + item.amount, 0);
                }, 0);

                const totalOutcome = wallets.reduce((sum: number, wallet: any) => {
                    return sum + wallet.expenseItems
                        .filter((item: any) => item.flowType === 'outcome')
                        .reduce((acc: number, item: any) => acc + item.amount, 0);
                }, 0);

                const totalExpenseItems = wallets.reduce((sum: number, wallet: any) => {
                    return sum + wallet.expenseItems.length;
                }, 0);

                const lastUpdate = wallets.reduce((latest: any, wallet: any) => {
                    return moment(wallet.updatedAt).isAfter(moment(latest.updatedAt)) ? wallet : latest;
                });

                setTableData(formattedData);
                setTotalWallets(wallets.length);
                setTotalExpenseItems(totalExpenseItems);
                setTotalIncome(totalIncome);
                setTotalOutcome(totalOutcome);
                setLastUpdate(lastUpdate.updatedAt);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleEdit = (row: Record<string, any>) => {
        setEditData(row);
        setInputValues({
            Name: row.Name,
            'Expense Items': row['Expense Items'],
            'Created At': row['Created At'],
        });
    };

    const handleRemove = async (row: Record<string, any>) => {
        if (!window.confirm(`Are you sure you want to remove wallet "${row.Name}"?`)) {
            return;
        }
        try {
            const response = await axios.delete(`https://digistar-demo-be.vercel.app/api/wallets/${row._id}`); // Use the wallet's _id for deletion
            const updatedData = tableData.filter((item) => item._id !== row._id); // Filter out the removed wallet from the state
            console.log('Response:', row._id);
            

            setTableData(updatedData);
        } catch (error) {
            console.error('Error removing data:', error);
            alert('Failed to remove wallet. Please try again.'); // Inform user about the error
        }
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post('https://digistar-demo-be.vercel.app/api/wallets', {
                name: inputValues.Name,
                expenseItems: [],
                createdAt: moment().toISOString(),
            });
            setTableData([...tableData, {
                Name: response.data.data.name,
                'Expense Items': response.data.data.expenseItems.length,
            }]);
            setInputValues({
                Name: '',
                'Expense Items': '',
                'Created At': '',
            });
            setEditData(null);
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    const handleUpdate = async () => {
        if (editData) {
            try {
                const response = await axios.put(`https://digistar-demo-be.vercel.app/api/wallets/${editData.id}`, {
                    name: inputValues.Name,
                    expenseItems: [],
                    createdAt: moment(inputValues['Created At']).toISOString(),
                });
                const updatedData = tableData.map((item) =>
                    item.Name === editData.Name ? {
                        Name: response.data.data.name,
                        'Expense Items': response.data.data.expenseItems.length,
                        'Created At': moment(response.data.data.createdAt).format('DD MMMM YYYY')
                    } : item
                );
                setTableData(updatedData);
                setInputValues({
                    Name: '',
                    'Expense Items': '',
                    'Created At': '',
                });
                setEditData(null);
            } catch (error) {
                console.error('Error updating data:', error);
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (editData) {
            setInputValues({
                ...inputValues,
                [name]: value
            });
        } else {
            setInputValues({
                ...inputValues,
                [name]: value
            });
        }
    };

    return (
        <>
        <Head>
            <title>Wallet Page</title>
        </Head>
            <div className='px-40 py-28'>
                <h1 className="text-4xl font-bold mb-8 text-center text-white">Wallet Page 💰</h1>
                <LabeledInput
                    label="Name"
                    type="text"
                    placeholder="Enter Wallet Name"
                    value={inputValues.Name}
                    onChange={handleInputChange}
                    name="Name"
                />
                <LabeledInput
                    label="Expense Items"
                    type="text"
                    placeholder="Enter Expense Items"
                    value={inputValues['Expense Items']}
                    onChange={handleInputChange}
                    name="Expense Items"
                />
                <div className='flex gap-5 mb-16'>
                    <Button color="bg-red-500 hover:bg-red-600 text-xl" onClick={() => { setEditData(null); setInputValues({ Name: '', 'Expense Items': '', 'Created At': '' }); }}>Cancel</Button>
                    <Button color="bg-blue-500 hover:bg-blue-600 text-xl" onClick={editData ? handleUpdate : handleAdd}>
                        {editData ? 'Update Data' : 'Add Data'}
                    </Button>
                </div>

                {loading ? (
                    <p className='text-white text-3xl text-center mt-3'>⏳⏳⏳ Loading ⏳⏳⏳</p>
                ) : (
                    <>
                        <div className='flex justify-center flex-wrap gap-5 mb-10 w-full'>
                            <Card title='Total Wallets' description={`Total: ${totalWallets}`} icon={<i className='bx bx-wallet'></i>} />
                            <Card title='Total Expense Items' description={`Total: ${totalExpenseItems}`} icon={<i className='bx bx-money'></i>} />
                            <Card title='Total Income' description={`Rp ${totalIncome.toLocaleString('id-ID')}`} icon={<i className='bx bx-up-arrow'></i>} />
                            <Card title='Total Outcome' description={`Rp ${totalOutcome.toLocaleString('id-ID')}`} icon={<i className='bx bx-down-arrow'></i>} />
                            <Card title='Update Terakhir' description={moment(lastUpdate).format('DD MMMM YYYY')} icon={<i className='bx bx-calendar'></i>} />
                        </div>
                        <Table columns={columns} data={tableData} onEdit={handleEdit} onRemove={handleRemove} />
                    </>
                )}
            </div>
        </>
    );
};

export default Page;
