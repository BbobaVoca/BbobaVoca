import React, { useState } from 'react';
import { MdDelete } from "react-icons/md";
import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { removeVocaTheme } from '../api/bbobavoca/bbobavocaAxios';
import { useNavigate } from 'react-router-dom';
import { ThemeCardProps } from '../interfaces/Interfaces';


const ThemeCard: React.FC<ThemeCardProps> = ({ category, description, color, onDelete }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); 
    const [openModal, setOpenModal] = useState(false);

    const handleDeleteFolder = async () => {
        if (token) {
            await removeVocaTheme(token, category, description);
            onDelete(category, description);
            setOpenModal(false);
        }
    };

    const handleCardClick = () => {
        navigate(`/${category}/${description}`);
    };
    
    return (
        <>
            <div className='flex flex-1 bg-white rounded-lg ml-1 mr-1 shadow-inner outline outline-1 outline-neutral-200 hover:outline-blue-500/50'>
                <figure className='relative w-full h-full flex flex-col cursor-pointer'>
                    <div className="relative">
                        <div className={`h-40 rounded-lg rounded-b-none object-cover w-full ${color}`}>
                            <div className="relative h-full flex justify-center items-center font-ownglyph text-6xl" onClick={handleCardClick}>
                                {category}
                            </div>
                            <div className="absolute top-2 right-2 flex">
                                <MdDelete className="text-white bg-black/50 rounded-full p-1 text-xl" onClick={() => setOpenModal(true)} />
                            </div>
                        </div>
                    </div>
                    <div className='pt-3 pb-3 pl-5 flex items-center' onClick={handleCardClick}>
                        {description}
                    </div>
                </figure>
            </div>
            {/* 삭제 Modal */}
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <div className='fixed top-20 left-0 w-full h-full bg-gray-500 bg-opacity-60'></div>
                    <div className='flex items-center justify-center fixed inset-0 opacity-100'>
                        <div className='z-10 bg-white rounded-lg border-solid  border-black-500 p-70 flex flex-col justify-center items-center'>
                            <Modal.Body>
                            <div className="text-center px-10">
                                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-black-200" />
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 shadow-3xl">
                                    해당 단어 카드를 삭제하시겠습니까?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button className="bg-gray-100 text-black w-20 hover:bg-main hover:text-white" onClick={handleDeleteFolder}>
                                        네
                                    </Button>
                                    <Button className="bg-gray-100 text-black w-20 hover:bg-main hover:text-white" onClick={() => setOpenModal(false)}>
                                        아니오
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default ThemeCard;