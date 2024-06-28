import { useEffect, useRef, useState } from "react";
import { MdPrint } from "react-icons/md";
import { VocaPrint } from "../interfaces/Interfaces";
import { printVocas, getPrinterId, sendPrinterId } from "../api/bbobavoca/bbobavocaAxios";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";


function PrintSection(props: {
    width: number;
    category: string;
    description: string;
    nickname: string;
    onClose: () => void;
}) {
    const popupRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem('token');

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startX, setStartX] = useState<number>(0);
    const [scrollStart, setScrollStart] = useState<number>(0);
    const [openModal, setOpenModal] = useState(false);
    const [isPrinterPopupVisible, setIsPrinterPopupVisible] = useState(false);
    const [printerInput, setPrinterInput] = useState('');


    const [printInfo, setPrintInfo] = useState<VocaPrint>({
        category: props.category,
        description: props.description,
        nickname: props.nickname,
        type: 0,
        template: 0
    });

    const templateOptions = [
        { id: 0, label: "단어 카드" },
        { id: 1, label: "단어 포스터" }
    ];

    const cardTemplates = [
        { id: 0, src: "/img/card/template_0.png" },
        { id: 1, src: "/img/card/template_1.png" },
        { id: 2, src: "/img/card/template_2.png" },
        { id: 3, src: "/img/card/template_3.png" },
        { id: 4, src: "/img/card/template_4.png" },
        { id: 5, src: "/img/card/template_5.png" },
        { id: 6, src: "/img/card/template_6.png" },
        { id: 7, src: "/img/card/template_7.png" },
        { id: 8, src: "/img/card/template_8.png" },
        { id: 9, src: "/img/card/template_9.png" },
        { id: 10, src: "/img/card/template_10.png" }
    ]

    const posterTemplates = [
        { id: 0, src: "/img/poster/template_p0.png" },
        { id: 1, src: "/img/poster/template_p1.png" },
        { id: 2, src: "/img/poster/template_p2.png" },
        { id: 3, src: "/img/poster/template_p3.png" },
        { id: 4, src: "/img/poster/template_p4.png" },
        { id: 5, src: "/img/poster/template_p5.png" },
        { id: 6, src: "/img/poster/template_p6.png" },
        { id: 7, src: "/img/poster/template_p7.png" },
        { id: 8, src: "/img/poster/template_p8.png" },
        { id: 9, src: "/img/poster/template_p9.png" },
        { id: 10, src: "/img/poster/template_p10.png" }
    ]

    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
    const [templateList, setTemplateList] = useState(cardTemplates);

    const handleTemplateSelect = (type: number) => {
        setPrintInfo(prevForm => ({
            ...prevForm,
            type: type,
            template: 0
        }));

        setSelectedTemplateIndex(0);
        setTemplateList(type === 0 ? cardTemplates : posterTemplates);
    };

    const handleArrowClick = (direction: string) => {
        if (direction === "left") {
            setSelectedTemplateIndex(prevIndex => (prevIndex - 1 + templateList.length) % templateList.length);
            setPrintInfo(prevForm => ({
                ...prevForm,
                template: (printInfo.template - 1 + templateList.length) % templateList.length
            }));
        } else {
            setSelectedTemplateIndex(prevIndex => (prevIndex + 1) % templateList.length);
            setPrintInfo(prevForm => ({
                ...prevForm,
                template: (printInfo.template + 1) % templateList.length
            })); 0
        }
    };

    const handleTempleateClick = (index: number) => {
        setSelectedTemplateIndex(index);
        setPrintInfo(prevForm => ({
            ...prevForm,
            template: index
        }));
    };

    // const handlePrint = async () => {
    //     setOpenModal(true);
    //     if (token) {
    //         await printVocas(token, printInfo.category, printInfo.description, printInfo.nickname, printInfo.type, printInfo.template);
    //         props.onClose();
    //     }
    // };

    const handlePrint = async () => {
        if (token) {
            try {
                const response = await getPrinterId(token);
                console.log(response.data);
                if (!response.data || response.data.printId === null) {
                    console.log("팝업창 띄우기 시작");
                    setIsPrinterPopupVisible(true);
                } else {
                    console.log("이미 주소 존재해서 프린트 요청 보냄");
                    setOpenModal(true);
                    await printVocas(token, printInfo.category, printInfo.description, printInfo.nickname, printInfo.type, printInfo.template);
                    props.onClose();
                }
            } catch (error) {
                console.error('Failed to get Printer ID:', error);
                setIsPrinterPopupVisible(true); // 에러 발생 시에도 팝업창을 표시
            }
        }
    };
    
    const handlePrinterSubmit = async () => {
        if (token) {
            try {
                console.log(printerInput);
                await sendPrinterId(token, printerInput);
                console.log(printerInput);
                setIsPrinterPopupVisible(false);
                setPrinterInput('');
                
                // 프린터 ID 입력 후 printVocas 호출
                setOpenModal(true);
                await printVocas(token, printInfo.category, printInfo.description, printInfo.nickname, printInfo.type, printInfo.template);
                props.onClose();
            } catch (error) {
                console.error('Failed to send Printer ID:', error);
            }
        }
    };
    

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                props.onClose();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [props.onClose]);




    const handlePrinterCancel = () => {
        setIsPrinterPopupVisible(false);
        setPrinterInput('');
    };


    const handleMouseDown = (event: MouseEvent) => {
        setIsDragging(true);
        setStartX(event.clientX);
        setScrollStart(scrollRef.current!.scrollLeft);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging) return;
        event.preventDefault();
        const x = event.clientX;
        const walk = (x - startX) * 3;
        scrollRef.current!.scrollLeft = scrollStart - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;

        // DOM 이벤트 리스너 추가
        scrollElement?.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            // 이벤트 리스너 제거
            scrollElement?.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp]);


    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-60 flex items-center justify-center">
                <div ref={popupRef} className="mx-auto h-3/7 bg-white rounded-lg border fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center mt-4 z-50" style={{ width: props.width }}>
                    <div className='m-4'>
                        <div className="flex justify-between mx-3 mb-3 mt-10">
                            <button
                                className="text-gray-600 py-1 px-3 ml-20"
                                onClick={() => handleArrowClick("left")}
                            >
                                <img
                                    src="/img/left-arrow.png"
                                />
                            </button>
                            <img
                                className="w-52"
                                src={templateList[selectedTemplateIndex].src}
                            />
                            <button
                                className="text-gray-600 py-1 px-3 mr-20"
                                onClick={() => handleArrowClick("right")}
                            >
                                <img
                                    src="/img/right-arrow.png"
                                />
                            </button>
                        </div>
                        <div className="ml-10">
                            {templateOptions.map(option => (
                                <button
                                    key={option.id}
                                    className={`text-m font-normal rounded-xl py-2 px-6 mt-4 shadow-inner transition duration-200 ease-in-out cursor-pointer mr-3 ${printInfo.type === option.id ? 'bg-main text-white' : 'bg-unselect-gray text-select-gray'
                                        }`}
                                    onClick={() => handleTemplateSelect(option.id)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <div className="inset-0 bg-light-green rounded-xl p-3 mx-5 mt-3">
                                <div ref={scrollRef} className="overflow-auto whitespace-nowrap cursor-grab">
                                    {templateList.map((template, index) => (
                                        <img
                                            key={index}
                                            className={`inline-block w-36 mr-3 ${index === selectedTemplateIndex && 'border border-2 border-blue-500'}`}
                                            src={template.src}
                                            alt={`Template ${index}`}
                                            onClick={() => handleTempleateClick(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            className={`w-full flex items-center justify-center text-white text-m font-normal rounded-md py-3 mt-4 transition duration-200 ease-in-out cursor-pointer bg-main`}
                            onClick={handlePrint}
                        >
                            <MdPrint className="mr-2" />
                            프린트하기
                        </button>
                    </div>
                </div>
            </div>

            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <div className='fixed top-20 left-0 w-full h-full bg-gray-500 bg-opacity-60'></div>
                <div className='flex items-center justify-center fixed inset-0 opacity-100'>
                    <div className='z-10 bg-white rounded-lg border-solid border-black-500 p-70 flex flex-col justify-center items-center'>
                        <Modal.Body>
                            <div className="text-center px-10">
                                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-black-200" />
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 shadow-3xl">
                                    곧 단어 카드가 출력됩니다! 프린터기를 확인해주세요!
                                </h3>
                                <div className="flex justify-center">
                                    <Button className="bg-gray-100 text-black w-20 hover:bg-main hover:text-white" onClick={() => setOpenModal(false)}>
                                        확인
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </div>
                </div>
            </Modal>

            {isPrinterPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-20">
                    <div className="bg-white rounded-lg p-5 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">연결된 프린터기가 없습니다<br></br>프린터기 ID를 입력해주세요!</h2>
                        <input
                            type="email"
                            className="border rounded-md p-2 w-full mb-4"
                            value={printerInput}
                            onChange={(e) => setPrinterInput(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-300 text-gray-800 rounded-md py-2 px-4 mr-2"
                                onClick={handlePrinterCancel}
                            >
                                취소
                            </button>
                            <button
                                className="bg-main text-white rounded-md py-2 px-4"
                                onClick={handlePrinterSubmit}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
}

export default PrintSection;