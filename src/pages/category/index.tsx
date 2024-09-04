import React from 'react';
import Table from '@/components/Table';

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

const Page = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Category Page</h1>
            <Table columns={columns} data={data} onEdit={handleEdit} onRemove={handleRemove} />
        </div>
    );
};

export default Page;
