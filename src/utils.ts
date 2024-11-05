import type { Paragraph, Text } from "mdast";
import type { ContainerDirective, LeafDirective } from "mdast-util-directive";
import type { Node } from "unist";

function isObject(target: unknown): target is { [k: string]: unknown } {
	return typeof target === "object" && target !== null;
}

function isNode(node: unknown): node is Node {
	return isObject(node) && "type" in node;
}

function is<T extends Node>(node: unknown, type: string): node is T {
	return isNode(node) && node.type === type;
}

export function isParagraph(node: unknown): node is Paragraph {
	return is(node, "paragraph");
}

export function isText(node: unknown): node is Text {
	return is(node, "text");
}

export function isLeafDirective(node: unknown): node is LeafDirective {
	return is(node, "leafDirective");
}

export function isContainerDirective(
	node: unknown,
): node is ContainerDirective {
	return is(node, "containerDirective");
}
