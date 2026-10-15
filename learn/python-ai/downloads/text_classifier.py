"""Educational multinomial naive Bayes classifier using only the standard library.

python text_classifier.py "great helpful course"
Tiny example data demonstrates training and inference, not production accuracy.
"""
import argparse
import math
import re
from collections import Counter, defaultdict

TRAIN = [
    ('positive', 'great helpful course'),
    ('positive', 'excellent clear explanation'),
    ('positive', 'good useful examples'),
    ('positive', 'love this fantastic tutorial'),
    ('positive', 'helpful clear and enjoyable'),
    ('positive', 'great teacher good lessons'),
    ('negative', 'bad confusing course'),
    ('negative', 'terrible unclear explanation'),
    ('negative', 'poor useless examples'),
    ('negative', 'hate this boring tutorial'),
    ('negative', 'confusing unclear and frustrating'),
    ('negative', 'bad teacher poor lessons'),
]
TEST = [
    ('positive', 'helpful useful tutorial'),
    ('positive', 'excellent great examples'),
    ('negative', 'terrible confusing lessons'),
    ('negative', 'bad useless tutorial'),
]


def tokenize(text):
    return re.findall(r'\w+', text.lower())


class TextClassifier:
    def __init__(self):
        self.documents = Counter()
        self.words = defaultdict(Counter)
        self.vocabulary = set()

    def fit(self, rows):
        # Reset state so repeated fit calls do not duplicate the training data.
        self.__init__()
        for label, text in rows:
            tokens = tokenize(text)
            self.documents[label] += 1
            self.words[label].update(tokens)
            self.vocabulary.update(tokens)
        if not self.documents or not self.vocabulary:
            raise ValueError('Training requires labeled text with at least one word.')
        return self

    def predict(self, text):
        if not self.documents:
            raise ValueError('Call fit before predict.')
        # Ignore unknown words: this small model has no evidence about them.
        tokens = [word for word in tokenize(text) if word in self.vocabulary]
        if not tokens:
            return 'unknown'
        scores = {}
        for label, count in self.documents.items():
            log_probability = math.log(count / sum(self.documents.values()))
            denominator = sum(self.words[label].values()) + len(self.vocabulary)
            for word in tokens:
                # Add-one smoothing avoids log(0) for unseen label-word pairs.
                log_probability += math.log((self.words[label][word] + 1) / denominator)
            scores[label] = log_probability
        return max(scores, key=scores.get)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('text')
    args = parser.parse_args()
    model = TextClassifier().fit(TRAIN)
    correct = sum(model.predict(text) == label for label, text in TEST)
    print(f'Toy held-out check: {correct}/{len(TEST)} correct. Not a real-world benchmark.')
    print('Prediction:', model.predict(args.text))
    print('Limitation: bag-of-words counts ignore word order, context and negation.')


if __name__ == '__main__':
    main()
