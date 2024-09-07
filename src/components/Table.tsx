import React from 'react';

interface TableProps {
    columns: string[];
    data: Record<string, any>[];
    onEdit: (row: Record<string, any>) => void;
    onRemove: (row: Record<string, any>) => void;
}

const Table: React.FC<TableProps> = ({ columns, data, onEdit, onRemove }) => {
    return (
        <div>
            <table className="w-full bg-gray-800 text-white shadow-lg">
                <thead className="bg-[#212529] border-b-2 border-white">
                    <tr>
                        <th className="p-4 text-left text-white bold">No</th>
                        {columns.map((column, index) => (
                            <th key={index} className=" px-6 py-3 text-left font-medium uppercase tracking-wider">{column}</th>
                        ))}
                        <th className="p-4 text-text-white bold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} className={`${i % 2 === 0 ? "bg-[#2C3034]" : "bg-gray-700"} hover:bg-gray-600`}>
                            <td className="p-4 text-white">{i + 1}</td>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="text-lg px-6 py-4 whitespace-nowrap">{row[column]}</td>
                            ))}
                            <td className='p-4 flex justify-center gap-1'>
                                <button
                                    onClick={() => onEdit(row)}
                                    className="text-lg px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onRemove(row)}
                                    className="text-lg px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
