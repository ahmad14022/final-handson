import React, { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Button from '@/components/Button';
import LabeledInput from '@/components/LabeledInput';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/id';

const columns = ['Title', 'Category', 'Wallet', 'Amount', 'Flow Type', 'Created At'];

type InputValues = {
    Title: string;
    Category: string;
    Wallet: string;
    Amount: string;
    'Flow Type': string;
};

type CategorySummary = {
    name: string;
    totalAmount: number;
    lastUpdated: string;
};

const Page = () => {
    const [tableData, setTableData] = useState([]);
    const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState<{ [key: string]: string } | null>(null);
    const [inputValues, setInputValues] = useState<InputValues>({
        Title: '',
        Category: '',
        Wallet: '',
        Amount: '',
        'Flow Type': '',
    });
    const [lastUpdate, setLastUpdate] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://digistar-demo-be.vercel.app/api/expense-items');
                const data = response.data.data;

                // Format data untuk table
                const formattedData = data.map((item: any) => ({
                    _id: item._id,
                    Title: item.title,
                    Category: item.category?.name,
                    CategoryId: item.category?._id, 
                    Wallet: item.wallet?.name,
                    WalletId: item.wallet?._id,
                    Amount: item.amount.toLocaleString('id-ID'),
                    'Flow Type': item.flowType,
                    'Created At': moment(item.createdAt).format('DD MMMM YYYY'),
                }));


                // Menghitung total amount per kategori
                const categoryTotals = data.reduce((acc: { [key: string]: { totalAmount: number; lastUpdated: string } }, item: any) => {
                    const categoryName = item.category?.name;
                    if (!acc[categoryName]) {
                        acc[categoryName] = { totalAmount: 0, lastUpdated: item.updatedAt };
                    }
                    acc[categoryName].totalAmount += item.amount;
                    if (moment(item.updatedAt).isAfter(moment(acc[categoryName].lastUpdated))) {
                        acc[categoryName].lastUpdated = item.updatedAt;
                    }
                    return acc;
                }, {});

                const formattedCategorySummaries = Object.keys(categoryTotals).map((name) => ({
                    name,
                    totalAmount: categoryTotals[name].totalAmount,
                    lastUpdated: moment(categoryTotals[name].lastUpdated).format('DD MMMM YYYY')
                }));

                setTableData(formattedData);
                setCategorySummaries(formattedCategorySummaries);
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
        setEditData({
            _id: row._id,
            Title: row.Title,
            CategoryId: row.CategoryId, 
            Category: row.Category, 
            Wallet: row.Wallet,     
            WalletId: row.WalletId, 
            Amount: row.Amount,
            'Flow Type': row['Flow Type'],
        });

        console.log('ini row edit', row);
        
        setInputValues({
            Title: row.Title,
            Category: row.Category,
            Wallet: row.Wallet,     
            Amount: row.Amount,
            'Flow Type': row['Flow Type'],
        });
    };

    const handleSaveEdit = async () => {
        if (!editData) {
            console.error('No data to edit');
            return;
        }

        try {
            const editedData = { ...editData };
            editedData.Amount = parseFloat(editedData.Amount.replace(/\./g, '').replace(',', '.'));

            const response = await axios.put(`https://digistar-demo-be.vercel.app/api/expense-items/${editData._id}`, {
                title: editedData.Title,
                category: editedData.CategoryId, 
                wallet: editedData.WalletId,    
                amount: editedData.Amount,
                flowType: editedData['Flow Type'],
            });

            console.log('Response:', response);
            
            const updatedItem = {
                _id: response.data.data._id,
                Title: response.data.data.title,
                Category: response.data.data.category?.name || editData.Category, 
                CategoryId: response.data.data.category?._id || editData.CategoryId,
                Wallet: response.data.data.wallet?.name || editData.Wallet,
                WalletId: response.data.data.wallet?._id || editData.WalletId,
                Amount: response.data.data.amount.toLocaleString('id-ID'),
                'Flow Type': response.data.data.flowType,
                'Created At': moment(response.data.data.createdAt).format('DD MMMM YYYY'),
            };

            const updatedTableData = tableData.map((item) => (item._id === editData._id ? updatedItem : item));
            setTableData(updatedTableData);

            setEditData(null);
            console.log('Data updated successfully!');
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Failed to update data. Please try again.');
        }
    };


    const handleAdd = async () => {
        try {
            const amount = parseFloat(inputValues.Amount.replace(/\./g, '').replace(',', '.'));

            const response = await axios.post('https://digistar-demo-be.vercel.app/api/expense-items', {
                title: inputValues.Title,
                // id from category and wallet
                category: inputValues.Category,
                wallet: inputValues.Wallet,     
                amount,
                flowType: inputValues['Flow Type'],
            });

            setTableData([...tableData, {
                Title: response.data.data.title,
                Category: response.data.data.category.name,
                Wallet: response.data.data.wallet.name,
                Amount: response.data.data.amount.toLocaleString('id-ID'),
                'Flow Type': response.data.data.flowType,
            }]);
            setInputValues({
                Title: '',
                Category: '',
                Wallet: '',
                Amount: '',
                'Flow Type': '',
            });
            setEditData(null);
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    const handleRemove = async (row: Record<string, any>) => {
        if (!window.confirm(`Are you sure you want to remove Expense Item "${row.Title}"?`)) {
            return;
        }
        try {
            const response = await axios.delete(`https://digistar-demo-be.vercel.app/api/expense-items/${row._id}`);
            const updatedData = tableData.filter((item) => item._id !== row._id);
            console.log('Response:', row._id);
            setTableData(updatedData);
        } catch (error) {
            console.error('Error removing data:', error);
            alert('Failed to remove wallet. Please try again.'); 
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (editData) {
            setEditData({
                ...editData,
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
        <div className='px-40 py-28'>
            <h1 className="text-4xl font-bold mb-8 text-center text-white">Expense Items Page 💰</h1>
            <LabeledInput
                label="Title"
                type="text"
                placeholder="Enter Title"
                value={editData ? editData.Title : inputValues.Title}
                onChange={handleInputChange}
                name="Title"
            />
            <LabeledInput
                label="Category"
                type="text"
                placeholder="Enter Category"
                value={editData ? editData.Category : inputValues.Category}
                onChange={handleInputChange}
                name="Category"
            />
            <LabeledInput
                label="Wallet"
                type="text"
                placeholder="Enter Wallet"
                value={editData ? editData.Wallet : inputValues.Wallet}
                onChange={handleInputChange}
                name="Wallet"
            />
            <LabeledInput
                label="Amount"
                type="text"
                placeholder="Enter Amount"
                value={editData ? editData.Amount : inputValues.Amount}
                onChange={handleInputChange}
                name="Amount"
            />
            <LabeledInput
                label="Flow Type"
                type="text"
                placeholder="Enter Flow Type"
                value={editData ? editData['Flow Type'] : inputValues['Flow Type']}
                onChange={handleInputChange}
                name="Flow Type"
            />
            <div className='flex gap-5 mb-16'>
                <Button color="bg-red-500 hover:bg-red-600 text-xl" onClick={() => { setEditData(null); setInputValues({ Title: '', Category: '', Wallet: '', Amount: '', 'Flow Type': '' }); }}>Cancel</Button>
                <Button color="bg-blue-500 hover:bg-blue-600 text-xl" onClick={editData ? handleSaveEdit : handleAdd}>{editData ? 'Update Data' : 'Add Data'}</Button>
            </div>
            {loading ? (
                <p className='text-white text-3xl text-center mt-3'>⏳⏳⏳ Loading ⏳⏳⏳</p>
            ) : (
                <>
                    <div className='flex justify-center flex-wrap gap-5 mb-10 w-full'>
                        {categorySummaries.map((category, index) => (
                            <Card
                                key={index}
                                title={`Category: ${category.name}`}
                                description={`Total Amount: Rp ${category.totalAmount.toLocaleString('id-ID')}`}
                                icon={<i className='bx bx-category'></i>}
                            />
                        ))}
                        <Card title='Update Terakhir' description={moment(lastUpdate).format('DD MMMM YYYY')} icon={<i className='bx bx-calendar'></i>} />
                    </div>
                    <Table columns={columns} data={tableData} onEdit={handleEdit} onRemove={handleRemove} />
                </>
            )}

        </div>
    );
};

export default Page;