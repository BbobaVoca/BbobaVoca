import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkEmail, checkNickname, register } from '../api/user/userAxios';


const Register = () => {
  const [signupForm, setSignupForm] = useState({
    email: "",
    nickname: "",
    password: "",
    checkedPassword: "",
    name: ""
  });

  // 오류 메세지
  const [validMessage, setValidMessage] = useState({
    emailMessage: "",
    nicknameMessage: "",
    passwordMessage: "",
    checkedPasswordMessage: "",
    nameMessage: "",
  });

  // 유효성 검사
  const [isValid, setIsValid] = useState({
    email: false,
    nickname: false,
    password: false,
    checkedPassword: false,
    name: true,
  });

  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewSrc, setPreviewSrc] = useState<string>('/img/default_image.png');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });

    if (name === "email") {
      setValidMessage((prev) => ({
        ...prev,
        emailMessage: "다시 중복확인을 해주세요.",
      }));
    }
    if (name === "nickname") {
      setValidMessage((prev) => ({
        ...prev,
        nicknameMessage: "다시 중복확인을 해주세요.",
      }));
    }
  }

  const handleCheckEmail = async (e: FormEvent) => {
    const emailResult = await checkEmail(signupForm.email);

    if (emailResult?.data.isExist === true) {
      setValidMessage((prev) => ({
        ...prev,
        emailMessage: "사용 불가능한 이메일입니다.",
      }));
      setIsValid({ ...isValid, email: false });
    } else if (emailResult?.data.isExist == false) {
      setValidMessage((prev) => ({
        ...prev,
        emailMessage: "사용 가능한 이메일입니다.",
      }));
      setIsValid({ ...isValid, email: true });
    } else {
      setValidMessage((prev) => ({
        ...prev,
        emailMessage: "잠시 후 다시 시도해주세요.",
      }));
      setIsValid({ ...isValid, email: false });
    }
  };

  const handleCheckNickname = async (e: FormEvent) => {
    const nicknameResult = await checkNickname(signupForm.nickname);

    if (nicknameResult?.data.isExist === true) {
      setValidMessage((prev) => ({
        ...prev,
        nicknameMessage: "중복된 닉네임입니다.",
      }));
      setIsValid({ ...isValid, nickname: false });
    } else if (nicknameResult?.data.isExist == false) {
      setValidMessage((prev) => ({
        ...prev,
        nicknameMessage: "사용 가능한 닉네임입니다.",
      }));
      setIsValid({ ...isValid, nickname: true });
    } else {
      setValidMessage((prev) => ({
        ...prev,
        nicknameMessage: "잠시 후 다시 시도해주세요.",
      }));
      setIsValid({ ...isValid, nickname: false });
    }
  };

  // 닉네임 유효성 검사
  // useEffect(() => {
  //   const regex = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,10}$/;

  //   if (!regex.test(signupForm.nickname)) {
  //     setValidMessage((prev) => ({
  //       ...prev,
  //       nicknameMessage: "2자 이상 10자 이하로 입력해주세요.",
  //     }));
  //     setIsValid({...isValid, nickname: false });
  //   } else {
  //     setValidMessage((prev) => ({
  //       ...prev,
  //       nicknameMessage: "",
  //     }));
  //     setIsValid({ ...isValid, nickname: true });
  //   }
  // }, [signupForm.nickname]);

  // 비밀번호 유효성 검사
  useEffect(() => {
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,15}$/;

    if (!regex.test(signupForm.password)) {
      setValidMessage((prev) => ({
        ...prev,
        passwordMessage: "숫자, 영문, 특수문자를 포함하여 최소 8자를 입력해주세요",
      }));
      setIsValid({ ...isValid, password: false });
    } else {
      setValidMessage((prev) => ({
        ...prev,
        passwordMessage: "",
      }));
      setIsValid({ ...isValid, password: true });
    }
  }, [signupForm.password]);

  // 비밀번호 확인
  useEffect(() => {
    if (signupForm.password !== signupForm.checkedPassword) {
      setValidMessage((prev) => ({
        ...prev,
        checkedPasswordMessage: "비밀번호가 일치하지 않습니다.",
      }));
      setIsValid({ ...isValid, checkedPassword: false });
    } else {
      setValidMessage((prev) => ({
        ...prev,
        checkedPasswordMessage: "",
      }));
      setIsValid({ ...isValid, checkedPassword: true });
    }
  }, [signupForm.password, signupForm.checkedPassword]);

  const handleFileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        setPreviewSrc(URL.createObjectURL(file));
      }
    };
    fileInput.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (signupForm.name == "") {
      setValidMessage((prev) => ({
        ...prev,
        nameMessage: "아이 이름을 입력해주세요.",
      }));
      console.log("이름을 입력하지 않았습니다")
      setIsValid((prev) => ({
        ...prev,
        name: false,
      }));
      return;
    } else {
      setValidMessage((prev) => ({
        ...prev,
        nameMessage: "",
      }));
      setIsValid((prev) => ({
        ...prev,
        name: true,
      }));

      if (isValid) {
        const formData = new FormData();

        formData.append('email', signupForm.email);
        formData.append('password', signupForm.password);
        formData.append('nickname', signupForm.nickname);
        formData.append('name', signupForm.name);
        if (selectedFile) {
          formData.append('profile', selectedFile);
        }

        console.log("test:", selectedFile?.name);

        const registerResult = await register(formData);

        if (registerResult) {
          navigate('/login');
        } else {
          console.error('register fail');
        }
      } else {
        console.error('register fail');
        return;
      }
    }


  };


  return (
    <>
      <div className='bg-main w-screen min-h-screen'>
        <section className="dark:bg-gray-900">
          <div className='flex justify-between pt-20 px-20'>
            <div className='text-white text-3xl leading-10 mt-20'>
              <p className='px-10'>
                안녕하세요,<br />
                아이의 창의력을 무한히 넓혀주는<br />
                AI 기반 단어 카드 서비스 <span className='font-semibold'>뽑아보카</span>입니다.
              </p>
              <img
                className="w-96 pl-12 pt-10 mt-20"
                src={`/img/login_img.png`}
                alt="뽑아보카 이미지"
              />
            </div>
            <div className="flex flex-col items-end justify-center px-6 py-8 mt-10">
              <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                    <div className='relative'>
                      <p className='mb-1 ml-1 text-sm'>이메일</p>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={signupForm.email}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-96 p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="이메일을 입력해주세요"
                        required
                      />
                      <button
                        className="absolute right-3 top-10 w-15 bg-main text-white text-xs font-PretendardVariable font-normal rounded-md py-1 px-2 transition duration-200 ease-in-out cursor-pointer"
                        onClick={handleCheckEmail}>중복확인
                      </button>
                      <p className={`text-gray-500 sm:text-sm ml-2 mt-1`}>
                        {validMessage.emailMessage}
                      </p>
                    </div>
                    <div className='relative'>
                      <p className='mb-1 ml-1 text-sm'>닉네임</p>
                      <input
                        type="text"
                        name="nickname"
                        id="nickname"
                        value={signupForm.nickname}
                        onChange={handleChange}
                        maxLength={10}
                        className={`bg-gray-50 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-96 p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        placeholder="닉네임"
                        required
                      />
                      <button
                        className="absolute right-3 top-10 w-15 bg-main text-white text-xs font-PretendardVariable font-normal rounded-md py-1 px-2 transition duration-200 ease-in-out cursor-pointer"
                        onClick={handleCheckNickname}>중복확인
                      </button>
                      <p className={`text-gray-500 sm:text-sm ml-2 mt-1`}>
                        {validMessage.nicknameMessage}
                      </p>
                    </div>
                    <div>
                      <p className='mb-1 ml-1 text-sm'>비밀번호</p>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={signupForm.password}
                        onChange={handleChange}
                        placeholder="영문자, 숫자, 특수문자 포함 8~20자리"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-96 p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                      <p className="text-red-500 sm:text-sm ml-2 mt-1 mb-2">
                        {validMessage.passwordMessage}
                      </p>
                      <input
                        type="password"
                        name="checkedPassword"
                        id="checkedPassword"
                        placeholder="비밀번호 확인"
                        value={signupForm.checkedPassword}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-96 p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                      <p className="text-red-500 sm:text-sm ml-2 mt-1">
                        {validMessage.checkedPasswordMessage}
                      </p>
                    </div>
                    <div className='relative'>
                      <p className='mb-1 ml-1 text-sm'>내 아이 프로필</p>
                      <div className='flex'>
                        <div className="rounded-full overflow-hidden w-24 mt-3 ml-4">
                          <img
                            className="h-full w-full object-cover rounded-full"
                            alt='profile'
                            src={previewSrc}
                            onClick={handleFileUpload}
                          />
                        </div>

                        <div className='relative'>
                          <p className='mb-1 ml-1 text-sm ml-10 mt-5 mb-2'>아이 이름</p>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={signupForm.name}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 h-10 p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-10"
                            placeholder=""
                            required
                          />
                          {/* <button
                        className="absolute right-3 top-10 w-15 bg-main text-white text-xs font-PretendardVariable font-normal rounded-md py-1 px-2 transition duration-200 ease-in-out cursor-pointer"
                        onClick={handleCheckEmail}>중복확인
                      </button> */}
                          <p className={`text-gray-500 sm:text-sm ml-1 mt-1`}>
                            {validMessage.nameMessage}

                          </p>
                        </div>














                      </div>

                    </div>
                    <br />
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          aria-describedby="terms"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                          뽑아보카의 <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/">이용약관</a>에 동의합니다.</label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center rounded-lg bg-main py-3 px-4 text-lg font-semibold leading-tight text-white shadow-md transition duration-200 ease-in-out cursor-pointer mb-2">
                      회원가입
                    </button>
                    <p className="mt-10 text-center text-sm text-gray-500">
                      이미 회원가입을 하셨나요?&nbsp;&nbsp;&nbsp;
                      <a href="/login" className="font-semibold text-primary-600 hover:underline dark:text-primary-500">로그인하기</a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Register;