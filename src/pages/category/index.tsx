import React from 'react';
import Table from '@/components/Table';
import Button from '@/components/Button';
import LabeledInput from '@/components/LabeledInput'; // Import komponen baru

const columns = ['Name', 'Email', 'Role'];
const data = [
    { Name: 'John Doe', Email: 'john@example.com', Role: 'Admin' },
    { Name: 'Jane Doe', Email: 'jane@example.com', Role: 'User' },
    // tambahkan data lainnya
];

const handleEdit = (row: Record<string, any>) => {
    console.log('Edit row', row);
};

const handleRemove = (row: Record<string, any>) => {
    console.log('Remove row', row);
};

const handleAdd = () => {
    console.log('Add Data');
};

const Page = () => {
    return (
        <div className='px-40 py-28'>
            <h1 className="text-4xl font-bold mb-8 text-center text-white">Category Page 📃</h1>
            <LabeledInput label="Add Category" type="text" placeholder="Enter Category Name" />
            <LabeledInput label="Edit Category" type="text" placeholder="Edit Category Name" />
            <LabeledInput label="Delete Category" type="text" placeholder="Delete Category Name" />
            <div className='flex gap-5 mb-16'>
                <Button color="bg-red-500" onClick={() => console.log('Danger Action')}>Cancel</Button>
                <Button color="bg-blue-500" onClick={handleAdd}>Add Data</Button>
            </div>
            <Table columns={columns} data={data} onEdit={handleEdit} onRemove={handleRemove} />
        </div>
    );
};

export default Page;
