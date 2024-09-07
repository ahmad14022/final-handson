interface LabeledInputProps {
    label: string;
    type: string;
    placeholder: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
}

export default function LabeledInput({ label, type, placeholder, value, onChange, name }: LabeledInputProps) {
    return (
        <div className="mb-7">
            <label className="text-lg text-blue-300 mb-2 block">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="bg-transparent w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-white"
                name={name}
            />
        </div>
    );
}
