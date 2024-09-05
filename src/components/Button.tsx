interface ButtonProps {
    color?: string; // warna button (optional)
    onClick?: () => void; // function yang akan dipanggil saat button diklik
    children: React.ReactNode; // isi button
}

export default function Button({ color = 'bg-blue-500', onClick, children }: ButtonProps) {
    const buttonClasses = `${color} text-white py-3 px-6 w-full rounded font-bold`;

    return (
        <button className={buttonClasses} onClick={onClick}>
            {children}
        </button>
    );
}
