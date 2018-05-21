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
import React from 'react';
import styled from 'styled-components';
import {HtmlEditor, MenuBar} from '@aeaton/react-prosemirror';

import Toolbar from '../structures/toolbar';

import {options, menu} from './config';

const Container = styled.div`
	.ProseMirror {
		margin-top: .5em;
		background: #3f3f3f;
		padding: 1em;

		h1 {
			font-size: 5.06em;
			line-height: 1.28em;
			padding-top: 0.296em;
			margin-bottom: 0.0247em;
		}

		h2 {
			font-size: 3.38em;
			line-height: 1.44em;
			padding-top: 0.389em;
			margin-bottom: 0.0926em;
		}

		h3 {
			font-size: 2.25em;
			line-height: 1.44em;
			padding-top: 0.389em;
			margin-bottom: 0.333em;
		}

		h4 {
			font-size: 1.50em;
			line-height: 1.08em;
			padding-top: 0.208em;
			margin-bottom: 0.875em;
		}

		p {
			font-size: 1.00em;
			line-height: 1.63em;
			padding-top: 0.500em;
			margin-bottom: 1.13em;
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

const RichText = ({...props}) => (
	<HtmlEditor
		options={options}
		render={({editor, state, dispatch}) => {
			const processMenuRecursively = menu => menu.map(item => {
				switch (true) {
					case 'items' in item: {
						const {items, ...rest} = item;

						return {
							...rest,
							items: processMenuRecursively(items)
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

			return (
				<Container>
					<Toolbar groups={processMenuRecursively(menu)}/>
					{editor}
				</Container>
			);
		}}
		{...props}
	/>
);

export default RichText;
