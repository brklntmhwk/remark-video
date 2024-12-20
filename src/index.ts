/// <reference types="mdast-util-directive" />

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ElementContent } from "hast";
import type { PhrasingContent, Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import {
	isContainerDirective,
	isLeafDirective,
	isParagraph,
	isText,
} from "./utils.js";

export type Config = {
	baseUrl?: string;
	publicDir?: string;
	videoContainerTag?: string;
	videoContainerClass?: string;
	fallbackContent?: Readonly<ElementContent> | null | undefined;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertMp4To = (path: string, format: string) =>
	`${path.slice(0, -3)}${format}`;

const remarkVideo: Plugin<[Config], Root> = (config) => {
	const {
		baseUrl = "",
		publicDir = "./public",
		videoContainerTag = "div",
		videoContainerClass,
		fallbackContent,
	} = config;

	return (tree) => {
		visit(tree, isLeafDirective, (node) => {
			if (node.name !== "video") return;
			if (!node.attributes?.src || !node.attributes?.src.endsWith("mp4"))
				return;

			let title: string | undefined = undefined;

			if (node.children.length > 0 && isText(node.children[0])) {
				title = node.children[0].value;
			}

			const pathToMp4Video = path.join(
				__dirname,
				publicDir,
				node.attributes.src,
			);
			const pathToWebMVideo = convertMp4To(pathToMp4Video, "webm");
			const pathToOggVideo = convertMp4To(pathToMp4Video, "ogg");
			const mp4VideoUrl = path.join(baseUrl, node.attributes.src);

			const sources: ElementContent[] = [];

			if (fs.existsSync(pathToWebMVideo)) {
				sources.push({
					type: "element",
					tagName: "source",
					properties: {
						src: convertMp4To(mp4VideoUrl, "webm"),
						type: "video/webm",
					},
					children: [],
				});
			}

			if (fs.existsSync(pathToOggVideo)) {
				sources.push({
					type: "element",
					tagName: "source",
					properties: {
						src: convertMp4To(mp4VideoUrl, "ogg"),
						type: "video/ogg",
					},
					children: [],
				});
			}

			sources.push({
				type: "element",
				tagName: "source",
				properties: {
					src: mp4VideoUrl,
					type: "video/mp4",
				},
				children: [],
			});

			if (fallbackContent) {
				sources.push(fallbackContent);
			}

			node.data = {
				...node.data,
				hName: videoContainerTag,
				hProperties: {
					class: videoContainerClass || node.attributes?.class || undefined,
					title: title,
					dataRemarkVideoFigure: true,
				},
				hChildren: [
					{
						type: "element",
						tagName: "video",
						properties: {
							controls: true,
							preload: "metadata",
							width: "100%",
						},
						children: sources,
					},
				],
			};
		});

		visit(tree, isContainerDirective, (node) => {
			if (node.name !== "video") return;
			if (node.children.length === 0) return;

			const [firstNode, secondNode, ..._restNodes] = node.children;
			if (!isParagraph(firstNode)) return;
			if (firstNode.children.length === 0) return;

			let title: string | undefined = undefined;
			let url: PhrasingContent;

			if (firstNode.data?.directiveLabel === true) {
				if (firstNode.children.length > 0 && isText(firstNode.children[0])) {
					title = firstNode.children[0].value;
				}

				if (!isParagraph(secondNode)) return;
				if (secondNode.children.length === 0) return;
				url = secondNode.children[0];
			} else {
				url = firstNode.children[0];
			}

			if (!isText(url)) return;
			if (!url.value.endsWith("mp4")) return;

			const pathToMp4Video = path.join(__dirname, publicDir, url.value);
			const pathToWebMVideo = convertMp4To(pathToMp4Video, "webm");
			const pathToOggVideo = convertMp4To(pathToMp4Video, "ogg");
			const mp4VideoUrl = path.join(baseUrl, url.value);

			const sources: ElementContent[] = [];

			if (fs.existsSync(pathToWebMVideo)) {
				sources.push({
					type: "element",
					tagName: "source",
					properties: {
						src: convertMp4To(mp4VideoUrl, "webm"),
						type: "video/webm",
					},
					children: [],
				});
			}

			if (fs.existsSync(pathToOggVideo)) {
				sources.push({
					type: "element",
					tagName: "source",
					properties: {
						src: convertMp4To(mp4VideoUrl, "ogg"),
						type: "video/ogg",
					},
					children: [],
				});
			}

			sources.push({
				type: "element",
				tagName: "source",
				properties: {
					src: mp4VideoUrl,
					type: "video/mp4",
				},
				children: [],
			});

			if (fallbackContent) {
				sources.push(fallbackContent);
			}

			node.data = {
				...node.data,
				hName: videoContainerTag,
				hProperties: {
					...node.attributes,
					class: videoContainerClass || node.attributes?.class || undefined,
					title: title,
					dataRemarkVideoFigure: true,
				},
				hChildren: [
					{
						type: "element",
						tagName: "video",
						properties: {
							controls: true,
							preload: "metadata",
							width: "100%",
						},
						children: sources,
					},
				],
			};
		});
	};
};

export default remarkVideo;
