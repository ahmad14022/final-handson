"use client";

import Link from "next/link";

interface CardProps {
    title: string;
    description: string;
    icon: any;
    url: string;
}

export default function Card({ title, description, url, icon }: CardProps) {
    return (
        <Link href={url} className="group">
            <div className="flex items-center border border-gray-200 w-full rounded-lg p-5 gap-5 transition-transform transform hover:scale-105 hover:shadow-lg hover:border-blue-300">
                <div>
                    <p className="text-3xl bg-blue-200 p-2 text-blue-500 rounded group-hover:bg-blue-300 group-hover:text-blue-700">
                        {icon}
                    </p>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-xl text-blue-600 group-hover:text-blue-700 font-medium">{title}</h3>
                    <p className="mt-1 text-lg font-semibold text-blue-300 group-hover:text-blue-400">{description}</p>
                </div>
            </div>
        </Link>
    )
}
