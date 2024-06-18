import React, { useState, useEffect } from "react";
import { Button, Navbar } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { savedUserState } from "../atom";
import { getUserFromLocalStorage, saveUserToLocalStorage, removeUserFromLocalStorage } from "../utils/localStorage";
import { user } from "../api/user/userAxios";


const theme = {
  active: {
    on: "text-black font-semibold dark:text-white md:bg-transparent md:text-black",
    off: "border-b border-gray-100 text-gray-500 font-semibold dark:border-gray-700 dark:text-gray-400 md:border-0 md:hover:bg-transparent dark:hover:text-white md:hover:text-black md:dark:hover:text-white",
  },
};

function Navbars() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useRecoilState(savedUserState);

  const token = localStorage.getItem('token');

  const handleLoginButtonClick = () => {
    if (loggedIn) {
      // 내 정보창 생기기
      // 새로 만드는 내 정보창 로그아웃에 해당 내용 넣기
      // localStorage.removeItem('token');
      // removeUserFromLocalStorage();
      // setUserInfo(null);
      // setLoggedIn(false);
    } else {
      navigate("/login");
    }
  };

  const getUserInfo = async () => {
    if (token && !userInfo) {
      const userInfoResult = await user(token);
      if (userInfoResult?.data) {
        setUserInfo(userInfoResult.data);
        saveUserToLocalStorage(userInfoResult.data);
      }
    }
  }

  useEffect(() => {
    setActiveLink(location.pathname);
    const storedUser = getUserFromLocalStorage();
    if (token) {
      setLoggedIn(true);
      if (storedUser) {
        setUserInfo(storedUser);
      } else {
        getUserInfo();
      }
    } else {
      setLoggedIn(false);
    }
  }, [location.pathname, token]);

  const getButtonStyle = (path: string) => {
    return path === activeLink ? theme.active.on : theme.active.off;
  };

  return (
    <Navbar border fluid className="fixed left-0 right-0 top-0 z-50 py-5">
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap font-uhbeezziba text-main text-3xl ml-12 dark:text-white">
          뽑아보카
        </span>
      </Navbar.Brand>
      <div className="flex items-center mr-auto gap-x-14 ml-28 list-none">
        <Navbar.Link theme={theme} href="/" className={getButtonStyle("/")}>
          단어보기
        </Navbar.Link>
        <Navbar.Link theme={theme} href="/voca-village" className={getButtonStyle("/voca-village")}>
          단어마을
        </Navbar.Link>
      </div>
      <div className="flex items-center ml-auto gap-x-4 mr-8 list-none">
        {loggedIn ? (
          <div className="flex items-center list-none">
            <div className="flex w-full">
              <img
                  className="w-6 mr-1"
                  alt='credit'
                  src="img/credit.png"
              />
              <p>{userInfo?.credit}</p>
            </div>
            <div className="rounded-full overflow-hidden w-24">
              <img
                  className="h-full w-full object-cover rounded-full"
                  alt='profile'
                  src={userInfo?.baby[0].profile}
              />
            </div>
            <div className='flex w-full ml-3 tracking-wide'>
              <p className="font-semibold text-black">{userInfo?.nickname}
                <span className='font-medium'>님</span>
              </p>
            </div>     
          </div>
        ) : (
          <Button color="light" className={`font-semibold hover:bg-green-600 rounded-3xl px-5 mr-2 bg-main text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent ${activeLink === 'login' ? 'active' : ''}`} onClick={handleLoginButtonClick}>
            로그인
          </Button>
        )}
      </div>
    </Navbar>
  );
}

export default Navbars;