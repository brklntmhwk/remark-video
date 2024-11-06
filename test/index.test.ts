// https://bun.sh/docs/cli/test

import { describe, expect, mock, test } from "bun:test";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkCard, { type Config } from "../src/index.js";

const normalizeHtml = (html: string) => {
	return html.replace(/[\n\s]*(<)|>([\n\s]*)/g, (_match, p1, _p2) =>
		p1 ? "<" : ">",
	);
};

const parseMarkdown = mock(
	async (markdown: string, options: Config, debug = false) => {
		const remarkProcessor = unified()
			.use(remarkParse)
			.use(remarkDirective)
			.use(remarkCard, options)
			.use(remarkRehype)
			.use(rehypeStringify);

		if (debug) {
			const remarkOutput = await remarkProcessor.run(
				remarkProcessor.parse(markdown),
			);
			console.log("Remark output:", JSON.stringify(remarkOutput, null, 2));
		}

		const output = String(await remarkProcessor.process(markdown));

		if (debug) {
			console.log(
				`HTML output:
      ${normalizeHtml(output)}`,
			);
		}

		return output;
	},
);

describe("Test the basic usage of video", () => {
	const BASE_URL = "https:\\BASE_URL.com";

	test("Double-colon & mp4-only ver. of video", async () => {
		const input = "::video{src=/videos/sample-video-1.mp4}";
		const output = `
    <div data-remark-video-figure>
      <video controls preload="metadata">
        <source src="${BASE_URL}/videos/sample-video-1.mp4" type="video/mp4">
      </video>
    </div>
    `;

		const html = await parseMarkdown(input, {
			baseUrl: BASE_URL,
			publicDir: "../public",
		});

		expect(normalizeHtml(html)).toBe(normalizeHtml(output));
	});

	test("Triple-colon & mp4-only ver. of video", async () => {
		const input = `
  :::video
  /videos/sample-video-1.mp4
  :::
    `;
		const output = `
    <div data-remark-video-figure>
      <video controls preload="metadata">
        <source src="${BASE_URL}/videos/sample-video-1.mp4" type="video/mp4">
      </video>
    </div>
    `;

		const html = await parseMarkdown(input, {
			baseUrl: BASE_URL,
			publicDir: "../public",
		});

		expect(normalizeHtml(html)).toBe(normalizeHtml(output));
	});

	test("Double-colon & mp4-and-webm ver. of video", async () => {
		const input = "::video{src=/videos/sample-video-2.mp4}";
		const output = `
    <div data-remark-video-figure>
      <video controls preload="metadata">
        <source src="${BASE_URL}/videos/sample-video-2.webm" type="video/webm">
        <source src="${BASE_URL}/videos/sample-video-2.mp4" type="video/mp4">
      </video>
    </div>
    `;

		const html = await parseMarkdown(input, {
			baseUrl: BASE_URL,
			publicDir: "../public",
		});

		expect(normalizeHtml(html)).toBe(normalizeHtml(output));
	});

	test("Double-colon & mp4-only ver. of video with the class name option", async () => {
		const input = "::video{src=/videos/sample-video-1.mp4}";
		const output = `
    <div class="video-container" data-remark-video-figure>
      <video controls preload="metadata">
        <source src="${BASE_URL}/videos/sample-video-1.mp4" type="video/mp4">
      </video>
    </div>
    `;

		const html = await parseMarkdown(input, {
			baseUrl: BASE_URL,
			publicDir: "../public",
			videoContainerClass: "video-container",
		});

		expect(normalizeHtml(html)).toBe(normalizeHtml(output));
	});

	test("Double-colon & mp4-only ver. of video with the container tag name option", async () => {
		const input = "::video{src=/videos/sample-video-1.mp4}";
		const output = `
    <figure data-remark-video-figure>
      <video controls preload="metadata">
        <source src="${BASE_URL}/videos/sample-video-1.mp4" type="video/mp4">
      </video>
    </figure>
    `;

		const html = await parseMarkdown(input, {
			baseUrl: BASE_URL,
			publicDir: "../public",
			videoContainerTag: "figure",
		});

		expect(normalizeHtml(html)).toBe(normalizeHtml(output));
	});
});
