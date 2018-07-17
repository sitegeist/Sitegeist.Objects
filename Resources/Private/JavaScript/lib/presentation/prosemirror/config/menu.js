import {lift, setBlockType, toggleMark} from 'prosemirror-commands';
import {redo, undo} from 'prosemirror-history';
import {wrapInList} from 'prosemirror-schema-list';

import schema from './schema';

const markActive = type => state => {
	const {from, $from, to, empty} = state.selection;

	return empty ?
		type.isInSet(state.storedMarks || $from.marks()) :
		state.doc.rangeHasMark(from, to, type);
};

const blockActive = (type, attrs = {}) => state => {
	const {$from, to, node} = state.selection;

	if (node) {
		return node.hasMarkup(type, attrs);
	}

	return to <= $from.end() && $from.parent.hasMarkup(type, attrs);
};

const markApplies = (doc, ranges, type) => {
	for (let i = 0; i < ranges.length; i++) {
		const {$from, $to} = ranges[i];
		let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;

		doc.nodesBetween($from.pos, $to.pos, node => {
			if (can) {
				return false;
			}
			can = node.inlineContent && node.type.allowsMarkType(type);
		});

		if (can) {
			return true;
		}
	}
	return false;
};

const getHrefFromState = state => {
	const {from, to} = state.selection;
	let href = null;

	state.doc.nodesBetween(from, to, node => {
		if (href) {
			return;
		}
		node.marks.forEach(mark => {
			if (href) {
				return;
			}
			href = mark.attrs.href;
		});
	});

	return href;
};

export default [{
	name: 'block-basic',
	items: [{
		name: 'block-basic',
		type: 'select',
		items: [{
			name: 'paragraph',
			value: 'p',
			icon: 'icon-paragraph',
			label: 'Absatz',
			isActive: blockActive(schema.nodes.paragraph),
			action: setBlockType(schema.nodes.paragraph)
		}, {
			name: 'h1',
			icon: 'icon-header',
			label: 'Überschrift 1',
			isActive: blockActive(schema.nodes.heading, {level: 1}),
			action: setBlockType(schema.nodes.heading, {level: 1})
		}, {
			name: 'h2',
			icon: 'icon-header',
			label: 'Überschrift 2',
			isActive: blockActive(schema.nodes.heading, {level: 2}),
			action: setBlockType(schema.nodes.heading, {level: 2})
		}, {
			name: 'h3',
			icon: 'icon-header',
			label: 'Überschrift 3',
			isActive: blockActive(schema.nodes.heading, {level: 3}),
			action: setBlockType(schema.nodes.heading, {level: 3})
		}, {
			name: 'h4',
			icon: 'icon-header',
			label: 'Überschrift 4',
			isActive: blockActive(schema.nodes.heading, {level: 4}),
			action: setBlockType(schema.nodes.heading, {level: 4})
		}, {
			name: 'h5',
			icon: 'icon-header',
			label: 'Überschrift 5',
			isActive: blockActive(schema.nodes.heading, {level: 5}),
			action: setBlockType(schema.nodes.heading, {level: 5})
		}, {
			name: 'h6',
			icon: 'icon-header',
			label: 'Überschrift 6',
			isActive: blockActive(schema.nodes.heading, {level: 6}),
			action: setBlockType(schema.nodes.heading, {level: 6})
		}]
	}]
}, {
	name: 'inline-basic',
	items: [{
		name: 'em',
		type: 'button',
		icon: 'icon-italic',
		label: 'Kursiv', /* @TODO: I18n */
		isActive: markActive(schema.marks.em),
		action: toggleMark(schema.marks.em)
	}, {
		name: 'strong',
		type: 'button',
		icon: 'icon-bold',
		label: 'Fettgedruckt', /* @TODO: I18n */
		isActive: markActive(schema.marks.strong),
		action: toggleMark(schema.marks.strong)
	}, {
		name: 'subscript',
		type: 'button',
		icon: 'icon-subscript',
		label: 'Tiefgestellt', /* @TODO: I18n */
		isActive: markActive(schema.marks.subscript),
		action: toggleMark(schema.marks.subscript)
	}, {
		name: 'superscript',
		type: 'button',
		icon: 'icon-superscript',
		label: 'Hochgestellt', /* @TODO: I18n */
		isActive: markActive(schema.marks.superscript),
		action: toggleMark(schema.marks.superscript)
	}, {
		name: 'underline',
		type: 'button',
		icon: 'icon-underline',
		label: 'Unterstrichen', /* @TODO: I18n */
		isActive: markActive(schema.marks.underline),
		action: toggleMark(schema.marks.underline)
	}, {
		name: 'strikethrough',
		type: 'button',
		icon: 'icon-strikethrough',
		label: 'Durchgestrichen', /* @TODO: I18n */
		isActive: markActive(schema.marks.strikethrough),
		action: toggleMark(schema.marks.strikethrough)
	}]
}, {
	name: 'links',
	items: [{
		name: 'link',
		type: 'button',
		icon: 'icon-link',
		label: 'Link', /* @TODO: I18n */
		isActive: markActive(schema.marks.link),
		action: (state, dispatch) => {
			if (dispatch) {
				const oldHref = getHrefFromState(state);
				/* @TODO: I18n, Improve link handling */
				const href = prompt('Ziel-Adresse (Feld leer lassen, um Link zu entfernen):', oldHref || 'https://'); /* eslint-disable-line */

				if (href === null) {
					return false;
				}

				const shouldRemoveMark = Boolean(oldHref) && href !== oldHref;
				const shouldAddMark = href !== '' && href !== oldHref;

				const markType = schema.marks.link;
				const {empty, $cursor, ranges} = state.selection;

				if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) {
					return false;
				}

				if ($cursor) {
					if (shouldRemoveMark && markType.isInSet(state.storedMarks || $cursor.marks())) {
						dispatch(state.tr.removeStoredMark(markType));
					}

					if (shouldAddMark) {
						dispatch(state.tr.addStoredMark(markType.create({href})));
					}
				} else {
					const tr = state.tr;
					let has = false;

					for (let i = 0; !has && i < ranges.length; i++) {
						const {$from, $to} = ranges[i];
						has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
					}

					for (let i = 0; i < ranges.length; i++) {
						const {$from, $to} = ranges[i];

						if (shouldRemoveMark && has) {
							tr.removeMark($from.pos, $to.pos, markType);
						}

						if (shouldAddMark) {
							tr.addMark($from.pos, $to.pos, markType.create({href}));
						}
					}
					dispatch(tr.scrollIntoView());
				}
			}
			return true;
		}
	}]
}, {
	name: 'lists',
	items: [{
		name: 'unordered-list',
		type: 'button',
		icon: 'icon-list-ul',
		label: 'Liste', /* @TODO: I18n */
		isActive: blockActive(schema.nodes.bullet_list),
		action: wrapInList(schema.nodes.bullet_list)
	}, {
		name: 'ordered-list',
		type: 'button',
		icon: 'icon-list-ol',
		label: 'Nummerierte Liste', /* @TODO: I18n */
		isActive: blockActive(schema.nodes.ordered_list),
		action: wrapInList(schema.nodes.ordered_list)
	}, {
		name: 'lift-list',
		type: 'button',
		icon: 'icon-outdent',
		label: 'Liste auflösen',
		action: lift
	}]
}, {
	name: 'history',
	items: [{
		name: 'undo',
		type: 'button',
		icon: 'icon-undo',
		action: undo
	}, {
		name: 'redo',
		type: 'button',
		icon: 'icon-repeat',
		action: redo
	}]
}];
