import openai

OPENAI_API_KEY = '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'


languages = {
                0: "한국어",
                1: "한국어와 영어",
                2: "한국어와 일본어",
                3: "한국어와 중국어"
            }

def get_response(prompt):
    """OpenAI API를 사용하여 응답을 가져오는 함수"""
    client = openai.OpenAI(
        api_key=OPENAI_API_KEY
    )

    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[{
            "role": "user",
            "content": prompt,
        }]
    )

    answer = response.choices[0].message.content

    return answer

def get_words(category, description, age, language):
    prompt = f"""너는 최고의 아동 언어 교육 전문가야. {age}세 아동이 학습할 단어를 선정하는데, {category} 에 해당하면서, {description}이라는 특징을 가지는 단어들을 24개 생성해 줘. 단어들은 '/' 기호로 구분해 줘.
    응담에 다른 말은 포함시키지 말고 단어들과 구분자만 포함해서 답변해 주고, 실제 사전에 있는 단어로만 구성해 줘."""
    answer = get_response(prompt)
    return answer
    
def get_foreign_word(word, language):
    target = languages[language]
    prompt = f"""{word}를 {target}로 번역해 줘."""
    answer = get_response(prompt)
    return answer

def get_image(word):
    prompt = f"""아동이 학습하는 낱말 카드에 등장할 만한 {word}"""
    client = openai.OpenAI(
        api_key=OPENAI_API_KEY
    )
    response = client.images.generate(
        model="dall-e-3",
        prompt= prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    image_url = response.data[0].url
    return image_url

def get_example(word):
    prompt = f"""너는 최고의 아동 언어 교육 전문가야. 아이가 단어를 즐겁게 공부할 수 있도록 '{word}'가 포함되도록 예문을 만들어 줘.
    응담에 다른 말은 포함시키지 말고 4단어 이하의 완성된 문장 형태로 한국어 문법에 맞게 존댓말 형태로 깔끔하게 답변해 줘."""
    answer = get_response(prompt)
    return answer

if __name__ == "__main__":
    res = get_words('동물', '작고 귀여운 동물', 2, 1)
    words = res.split('/')
    
    print(get_image(words[0]))
    
    for word in words:
        example = get_example(word)
        
        print(example)