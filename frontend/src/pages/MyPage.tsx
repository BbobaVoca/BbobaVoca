import { useNavigate } from "react-router-dom";


const MyPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    return (
        <>
        <div className='flex w-screen h-full justify-center self-stretch text-gray-700 bg-light-green'>
            <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
                <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                    test
                </div>
            </div>
        </div>
        </>
    );
};

export default MyPage;