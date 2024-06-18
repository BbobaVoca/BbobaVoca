import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  function moveLoginBtn(e: FormEvent): void {
    navigate('/login');
  }

  return (
    <div className='text-center'>
        <div className='flex w-screen justify-center self-stretch bg-main'>
            <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
                <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 '>
                    <div className='flex justify-center my-3 mb-0'>
                        <div className="flex flex-1 flex-col pt-20 pb-20">
                            <img
                                className="flex mx-auto w-96"
                                src={`/img/herosection-character.png`}
                            />
                            <p className="font-PretendardVariable text-3xl text-white">AI 기반 단어 생성 서비스</p>
                            <br></br>
                            <p className="font-ownglyph text-7xl text-white">뽑아보카</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <img
            className="flex w-full"
            src={`/img/Herosection.png`}
        />
        <br></br><br></br><br></br><br></br>
        <button type="submit" className="relative mx-auto justify-center rounded-lg bg-main py-4 px-14 font-PretendardVariable text-2xl font-semibold leading-tight text-white shadow-md transition duration-200 ease-in-out cursor-pointer" onClick={moveLoginBtn}>메인페이지 바로가기</button>
        <br></br><br></br><br></br><br></br><br></br>
    </div>
  );
}

export default HeroSection;