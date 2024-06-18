import { useEffect, useRef, useState } from "react";
import HeroSection from "../components/HeroSection";
import { VocaThemes } from "../interfaces/Interfaces";
import { getMyTheme } from "../api/bbobavoca/bbobavocaAxios";
import ThemeCard from "../components/ThemeCard";
import { pastelColors } from "../styles/pasterColors";


const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showHeroSection, setShowHeroSection] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [themes, setThemes] = useState<VocaThemes>([{ category: "과일", description: "test111" }, { category: "동물", description: "test222" }, { category: "애니메이션", description: "test333" }, { category: "감정", description: "test444" }]);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const popupRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('token');

  const fetchCards = async () => {
    if (token) {
        const cardResponse = await getMyTheme(token);
        if (cardResponse && cardResponse.data) {
            const cardsArray = cardResponse.data;

            if (Array.isArray(cardsArray)) {
                const updatedCards = cardsArray.map(card => {
                    return { category: card.category, description: card.description };
                });
                setThemes(updatedCards);
            } else {
                console.error('cardsArray is not an array:', cardsArray);
            }
        }
    }
  };

  const handlePopUpButtonClick = () => {
    setShowPopup(true);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
      fetchCards();
    } else {
      setLoggedIn(false);
      // setThemes([]);
    }

    if (loggedIn) {
      setShowHeroSection(false);
    }
  }, [loggedIn, token]);

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

  return (
    <>
    {showHeroSection ? (
        <>
        <HeroSection />
        </>
    ) : (
        <>
        <div className='flex w-screen h-screen justify-center self-stretch bg-light-green'>
          <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
              <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 '>
                  <div id="content-container" className='mx-auto md:w-[80%]'>
                    <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                        <p className='text-xl font-PretendardVariable font-semibold ml-3'>단어 카드 보기</p>
                        <button
                            type="submit"
                            onClick={handlePopUpButtonClick}
                            className="bg-main text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer">
                            단어 만들기
                        </button>
                    </div>
                    {themes.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-200 text-xs font-PretendardVariable font-normal rounded-md mt-3 px-3 py-5 mx-3 text-center">단어 카드가 없습니다.</div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-1 pt-5'>
                            {themes.map((theme, index) => (
                                <div key={index} className='flex flex-col w-full'>
                                    <ThemeCard
                                        category={theme.category}
                                        description={theme.description}
                                        color={pastelColors[Math.floor(Math.random() * pastelColors.length)]}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                  </div>
              </div>
          </div>
        </div>
        </>
    )}
    {showPopup && (
      <>
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-60 flex items-center justify-center">
          {/* 모달 백그라운드 */}
        </div>
        <div ref={popupRef} className={`mx-auto h-3/7 bg-white rounded-lg border-1 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center mt-4 z-1`} style={{ width: containerWidth }}>
          <div className='m-4'>
            <div className={`bg-white rounded-lg p-70 flex flex-col justify-start items-start`}>
              test
            </div>
            <button className={`w-full text-white text-xs font-PretendardVariable font-normal rounded-md py-3 mt-4 transition duration-200 ease-in-out cursor-pointer bg-main`}>
              단어 만들러가기
            </button>
          </div>
        </div>
      </>
    )}
    </>
  );
};

export default Home;