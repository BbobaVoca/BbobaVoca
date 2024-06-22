import React, { useState } from 'react';
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { ThemeAllCardProps } from '../interfaces/Interfaces';


const VillageThemeCard: React.FC<ThemeAllCardProps> = ({ category, description, color, nickname }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); 

    const handleCardClick = () => {
        navigate(`/${category}/${description}`);
    };
    
    return (
        <>
            <div className='flex flex-1 bg-white rounded-lg ml-1 mr-1 shadow-inner outline outline-1 outline-neutral-200 hover:outline-blue-500/50 mb-2'>
                <figure className='relative w-full h-full flex flex-col cursor-pointer'>
                    <div className="flex">
                        <div className={`flex rounded-lg rounded-b-none object-cover w-full`}>
                            <div className={`flex h-full w-24 flex justify-center items-center p-4 text-lg font-semibold ${color}`} onClick={handleCardClick}>
                                {category}
                            </div>
                            <div className='py-3 pl-5 flex items-center' onClick={handleCardClick}>
                                {description}
                            </div>
                            <div className='py-3 pl-5 ml-auto mr-5 flex items-center' onClick={handleCardClick}>
                                <p className='mr-5 font-light'>|</p>
                                <p className='mr-1 text-sm'>by</p>
                                <p className='text-main text-sm font-semibold'>{nickname}</p>
                            </div>
                        </div>
                    </div>
                    
                </figure>
            </div>
        </>
    );
}

export default VillageThemeCard;