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
import React, {Component} from 'shim/react';
import {Link} from 'react-router-dom';
import lru from 'lru-cache';

import StoresQuery from '../../query/stores';

import IconCard from '../../lib/presentation/structures/iconCard';
import Grid from '../../lib/presentation/primitives/grid';
import Message from '../../lib/presentation/primitives/message';

import Breadcrumb from '../../lib/presentation/structures/breadcrumb';

export default class StoresView extends Component {
	componentDidMount() {
		if (!this.cache) {
			this.cache = lru(1);
		}
	}

	render() {
		return (
			<StoresQuery cache={this.cache}>
				{({stores}) => {
					if (stores.length > 0) {
						return (
							<React.Fragment>
								<Breadcrumb/>
								<Grid>
									{stores.map(store => (
										<Link key={store.identifier} to={`/store/${store.identifier}`}>
											<IconCard
												icon={store.icon}
												title={store.title}
											>
												{store.description}
											</IconCard>
										</Link>
									))}
								</Grid>
							</React.Fragment>
						);
					}

					return (
						<React.Fragment>
							<Breadcrumb/>
							<Message>
								<Message.Text>
									There appears to be no store present in your Content Repository. You can create one
									using the Command Line:
								</Message.Text>
								<Message.Code>
									{'./flow objects:createstore'}
								</Message.Code>
							</Message>
						</React.Fragment>
					);
				}}
			</StoresQuery>
		);
	}
}
