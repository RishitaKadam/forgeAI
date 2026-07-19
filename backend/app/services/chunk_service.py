from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_text(text: str):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=250)
    return splitter.split_text(text)


def chunk_pages(pages: list[str]):
    """
    Chunk page-by-page so every chunk keeps track of which PDF page it
    came from. Returns a list of (chunk_text, page_number) tuples,
    page_number is 1-indexed.
    """
    splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)
    chunks = []

    for i, page_text in enumerate(pages, start=1):
        if not page_text.strip():
            continue
        for chunk in splitter.split_text(page_text):
            chunks.append((chunk, i))

    return chunks
