interface ButtonProps {
    color?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

export default function Button({ color = 'bg-blue-500', onClick, children }: ButtonProps) {
    const buttonClasses = `${color} text-white py-3 px-6 w-full rounded font-bold`;

    return (
        <button className={buttonClasses} onClick={onClick}>
            {children}
        </button>
    );
}
