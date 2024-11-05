# remark-video

A remark plugin to parse video component(s).

## Features

- Compatible with [the proposed generic syntax](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444/1) for custom directives/plugins in Markdown
- Fully customizable styles
- Written in TypeScript
- ESM only

## How to Use

### Installation

To install the plugin:

With `npm`:

```bash
npm install remark-video
```

With `yarn`:

```bash
yarn add remark-video
```

With `pnpm`:

```bash
pnpm add remark-video
```

With `bun`:

```bash
bun install remark-video
```

### Usage

General usage:

```js
import rehypeStringify from "rehype-stringify";
import remarkVideo from "remark-video";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const BASE_URL = "https:\\BASE_URL.com";

const normalizeHtml = (html: string) => {
  return html.replace(/[\n\s]*(<)|>([\n\s]*)/g, (_match, p1, _p2) =>
    p1 ? "<" : ">"
  );
};

const parseMarkdown = async (markdown: string) => {
  const remarkProcessor = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkVideo, { baseUrl: BASE_URL, publicDir: "./public" })
    .use(remarkRehype)
    .use(rehypeStringify);

  const output = String(await remarkProcessor.process(markdown));

  return output;
}

const input_1 = `::video{src=\/videos\/sample-video.mp4}`;
const input_2 = `
:::video
${BASE_URL}\\videos\\sample-video.mp4
:::
`;

const html_1 = await parseMarkdown(input_1);
const html_2 = await parseMarkdown(input_2);

console.log(normalizeHtml(html_1));
console.log(normalizeHtml(html_2));
```

Yields: (Both the `html_1` and `html_2` yields the same output)

```html
<div>
  <video controls preload="metadata">
    <source src="${BASE_URL}\\videos\\sample-video.mp4" type="video/mp4">
  </video>
</div>
```

At the moment, it takes the following option(s):

```ts
export type Config = {
  baseUrl: string; // e.g., your website's URL
  publicDir: string; // A relative path to your public directory from the current working directory
  videoContainerClass?: string;
}
```

> [!NOTE]
> Why is the triple-colon version provided?
> \- Since [MDX 2](https://mdxjs.com/blog/v2/), the compiler has come to throw an error "Could not parse expression with acorn: $error" whenever there are unescaped curly braces and the expression inside them is invalid. This breaking change leads the directive syntax (`::xxx{a=b}`) to cause the error, so the options are like an escape hatch for that situation.

For more possible patterns and in-depths explanations on the generic syntax(e.g., `:::something[...]{...}`), see `./test/index.test.ts` and [this page](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444/1), respectively.

### Syntax

#### card

For example, the following Markdown content:

```markdown
::video{src=/videos/sample-video.mp4}
```

Or

```markdown
:::video
/videos/sample-video.mp4
:::
```

Yields:

```html
<div>
  <video controls preload="metadata">
    <source src="/videos/sample-video.mp4" type="video/mp4">
  </video>
</div>
```

### Astro

If you want to use this in your [Astro](https://astro.build/) project, note that you need to install `remark-directive` and add it to the `astro.config.{js,mjs,ts}` file simultaneously.

```ts title="astro.config.ts"
import { defineConfig } from 'astro/config';
import remarkVideo from "remark-video";
import remarkDirective from "remark-directive";
// ...

export default defineConfig({
  // ...
  markdown: {
    // ...
    remarkPlugins: [
      // ...
      remarkDirective,
      remarkVideo,
      // ...
    ]
    // ...
  }
  // ...
})
```

### How it works

Some key takeaways are:

- `publicDir`
- Both `card` and `card-grid` take common & custom HTML attributes
  - their styles are customizable by providing user-defined CSS class(es)
    - e.g., `border`, `background-color`, etc.
- The default values of this plugin's options:
  - `customHTMLTags.enabled`: `false`
  - `imageContainerClass`: "image-container"
  - `contentContainerClass`: "content-container"
  - `cardGridClass`: `undefined`
  - `cardClass`: `undefined`

## Feature(s) pending to be added

Nothing special.

## TODO(s)

- [ ] add a demo screenshot of the actual implementation to this page

## License

This project is licensed under the MIT License, see the LICENSE file for more details.