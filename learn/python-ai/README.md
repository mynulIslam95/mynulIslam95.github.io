# Python + AI classroom

Fourteen static written chapters and three project sessions, following the existing C classroom's stylesheet and theme controls. Added to the Learn with Mynul hub at `/learn/`.

- 46 upstream Python lessons with 73 rendered notebook sections
- 21 AI concept entries
- 56 case-sensitive checked questions
- 14 written exercises with hints and commented reference answers
- 3 standard-library projects with downloadable reference implementations
- Browser-local drafts, solved questions and reading progress

The site does not execute Python. Output questions check text. Writing and project submissions explicitly use self-review, not automatic grading.

## Attribution

Reading notes, lesson summaries, video links and independent tasks are adapted from [Mayank Aggarwal's Python AI Crash Course](https://github.com/mayank953/python-ai-crash-course). Its MIT license is included as `LICENSE-upstream.txt`. `sources.html` records the exact source revision. Original materials remain linked from each lesson.

## Regenerate

Use Python 3.12+, Node and the `marked` JavaScript package. Clone the upstream repository separately, then check out the revision recorded in `sources.html`. The generator reads upstream notebook JSON and literal content data without executing upstream scripts or notebooks.

```sh
python build_course.py /absolute/path/to/python-ai-crash-course /absolute/path/to/marked/lib/marked.esm.js
```

Edit chapter guides and exercises in `course_content.py`. The generator writes the HTML pages. The shared C course CSS remains the source of the base visual style.
