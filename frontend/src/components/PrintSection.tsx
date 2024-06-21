import { useEffect, useRef, useState } from "react";
import { MdPrint } from "react-icons/md";
import { VocaPrint } from "../interfaces/Interfaces";
import { useRecoilState } from "recoil";
import { savedUserState } from "../atom";
import { printVocas } from "../api/bbobavoca/bbobavocaAxios";


function PrintSection(props: {
    width: number;
    category: string;
    description: string;
    onClose: () => void;
}) {
    const popupRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem('token');
    const [userInfo, setUserInfo] = useRecoilState(savedUserState);
    const [printInfo, setPrintInfo] = useState<VocaPrint>({
        category: props.category,
        description: props.description,
        nickname: userInfo? userInfo.nickname : "",
        type: 0,
        template: 0
    });

    const templateOptions = [
        { id: 0, label: "단어 카드" },
        { id: 1, label: "단어 포스터" }
    ];

    const cardTemplates = [
        { id: 0, src: "/img/template_0.png"},
        { id: 1, src: "/img/template_test1.png"},
        { id: 2, src: "/img/template_test2.png"},
        { id: 3, src: "/img/template_0.png"},
        { id: 4, src: "/img/template_test1.png"},
        { id: 5, src: "/img/template_0.png"},
        { id: 6, src: "/img/template_test2.png"}
    ]

    const posterTemplates = [
        { id: 0, src: "/img/template_0.png"},
        { id: 1, src: "/img/template_test1.png"},
        { id: 2, src: "/img/template_0.png"},
        { id: 3, src: "/img/template_test2.png"},
        { id: 4, src: "/img/template_0.png"},
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
        
        if (type === 0) {
            setTemplateList(cardTemplates);
        } else {
            setTemplateList(posterTemplates);
        }
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
            }));0
        }
    };

    const handleTempleateClick = (index: number) => {
        setSelectedTemplateIndex(index);
        setPrintInfo(prevForm => ({
            ...prevForm,
            template: index
        }));
    };

    const handlePrint = async () => {
        if (token) {
            const successResponse = await printVocas(token, printInfo);
            if (successResponse && successResponse.data) {
                console.log(successResponse.data);
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
                                    className={`text-m font-normal rounded-xl py-2 px-6 mt-4 shadow-inner transition duration-200 ease-in-out cursor-pointer mr-3 ${
                                        printInfo.type === option.id ? 'bg-main text-white' : 'bg-unselect-gray text-select-gray'
                                    }`}
                                    onClick={() => handleTemplateSelect(option.id)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <div className="inset-0 bg-light-green rounded-xl p-3 mx-5 mt-3">
                                <div className="overflow-auto whitespace-nowrap">
                                    {templateList.map((template, index) => (
                                        <img
                                            key={index}
                                            className={`inline-block w-36 mr-3 ${index===selectedTemplateIndex && 'border border-2 border-blue-500'}`}
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
        </>
    );
}

export default PrintSection;