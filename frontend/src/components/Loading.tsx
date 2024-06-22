
function Loading() {
    return (
      <div className="fixed top-20 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
          <img
            className="w-56"
            src='/img/loading_character.png'
          />
          {/* <h2 className="text-center text-white text-xl font-semibold">
            열심히 만들고 있어요!
          </h2> */}
          <p className="text-center text-white text-3xl font-ownglyph mb-20">
            잠시만 기다리면 단어 카드 8장이 순서대로 나타납니다!
          </p>
      </div>
    );
  }
  
  export default Loading;