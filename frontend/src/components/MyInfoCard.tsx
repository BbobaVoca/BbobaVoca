import { useRecoilState } from 'recoil';
import { savedUserState } from '../atom';
import { removeUserFromLocalStorage } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';

function MyInfoCard(props: {
    onLogout: () => void;
    onClose: () => void;
}) {
    const [userInfo, setUserInfo] = useRecoilState(savedUserState);
    const navigate = useNavigate();

    const handleLogoutButton = () => {
        localStorage.removeItem('token');
        removeUserFromLocalStorage();
        setUserInfo(null);
        props.onLogout();
    };

    const handleMyPageButton = () => {
        navigate("/mypage");
        props.onClose();
    }


    return (
        <div className={`right-0 top-0 mt-24 mr-10 fixed bg-white rounded-lg ml-2 mr-2 shadow-inner outline outline-1 outline-neutral-200 z-10`}>
            <figure className='relative w-full h-full flex flex-col'>
                <div className={`relative rounded-xl object-cover w-full bg-white py-5`}>
                    <p className="relative text-lg font-semibold pl-7">내 정보</p>
                    <div className='flex justify-between mt-4 pl-7'>
                        <div className="rounded-full overflow-hidden w-32">
                            <img
                                className="h-full w-full object-cover rounded-full"
                                alt='profile'
                                src={userInfo?.babies.profile}
                            />
                        </div>
                        <div className='relative ml-8 leading-7 mr-10'>
                            <p className='font-semibold text-xl mt-1'>{userInfo?.nickname}</p>
                            <p>나의 보물 <span className='font-semibold'>{userInfo?.babies.name}</span></p>
                                <div className='flex'>
                                                <img
                                    className="w-6 h-6 mr-1"
                                    alt='credit'
                                    src="img/credit.png"
                                />
                                <p>{userInfo?.credit}</p>
                            </div>
                            <button
                                type="submit"
                                className="bg-main flex items-center mt-2 text-white text-xs font-normal rounded-md py-2 px-10 transition duration-200 ease-in-out cursor-pointer hover:bg-green-600"
                                // onClick={}
                                >
                                충전하기
                            </button>
                        </div>
                    </div>
                    <div className='w-full border-t mt-8 cursor-pointer' onClick={handleMyPageButton}>
                        <p className='font-semibold text-gray-700 pt-5 pl-5'>아이 단어 성장일지</p>
                    </div>
                    <div className='w-full border-t mt-5 cursor-pointer' onClick={handleLogoutButton}>
                        <p className='font-semibold text-gray-700 pt-5 pl-5'>로그아웃</p>
                    </div>
                </div>
            </figure>
        </div>
    );
}

export default MyInfoCard;