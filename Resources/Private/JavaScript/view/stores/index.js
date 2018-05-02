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
import React, {Component} from 'react';

import StoresQuery from '../../query/stores';

import IconCard from '../../ui/structures/iconCard';
import Grid from '../../ui/primitives/grid';
import Message from '../../ui/primitives/message';

export default class StoresView extends Component {
	render() {
		return (
			<StoresQuery>
				{({stores}) => {
					if (stores.length > 0) {
						return (
							<Grid>
								{stores.map(store => (
									<IconCard
										key={store.identifier}
										icon={store.icon}
										title={store.title}
									>
										{store.description}
									</IconCard>
								))}
							</Grid>
						);
					}

					return (
						<Message>
							<Message.Text>
								There appears to be no store present in your Content Repository. You can create one
								using the Command Line:
							</Message.Text>
							<Message.Code>
								{'./flow objects:createstore'}
							</Message.Code>
						</Message>
					);
				}}
			</StoresQuery>
		);
	}
}
