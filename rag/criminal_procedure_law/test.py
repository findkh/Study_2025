import re
from langchain_community.document_loaders import PyPDFLoader

# 파일 경로 설정
FILE_PATH = "./pdf/law.pdf"
OUTPUT_FILE = "cases_output.txt"  # 저장할 텍스트 파일 이름

# PDF 로더 초기화
loader = PyPDFLoader(FILE_PATH)
docs = loader.load()

# [32] 페이지부터 시작하여 텍스트를 합침
start_index = 32
full_text = "\n".join([doc.page_content for doc in docs[start_index:]])

# 머릿말 없애기: 첫 번째 줄은 머릿말로 가정하고 제거
full_text = "\n".join(full_text.split("\n")[1:])

# 특정 문구 제거 (변호사시험 관련 문구)
full_text = re.sub(r'변호사시험의 자격시험을 위한 형사소송법 표준판례연구.*', '', full_text)

# 쪽번호 없애기: 페이지 번호가 포함된 줄을 제거
full_text = re.sub(r'^\d+\s*$', '', full_text, flags=re.MULTILINE)  # 숫자만 있는 줄을 제거

# 불필요한 제목들 제거
# 제목 제거 (장별 구분, 로마자 번호 등)
full_text = re.sub(r'^[제0-9]+\s*편\s*.*$', '', full_text, flags=re.MULTILINE)  # 제1편, 제2편 등
full_text = re.sub(r'^\d*\s*장\s*.*$', '', full_text, flags=re.MULTILINE)  # 제 1 장, 제 2 장 등
full_text = re.sub(r'^[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]+\.\s*.*$', '', full_text, flags=re.MULTILINE)  # I. 수사의 의의와 구조 등
full_text = re.sub(r'^\s*제\s*\d+\s*장\s*.*$', '', full_text, flags=re.MULTILINE)  # 공백 처리된 장 제목도 제거
full_text = re.sub(r'^\s*[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]+\s*\..*$', '', full_text, flags=re.MULTILINE)  # 로마자 번호와 소제목도 제거

# 여러 개의 개행을 하나로 합침
full_text = re.sub(r'\n+', '\n', full_text)

# 정규식을 이용해 판례 나누기
# '1.', '2.', '3.'...과 같은 번호로 판례를 나눔
cases = re.split(r'\n(\d+\.)', full_text)  # 숫자와 점을 기준으로 분할

# 판례 리스트 정리
all_cases = []
for i in range(1, len(cases), 2):  # 인덱스 1부터 시작해서, 짝수 번째 인덱스는 판례의 내용임
    case_number = cases[i].strip()  # 판례 번호
    case_content = cases[i+1].strip() if i+1 < len(cases) else ""
    
    # 판례 번호와 내용을 합침
    all_cases.append(f"{case_number}\n{case_content}")

# 판례를 텍스트 파일에 저장
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    for i, case in enumerate(all_cases, start=1):
        f.write(case + "\n")
        f.write("-" * 50 + "\n")  # 구분선 작성

print(f"총 {len(all_cases)}개의 판례가 '{OUTPUT_FILE}'에 저장되었습니다.")
