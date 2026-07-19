import re
from collections import Counter

from fastapi import APIRouter, HTTPException

from app.services.store import get_document, get_document_text

router = APIRouter(tags=["Engineering Dashboard"])

STOPWORDS = set("""
the a an is are was were be been being of to in on for with and or as by at from
this that these those it its into over under between within without across per
also can may will shall should would could not no nor if then than so such which
who whom whose what when where why how each all any both more most other some
such only own same figure table page section chapter fig eq
""".split())


@router.get("/dashboard/{doc_id}")
def engineering_dashboard(doc_id: str):
    meta = get_document(doc_id)
    if not meta:
        raise HTTPException(404, "Document not found.")

    text = get_document_text(doc_id)

    words = re.findall(r"[A-Za-z][A-Za-z\-]{2,}", text.lower())
    freq = Counter(w for w in words if w not in STOPWORDS)
    top_terms = [{"term": w, "count": c} for w, c in freq.most_common(12)]

    numbers = re.findall(
        r"\b\d+(?:\.\d+)?\s?(?:mm|cm|m|km|kg|g|N|Pa|MPa|GPa|V|A|W|kW|Hz|°C|°F|psi|rpm|bar|L|ml)\b",
        text,
    )
    number_counts = Counter(numbers)
    key_values = [{"value": v, "count": c} for v, c in number_counts.most_common(10)]

    headings = re.findall(
        r"(?m)^\s{0,3}(\d+(?:\.\d+)*\s+[A-Z][A-Za-z0-9 ,\-/]{3,80})$", text
    )
    seen, sections = set(), []
    for h in headings:
        h = h.strip()
        if h not in seen:
            seen.add(h)
            sections.append(h)
        if len(sections) >= 15:
            break

    reading_minutes = max(1, round(meta["words"] / 200))

    return {
        "doc_id": doc_id,
        "filename": meta["filename"],
        "pages": meta["pages"],
        "words": meta["words"],
        "characters": meta["characters"],
        "reading_minutes": reading_minutes,
        "top_terms": top_terms,
        "key_values": key_values,
        "sections": sections,
    }
