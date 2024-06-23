import { getSpeech } from './getSpeech';

function VocaCard(props: {
    bgColor: string;
    kor: string;
    other: string;
    src: string;
    example: string;
}) {
    const handleClick = () => {
        getSpeech(props.kor);
    };
    const themeColor = props.bgColor;

    return (
        <div className={`flex flex-1 ${themeColor} rounded-3xl mx-2 mb-2 shadow-inner outline outline-1 outline-neutral-200`}>
            <figure className='relative w-full h-full flex flex-col cursor-pointer'>
                <div className='flex justify-between py-8 px-10'>
                    <div className='mt-10'>
                        <img
                            className="w-96 pl-12 pb-5"
                            src={props.src}
                            alt="vocaImage"
                        />
                    </div>
                    <div className={`relative rounded-xl object-cover w-full ${themeColor} flex flex-col items-center`}>
    <div className="relative flex justify-center items-center font-ownglyph text-6xl py-10">
        <p className='text-center'>
            {props.kor}
            <br />
            <span className='font-Maplestory text-2xl mt-3'>
                {props.other}
            </span>
        </p>
        <img
            className='w-8 h-8 ml-10 mt-2 cursor-pointer'
            src="/img/speaker.png"
            onClick={handleClick}
            alt="speaker"
        />
    </div>
    <p className='text-center pb-10 font-ownglyph text-3xl'>
        {props.example}
    </p>
</div>


                </div> 
            </figure>
        </div>
    );
}

export default VocaCard;