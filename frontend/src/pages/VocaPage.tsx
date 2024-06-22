import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdPrint } from 'react-icons/md';
import { FormEvent, useEffect, useState } from "react";
import { VocaThemeCard } from "../interfaces/Interfaces";
import VocaNameCard from "../components/VocaNameCard";
import { getMyVocaCards } from "../api/bbobavoca/bbobavocaAxios";
import VocaCard from "../components/VocaCard";
import { HiArrowLeft } from "react-icons/hi";
import { vocaCardsInfoState } from "../atom";
import { useRecoilState } from "recoil";
import PrintSection from "../components/PrintSection";
import Loading from "../components/Loading";

const VocaPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const { category } = useParams() as { category : string };
    const { description } = useParams() as { description : string };
    const { nickname } = useParams() as { nickname: string };
    const [saveVocaCards, setSaveVocaCards] = useRecoilState(vocaCardsInfoState);
    const [vocaCards, setVocaCards] = useState<VocaThemeCard>();
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
    const [selectedCardInfo, setSelectedCardInfo] = useState(vocaCards?.cards[0]);

    const themeInfo = {
        category: category,
        description: description
    }

    const handleCardClick = (index: number) => {
        setSelectedCardIndex(index);
        setSelectedCardInfo(vocaCards?.cards[index]);
    };

    const handlePrintButtonClick = () => {
        setShowPopup(true);
    };

    const fetchVocaCards = async () => {
        if (token) {
            const cardResponse = await getMyVocaCards(token, themeInfo.category, themeInfo.description);
            if (cardResponse && cardResponse.data) {
                setVocaCards(cardResponse.data);
                setSaveVocaCards(cardResponse.data);
                if (!selectedCardInfo) setSelectedCardInfo(cardResponse.data.cards[0]);
            }
        }
    };

    useEffect(() => {
        if (token) {
          fetchVocaCards();
        }
      }, [token, vocaCards]);

    useEffect(() => {
        const updateContainerWidth = () => {
          const contentContainer = document.getElementById('content-container');
          if (contentContainer) {
            const width = contentContainer.offsetWidth;
            setContainerWidth(width);
          }
        };
    
        updateContainerWidth();
        window.addEventListener('resize', updateContainerWidth);
    
        return () => {
          window.removeEventListener('resize', updateContainerWidth);
        };
    }, []);

    function moveBackPage(e: FormEvent): void {
        navigate('/');
    }

    return (
        <>
        {vocaCards && selectedCardInfo ? (
            <>
            <div className='flex w-screen min-h-screen justify-center self-stretch text-gray-700 bg-light-green'>
                <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
                    <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                        <div id="content-container" className='mx-auto md:w-[80%]'>
                            <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                                <p className='flex text-xl font-bold ml-3 items-center'>
                                    <HiArrowLeft className="mr-4 cursor-pointer" onClick={moveBackPage}/>
                                    {themeInfo.category}
                                    <span className="px-3 font-light">|</span>
                                    <span className="font-medium">{themeInfo.description}</span>
                                </p>
                                <div className='flex items-center mr-3'>
                                    <button
                                    type="submit"
                                    className="bg-main flex items-center text-white text-sm font-normal rounded-md py-2 px-5 transition duration-200 ease-in-out cursor-pointer hover:bg-green-600"
                                    onClick={handlePrintButtonClick}
                                    >
                                        <MdPrint className="mr-1" />
                                        프린트
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="flex justify-between mx-3 mb-3">
                                    <button
                                        className="text-gray-600 py-1 px-3 font-medium"
                                        onClick={() => handleCardClick((selectedCardIndex - 1 + vocaCards.cards.length) % vocaCards.cards.length)}
                                    >
                                        <img
                                            src="/img/left-arrow.png"
                                        />
                                    </button>
                                    <VocaCard
                                        bgColor={vocaCards.bgColor}
                                        kor={selectedCardInfo.kor}
                                        other={selectedCardInfo.other}
                                        src={selectedCardInfo.src}
                                        example={selectedCardInfo.example}
                                    />
                                    <button
                                        className="text-gray-600 py-1 px-3 font-medium"
                                        onClick={() => handleCardClick((selectedCardIndex + 1) % vocaCards.cards.length)}
                                    >
                                        <img
                                            src="/img/right-arrow.png"
                                        />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-3 mr-3 mt-5 mb-5">
                                    {/* 단어 카드 반환한 거 띄우는 위치 */}
                                    {vocaCards.cards.map((card, index) => (
                                        <div key={index} className="flex flex-col w-full pb-1">
                                            <VocaNameCard
                                                kor={card.kor}
                                                onClick={() => handleCardClick(index)}
                                                isSelected={index === selectedCardIndex}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showPopup && (
                <>
                    <PrintSection
                        width={containerWidth}
                        category={vocaCards.category}
                        description={vocaCards.description}
                        nickname={nickname}
                        onClose={() => setShowPopup(false)}
                    />
                </>
                )}
            </div>
            </>
        ) : (
            <>
            <Loading />
            </>
        )}
        
        </>
    );
};

export default VocaPage;