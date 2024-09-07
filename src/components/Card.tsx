"use client";

import Link from "next/link";
import React from 'react';

interface CardProps {
    title: string;
    description: string | React.ReactNode;
    icon: any;
    url?: string;
}

export default function Card({ title, description, url, icon }: CardProps) {
    const content = (
        <div className="flex items-center border border-gray-200 rounded-lg p-5 gap-5 transition-transform transform hover:scale-105 hover:shadow-lg hover:border-blue-300">
            <p className="flex justify-center items-center text-3xl bg-blue-200 p-3 text-blue-500 rounded group-hover:bg-blue-300 group-hover:text-blue-700">
                {icon}
            </p>
            <div className="flex flex-col">
                <h3 className="text-xl text-blue-600 group-hover:text-blue-700 font-bold">{title}</h3>
                <div className="mt-1 text-lg text-blue-300 group-hover:text-blue-400">
                    {description}
                </div>
            </div>
        </div>
    );

    return url ? (
        <Link href={url} className="group">
            {content}
        </Link>
    ) : (
        <div className="group">
            {content}
        </div>
    );
}
