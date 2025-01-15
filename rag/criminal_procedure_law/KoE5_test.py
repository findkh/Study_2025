from common import process_full_text
from langchain_community.document_loaders import PyPDFLoader
import re
from langchain_community.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.schema import Document

def initialize_faiss(docs, embedding_model_name, chunk_size=500, chunk_overlap=0):
    """
    Initializes a FAISS vector store from documents.

    Args:
        docs (list): List of raw documents.
        embedding_model_name (str): Hugging Face embedding model name.
        chunk_size (int): Size of text chunks for splitting.
        chunk_overlap (int): Overlap between chunks.

    Returns:
        tuple: FAISS vector store, similarity retriever, and MMR retriever.
    """
    # Text cleaning and processing
    full_text = "\n".join([doc.page_content for doc in docs])
    processed_cases = process_full_text(full_text)

    # Clean case text
    cleaned_cases = [
        re.sub(r'\s+', ' ', " ".join(case.splitlines())).strip()
        for case in processed_cases
    ]

    # Split documents
    text_splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    split_docs = text_splitter.split_documents([Document(page_content=case) for case in cleaned_cases])

    # Initialize embedding model
    embedding_model = HuggingFaceEmbeddings(model_name=embedding_model_name)

    # Create FAISS vector store
    faiss_db = FAISS.from_texts([doc.page_content for doc in split_docs], embedding=embedding_model)

    # Create retrievers
    simi_retriever = faiss_db.as_retriever(search_type="similarity", search_kwargs={"k": 2})
    mmr_retriever = faiss_db.as_retriever(search_type="mmr", search_kwargs={"k": 2})

    return faiss_db, simi_retriever, mmr_retriever

def query_retrievers(retriever, queries):
    """
    Queries the retriever with multiple user queries.

    Args:
        retriever: Retriever object (similarity or MMR).
        queries (list): List of user queries.

    Prints:
        Retrieved documents for each query.
    """
    for user_query in queries:
        print(f"====== Query: {user_query} ======")
        retrieved_docs = retriever.invoke(user_query)
        for doc in retrieved_docs:
            print(doc.page_content)
        print("==============")

# 파일 경로 설정
FILE_PATH = "./pdf/law.pdf"

# PDF 로더 초기화
loader = PyPDFLoader(FILE_PATH)
docs = loader.load()

# Initialize FAISS and retrievers
embedding_model_name = "nlpai-lab/KoE5"
faiss_db, simi_retriever, mmr_retriever = initialize_faiss(docs[32:], embedding_model_name)

# 사용자 질문 목록
user_queries = [
    "고소 여부는 자유로운 증명의 대상인가?",
    "소년 판단 여부",
    "항소심에서 공소장 변경이 가능한가?",
    "자백의 임의성에 다툼이 있는 경우 검사에게 입증 책임이 있는가?",
    "개전의 정상이 현저할 때의 판단은?",
    "공범자에 대한 무죄 판결이 재심사유에 해당하나?",
    "실체진실주의가 소극적 진실주의를 의미하나?",
    "상해진단서의 증명력은 인정된다.",
    "녹음 테이프는 증거로 인정할 수 있나?",
    "불이익 변경 금지 원칙의 근거는 무엇인가?"
]

# Query similarity retriever
print("====== Similarity Retriever Results ======")
query_retrievers(simi_retriever, user_queries)

# Query MMR retriever
print("====== MMR Retriever Results ======")
query_retrievers(mmr_retriever, user_queries)
