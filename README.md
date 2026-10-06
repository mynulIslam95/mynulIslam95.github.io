# Mynul Islam — portfolio site

Pine / parchment personal site for junior DevOps, cloud, systems admin, and IT support applications.

## Local

Open `index.html` in a browser, or:

```bash
cd portfolio
python3 -m http.server 8080
```

Then go to http://localhost:8080

## Publish on GitHub Pages

This folder is a standalone git repo. From here:

```bash
cd portfolio
git remote add origin https://github.com/mynulIslam95/mynulIslam95.github.io.git
git push -u origin main
```

In the GitHub repo: **Settings → Pages → Deploy from branch → main**.  
Site URL will be https://mynulislam95.github.io/

If you already have a Pages repo, push this folder as `gh-pages` or copy `index.html`, `mynul_photo.JPG`, and `cv.pdf` into it.

## Files

| File | Use |
|------|-----|
| `index.html` | Full site |
| `mynul_photo.JPG` | Nav + about |
| `cv.pdf` | Download CV (NXP DevOps one-pager; swap when you have a general IT CV) |
