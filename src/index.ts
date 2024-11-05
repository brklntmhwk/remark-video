/// <reference types="mdast-util-directive" />

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ElementContent } from "hast";
import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { isContainerDirective, isLeafDirective, isParagraph } from "./utils.js";

export type Config = {
  baseUrl: string;
  publicDir: string;
  videoContainerClass?: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertMp4ToWebM = (path: string) => `${path.slice(0, -3)}webm`;

const remarkVideo: Plugin<[Config], Root> = (config) => {
  const { baseUrl, publicDir, videoContainerClass } = config;

  return (tree) => {
    visit(tree, isLeafDirective, (node) => {
      if (node.name !== "video") return;
      if (!node.attributes?.src || !node.attributes?.src.endsWith("mp4"))
        return;

      const pathToMp4Video = path.join(
        __dirname,
        publicDir,
        node.attributes.src
      );
      const pathToWebMVideo = convertMp4ToWebM(pathToMp4Video);
      const mp4VideoUrl = path.join(baseUrl, node.attributes.src);

      const sources: ElementContent[] = [];

      if (fs.existsSync(pathToWebMVideo)) {
        sources.push({
          type: "element",
          tagName: "source",
          properties: {
            src: convertMp4ToWebM(mp4VideoUrl),
            type: "video/webm",
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

      node.data = {
        ...node.data,
        hName: "div",
        hProperties: {
          class: videoContainerClass || node.attributes?.class || undefined,
        },
        hChildren: [
          {
            type: "element",
            tagName: "video",
            properties: {
              controls: true,
              preload: "metadata",
            },
            children: sources,
          },
        ],
      };
    });

    visit(tree, isContainerDirective, (node) => {
      if (node.name !== "video") return;
      if (node.children.length === 0) return;

      const firstNode = node.children[0];
      if (!isParagraph(firstNode)) return;
      if (firstNode.children.length === 0) return;

      const url = firstNode.children[0];
      if (url.type !== "text") return;
      if (!url.value.endsWith("mp4")) return;

      const pathToMp4Video = path.join(__dirname, publicDir, url.value);
      const pathToWebMVideo = convertMp4ToWebM(pathToMp4Video);
      const mp4VideoUrl = path.join(baseUrl, url.value);

      const sources: ElementContent[] = [];

      if (fs.existsSync(pathToWebMVideo)) {
        sources.push({
          type: "element",
          tagName: "source",
          properties: {
            src: convertMp4ToWebM(mp4VideoUrl),
            type: "video/webm",
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

      node.data = {
        ...node.data,
        hName: "div",
        hProperties: {
          ...node.attributes,
          class: videoContainerClass || node.attributes?.class || undefined,
        },
        hChildren: [
          {
            type: "element",
            tagName: "video",
            properties: {
              controls: true,
              preload: "metadata",
            },
            children: sources,
          },
        ],
      };
    });
  };
};

export default remarkVideo;
