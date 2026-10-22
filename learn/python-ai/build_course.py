"""Build static course pages from this content and a local upstream checkout.

Usage: python build_course.py /path/to/python-ai-crash-course /path/to/marked/lib/marked.esm.js
Only reads notebook source cells. Never executes upstream Python or notebook code.
"""
import ast
import html
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path
from course_content import CHAPTERS, DRILLS, WRITING

HERE = Path(__file__).resolve().parent
SOURCE = Path(sys.argv[1]).resolve()
MARKED = Path(sys.argv[2]).resolve().as_uri()
UPSTREAM = 'https://github.com/mayank953/python-ai-crash-course'
REV = subprocess.check_output(['git', '-C', str(SOURCE), 'rev-parse', 'HEAD'], text=True).strip()
E = html.escape


def read_literal(name, key):
    """Read static content with AST, without importing or running upstream code."""
    tree = ast.parse((SOURCE / 'scripts' / name).read_text())
    for node in tree.body:
        if isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id == key for t in node.targets):
            return ast.literal_eval(node.value)
    raise ValueError(key)


summaries = read_literal('practice.py', 'LESSONS')
activities = read_literal('ai_terms.py', 'ACTIVITIES')
chunks = []


def markdown(text, base):
    text = text.replace('\u2014', '. ')
    # Resolve repository-relative links in the lesson and notebook material.
    def link(match):
        label, target = match.group(1), match.group(2)
        if not re.match(r'https?://|#|mailto:', target):
            from urllib.parse import urljoin
            target = urljoin(f'{UPSTREAM}/blob/{REV}/{base}/', target)
        return f'[{label}]({target})'
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, text)
    # Keep the generated page's chapter heading as its only h1.
    text = re.sub(r'^(#{1,5}) ', lambda m: '#' * min(len(m[1]) + 2, 6) + ' ', text, flags=re.M)
    index = len(chunks)
    chunks.append(text)
    return f'@@MARKDOWN-{index}@@'


head = (HERE.parent / 'c-os' / 'index.html').read_text()
theme_boot = re.search(r'<script>(.*?)</script>', head, re.S)[0]
theme_button = re.search(r'<button type="button" class="theme-toggle".*?</button>', head, re.S)[0]


def page(title, body, chapter='', practice=None):
    nav = '<a href="index.html">Map</a>' + ''.join(f'<a {"class=\"is-on\"" if str(i) == str(chapter) else ""} href="ch{i:02}.html">{i}</a>' for i in range(1,15))
    nav += '<a href="index.html#projects">Projects</a><a href="../index.html">Learn hub</a>'
    data = '' if practice is None else '<script>window.PYTHON_PRACTICE = ' + json.dumps(practice).replace('<', '\\u003c') + ';</script>'
    return f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
{theme_boot}<title>{E(title)} · Python + AI · Learn with Mynul</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&amp;family=IBM+Plex+Sans:wght@400;500;600&amp;display=swap" rel="stylesheet">
<meta name="description" content="Python and AI from scratch. Read the lessons, trace examples and practice with hints, saved drafts and commented answers.">
<link rel="stylesheet" href="course.css?v=1"><link rel="stylesheet" href="../../assets/css/learning-theme.css?v=1"></head>
<body class="cos" data-chapter="{chapter}"><a class="skip" href="#main">Skip to content</a>
<header class="cos-bar"><div class="wrap"><a class="cos-brand" href="index.html">Python · AI</a><nav class="cos-nav" aria-label="Python course">{nav}</nav>{theme_button}</div></header>
<main id="main"><div class="wrap">{body}
<p class="source-note">Reading notes and course sequence adapted from <a href="{UPSTREAM}">Mayank Aggarwal’s Python AI Crash Course</a>, under the <a href="LICENSE-upstream.txt">MIT license</a>. Classroom adaptation, chapter guides and project exercises: Learn with Mynul. <a href="sources.html">Sources and study guide</a>.</p>
</div></main><footer class="cos-foot"><div class="wrap">Learn with Mynul · Read. Trace. Practice. Build.</div></footer>
{data}<script src="js/practice.js?v=1" defer></script><script src="../../assets/js/theme.js?v=3" defer></script></body></html>'''


def practice_html(drills):
    result = '<h2 id="practice">Practice session</h2><div class="scorebox"><span class="tag">This chapter</span><p data-score aria-live="polite"></p><p>Predict the output before running it. Output checks preserve case and line breaks. Written programs are saved for self-review and are not executed here. Drafts and progress stay in this browser.</p></div>'
    for n, d in enumerate(drills, 1):
        identifier = d['id']
        result += f'<article class="drill" id="{identifier}"><p class="drill-id">Practice {n:02} · {"checked answer" if d.get("accept") else "write and self-review"}</p><h3>{E(d["prompt"])}</h3>'
        if d.get('code'):
            result += '<pre><code>' + E(d['code']) + '</code></pre>'
        result += f'''<label for="input-{identifier}">Your answer</label><textarea id="input-{identifier}" class="drill-in" rows="{3 if d.get('accept') else 10}" spellcheck="false"></textarea>
<div class="drill-actions"><button type="button" data-hint-button aria-expanded="false" aria-controls="hint-{identifier}">Hint</button><button type="button" data-submit>{'Submit' if d.get('accept') else 'Submit draft'}</button><button type="button" data-answer-button aria-expanded="false" aria-controls="answer-{identifier}">See answer</button></div>
<div class="drill-hint" id="hint-{identifier}" data-hint hidden><span class="tag">Step by step</span><p>{E(d['hint'])}</p></div>
<p class="drill-fb" data-feedback role="status" aria-live="polite"></p>
<div class="drill-ans" id="answer-{identifier}" data-answer hidden><span class="tag">Answer and explanation</span><pre><code>{E(d['answer'])}</code></pre><p>{E(d.get('why', 'Compare the result with your own answer. Explain what each line does before moving on.'))}</p></div></article>'''
    return result


outputs = {}
folders = sorted((SOURCE / 'python').glob('[0-9][0-9]-*'))
for number, chapter in enumerate(CHAPTERS, 1):
    title, start, end, intro, rule, example, trace = chapter
    selected = folders[start-1:end] if start else []
    body = f'<p class="kicker"><a href="index.html">Python + AI</a> · Chapter {number:02}</p><h1>{E(title)}</h1><p class="lede">{E(intro)}</p><div class="toc"><a href="#reading">Reading</a><a href="#practice">Practice session</a><a href="#end">Save reading progress</a></div>'
    body += f'<div class="rule"><span class="tag">The rule</span><p>{E(rule)}</p></div><h2>Worked example</h2><pre><code>{E(example)}</code></pre><div class="trace"><span class="tag">Trace every line</span><p>{E(trace)}</p></div>'
    if number == 1:
        body += '<div class="need"><span class="tag">Windows setup, step by step</span><ol><li>Install Python from <a href="https://www.python.org/downloads/">python.org</a>. Open a new terminal and run <code>py --version</code>.</li><li>Create a folder called python-practice. Save hello.py there using a code editor or IDLE. Make sure it is not hello.py.txt.</li><li>Open a terminal in that folder and run <code>py hello.py</code>. <code>&gt;&gt;&gt;</code> is the Python prompt, not a terminal prompt. Use <code>exit()</code> to leave it.</li><li>For notebooks, create a virtual environment with <code>py -m venv .venv</code>. In Command Prompt activate it with <code>.venv\\Scripts\\activate.bat</code>, then run <code>python -m pip install jupyterlab</code> and <code>python -m jupyter lab</code>.</li><li>You can also use <a href="https://colab.research.google.com/">Google Colab</a> for notebooks without installing Python. Start by typing examples yourself.</li></ol></div>'
    body += '<div id="reading">'
    for folder in selected:
        readme = (folder / 'README.md').read_text()
        lesson_title = readme.splitlines()[0].lstrip('# ')
        summary, tasks = summaries.get(folder.name[:2], ('Read the examples and change the inputs.', []))
        body += f'<section class="reading" id="lesson-{folder.name[:2]}"><h2>{E(lesson_title)}</h2><p>{E(summary)}</p><div class="lesson-links">'
        for timestamp, url in re.findall(r'\[`([^`]+)`\]\((https://www.youtube.com/[^)]+)\)', readme):
            body += f'<a href="{E(url)}">Watch {E(timestamp)}</a>'
        body += f'<a href="{UPSTREAM}/tree/{REV}/python/{folder.name}">Original resources</a></div>'
        notebooks = sorted(folder.glob('*.ipynb'), key=lambda p: (0 if p.name == 'theory.ipynb' else 1, p.name))
        for notebook in notebooks:
            if 'exercise' in notebook.name:
                continue
            cells = json.loads(notebook.read_text())['cells']
            notes = []
            for cell in cells:
                content = ''.join(cell.get('source', []))
                if not content.strip() or '📺' in content or '📂' in content:
                    continue
                if cell['cell_type'] == 'markdown':
                    # Raw HTML and images in notebooks are omitted from classroom notes.
                    content = re.sub(r'<[^>]+>', '', content)
                    content = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', content)
                    notes.append(content)
                elif cell['cell_type'] == 'code':
                    notes.append('```python\n' + content + '\n```')
            if notes:
                label = 'Read the explanation' if 'theory' in notebook.name else 'Read and trace the code examples'
                body += f'<details {"open" if notebook == notebooks[0] else ""}><summary>{label} · {E(notebook.name)}</summary>{markdown(chr(10).join(notes), "python/" + folder.name)}</details>'
        if not notebooks:
            body += '<p>Start with the chapter guide and worked example above. The video and original PDF provide the accompanying introduction.</p>'
        if tasks:
            body += '<h3>Try it yourself</h3><ol>' + ''.join('<li>' + E(task) + '</li>' for task in tasks) + '</ol><p>These are extra independent tasks. Use the chapter practice below for hints and worked answers.</p>'
        body += '</section>'
    if number == 14:
        ai = (SOURCE / 'ai-concepts' / 'README.md').read_text()
        terms = re.findall(r'^### ([^\n]+)\n(.*?)(?=^### |^## |\Z)', ai, re.M | re.S)
        # Only the 21 concept entries, not resource descriptions or recap.
        for title_ai, section in terms[:21]:
            paragraphs = [p.strip() for p in section.split('\n\n')]
            summary = next((p for p in paragraphs if p.strip() and not p.startswith(('[', '![', '**', '-'))), '')
            summary = summary.replace('When it is full, the oldest content is dropped.', 'When the available context budget is exceeded, the application must truncate, summarize or select content, or the request may be rejected.')
            if title_ai == 'Temperature':
                summary = 'Temperature changes how sharply a model samples from its predicted next-token distribution. Lower values favor higher-probability tokens; higher values allow more variation. Low temperature does not make an answer factually correct or guarantee repeatable output.'
            if title_ai == 'Vectors & Embeddings':
                summary = 'An embedding represents text or another input as a vector of numbers. Embedding models can place related inputs near each other, enabling similarity search. Token embeddings inside a language model and whole-document embeddings used for retrieval serve related but different roles.'
            if title_ai == 'Pretraining':
                summary = 'Pretraining learns broad patterns from a large dataset. For autoregressive language models, a common objective is predicting the next token from preceding tokens. Later training can adapt behavior or specialize the model.'
            activity_key = list(activities)[terms.index((title_ai, section))]
            watch = re.search(r'https://www.youtube.com/[^)]+', section)
            body += f'<section class="reading"><h2>{E(title_ai)}</h2><p>{E(summary)}</p>'
            if watch:
                body += f'<p><a href="{E(watch[0])}">Watch this concept</a></p>'
            body += f'<p><a href="{UPSTREAM}/blob/{REV}/ai-concepts/README.md">Original concept notes and interactive resources</a></p>'
            body += f'<div class="need"><span class="tag">Practice the concept</span><p>{E(activities[activity_key])}</p></div></section>'
    body += '</div>'
    drills = []
    for n, original in enumerate(DRILLS[number-1], 1):
        drills.append(dict(original, id=f'ch{number:02}-q{n}'))
    prompt, hint, answer = WRITING[number-1]
    drills.append(dict(id=f'ch{number:02}-write', prompt=prompt, hint=hint, answer=answer))
    body += practice_html(drills)
    body += '<div class="course-actions chapter-end" id="end"><button type="button" data-complete aria-pressed="false">Mark chapter as read</button><a href="#main">Back to reading</a></div>'
    previous = 'index.html' if number == 1 else f'ch{number-1:02}.html'
    following = f'ch{number+1:02}.html' if number < 14 else 'index.html#projects'
    body += f'<div class="pager"><a href="{previous}">← {"Map" if number == 1 else "Previous chapter"}</a><a href="{following}">{"Next chapter" if number < 14 else "Build a project"} →</a></div>'
    outputs[f'ch{number:02}.html'] = page(title, body, str(number), drills)

PROJECTS = [
 ('Expense tracker', 'expense_tracker.py', 'easy', 'A command-line app that saves expenses between runs. Practice functions, dictionaries, JSON, validation and file errors.',
  ['Create to_cents(text). Accept positive numbers with at most two decimal places. Reject invalid text, negative amounts, NaN and infinity.', 'Load a JSON list from expenses.json. Return [] only when the file is missing. Report malformed data.', 'Implement add and list commands. Add records, show each expense and print the total in EUR.', 'Run the app twice and verify persistence. Reject bad input without overwriting the existing file.'],
  'py expense_tracker.py add 3.50 coffee\npy expense_tracker.py add 12.00 food\npy expense_tracker.py list',
  'Expect Total: 15.50 EUR after those two additions to a new file. Try 1.005, -5, abc and NaN: each must fail. Try an empty category. Then run list again and confirm that valid records remain intact.'),
 ('Search your study notes', 'document_search.py', 'medium', 'Build a lexical document retriever using TF-IDF weighted word overlap. This is a retrieval building block for a future RAG app, without an LLM or embedding model.',
  ['Create notes/python.txt with Python functions return values. Create notes/sql.txt with SQL joins combine tables.', 'Write tokenize(text) using lowercase text and a regular expression. Count document words with Counter.', 'Implement TF-IDF scoring for overlapping query terms. Return the top matches with a stable tie-break by filename.', 'Print the source name, score and evidence. If nothing matches, say so rather than inventing an answer.'],
  'py document_search.py notes "python functions"\npy document_search.py notes "ocean animals"',
  'The first query should rank python.txt first. The second should print No matching evidence found. Test empty files, punctuation, repeated words and mixed case. Explain why lexical overlap cannot match every pair of synonyms.'),
 ('Train a text classifier', 'text_classifier.py', 'hard', 'Train an actual small machine learning model from labeled text using multinomial naive Bayes. Implement training and inference with the standard library. The included dataset is deliberately tiny.',
  ['Separate labeled training data from held-out test data. Tokenize lowercase words without looking at test labels during training.', 'Count documents per label and words per label. Build the training vocabulary.', 'Predict with log priors and add-one-smoothed word likelihoods. Return unknown if no query words are known.', 'Evaluate on the held-out examples, then write your own test set. Include negation and unfamiliar vocabulary and explain the failures.'],
  'py text_classifier.py "great helpful course"\npy text_classifier.py "terrible confusing tutorial"\npy text_classifier.py "astronaut telescope"',
  'Expect positive, negative and unknown respectively. Evaluate your own unseen sentences. Try not good: a bag-of-words model may miss negation. The four supplied test examples are a toy check, not evidence of real-world accuracy.'),
]
for n, (title, file, level, intro, tasks, commands, checks) in enumerate(PROJECTS, 1):
    code = (HERE / 'downloads' / file).read_text()
    body = f'<p class="kicker"><a href="index.html#projects">Python + AI projects</a> · P{n} · {level}</p><h1>{E(title)}</h1><p class="lede">{E(intro)}</p><div class="need"><span class="tag">Build before reading the solution</span><p>Create your own .py file and implement each step. Submit your plan or code below. These project submissions are saved drafts for self-review.</p></div><h2>Build in steps</h2><ol>' + ''.join(f'<li>{E(task)}</li>' for task in tasks) + '</ol>'
    body += f'<h2>Run locally on Windows</h2><pre><code>{E(commands)}</code></pre><p>On macOS or Linux, replace py with python3.</p><h2>Verify the behavior</h2><p>{E(checks)}</p>'
    drills = [dict(id=f'p{n}-s{i}', prompt=task, hint=['Write the input and expected output on paper. Identify the data structure and the function responsible.', 'Use the previous chapters to write the smallest working version. Test one normal case and one invalid case.', 'Trace each function in the reference implementation and compare its behavior with yours.', 'Record the observed output, not just whether the program ran.'][i-1], answer=code if i == 3 else task + '\n\nReview checklist:\n- State the inputs and outputs.\n- Run the normal and edge cases described above.\n- Explain the relevant lines in the complete reference solution.', why='This is a self-review task. Your code has not been executed or graded by the page.') for i, task in enumerate(tasks, 1)]
    body += practice_html(drills)
    body += f'<h2>Complete commented reference</h2><p><a href="downloads/{file}" download>Download {file}</a> · No external Python packages required.</p><details class="reading"><summary>Open the full reference implementation</summary><pre><code>{E(code)}</code></pre></details><h2>Publish your own project</h2><ol><li>Create a GitHub repository for your implementation.</li><li>Add the .py file and a README with setup instructions, sample input, actual output and limitations.</li><li>Explain one change you made beyond the reference. Exclude personal expense files and other private data.</li><li>Link the repository from your portfolio only after you can explain and reproduce its behavior.</li></ol><div class="pager"><a href="index.html#projects">← Project map</a><a href="{f"p{n+1}.html" if n<3 else "../index.html"}">{"Next project" if n<3 else "Learn hub"} →</a></div>'
    outputs[f'p{n}.html'] = page(title, body, practice=drills)

body = '<p class="kicker"><a href="../index.html">Learn with Mynul</a> · Technology</p><h1>Python from scratch, then AI</h1><p class="lede">Fourteen written chapters. Read the rule, trace the examples and practice before opening the answer. Start with your first .py file, learn the Python foundations and then explore AI concepts. Finish with three programs you can run and explain.</p><div class="need"><span class="tag">How to study</span><p>Read → trace → practice → build. Each chapter has four checked questions and one written task with a hint and commented answer. Additional independent exercises follow each original lesson. You can learn from the written pages without watching the video.</p><p>Progress and drafts save in this browser. Written code is for self-review; this site does not run Python. Use Python locally or a notebook to verify your programs.</p></div><label for="course-search">Find a topic</label><input id="course-search" class="course-search" data-search type="search" placeholder="Try slicing, loops, functions or AI"><p data-search-status role="status" aria-live="polite">14 chapters and 3 projects</p><div class="floor"><p class="floor-label">Read and practice</p><h2>Chapter map</h2><div class="grid">'
for n, chapter in enumerate(CHAPTERS, 1):
    body += f'<a class="card" href="ch{n:02}.html" data-course-card><p class="id">Ch{n:02} · <span data-chapter-status="{n}">Open</span></p><h3>{E(chapter[0])}</h3><p>{E(chapter[3])}</p><p>Reading · 4 checks · writing task</p></a>'
body += '</div></div><div class="floor" id="projects"><p class="floor-label">Apply what you learned</p><h2>Three projects, then GitHub</h2><div class="grid">'
for n, (title, file, level, intro, *_) in enumerate(PROJECTS, 1):
    body += f'<a class="card" href="p{n}.html" data-course-card><p class="id">P{n} · {level}</p><h3>{E(title)}</h3><p>{E(intro)}</p></a>'
body += '</div></div><div class="need"><span class="tag">Original course</span><p>Based on Mayank Aggarwal’s Python AI Crash Course. The original video and resource repository remain credited throughout. This site adds a written classroom, practice sessions and project exercises.</p><a href="sources.html">Sources, license and study guide</a></div>'
outputs['index.html'] = page('Course map', body)
body = f'<p class="kicker"><a href="index.html">Python + AI</a></p><h1>Sources and study guide</h1><h2>Original materials</h2><p>Author: Mayank Aggarwal. <a href="{UPSTREAM}">Python AI Crash Course repository</a>. <a href="https://www.youtube.com/watch?v=J9BI0jGOds8">Full course video</a>. <a href="LICENSE-upstream.txt">Original MIT license</a>.</p><p>Adapted from repository revision <code>{REV}</code>. Reading notes are rendered from the original notebooks. Video chapter links, lesson summaries and independent tasks come from the source course. The written chapter guides, checked exercises and three project implementations were added for this classroom.</p><h2>Course coverage</h2><p>The 46 source Python lessons are organized into 13 chapters here. Chapter 14 covers 21 AI terms, including the topics in your timestamp list and later concepts such as RAG and agents. The Python course includes exception handling and object-oriented programming from the source repository.</p><h2>A practical study routine</h2><ol><li>Read one chapter guide and trace its example by hand.</li><li>Expand each lesson’s written notes. Type the examples into a .py file or notebook and change the inputs.</li><li>Answer the four checked questions and write the final program before opening its solution.</li><li>Run your program and compare behavior. Mark the chapter as read when you can explain it.</li><li>Complete the projects using your own implementation. Add a README and actual results to your GitHub repository.</li></ol><h2>Progress and privacy</h2><p>Drafts, solved questions and reading status use localStorage on this browser and device. They are not synced across devices. Clearing browser data removes them. Download or copy important work into your own files.</p><h2>Next after this course</h2><p>This is a foundation, not a full AI engineering qualification. Next learn file formats, HTTP APIs, virtual environments, Git, testing, NumPy, pandas and model evaluation. For an LLM app, build a small backend that keeps credentials private and evaluate answers against a fixed test set.</p><p><a href="index.html">Return to the course map</a></p>'
outputs['sources.html'] = page('Sources and study guide', body)

# Render all markdown in a single subprocess using the installed marked package.
script = 'import {marked} from ' + json.dumps(MARKED) + '; let s=""; for await (const c of process.stdin) s+=c; process.stdout.write(JSON.stringify(JSON.parse(s).map(x=>marked.parse(x))));'
rendered = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', script], input=json.dumps(chunks).encode()))
rendered = [re.sub(r'<(/?)h1>', r'<\1h3>', block) for block in rendered]
for name, text in outputs.items():
    text = re.sub(r'@@MARKDOWN-(\d+)@@', lambda m: rendered[int(m[1])], text)
    (HERE / name).write_text(text)
shutil.copyfile(SOURCE / 'LICENSE', HERE / 'LICENSE-upstream.txt')
print(f'Built {len(outputs)} pages, {len(chunks)} notebook reading sections, 56 checked questions, 14 writing tasks and 3 projects.')
