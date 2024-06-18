import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  function moveLoginBtn(e: FormEvent): void {
    navigate('/login');
  }

  return (
    <div className='text-center'>
        <div className='flex w-screen min-h-screen justify-center self-stretch bg-main'>
            <div className='flex flex-1 flex-row box-border max-w-screen-xl items-center justify-center'>
                <div className="flex flex-1 justify-center items-center pl-20">
                    <img
                        className="w-4/5"
                        src={`/img/herosection-character.png`}
                    />
                </div>
                <div className="flex flex-1 flex-col justify-center items-start text-left">
                    <p className="font-PretendardVariable text-3xl text-white pb-3">AI 기반 단어 생성 서비스</p>
                    <p className="font-ownglyph text-7xl text-white pb-8">뽑아보카</p>
                    <button
                        type="submit"
                        className="rounded-lg bg-white py-4 px-14 font-PretendardVariable text-2xl font-semibold leading-tight text-black shadow-md transition duration-200 ease-in-out cursor-pointer"
                        onClick={moveLoginBtn}
                    >
                        지금 바로 시작하기
                    </button>
                </div>
            </div>
        </div>
        
        <img
            className="flex w-full"
            src={`/img/Herosection.png`}
        />
        <br></br><br></br><br></br><br></br>
        <button
            type="submit"
            className="relative mx-auto justify-center rounded-lg bg-main py-4 px-14 font-PretendardVariable text-2xl font-semibold leading-tight text-white shadow-md transition duration-200 ease-in-out cursor-pointer"
            onClick={moveLoginBtn}
        >
            메인페이지 바로가기
        </button>
        <br></br><br></br><br></br><br></br><br></br>
    </div>
  );
}

export default HeroSection;