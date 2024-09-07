import Image from "next/image";
import Card from "@/components/Card";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Dashboard HandsOn</title>
      </Head>
      <div className="min-h-screen flex flex-col justify-center items-center gap-10 relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-gradient-x">\
        <div className="flex items-center gap-3 mb-3 justify-center">
          <Image src={'/livin.png'} alt="Logo" width={300} height={100} className="w-full max-w-[100px]" />
          <Image src={'/digistar.png'} alt="Logo" width={700} height={10} className="w-full max-w-[300px]" />
          <Image src={'/Picture1.png'} alt="Logo" width={300} height={150} className="w-full max-w-[150px]" />

        </div>
        <h1 className="text-3xl font-bold text-center text-white relative z-10 animate-pulse">🔥 Welcome to Final HandsOn of Digistar Class 2024 🔥</h1>
        <div className="flex gap-8 relative z-10">
          <Card title="Category" description="Organize your categories" url="/category" icon={<i className='bx bx-category' ></i>} />
          <Card title="Wallet" description="Track your wallets" url="/wallet" icon={<i className='bx bx-wallet'></i>} />
          <Card title="Expense Item" description="View expenses" url="/expense-item" icon={<i className='bx bx-money'></i>} />
        </div>
        <div className="absolute inset-0 bg-gradient-radial from-black/5 to-transparent z-0 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-conic from-purple-900 via-indigo-900 to-blue-900 opacity-25 mix-blend-overlay z-0 pointer-events-none"></div>
      </div>
    </>
  );
}
