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

import StoreQuery from '../../query/store';

import Breadcrumb from '../../ui/structures/breadcrumb';

export default class StoreView extends Component {
	render() {
		const {identifier} = this.props;

		return (
			<StoreQuery identifier={identifier}>
				{({store}) => (
					<Breadcrumb
						items={[
							...store.parents.map(parent => ({
								icon: parent.icon,
								label: parent.label,
								link: `/store/${parent.identifier}`
							})),
							{
								icon: store.icon,
								label: store.label,
								link: `/store/${store.identifier}`,
								isActive: true
							}
						]}
					/>
				)}
			</StoreQuery>
		);
	}
}
