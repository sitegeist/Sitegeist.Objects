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
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import Condition from '../../core/util/condition';

import StoreQuery from '../../query/store';

import Icon from '../../ui/primitives/icon';
import Button from '../../ui/primitives/button';
import ButtonList from '../../ui/primitives/buttonList';
import Breadcrumb from '../../ui/structures/breadcrumb';
import Table from '../../ui/structures/table';

export default class StoreView extends Component {
	static propTypes = {
		identifier: PropTypes.string.isRequired
	};

	state = {
		selection: []
	};

	handleSelection = ({items}) => {
		this.setState({selection: items});
	};

	render() {
		const {identifier} = this.props;
		const {selection} = this.state;

		return (
			<StoreQuery identifier={identifier}>
				{({store}) => (
					<React.Fragment>
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
						<ButtonList>
							<Link to={`/${identifier}/create`}>
								<Button>
									{/* @TODO. I18n */}
									<Icon className="icon-plus"/>
									Neu erstellen
								</Button>
							</Link>
							<Condition condition={selection.length > 1}>
								<Button>
									{/* @TODO. I18n */}
									{selection.length} Objekte
								</Button>
							</Condition>
						</ButtonList>
						<Table
							onSelect={this.handleSelection}
							columns={[{
								id: '__icon',
								width: 32,
								sortable: false,
								resizable: false,
								filterable: false,
								accessor: row => row.object.icon,
								Cell: ({value}) => (
									<div style={{textAlign: 'center'}}>
										<Icon className={value}/>
									</div>
								)
							}, {
								id: '__label',
								Header: 'Title', /* @TODO: I18n */
								accessor: row => row.object.label
							},
							...store.objectIndex.tableHeads.map((tableHead, index) => ({
								id: tableHead.name,
								Header: tableHead.label,
								Cell: ({original}) => original.tableCells[index].value
							}))]}
							data={store.objectIndex.tableRows.map(row => ({
								_id: row.object.identifier,
								...row
							}))}
						/>
					</React.Fragment>
				)}
			</StoreQuery>
		);
	}
}
