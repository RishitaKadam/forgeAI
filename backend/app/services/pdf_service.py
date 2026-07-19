import fitz  # PyMuPDF


def extract_pages(pdf_path: str) -> list[str]:
    """Return a list of page texts (index 0 = page 1)."""
    document = fitz.open(pdf_path)
    pages = [page.get_text() for page in document]
    document.close()
    return pages


def extract_text_from_pdf(pdf_path: str) -> str:
    return "\n".join(extract_pages(pdf_path))
