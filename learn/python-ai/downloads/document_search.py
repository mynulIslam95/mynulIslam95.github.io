"""A lexical retrieval project, not an LLM or semantic embedding model.

Run: python document_search.py notes "python functions"
Create a notes directory containing at least two .txt files first.
"""
import argparse
import math
import re
from collections import Counter
from pathlib import Path


def tokenize(text):
    return re.findall(r'\w+', text.lower())


def search(documents, query, limit=3):
    """Rank documents by TF-IDF weighted overlap with query terms."""
    query_words = set(tokenize(query))
    if not query_words or not documents:
        return []
    counts = {name: Counter(tokenize(text)) for name, text in documents.items()}
    results = []
    for name, words in counts.items():
        size = sum(words.values())
        score = 0.0
        for word in query_words:
            frequency = sum(word in other for other in counts.values())
            # Smoothed IDF is always positive, including common words.
            idf = math.log((1 + len(counts)) / (1 + frequency)) + 1
            score += (words[word] / size if size else 0) * idf
        if score > 0:
            results.append((score, name, documents[name]))
    return sorted(results, key=lambda row: (-row[0], row[1]))[:limit]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path)
    parser.add_argument('query')
    args = parser.parse_args()
    if not args.directory.is_dir():
        parser.error('Create a directory containing .txt files first.')
    try:
        documents = {p.name: p.read_text(encoding='utf-8') for p in sorted(args.directory.glob('*.txt'))}
    except (OSError, UnicodeError) as error:
        parser.exit(1, f'Could not read documents: {error}\n')
    results = search(documents, args.query)
    if not results:
        print('No matching evidence found. Try different words.')
    for score, name, text in results:
        print(f'\nSource: {name} | score: {score:.3f}')
        print(text[:500])


if __name__ == '__main__':
    main()
