import InputForm from "../components/InputForm";
import { useEffect, useState } from "react";
import { AllVocaThemes } from "../interfaces/Interfaces";
import { getAllVocaTheme } from "../api/bbobavoca/bbobavocaAxios";
import HeroSection from "../components/HeroSection";
import VillageThemeCard from "../components/VillageThemeCard";

const VocaVillage = () => {
    const token = localStorage.getItem('token');

    const [loggedIn, setLoggedIn] = useState(false);
    const [showHeroSection, setShowHeroSection] = useState(true);
    const [searchAll, setSearchAll] = useState<string>("");
    const [themes, setThemes] = useState<AllVocaThemes>([]);
    const [filteredThemes, setFilteredThemes] = useState<AllVocaThemes>([]);

    const fetchCards = async () => {
        const cardResponse = await getAllVocaTheme();
        if (cardResponse && cardResponse.data) {
          setThemes(cardResponse.data);
          setFilteredThemes(cardResponse.data);
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
    }, [loggedIn, token]);

    useEffect(() => {
        const filtered = themes.filter(
            theme => 
                theme.category.toLowerCase().includes(searchAll.toLowerCase()) ||
                theme.description.toLowerCase().includes(searchAll.toLowerCase())
        );
        setFilteredThemes(filtered);
    }, [searchAll, themes]);

    return (
        <>
        {showHeroSection ? (
            <>
            <HeroSection />
            </>
        ) : (
            <div className='flex w-screen h-full justify-center self-stretch text-gray-700 bg-light-green'>
                <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
                    <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                        <div id="content-container" className='mx-auto md:w-[80%]'>
                            <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                                <p className='text-xl font-semibold ml-3'>단어마을</p>
                                <InputForm
                                    value={searchAll}
                                    onChange={(e) => setSearchAll(e.target.value)}
                                    placeholder="검색어를 입력해주세요"
                                />
                            </div>
                            {filteredThemes.length === 0 ? (
                                <div className="bg-gray-50 border border-gray-200 text-xs font-normal rounded-md mt-3 px-3 py-5 mx-3 text-center">단어 카드가 없습니다.</div>
                            ) : (
                                <div className='grid grid-cols-1 pt-2'>
                                    {filteredThemes.map((theme, index) => (
                                        <div key={index} className='flex flex-col w-full'>
                                            <VillageThemeCard
                                                category={theme.category}
                                                description={theme.description}
                                                color={theme.bgColor}
                                                nickname={theme.nickname}
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
    );
};

export default VocaVillage;