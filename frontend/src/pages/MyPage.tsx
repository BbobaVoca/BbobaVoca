import { useNavigate } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { savedUserState } from '../atom';
import { FaEdit, FaRegEdit } from 'react-icons/fa';
import { useState, useEffect } from "react";
import { makeTimeline, getTimeline, updateProfile } from "../api/bbobavoca/bbobavocaAxios";
import { removeUserFromLocalStorage, saveUserToLocalStorage } from '../utils/localStorage';
import { user } from "../api/user/userAxios";
import { TimelineMessage } from "../interfaces/Interfaces";
import { MdEdit } from "react-icons/md";

const MyPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [userInfo, setUserInfo] = useRecoilState(savedUserState);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);
    const [showMessage, setShowMessage] = useState(true);
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
                if (response.data.msg !== "") setShowMessage(false);
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
        navigate('/');
    };


    const handlePopUpButtonClick = () => {
        setShowPopup(true);
        setShowMessage(false);
    };

    const handlePopUpButtonClick2 = () => {
        // 타임라인 데이터 테스트
        if (timeline && timeline.vocas && timeline.vocas[0]) {
            console.log(timeline.vocas[0].voca.length);
            console.log(timeline.msg)
        }
        setShowPopup2(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleClosePopup2 = () => {
        setShowPopup2(false);
    };

    const handleCloseMessage = () => {
        setShowMessage(false);
    }

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
            // setIsLoading(true);
            const babyName = userInfo?.babies?.name;
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
                                <h2 className="text-2xl font-semibold mt-6">{userInfo?.babies.name}</h2>
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
                <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl justify-center items-center ml-20 pt-10 pb-20'>
                    <div className='flex-1 self-center max-w-none prose-lg text-gray-700'>
                        <div className="flex flex-col h-full rounded-lg p-6">
                            {showMessage && (
                                <div className="flex px-5 py-4 bg-green-400 text-white rounded-xl flex md:w-3/4 items-center justify-between">
                                    <div>
                                        <div className="text-start">
                                            아직 메세지를 작성하지 않았어요. 내 아이를 위한 메세지를 남겨볼까요?
                                        </div>
                                        <button
                                            type="submit"
                                            onClick={handlePopUpButtonClick}
                                            className="mt-5 px-5 py-2 text-sm bg-gray-50 text-black rounded border border-gray-300">
                                            작성하기
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Changed section starts here */}
                            <div className="flex mt-5 py-3 text-black flex md:w-3/4 border-b border-gray-300 mb-2">
                                <h2 className="text-xl font-semibold ml-2">단어 성장 일지</h2>
                                    <button className="px-2 py-1 text-gray-600"
                                        onClick={handlePopUpButtonClick}>
                                        <MdEdit />
                                    </button>
                            </div>
                            <div className="flex py-2 text-black flex md:w-3/4">
                                <div className="relative w-full">
                                    <img
                                        className="w-full rounded-lg"
                                        src={`/img/mypagePic.png`}
                                        alt="myPage"
                                    />
                                    <div className='absolute inset-0 flex flex-col items-center justify-center p-4 overflow-auto'>
                                        <span className="inline-flex mb-7 items-center rounded-3xl bg-gray-50 px-7 py-3 text-3xl font-ownglyph text-gray-600 ring-1 ring-inset ring-gray-500/10 mt-10 lg:text-4xl lg:px-10 lg:py-5">
                                            {userInfo?.babies?.name || '내 아이'}의 순간들
                                        </span>
                                        {timeline != null ? (
                                            <div className='flex flex-col items-center mt-4'>
                                                <img
                                                    className="w-40 h-40 object-cover rounded-full lg:w-60 lg:h-60"
                                                    alt="profile"
                                                    src={timeline.babies.profile}
                                                />
                                                <span className="font-uhbeezziba items-center text-2xl mt-10 mb-10 lg:text-4xl">{timeline.msg}</span>
                                                <div className="mt-10 items-center">
                                                    {timeline.vocas.map((vocaData, vocaIndex) => (
                                                        <div key={vocaIndex} className='flex items-center mb-2'>
                                                            <span className='font-uhbeezziba font-semibold mr-2 text-lg lg:text-2xl'>{vocaData.timestamp}</span>
                                                            <span className="font-uhbeezziba text-lg lg:text-2xl">{vocaData.voca.join(', ')}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='flex flex-col items-center justify-center bg-white bg-opacity-80 rounded-lg p-6 mt-40'>
                                                <p className='text-xl font-semibold text-gray-800 mb-2 lg:text-3xl'>아직 생성된 단어가 없습니다!</p>
                                                <p className='text-lg text-gray-600 lg:text-2xl'>단어를 생성해주세요</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Changed section ends here */}
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
                                <div className="flex justify-end mt-4">
                                    <button onClick={handleClosePopup} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2">취소</button>
                                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">저장</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPage;