import re

def remove_header(text):
    """Removes the first line assuming it is a header."""
    return "\n".join(text.split("\n")[1:])

def remove_specific_phrase(text):
    """Removes specific phrases related to the bar exam."""
    return re.sub(r'변호사시험의 자격시험을 위한 형사소송법 표준판례연구.*', '', text)

def remove_page_numbers(text):
    """Removes lines containing only page numbers."""
    return re.sub(r'^\d+\s*$', '', text, flags=re.MULTILINE)

def remove_unnecessary_titles(text):
    """Removes unnecessary titles such as chapters, Roman numerals, etc."""
    text = re.sub(r'^[제0-9]+\s*편\s*.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\d*\s*장\s*.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'^[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]+\.\s*.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*제\s*\d+\s*장\s*.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]+\s*\..*$', '', text, flags=re.MULTILINE)
    return text

def condense_newlines(text):
    """Replaces multiple newlines with a single newline."""
    return re.sub(r'\n+', '\n', text)

def preprocess_dates(text):
    """Temporarily replaces dates with a placeholder to prevent splitting."""
    return re.sub(r'(\d{4}\.\s*\d{1,2}\.\s*\d{1,2}\.)', r'__DATE__\1', text)

def restore_dates(cases):
    """Restores dates from the placeholder."""
    return [case.replace('__DATE__', '') for case in cases]

def split_cases(text):
    """Splits the text into individual cases based on the numbering pattern."""
    return re.split(r'\n(\d+\.)', text)

def combine_cases(cases):
    """Combines case numbers and their contents into a formatted list."""
    all_cases = []
    for i in range(1, len(cases), 2):
        case_number = cases[i].strip()
        case_content = cases[i+1].strip() if i+1 < len(cases) else ""
        all_cases.append(f"{case_number}\n{case_content}")
    return all_cases

def clean_case_text(all_cases):
    """Cleans up each case by removing extra whitespace and condensing lines."""
    cleaned_cases = []
    for case in all_cases:
        cleaned_case = " ".join(case.splitlines())
        cleaned_case = re.sub(r'\s+', ' ', cleaned_case)
        cleaned_cases.append(cleaned_case)
    return cleaned_cases

def process_full_text(full_text):
    """Processes the full text through all preprocessing steps."""
    full_text = remove_header(full_text)
    full_text = remove_specific_phrase(full_text)
    full_text = remove_page_numbers(full_text)
    full_text = remove_unnecessary_titles(full_text)
    full_text = condense_newlines(full_text)
    full_text = preprocess_dates(full_text)
    cases = split_cases(full_text)
    cases = restore_dates(cases)
    all_cases = combine_cases(cases)
    return clean_case_text(all_cases)

