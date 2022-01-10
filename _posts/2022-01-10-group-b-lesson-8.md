---
layout: post
title: Web Dev - HTML/CSS Intro
date: 2022-01-10 00.00.00 -0400
categories: group-b
tags: [web development, html, css]
current_page: lessons
code_editor: false
---

## Introduction

Hey Group B! This meeting introduces the basics of HTML and CSS. It's the first meeting of a series, with the goal of *building your own personal website*!

If you're interested in learning how, then make sure to come to our meetings! We explored some fundamentals of web development in our previous meeting [Web Development Concepts](https://woodlands.codes/group-b/2021/11/15/group-b-lesson-5.html){:target="_blank"}, so if you find the concepts confusing, take a moment to refresh.

This lesson will have a lot of overlap for the sake of reducing confusion. Since the previous lesson focused more on *theoretical concepts* and provided a broad overview of topics, this lesson will focus on *HTML basics* to help you write your first lines of code!

If you're not sure what "web development" is, check out the ["What is Web Development?"](https://woodlands.codes/group-b/2021/11/15/group-b-lesson-5.html#h-what-is-web-development){:target="_blank"} section on our previous post. Spoiler alert, it's making websites.

We won't be introducing any web design frameworks at first, instead teaching basic HTML/CSS concepts first. But if you want to know what's out there, many frameworks and languages are listed in [this table](https://woodlands.codes/group-b/2021/11/15/group-b-lesson-5.html#h-languages-and-frameworks){:target="_blank"}!

That's enough talking, now let's go over all *you* need to do to build your first website!

## Becoming a Web Developer

As a brief recap, a *web page* is a document written in HTML, styled in CSS, and made dynamic in JavaScript, that the browser renders. We'll begin with writing HTML, since it's at the core of every website no matter what.

[I spent 2 days trying to embed Ace code editor here--tragic failure--check back in a week]

HTML is really easy to learn! There are great resources online like [w3schools](https://www.w3schools.com/){:target="_blank"} and [learn-html.org](https://www.learn-html.org/){:target="_blank"}. This lesson isn't meant to teach you everything about HTML, only to get you started. Learning requires active work and self-study!

## Getting Started

### Editing HTML

You can edit HTML with any text editor, even something as basic as Notepad (for PC users)! Any file saved as `.htm` or `.html` can be opened in your browser as a web page.

There are also many online tools like w3schools, as previously mentioned, [replit](https://replit.com){:target="_blank"}, and [jsfiddle](https://jsfiddle.net/){:target="_blank"}.

Or consider downloading a more advanced text editor!

### HTML Elements

{% highlight html %}
<tag>Content</tag>
{% endhighlight %}

HTML elements can contain other elements.

{% highlight py %}
<ul>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>
{% endhighlight %}

<ul>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>

HTML elements can by styled with CSS.

{% highlight py %}
<p style="color:red">CS Club</p>
{% endhighlight %}

<p style="color:red">CS Club</p>

### Common HTML Tags

* `html` - should be the tag that wraps everything
* `script` - run something that is Javascript
* `a` -  a link to somewhere
* `div` - a divider that is usually used to separate the content
* `head` and `header` - some metadata and non-content information related to the page
* `h1` to `h6` - some header on the page; like for a title of a paragraph
* `p` - a paragraph
* `svg` and `img` - an SVG or some display a image (found at some link)

## Hosting a Website

Websites that are visited on the internet are all hosted on servers. Registering a domain is recommended, domain names remove the need to type the IP address of your web server and makes it easier to remember.
* Top level domains (.com, .net) are managed by ICANN.
* To register a domain name, people go through registrar companies like GoDaddy, Namecheap, Hover, Google Domains, etc.
* Self-hosting websites is possible, most websites are run with hosting providers.

[GitHub Pages](https://pages.github.com/){:target="_blank"} is a free option for statically hosting websites, and is great for personal websites!
The domain is: "yournamehere.github.io".

So that's it for this week, get started on your HTML/CSS journey!
