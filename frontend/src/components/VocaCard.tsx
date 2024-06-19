import React, { useState } from 'react';

function VocaCard(props: {
    bgColor: string;
    kor: string;
    other: string;
    src: string;
    example: string;
}) {
    return (
        <div className={`flex flex-1 ${props.bgColor} rounded-3xl mx-2 mb-2 shadow-inner outline outline-1 outline-neutral-200`}>
            <figure className='relative w-full h-full flex flex-col cursor-pointer'>
                <div className='flex justify-between py-8 px-20'>
                    <div className='mt-10'>
                        <img
                        className="w-96 pl-12 pb-5"
                        src={props.src}
                        alt="vocaImage"
                        />
                    </div>
                    <div className={`relative rounded-xl object-cover w-full ${props.bgColor}}`}>
                        <div className="relative flex justify-center items-center font-ownglyph text-6xl py-10">
                            <p>
                                {props.kor}
                                <span className='font-Maplestory text-3xl ml-4'>{props.other}</span>
                            </p>
                        </div>
                        <p className='relative flex justify-center pb-10 font-ownglyph text-4xl'>
                            {props.example}
                        </p>
                    </div>
                </div> 
            </figure>
        </div>
    );
}

export default VocaCard;