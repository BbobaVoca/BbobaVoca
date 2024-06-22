import { useEffect, useRef, useState } from "react";
import HeroSection from "../components/HeroSection";
import { MakeVocaCard, VocaThemes } from "../interfaces/Interfaces";
import { getMyTheme, makeVocas } from "../api/bbobavoca/bbobavocaAxios";
import ThemeCard from "../components/ThemeCard";
import { Dropdown } from "flowbite-react";
import Loading from "../components/Loading";
import { useRecoilState } from "recoil";
import { savedUserState } from "../atom";


const Home = () => {
  const popupRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('token');

  const [loggedIn, setLoggedIn] = useState(false);
  const [showHeroSection, setShowHeroSection] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [themes, setThemes] = useState<VocaThemes>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [userInfo, setUserInfo] = useRecoilState(savedUserState);

  const [vocaForm, setVocaForm] = useState<MakeVocaCard>({
    category: "",
    description: "",
    age: 1,
    language: 0
  });

  const languageOptions = [
    { id: 0, label: "한국어만" },
    { id: 1, label: "한국어+영어" },
    { id: 2, label: "한국어+일본어" },
    { id: 3, label: "한국어+중국어" }
  ];

  const fetchCards = async () => {
    if (token) {
        const cardResponse = await getMyTheme(token);
        if (cardResponse && cardResponse.data) {
          setThemes(cardResponse.data);
          console.log(cardResponse.data);
        }
    }
  };

  const handlePopUpButtonClick = () => {
    setShowPopup(true);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setShowPopup(false);
      setVocaForm({
        category: "",
        description: "",
        age: 1,
        language: 0
      });
    }
  };

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
      fetchCards();
    } else {
      setLoggedIn(false);
    }

    if (loggedIn) {
      setShowHeroSection(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCards();
    }
  }, [themes]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVocaForm({ ...vocaForm, [name]: value });
  }

  const handleSelectAge = (age: number) => {
      setVocaForm(prev => ({
        ...prev,
        age: age
      }));
  };

  const handleLanguageSelect = (langId: number) => {
    setVocaForm(prevForm => ({
      ...prevForm,
      language: langId
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(token) {
      setShowPopup(false);
      const successRespose = await makeVocas(token, vocaForm.category, vocaForm.description, vocaForm.age, vocaForm.language);
      if (successRespose) {
        fetchCards();
      }
    }
  };

  const handleDeleteCard = (category: string, description: string) => {
    setThemes(prevThemes => prevThemes.filter(theme => theme.category !== category || theme.description !== description));
  };

  return (
    <>
    {showHeroSection ? (
        <>
        <HeroSection />
        </>
    ) : (
        <>
        {isLoading ? (
          <Loading />
        ) : (
          <div className='flex w-screen min-h-screen justify-center self-stretch bg-light-green'>
            <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
                <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 '>
                    <div id="content-container" className='mx-auto md:w-[80%]'>
                      <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                          <p className='text-xl font-semibold ml-3'>단어 카드 보기</p>
                          <button
                              type="submit"
                              onClick={handlePopUpButtonClick}
                              className="bg-main text-white text-xs font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer">
                              단어 만들기
                          </button>
                      </div>
                      {themes.length === 0 ? (
                          <div className="bg-gray-50 border border-gray-200 text-xs font-normal rounded-md mt-3 px-3 py-5 mx-3 text-center">단어 카드가 없습니다.</div>
                      ) : (
                          <div className='grid grid-cols-1 md:grid-cols-4 gap-1 pt-3'>
                              {themes.map((theme, index) => (
                                  <div key={index} className='flex flex-col w-full'>
                                      <ThemeCard
                                          category={theme.category}
                                          description={theme.description}
                                          color={theme.bgColor}
                                          nickname={userInfo? userInfo.nickname : ""}
                                          onDelete={handleDeleteCard}
                                      />
                                  </div>
                              ))}
                          </div>
                      )}
                    </div>
                </div>
            </div>
          </div>
        )}
        </>
    )}
    {showPopup && (
      <>
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-60 flex items-center justify-center">
          {/* 모달 백그라운드 */}
        </div>
        <div ref={popupRef} className={`mx-auto h-3/7 bg-white rounded-lg border-1 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center mt-4 z-1`} style={{ width: containerWidth }}>
          <div className='m-4'>
            <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
              <div className="p-10">
                <div className="relative mb-5">
                  <h1 className="font-semibold text-xl ml-1 mb-2">
                    테마<span className="ml-4 font-medium text-sm text-gray-500">{'예) 동물, 사물, 색깔, 과일 등'}</span>
                  </h1>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    placeholder='원하는 주제를 자유롭게 입력해주세요!'
                    value={vocaForm.category}
                    required
                    onChange={handleChange}
                    className="block w-2/5 rounded-md border-0 px-5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="relative mb-8">
                  <h1 className="font-semibold text-xl ml-1 mb-2">
                    추가 설명<span className="ml-4 font-medium text-sm text-gray-500">{'예) 여름에 피는 꽃, 다람쥐 닮은 동물 등'}</span>
                  </h1>
                  <input
                    id="description"
                    name="description"
                    type="text"
                    placeholder='더 구체적인 설명을 담고 싶으면 입력해주세요!'
                    value={vocaForm.description}
                    onChange={handleChange}
                    className="block w-3/5 rounded-md border-0 px-5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="relative mb-8">
                  <h1 className="flex items-center font-semibold text-xl ml-1 mb-2">
                    내 아이는 만으로
                    <span className="text-main ml-10 mr-2 z-10">
                    <Dropdown
                      label={vocaForm.age.toString()}
                      inline
                      name="age"
                    >
                      {[1, 2, 3, 4].map(age => (
                        <Dropdown.Item
                          key={age}
                          value={age}
                          onClick={() => handleSelectAge(age)}
                        >
                          {age}
                        </Dropdown.Item>
                      ))}
                    </Dropdown>
                    </span>
                    살이에요!
                  </h1>
                </div>
                <div className="relative mb-5">
                  <h1 className="font-semibold text-xl ml-1 mb-2">
                    언어 선택
                  </h1>
                  <div>
                    {languageOptions.map(option => (
                      <button
                        key={option.id}
                        type="button"
                        className={`text-m font-normal rounded-2xl py-3 px-7 mt-4 transition duration-200 ease-in-out cursor-pointer mr-3 ${
                          vocaForm.language === option.id ? 'bg-select-gray text-white' : 'bg-unselect-gray text-select-gray'
                        }`}
                        onClick={() => handleLanguageSelect(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button className={`w-full text-white text-m font-normal rounded-md py-3 mt-4 transition duration-200 ease-in-out cursor-pointer bg-main`}>
                단어 만들러가기
              </button>
            </form>
          </div>
        </div>
      </>
    )}
    </>
  );
};

export default Home;