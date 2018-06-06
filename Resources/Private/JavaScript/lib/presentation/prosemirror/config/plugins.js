import {history} from 'prosemirror-history';
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';
import {placeholder} from '@aeaton/prosemirror-placeholder';

import keys from './keys';
import rules from './rules';

export default [
	rules,
	keys,
	placeholder(),
	dropCursor(),
	gapCursor(),
	history()
];
