import React, { useEffect, useState } from 'react';
import Table from '@/components/Table';
import Button from '@/components/Button';
import LabeledInput from '@/components/LabeledInput';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/id';
import Card from '@/components/Card';
import Head from 'next/head';

const columns = ['Name', 'Wallet Balance', 'Created At'];

type InputValues = {
    Name: string;
    'Wallet Balance': string;
    'Created At': string;
};

const Page = () => {
    const [lastUpdate, setLastUpdate] = useState('');
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState<{ [key: string]: string } | null>(null);
    const [inputValues, setInputValues] = useState<InputValues>({
        Name: '',
        'Wallet Balance': '',
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://digistar-demo-be.vercel.app/api/categories');
                const formattedData = response.data.data.map((item: any) => ({
                    _id: item._id,
                    Name: item.name,
                    'Wallet Balance': item.wallet ? item.wallet?.name : 'None',
                    'Wallet id': item.wallet ? item.wallet?._id : 'None',
                    'Created At': moment(item.createdAt).format('DD MMMM YYYY'),
                    updatedAt: item.updatedAt
                }));

                const lastUpdate = formattedData.reduce((latest: any, category: any) => {
                    return moment(category.updatedAt).isAfter(moment(latest.updatedAt)) ? category : latest;
                });

                setLastUpdate(lastUpdate.updatedAt);
                setTableData(formattedData);
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
            Name: row.Name,
            walletId: row['Wallet id'] || '',
            walletName: row['Wallet Balance'] || '',
        });

        console.log("ini row", row);

        setInputValues({
            Name: row.Name,
            'Wallet Balance': row['Wallet Balance'] || '',
        });
    };


    const handleAdd = async () => {
        try {
            if (editData && editData._id) {
                console.log("ini editData:", editData.walletName);
                
                // Update data
                const updatePayload = {
                    name: editData.Name,
                    wallet: editData.walletId
                        ? { _id: editData.walletId, name: editData.walletName }
                        : null,
                };

                console.log('Update Payload:', updatePayload);
                console.log("ini editData:", updatePayload.wallet);
                

                const response = await axios.put(`https://digistar-demo-be.vercel.app/api/categories/${editData._id}`, updatePayload);

                // Update data di frontend setelah berhasil
                const updatedData = tableData.map((item) => {
                    if (item._id === editData._id) {
                        return {
                            ...item,
                            Name: response.data.data.name,
                            wallet: response.data.data.wallet ? response.data.data.wallet.name : null,
                        };
                    }
                    return item;
                });

                setTableData(updatedData);
                setEditData(null);
                setInputValues({
                    Name: '',
                    'Wallet Balance': '',
                });
            } else {
                // Handle creation case
                if (!inputValues['Wallet Balance']) {
                    alert('Wallet Balance is required');
                    return;
                }

                // Create Payload
                const createPayload = {
                    name: inputValues.Name,
                    wallet: {
                        _id: 'temp_wallet_id', // ID from wallet
                        name: inputValues['Wallet Balance']
                    }
                };

                const response = await axios.post('https://digistar-demo-be.vercel.app/api/categories', createPayload);

                setTableData([...tableData, {
                    _id: response.data.data._id,
                    Name: response.data.data.name,
                    wallet: response.data.data.wallet ? response.data.data.wallet.name : null,
                }]);
                setInputValues({
                    Name: '',
                    'Wallet Balance': '',
                });
                setEditData(null);
            }
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    const handleRemove = async (row: Record<string, any>) => {
        if (!window.confirm(`Are you sure you want to remove Category "${row.Name}"?`)) {
            return;
        }
        try {
            await axios.delete(`https://digistar-demo-be.vercel.app/api/categories/${row._id}`);
            const updatedData = tableData.filter((item) => item._id !== row._id);
            setTableData(updatedData);
        } catch (error) {
            console.error('Error removing data:', error);
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


    // Card Dashboard
    const totalTabungan = tableData.filter((item) => item['Wallet Balance'] === 'Tabungan').length;
    const totalHomeWallet = tableData.filter((item) => item['Wallet Balance'] === 'Home Wallet').length;

    return (
        <>
            <Head>
                <title>Category Page</title>
            </Head>
            <div className='px-40 py-28'>
                <h1 className="text-4xl font-bold mb-8 text-center text-white">Category Page 📃</h1>
                <LabeledInput
                    label="Name"
                    type="text"
                    placeholder="Enter Category Name"
                    value={editData ? editData.Name : inputValues.Name}
                    onChange={handleInputChange}
                    name="Name"
                />
                <LabeledInput
                    label="Wallet Balance"
                    type="text"
                    placeholder="Enter Wallet Balance"
                    value={editData ? editData.walletName : inputValues['Wallet Balance']}
                    onChange={handleInputChange}
                    name="Wallet Balance"
                />

                <div className='flex gap-5 mb-10'>
                    <Button color="bg-red-500 hover:bg-red-600 text-xl" onClick={() => { setEditData(null); setInputValues({ Name: '', 'Wallet Balance': '' }); }}>Cancel</Button>
                    <Button color="bg-blue-500 hover:bg-blue-600 text-xl" onClick={handleAdd}>{editData ? 'Update Data' : 'Add Data'}</Button>
                </div>
                {loading ? (
                    <p className='text-white text-3xl text-center mt-3'>⏳⏳⏳ Loading ⏳⏳⏳</p>
                ) : (
                    <>
                        <div className='w-full flex justify-center gap-5 mb-10'>
                            <Card title='Tabungan' description={`Total: ${totalTabungan}`} icon={<i className='bx bx-category'></i>} />
                            <Card title='Home Wallet' description={`Total: ${totalHomeWallet}`} icon={<i className='bx bx-category'></i>} />
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
