/*
 * Copyright notice
 *
 * (c) 2018 Wilhelm Behncke <behncke@sitegeist.de>
 * All rights reserved
 *
 * This file is part of the Sitegeist/Objects project under GPL-3.0.
 *
 * For the full copyright and license information, please read the
 * LICENSE.md file that was distributed with this source code.
 */
import React from 'shim/react';
import styled from 'shim/styled-components';
import {HtmlEditor} from '@aeaton/react-prosemirror';

import Toolbar from '../structures/toolbar';

import {options, menu} from './config';

const AdjustProseMirrorStyles = styled.div`
	.ProseMirror {
		background: #3f3f3f;

		h1 {
			font-size: 5.06em;
			line-height: 1.28em;
			padding-top: 0.296em;
			margin-bottom: 0.0247em;
			&:last-child {
				margin-bottom: 0;
			}
		}

		h2 {
			font-size: 3.38em;
			line-height: 1.44em;
			padding-top: 0.389em;
			margin-bottom: 0.0926em;
			&:last-child {
				margin-bottom: 0;
			}
		}

		h3 {
			font-size: 2.25em;
			line-height: 1.44em;
			padding-top: 0.389em;
			margin-bottom: 0.333em;
			&:last-child {
				margin-bottom: 0;
			}
		}

		h4 {
			font-size: 1.50em;
			line-height: 1.08em;
			padding-top: 0.208em;
			margin-bottom: 0.875em;
			&:last-child {
				margin-bottom: 0;
			}
		}

		p {
			font-size: 1.00em;
			line-height: 1.63em;
			padding-top: 0.500em;
			margin-bottom: 1.13em;
			&:last-child {
				margin-bottom: 0;
			}
		}

		strong {
			font-weight: bold;
		}

		em {
			font-style: italic;
		}

		ul, ol {
			li {
				p {
					margin-bottom: 0!important;
				}
			}
		}

		ul li {
			list-style-type: disc;

			> ul > li {
				list-style-type: circle;

				> ul > li {
					list-style-type: square;
				}
			}
		}

		ol li {
			list-style-type: decimal;
		}
	}
	.ProseMirror-focused {
		background: #fff;
		color: #000;
	}
`;

const Container = styled.div`
	.ProseMirror {
		margin-top: .5em;
		padding: 1em;
	}
`;

const processMenuRecursively = (menu, {state, dispatch}) => menu.map(item => {
	switch (true) {
		case 'items' in item: {
			const {items, ...rest} = item;

			return {
				...rest,
				items: processMenuRecursively(items, {state, dispatch})
			};
		}

		default: {
			const {action, isActive, ...rest} = item;

			return {
				...rest,
				isActive: typeof isActive === 'function' ? isActive(state) : Boolean(isActive),
				action: () => action(state, dispatch)
			};
		}
	}
});

export const RichTextRenderer = ({children, ...props}) => (
	<HtmlEditor
		options={options}
		render={({state, dispatch, editor, ...props}) => children({
			...props,
			menu: processMenuRecursively(menu, {state, dispatch}),
			editor: (
				<AdjustProseMirrorStyles>{editor}</AdjustProseMirrorStyles>
			)
		})}
		{...props}
	/>
);

const RichText = props => (
	<RichTextRenderer {...props}>
		{({editor, menu}) => (
			<Container>
				<Toolbar groups={menu}/>
				{editor}
			</Container>
		)}
	</RichTextRenderer>
);

export default RichText;
