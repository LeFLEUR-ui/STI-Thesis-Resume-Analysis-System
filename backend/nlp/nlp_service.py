# nlp_service.py

import spacy
from typing import List, Dict
import re
from sentence_transformers import SentenceTransformer, util
from flashtext import KeywordProcessor
from rapidfuzz import fuzz

# Load English & Tagalog spaCy models
nlp_en = spacy.load("en_core_web_sm")
try:
    nlp_tl = spacy.load("tl_core_news_sm")
except OSError:
    nlp_tl = None

# HuggingFace multilingual model
model = SentenceTransformer('sentence-transformers/paraphrase-xlm-r-multilingual-v1')

# -------------------------------------------------
# Mariwasa Manufacturing Skills Dataset
# (Still used for detection assistance if needed)
# -------------------------------------------------
MARIWASA_SKILLS_DATASET = {
    "production": [
        "tile production","ceramic manufacturing","production line operation",
        "machine operation","press machine operation","kiln operation",
        "glazing process","raw material mixing","process monitoring",
        "production scheduling","standard operating procedures","industrial automation"
    ],
    "engineering": [
        "mechanical troubleshooting","electrical maintenance","preventive maintenance",
        "corrective maintenance","equipment calibration","plc programming",
        "industrial instrumentation","robotics maintenance","hydraulic systems","pneumatic systems"
    ],
    "quality_control": [
        "quality inspection","defect detection","surface defect inspection",
        "dimension tolerance inspection","statistical process control","spc",
        "iso quality standards","laboratory material testing","process quality monitoring"
    ],
    "safety": [
        "workplace safety","hazard identification","risk assessment",
        "ppe compliance","environmental compliance","industrial safety procedures","safety audit"
    ],
    "logistics": [
        "inventory management","warehouse operations","forklift operation",
        "shipment preparation","supply chain coordination","packaging operations"
    ],
    "it_systems": [
        "erp systems","sap","oracle erp","data reporting",
        "manufacturing analytics","industrial iot monitoring","mes systems","production data analysis"
    ]
}

FACTORY_SKILLS = set(
    skill
    for category in MARIWASA_SKILLS_DATASET.values()
    for skill in category
)

# -------------------------------------------------
# FlashText dictionary processor
# -------------------------------------------------
keyword_processor = KeywordProcessor(case_sensitive=False)
for skill in FACTORY_SKILLS:
    keyword_processor.add_keyword(skill)

# -------------------------------------------------
# Helpers
# -------------------------------------------------
def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_skills_from_paragraph(paragraph: str) -> List[str]:
    paragraph = re.sub(r"\s+(at|din|ng)\s+", ",", paragraph, flags=re.IGNORECASE)
    sentences = re.split(r"[.,;]", paragraph)
    skills = []

    for sent in sentences:
        sent = sent.strip()
        if not sent:
            continue

        multi_word_skills = re.findall(
            r'\b(?:[A-Z][a-z]*\s?)+\b(?:\([A-Z]{1,5}\))?', sent
        )
        for skill in multi_word_skills:
            skill = skill.strip()
            if len(skill) > 1:
                skills.append(skill)

        doc_en = nlp_en(sent)
        tokens_en = [
            token.text for token in doc_en
            if not token.is_stop and len(token.text) > 1
        ]
        skills.extend(tokens_en)

        if nlp_tl:
            doc_tl = nlp_tl(sent)
            tokens_tl = [
                token.text for token in doc_tl
                if not token.is_stop and len(token.text) > 1
            ]
            skills.extend(tokens_tl)

    seen = set()
    unique_skills = []
    for s in skills:
        if s not in seen:
            seen.add(s)
            unique_skills.append(s)

    return unique_skills


# -------------------------------------------------
# FIXED MATCHING FUNCTION
# -------------------------------------------------
def match_skills(resume_text: str, hr_paragraph: str, semantic_threshold: float = 0.7) -> Dict:

    # Extract ONLY job-specific skills
    hr_skills = extract_skills_from_paragraph(hr_paragraph)

    # 🚨 FIX: Removed dataset merge that caused identical scoring
    # OLD (problematic):
    # hr_skills = list(set(hr_skills + list(FACTORY_SKILLS)))

    hr_skills = list(set(hr_skills))

    resume_text_norm = normalize_text(resume_text)

    flashtext_matches = set(
        keyword_processor.extract_keywords(resume_text_norm)
    )

    resume_tokens = set(
        token.text.lower()
        for token in nlp_en(resume_text_norm)
        if not token.is_stop
    )

    if nlp_tl:
        resume_tokens.update(
            token.text.lower()
            for token in nlp_tl(resume_text_norm)
            if not token.is_stop
        )

    matched_skills = []
    unmatched_skills = []

    for skill in hr_skills:
        norm_skill = normalize_text(skill)

        # Exact token match
        if all(word in resume_tokens for word in norm_skill.split()):
            matched_skills.append(skill)
            continue

        # FlashText match
        if norm_skill in flashtext_matches:
            matched_skills.append(skill)
            continue

        # Fuzzy match
        fuzzy_score = max(
            [fuzz.partial_ratio(norm_skill, token) for token in resume_tokens] or [0]
        )

        if fuzzy_score >= 85:
            matched_skills.append(skill)
        else:
            unmatched_skills.append(skill)

    # Semantic similarity for unmatched skills
    if unmatched_skills:
        resume_embedding = model.encode(resume_text, convert_to_tensor=True)
        skill_embeddings = model.encode(unmatched_skills, convert_to_tensor=True)
        cosine_scores = util.cos_sim(skill_embeddings, resume_embedding)

        for i, score in enumerate(cosine_scores):
            if score.item() >= semantic_threshold:
                matched_skills.append(unmatched_skills[i])

    total_skills = len(hr_skills)
    matched_count = len(matched_skills)

    percentage_match = (
        (matched_count / total_skills) * 100
        if total_skills > 0 else 0
    )

    ranking_score = round(
        percentage_match * 1.2 + matched_count * 0.5,
        2
    )

    return {
        "ranking_score": ranking_score,
        "total_skills": total_skills,
        "matched_count": matched_count,
        "percentage_match": round(percentage_match, 2),
        "matched_skills": matched_skills,
        "unmatched_skills": [s for s in hr_skills if s not in matched_skills]
    }
