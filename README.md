# Woodlands CS Website

An educational platform featuring interactive Python code execution and computer science tutorials. I originally built this website during my final year of high school for The Woodlands School's Computer Science Club. It is currently maintained as a personal project.
Visit the site: [woodlands.codes](https://woodlands.codes){:target="_blank"}

### Features

The site combines interactive coding with comprehensive tutorials through:
- In-browser Python code execution powered by Pyodide and Ace Editor, as seen in the [Introduction to Programming](https://woodlands.codes/group-a/2021/10/18/lesson-1.html){:target="_blank"} post
- Step-by-step tutorials from [Python fundamentals](https://woodlands.codes/group-a/2021/10/25/lesson-2.html){:target="_blank"} to [networking concepts](https://woodlands.codes/group-b/2022/02/14/group-b-lesson-9.html){:target="_blank"} to [cryptography](https://woodlands.codes/group-b/2022/02/14/group-b-lesson-10.html){:target="_blank"}
- LaTeX support for mathematical content and algorithm explanations

### Technical Stack

Built with Jekyll and Ruby, hosted on GitHub Pages. The interactive code editor is implemented as a custom web component using Pyodide for Python execution in a web worker, with Ace Editor providing syntax highlighting and code editing capabilities. MathJax is used for TeX output.

### Local Development

```bash
# Install dependencies
bundle install

# Start local server
bundle exec jekyll serve
```

### License

Licensed under the [MIT License](https://opensource.org/license/mit){:target="_blank"}.