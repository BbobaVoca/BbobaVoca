import { useNavigate } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { savedUserState } from '../atom';
import { FaEdit } from 'react-icons/fa'; // Importing the edit icon from react-icons
import { useState } from "react";
import { makeTimeline } from "../api/bbobavoca/bbobavocaAxios"; // 백엔드 API 호출 함수 import

const MyPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [userInfo, setUserInfo] = useRecoilState(savedUserState);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState(""); // State for the message input

    const handlePopUpButtonClick = () => {
        setShowPopup(true);
    };

    // Function to handle closing the popup
    const handleClosePopup = () => {
        setShowPopup(false);
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

    return (
        <div className='flex w-screen h-screen justify-center self-stretch text-gray-700 bg-light-green'>
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
                                <h2 className="text-2xl font-semibold mt-4">뽑아보카</h2>
                                <button className="mt-20 px-4 py-2 bg-gray-50 text-black rounded border border-gray-50">프로필 수정</button>
                                <div>
                                    <div className="mt-5 border-b border-gray-300 w-full"></div>
                                    <div className="mb-5">
                                        <button className="mt-5 px-4 py-2 bg-gray-50 text-black rounded border border-gray-50">크레딧 충전하기</button>
                                    </div>
                                    <div className="mt-2 border-b border-gray-300 w-full"></div>
                                    <div className="mt-30">
                                        <button className="mt-20 px-10 py-2 bg-green-500 text-white rounded-full font-semibold">로그아웃</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                    <div className="flex flex-col items-center rounded-lg p-6 shadow-lg">
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
                        {/* Changed section starts here */}
                        <div className="flex items-center mt-10 w-full">
                            <h2 className="text-2xl font-semibold">단어 성장 일지</h2>
                            <button className="ml-2 px-2 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-300"
                                onClick={handlePopUpButtonClick}>
                                <FaEdit />
                            </button>
                        </div>
                        {/* Changed section ends here */}
                        <div className="mt-2 border-b border-gray-300 w-full"></div>

                        {/* Timeline content will go here */}
                    </div>
                </div>
            </div>
            {/* Message popup */}
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