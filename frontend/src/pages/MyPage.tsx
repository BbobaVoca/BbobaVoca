import { useNavigate } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { savedUserState } from '../atom';
import { FaEdit } from 'react-icons/fa'; // Importing the edit icon from react-icons
import { useState, useEffect } from "react";
import { makeTimeline, getTimeline, updateProfile } from "../api/bbobavoca/bbobavocaAxios"; // 백엔드 API 호출 함수 import
import { profile } from "console";
import handleLogoutButton from "../components/MyInfoCard"
import { removeUserFromLocalStorage, saveUserToLocalStorage } from '../utils/localStorage';
import { user } from "../api/user/userAxios";
import { TimelineMessage } from "../interfaces/Interfaces";

const MyPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [userInfo, setUserInfo] = useRecoilState(savedUserState);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);
    const [message, setMessage] = useState(""); // State for the message input
    const [profile, setProfile] = useState<File | null>(null); // State for the profile file input
    const [timeline, setTimeline] = useState<TimelineMessage>(); // 타임라인 데이터 상태
    const [profileImage, setProfileImage] = useState(null);
    const [shouldFetchData, setShouldFetchData] = useState(false); // State to track data refresh

    const fetchData = async () => {
        if (token) {
            const response = await getTimeline(token);
            if (response && response.data) {
                setTimeline(response.data);
                console.log(timeline);
            }
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    useEffect(() => {
        if (shouldFetchData) {
            fetchData();
            setShouldFetchData(false);
        }
    }, [shouldFetchData]);

    const handleLogoutButton = () => {
        localStorage.removeItem('token');
        removeUserFromLocalStorage();
        setUserInfo(null);
        //props.onLogout();
    };


    const handlePopUpButtonClick = () => {
        setShowPopup(true);
    };

    const handlePopUpButtonClick2 = () => {
        // 타임라인 데이터 테스트
        if (timeline && timeline.vocas && timeline.vocas[0]) {
            console.log(timeline.vocas[0].voca.length);
            console.log(timeline.msg)
        }
        setShowPopup2(true);
    };

    // Function to handle closing the popup
    const handleClosePopup = () => {
        setShowPopup(false);
    };
    const handleClosePopup2 = () => {
        setShowPopup2(false);
    };
    // Function to handle submitting the message
    const handleSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (token) {
            console.log("백엔드 통신 시도중")
            // setIsLoading(true);
            const submitResult = await makeTimeline(token, message);
            if (submitResult) {
                // setIsLoading(false);
                setShouldFetchData(true);
            } else {
                console.error('makeVoca fail');
            }
            setShowPopup(false);
        }
        handleClosePopup();
    };


    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (token && profile) {
            console.log("백엔드 통신 시도중2")
            // setIsLoading(true);
            const babyName = userInfo?.babies?.name; // 아기 이름 추출
            const formData = new FormData();
            if (babyName != null) {
                formData.append('name', babyName)
            }
            formData.append('profile', profile)
            if (babyName != null) {
                const imageUpload = await updateProfile(token, formData);
                if (imageUpload) {
                    // setIsLoading(false);
                    const userInfoResult = await user(token);
                    if (userInfoResult?.data) {
                        setUserInfo(userInfoResult.data);
                        saveUserToLocalStorage(userInfoResult.data);
                        setShouldFetchData(true);
                    }
                } else {
                    console.error('Profile update failed');
                }
                setShowPopup2(false);
            }

        }
        handleClosePopup2();
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfile(e.target.files[0]);
        }
    };


    return (
        <div className='flex w-screen min-h-screen justify-center self-stretch bg-light-green'>
            <div className='flex flex-1 flex-col md:flex-row box-border items-center justify-start pt-20'>
                {/* Sidebar */}
                <div className='flex-none w-full md:w-1/4 max-w-md prose-lg mx-4 text-gray-700'>
                    <div className="fixed top-0 left-0 w-1/4 h-screen flex flex-col items-center bg-gray-50 rounded-lg p-6 justify-center shadow-lg">
                        <div className="flex items-center mb-4 justify-center">
                            <div className="text-center">
                                <div className="rounded-full overflow-hidden w-32 mx-auto">
                                    <img
                                        className="h-full w-full object-cover rounded-full"
                                        alt='profile'
                                        src={userInfo?.babies.profile}
                                    />
                                </div>
                                <h2 className="text-2xl font-semibold mt-6">뽑아보카</h2>
                                <button type="submit"
                                    onClick={handlePopUpButtonClick2}
                                    className="mt-20 px-4 py-2 bg-gray-50 text-black rounded border border-gray-50">프로필 수정</button>
                                <div>
                                    <div className="mt-5 border-b border-gray-300 w-full"></div>
                                    <div className="mb-5">
                                        <button className="mt-5 px-4 py-2 bg-gray-50 text-black rounded border border-gray-50">크레딧 충전하기</button>
                                    </div>
                                    <div className="mt-2 border-b border-gray-300 w-full"></div>
                                    <div className="mt-8">
                                        <button
                                            onClick={handleLogoutButton}
                                            className="mt-5 px-10 py-2 bg-green-500 text-white rounded-full font-semibold"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <div className='flex w-screen min-h-screen justify-center self-stretch bg-light-green'>
                    <div className='flex-1 flex-grow-4s self-start max-w-none prose-lg mx-4 text-gray-700'>
                        <div className="flex flex-col h-screen items-center rounded-lg p-6">


                            {/* {timeline && timeline.timelineMessages.length > 0 ? (
                                <div className='flex flex-col items-center mt-4'>
                                </div>
                            ) : ( */}
                            <div className="flex text-center mt-5 px-20 py-2 bg-main text-black rounded-xl flex md:w-3/4 items-center justify-between">
                                <div className="flex-1 text-center">
                                    <div>
                                        아직 메세지를 작성하지 않았어요. 내 아이를 위한 메세지를 남겨볼까요?
                                    </div>
                                    <button
                                        type="submit"
                                        onClick={handlePopUpButtonClick}
                                        className="ml-100 mt-5 px-4 py-2 bg-gray-50 text-black rounded border border-gray-300">
                                        작성하기
                                    </button>
                                </div>
                            </div>
                            {/* )
                            } */}




                            {/* Changed section starts here */}
                            <div className="flex items-center mt-10 w-full">
                                <h2 className="text-3xl font-semibold">단어 성장 일지</h2>
                                <button className="ml-2 px-2 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-300"
                                    onClick={handlePopUpButtonClick}>
                                    <FaEdit />
                                </button>
                            </div>
                            {/* Changed section ends here */}
                            <div className="mt-2 border-b border-gray-300 w-full"></div>
                            <div className="flex justify-center relative">
                                <img
                                    className="w-full mt-10 rounded-lg"
                                    src={`/img/mypagePic.png`}
                                    alt="뽑아보카 이미지"
                                />
                                <div className='absolute top-5 left-0 right-0 bottom-0 flex flex-col items-center p-4 overflow-auto'>
                                {/* <div className="bg-white p-4 rounded-full shadow-lg mt-8 mb-4 text-center">
    <h1 className='text-2xl font-bold text-black'>
        {userInfo?.babies?.name || '아기'}의 순간들
    </h1>
</div> */}
<span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-3xl font-uhbeezziba text-gray-600 ring-1 ring-inset ring-gray-500/10 mt-10">{userInfo?.babies?.name || '아기'}의 순간들</span>

                                    {/* 타임라인 메시지 렌더링 */}
                                    {/* {timeline && timeline.timelineMessages.length > 0 ? ( */}


                                    {/* 
                                    {timeline != null ? ( 
                                        <div className='flex flex-col items-center mt-4'>
                                            {timeline.timelineMessages.map((message, index) => (
                                                <div key={index} className='max-w-lg bg-white bg-opacity-80 rounded-lg p-4 mb-4'>
                                                    <div className='flex items-center mb-2'>
                                                        <img src={message.babies.profile} alt={message.babies.name} className='w-12 h-12 rounded-full object-cover mr-2' />
                                                        <div>
                                                            <h2 className='text-lg font-semibold'>{message.babies.name}</h2>
                                                            <p className='text-gray-600'>{message.msg}</p>
                                                        </div>
                                                    </div>
                                                    <div className='mt-2'>
                                                        {/* VocaData를 반복적으로 렌더링 */}
                                    {/* {Object.keys(message.vocas).map((key: string) => (
                                                            <div key={key} className='flex items-center mb-2'>
                                                                <span className='font-semibold mr-2'>{message.vocas[key as any].timestamp}</span>
                                                                <ul className='list-disc ml-4'>
                                                                    {message.vocas[key as any].voca.map((word: string, i: number) => (
                                                                        <li key={`${key}-${i}`}>{word}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='flex flex-col items-center justify-center bg-white bg-opacity-80 rounded-lg p-6 mt-40'>
                                            <p className='text-xl font-semibold text-gray-800 mb-2'>아직 생성된 단어가 없습니다!</p>
                                            <p className='text-lg text-gray-600'>단어를 생성해주세요</p>
                                        </div>
                                    )} */}

                                    {timeline != null ? (
                                        <div className='flex flex-col items-center mt-4'>

                                            <img
                                                className="w-40 h-40 object-cover rounded-full"
                                                alt="profile"
                                                src={timeline.babies.profile}
                                            />
                                            <span className="font-uhbeezziba items-center text-2xl mt-10">{timeline.msg}</span>


                                            <div className="mt-10 items-center">
                                                {/* <span className="font-uhbeezziba items-center text-2xl">{timeline.msg}</span> */}

                                                {timeline.vocas.map((vocaData, vocaIndex) => (
                                                    <div key={vocaIndex} className='flex items-center mb-2'>
                                                        <span className='font-uhbeezziba font-semibold mr-2'>{vocaData.timestamp}</span>
                                                        <span className="font-uhbeezziba">{vocaData.voca.join(', ')}</span>
                                                        <ul className='list-disc ml-4'>
                                                            {/* {vocaData.voca.map((word, wordIndex) => (
                                    <li key={`${vocaIndex}-${wordIndex}`}>{word}</li>
                                ))} */}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    ) : (
                                        <div className='flex flex-col items-center justify-center bg-white bg-opacity-80 rounded-lg p-6 mt-40'>
                                            <p className='text-xl font-semibold text-gray-800 mb-2'>아직 생성된 단어가 없습니다!</p>
                                            <p className='text-lg text-gray-600'>단어를 생성해주세요</p>
                                        </div>
                                    )}








                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </div>
            {/* Message popup */}

            {showPopup2 && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-60 flex items-center justify-center">
                    <div className="bg-white rounded-lg border-2 border-gray-300 p-6 w-96">
                        <h3 className="text-xl font-semibold mb-4">프로필 사진 업로드하기</h3>
                        <form onSubmit={handleImageUpload}>
                            <input
                                type="file"
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                onChange={handleProfileChange}
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded"
                                    onClick={handleClosePopup2}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                >
                                    전송
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-60 flex items-center justify-center">
                    <div className="bg-white rounded-lg border-2 border-gray-300 p-6 w-96">
                        <h3 className="text-xl font-semibold mb-4">메세지 작성하기</h3>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            placeholder="내 아이를 위한 메세지를 작성해주세요."
                            className="block w-full border border-gray-300 rounded-md p-2 mb-4 resize-none focus:outline-none focus:border-indigo-500"
                        />
                        <div className="flex justify-end">
                            <form onSubmit={handleSubmitMessage}>
                                <input type="text" value={message} onChange={handleInputChange} />
                                <div className="flex justify-end mt-4">
                                    <button onClick={handleClosePopup} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2">취소</button>
                                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">저장</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/* End of Message popup */}
        </div>
    );
};

export default MyPage;