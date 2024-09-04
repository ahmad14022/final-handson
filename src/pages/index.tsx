import Image from "next/image";
import { Inter } from "next/font/google";
import Card from "@/components/Card";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Dashboard HandsOn</title>
      </Head>
      <div className="min-h-screen flex flex-col justify-center items-center gap-10 relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-gradient-x">
        <Image src={'/logo-telkom.png'} alt="Logo" width={300} height={300} />
        <h1 className="text-3xl font-bold text-center text-white relative z-10 animate-pulse">🔥 Welcome to Final HandsOn of Digistar Class 2024 🔥</h1>
        <div className="flex gap-8 relative z-10">
          <Card title="Category" description="Manage your crypto assets" url="/category" icon={<i className='bx bx-category' ></i>} />
          <Card title="Wallet" description="Manage your crypto assets" url="/wallet" icon={<i className='bx bx-wallet'></i>} />
          <Card title="Expense Item" description="Manage your crypto assets" url="/expense-item" icon={<i className='bx bx-money'></i>} />
        </div>
        <div className="absolute inset-0 bg-gradient-radial from-black/5 to-transparent z-0 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-conic from-purple-900 via-indigo-900 to-blue-900 opacity-25 mix-blend-overlay z-0 pointer-events-none"></div>
      </div>
    </>
  );
}
