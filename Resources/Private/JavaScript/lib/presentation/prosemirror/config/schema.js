import {Schema} from 'prosemirror-model';
import {schema, marks} from 'prosemirror-schema-basic';
import {addListNodes} from 'prosemirror-schema-list';

export default new Schema({
	nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
	marks: {
		...marks,
		subscript: {
			excludes: 'superscript',
			parseDOM: [
				{tag: 'sub'},
				{style: 'vertical-align=sub'}
			],
			toDOM: () => ['sub']
		},
		superscript: {
			excludes: 'subscript',
			parseDOM: [
				{tag: 'sup'},
				{style: 'vertical-align:super'}
			],
			toDOM: () => ['sup']
		},
		strikethrough: {
			parseDOM: [
				{tag: 'strike'},
				{tag: 's'},
				{style: 'text-decoration:line-through'},
				{style: 'text-decoration-line:line-through'}
			],
			toDOM: () => ['s']
		},
		underline: {
			parseDOM: [
				{tag: 'u'},
				{style: 'text-decoration:underline'}
			],
			toDOM: () => ['u']
		}
	}
});
