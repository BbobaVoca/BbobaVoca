import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdPrint } from 'react-icons/md';
import { FormEvent, useEffect, useRef, useState } from "react";
import { VocaThemeCard } from "../interfaces/Interfaces";
import VocaNameCard from "../components/VocaNameCard";
import { getMyVocaCards } from "../api/bbobavoca/bbobavocaAxios";
import VocaCard from "../components/VocaCard";
import { HiArrowLeft } from "react-icons/hi";

const VocaPage = () => {
    const navigate = useNavigate();
    const popupRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem('token');

    const { category } = useParams() as { category : string };
    const { description } = useParams() as { description : string };
    const [vocaCards, setVocaCards] = useState<VocaThemeCard>({
        category: "test",
        description: "test111",
        bgColor: "bg-pink-100",
        cards: [
            {
                src: "/img/test.png",
                kor: "사과",
                other: "Apple",
                example: "사과는 아삭아삭"
            },
            {
                src: "/img/test.png",
                kor: "바나나",
                other: "Banana",
                example: "바나나는 기다래"
            },
            {
                src: "/img/test.png",
                kor: "멜론",
                other: "Banana",
                example: "바나나는 기다래"
            },
            {
                src: "/img/test.png",
                kor: "수박",
                other: "Banana",
                example: "바나나는 기다래"
            },
            {
                src: "/img/test.png",
                kor: "파인애플",
                other: "Banana",
                example: "바나나는 기다래"
            },
            {
                src: "/img/test.png",
                kor: "자두",
                other: "Banana",
                example: "바나나는 기다래"
            },
            {
                src: "/img/test.png",
                kor: "복숭아",
                other: "Banana",
                example: "바나나는 기다래"
            },
            {
                src: "/img/test.png",
                kor: "참외",
                other: "Banana",
                example: "바나나는 기다래"
            },
        ]   
    });
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
    const [selectedCardInfo, setSelectedCardInfo] = useState(vocaCards.cards[0]);

    const themeInfo = {
        category: category,
        description: description
    }

    const handleCardClick = (index: number) => {
        setSelectedCardIndex(index);
        setSelectedCardInfo(vocaCards.cards[index]);
    };

    const handlePrintButtonClick = () => {
        setShowPopup(true);
    };

    const fetchVocaCards = async () => {
        if (token) {
            const cardResponse = await getMyVocaCards(token, themeInfo);
            if (cardResponse && cardResponse.data) {
                setVocaCards(cardResponse.data);
            }
        }
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setShowPopup(false);
        }
    };

    useEffect(() => {
        if (token) {
          fetchVocaCards();
        }
      }, [token]);

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
        // 팝업창 닫기 이벤트
        document.addEventListener('mousedown', handleOutsideClick);
    
        return () => {
          window.removeEventListener('resize', updateContainerWidth);
          document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    function moveBackPage(e: FormEvent): void {
        navigate('/');
    }

    return (
        <>
        <div className='flex w-screen h-screen justify-center self-stretch text-gray-700 bg-light-green'>
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
        </div>

        {showPopup && (
            <>
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-60 flex items-center justify-center">
                {/* 모달 백그라운드 */}
                <div ref={popupRef} className={`mx-auto h-3/7 bg-white rounded-lg border-1 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center mt-4 z-1`} style={{ width: containerWidth }}>
                    <div className='m-4'>
                        TEST        
                    </div>
                </div>
                </div>
            </>
        )}
        </>
    );
};

export default VocaPage;