---
title: Creating a Blog with Gatsby
path: /getting-started-with-gatsby
date: '2017-07-17T17:12:33.962Z'
tags:
  - gatsby
  - react
  - javascript
image: preview.png
excerpt: Part 01 ~ Gatsby is an incredible static site generator that lets you build a static site that still has all the benefits expected from a modern web application. In this tutorial, we'll create a static blog, and get an in-depth look at Gatsby and its feature-set.
---

_This blog post was originally published at [Object Partners, Inc.](https://objectpartners.com/2017/07/19/creating-a-static-blog-with-gatsby/), and has since been cross-posted to the [official gatsby blog](https://www.gatsbyjs.org/blog/2017-07-19-creating-a-blog-with-gatsby/)_

Gatsby is an incredible static site generator that allows for React to be used as the underlying rendering engine to scaffold out a static site that truly has all the benefits expected in a modern web application. It does this by rendering dynamic React components into static HTML content via [server side rendering][react-dom-server] at build time. This means that your users get all the benefits of a static site such as the ability to work without JavaScript, search engine friendliness, speedy load times, etc. without losing the dynamism and interactivity that is expected of the modern web. Once rendered to static HTML, client-site React/JavaScript _can_ take over (if creating stateful components or logic in `componentDidMount`) and add dynamism to the statically generated content.

Gatsby [recently released][gatsby-release] a v1.0.0 with a bunch of new features, including (but not limited to) the ability to create content queries with GraphQL, integration with various CMSs--including WordPress, Contentful, Drupal, etc., and route based code splitting to keep the end-user experience as snappy as possible. In this post, we'll take a deep dive into Gatsby and some of these new features by creating a static blog. Let's get on it!

## Getting started

### Installing the CLI

`npm install -g gatsby`

Gatsby ships with a great CLI (command line interface) that contains the functionality of scaffolding out a working site, as well as commands to help develop the site once created.

`gatsby new personal-blog && cd $_`

This command will create the folder `personal-blog` and then change into that directory. A working `gatsby` statically generated application can now be developed upon. The Gatsby CLI includes many common development features such as `gatsby build` (build a production, statically generated version of the project), `gatsby develop` (launch a hot-reload enabled web development server), etc.

We can now begin the exciting task of _actually_ developing on the site, and creating a functional, modern blog. You'll generally want to use `gatsby develop` to launch the local development server to validate functionality as we progress through the steps.

## Adding necessary plugins

Gatsby supports a [rich plugin interface][gatsby-plugins], and many incredibly useful plugins have been authored to make accomplishing common tasks a breeze. Plugins can be broken up into three main categories: **functional** plugins, **source** plugins, and **transformer** plugins.

### Functional plugins

Functional plugins either implement some functionality (e.g. offline support, generating a sitemap, etc.) _or_ they extend Gatsby's webpack configuration adding support for typescript, sass, etc.

For this particular blog post, we want a single page app-like feel (without page reloads), as well as the ability to dynamically change the `title` tag within the `head` tags. As noted, the Gatsby plugin ecosystem is rich, vibrant, and growing, so oftentimes a plugin already exists that solves the particular problem you're trying to solve. To address the functionality we want for _this_ blog, we'll use the following plugins:

- [`gatsby-plugin-catch-links`][gatsby-plugin-catch-links]
  - implements the history `pushState` API, and does not require a page reload on navigating to a different page in the blog
- [`gatsby-plugin-react-helmet`][gatsby-plugin-react-helmet]
  - [react-helmet][react-helmet] is a tool that allows for modification of the `head` tags; Gatsby statically renders any of these `head` tag changes

with the following command:

```bash
yarn add gatsby-plugin-catch-links gatsby-plugin-react-helmet
```

We're using [yarn][yarn], but npm can just as easily be used with `npm i --save [deps]`.

After installing each of these functional plugins, we'll edit `gatsby-config.js`, which Gatsby loads at build-time to implement the exposed functionality of the specified plugins.

```javascript{6}
module.exports = {
  siteMetadata: {
    title: `Your Name - Blog`,
    author: `Your Name`
  },
  plugins: ['gatsby-plugin-catch-links', 'gatsby-plugin-react-helmet']
};

```

Without any additional work besides a `yarn install` and editing a config file, we now have the ability to edit our site's head tags, as well as implement a single page app feel without reloads. Now let's enhance the base functionality by implementing a source plugin which can load blog posts from our local file system.

### Source plugins

Source plugins create _nodes_ which can then be transformed into a usable format (if not already usable) by a transformer plugin. For instance, a typical workflow often involves using [`gatsby-source-filesystem`][gatsby-source-filesystem], which loads files off of disk--e.g. Markdown files--and then specifying a Markdown transformer to transform the Markdown into HTML.

Since the bulk of the blog's content, and each article, will be authored in Markdown, let's add that [`gatsby-source-filesystem`][gatsby-source-filesystem] plugin. Similarly to our previous step, we'll install the plugin and then inject into our `gatsby-config.js`, like so:

```bash
yarn add gatsby-source-filesystem
```

```javascript{6-12}
module.exports = {
  // previous configuration
  plugins: [
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    }
  ]
};

```

Some explanation will be helpful here! An `options` object can be passed to a plugin, and we're passing the filesystem `path` (i.e. where our Markdown files will be located), and then a `name` for the source files. Now that Gatsby knows about our source files, we can begin applying some useful transformers to convert those files into usable data!

### Transformer plugins

As mentioned, a transformer plugin takes some underlying data format that is not inherently usable in its current form (e.g. Markdown, json, yaml, etc.), and transforms it into a format that Gatsby can understand, and that we can query against with GraphQL. Jointly, the filesystem source plugin will load file nodes (as Markdown) off of our filesystem, and then the Markdown transformer will take over and convert to usable HTML.

We'll only be using one transformer plugin (for Markdown), so let's get that installed.

- [gatsby-transformer-remark][gatsby-transformer-remark]
  - Uses the [remark][remark] Markdown parser to transform .md files on disk into HTML; additionally this transformer can optionally take plugins to further extend functionality--e.g. add syntax highlighting with `gatsby-remark-prismjs`, `gatsby-remark-copy-linked-files` to copy relative files specified in markdown, `gatsby-remark-images` to compress images and add responsive images with `srcset`, etc.

The process should be familiar by now, install and then add to config.

```bash
yarn add gatsby-transformer-remark
```

and editing `gatsby-config.js`

```javascript{14-18}
module.exports = {
  // previous setup
  plugins: [
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [] // just in case those previously mentioned remark plugins sound cool :)
      }
    }
  ]
};

```

Whew! Seems like a lot of set up, but collectively these plugins are going to super charge Gatsby, and give us an incredibly powerful (yet relatively simple!) development environment. We have one more set up step and it's an easy one. We're simply going to create a Markdown file that will contain the content of our first blog post. Let's get to it.

Let's proceed on to Part 02...


![Dream Bigger](./images/dream-bigger.jpeg)

## Links

- [`@dschau/gatsby-blog-starter-kit`][source-code]
  - A working repo demonstrating all of the aforementioned functionality of Gatsby
- [`@dschau/create-gatsby-blog-post`][create-gatsby-blog-post]
  - A utility and CLI I created to scaffold out a blog post following the predefined Gatsby structure with frontmatter, date, path, etc.
- [Source code for my blog][blog-source-code]
  - The source code for my blog, which takes the gatsby-starter-blog-post (previous link), and expands upon it with a bunch of features and some more advanced functionality

[react-dom-server]: https://facebook.github.io/react/docs/react-dom-server.html
[gatsby-release]: https://gatsbyjs.org/blog/gatsby-v1/
[gatsby-plugins]: https://gatsbyjs.org/docs/plugins/
[gatsby-plugin-catch-links]: https://gatsbyjs.org/packages/gatsby-plugin-catch-links/
[gatsby-plugin-react-helmet]: https://gatsbyjs.org/packages/gatsby-plugin-react-helmet/
[gatsby-plugin-preact]: https://gatsbyjs.org/packages/gatsby-plugin-preact/
[gatsby-transformer-remark]: /packages/gatsby-transformer-remark/
[remark]: https://github.com/wooorm/remark
[gatsby-source-filesystem]: /packages/gatsby-source-filesystem/
[react-helmet]: https://github.com/nfl/react-helmet

[frontmatter]: https://jekyllrb.com/docs/frontmatter/
[learn-graphql]: https://www.howtographql.com
[node-spec]: https://gatsbyjs.org/docs/node-apis/
[gatsby-bound-action-creators]: https://www.gatsbyjs.org/docs/bound-action-creators/
[styled-components]: https://github.com/styled-components/styled-components
[yarn]: https://yarnpkg.com/en/

[source-code]: https://github.com/dschau/gatsby-blog-starter-kit
[blog-source-code]: https://github.com/dschau/blog
[create-gatsby-blog-post]: https://github.com/DSchau/create-gatsby-blog-post
