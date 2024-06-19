import React, { useState } from 'react';

function VocaNameCard(props: {
    kor: string;
    onClick: () => void;
    isSelected: boolean;
}) {
    return (
        <div className={`flex flex-1 bg-${props.isSelected ? 'main' : 'white'} rounded-lg ml-2 mr-2 shadow-inner outline outline-1 outline-neutral-200`} onClick={props.onClick}>
            <figure className='relative w-full h-full flex flex-col cursor-pointer'>
                <div className={`relative rounded-xl object-cover w-full bg-${props.isSelected ? 'main' : 'white'} ${props.isSelected && 'text-white'}`}>
                    <div className="relative flex justify-center items-center font-ownglyph text-5xl py-4">
                        {props.kor}
                    </div>
                </div>
            </figure>
        </div>
    );
}

export default VocaNameCard;