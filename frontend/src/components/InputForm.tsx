import React from 'react';

interface InputFormProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const InputForm: React.FC<InputFormProps> = ({ value, onChange, placeholder }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="bg-gray-100 border border-gray-300 text-xs font-PretendardVariable font-normal rounded-md px-3 py-2 mr-3"
        />
    );
};

export default InputForm;