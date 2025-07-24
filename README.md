# teslaconsole GitHub Pages

This directory contains a static version of the teslaconsole web app, ready to be deployed to GitHub Pages.

## How to Deploy to GitHub Pages

1. **Push the `GithubPages` folder to your repository.**
   - Make sure all files (HTML, CSS, JS, images, etc.) are inside the `GithubPages` directory.

2. **Configure GitHub Pages:**
   - Go to your repository on GitHub.
   - Click on **Settings** > **Pages**.
   - Under **Source**, select the branch (usually `main` or `master`) and set the folder to `/GithubPages`.
   - Save your changes.

3. **Access your site:**
   - After a few moments, your site will be available at `https://<your-username>.github.io/<your-repo>/`.

## Notes
- Only static content is supported. Dynamic server-side features from ASP.NET Core are not available.
- Update asset references in your HTML if you add new files.
- For custom domains, configure in the GitHub Pages settings.

---

For more details, see the [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages).
