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
import PropTypes from 'shim/prop-types';
import {Link} from 'react-router-dom';
import lru from 'lru-cache';

import StoreQuery from '../../query/store';

import Icon from '../../lib/presentation/primitives/icon';
import Breadcrumb from '../../lib/presentation/structures/breadcrumb';
import Table from '../../lib/presentation/structures/table';

import Layout from '../../lib/presentation/layout';

import Header from './header';
import Operations from './operations';

const defaultPageSize = 10;

export default class StoreView extends Component {
	static propTypes = {
		identifier: PropTypes.string.isRequired
	};

	getInitialState = () => {
		const savedState = window.sessionStorage.getItem(`storeView-${this.props.identifier}`);

		if (savedState) {
			const {query} = JSON.parse(savedState);

			return {
				selection: [],
				query
			};
		}

		return {
			selection: [],
			query: {
				from: 0,
				length: defaultPageSize
			}
		};
	}

	state = this.getInitialState();

	componentDidMount() {
		if (!this.cache) {
			this.cache = lru(500);
		}
	}

	componentWillUnmount() {
		this.cache.reset();
	}

	handleSelection = ({items}) => {
		this.setState({selection: items});
	};

	handlePageChange = pageIndex => {
		const {length} = this.state.query;
		const from = pageIndex * length;

		this.setState(({query}) => ({
			selection: [],
			query: {
				...query,
				from
			}
		}));
	};

	handlePageSizeChange = length => {
		this.setState(({query}) => ({
			selection: [],
			query: {
				...query,
				length,
				from: 0
			}
		}));
	}

	handleFilterChange = filters => {
		this.setState(({query}) => ({
			selection: [],
			query: {
				...query,
				filters,
				from: 0
			}
		}));
	};

	handleSortedChange = (newSorted, column) => {
		const order = newSorted[0].desc ? 'DESC' : 'ASC';
		const sort = column.__sortProperty;

		this.setState(({query}) => ({
			selection: [],
			query: {
				...query,
				sort,
				order,
				from: 0
			}
		}));
	};

	handleSearch = searchTerm => {
		this.setState(({query}) => ({
			selection: [],
			query: {
				...query,
				search: searchTerm,
				from: 0
			}
		}));
	}

	renderHeader = store => (
		<React.Fragment>
			<Breadcrumb
				parents={store.parents}
				current={{
					icon: store.icon,
					label: store.label,
					link: `/store/${store.identifier}`,
					isActive: true
				}}
			/>
			<Header
				initialSearchTerm={this.state.query.search}
				filterConfiguration={store.objectIndex.filterConfiguration}
				filters={this.state.query.filters || []}
				page={Math.ceil(this.state.query.from / this.state.query.length)}
				pages={Math.ceil(store.objectIndex.totalNumberOfRows / this.state.query.length)}
				pageSize={this.state.query.length}
				pageSizeOptions={[5, 10, 20, 50, 100]}
				onSearch={this.handleSearch}
				onFilterChange={this.handleFilterChange}
				onPageChange={this.handlePageChange}
				onPageSizeChange={this.handlePageSizeChange}
			/>
		</React.Fragment>
	)

	render() {
		const {identifier} = this.props;
		const {query} = this.state;

		window.sessionStorage.setItem(`storeView-${identifier}`, JSON.stringify({query}));

		return (
			<StoreQuery cache={this.cache} identifier={identifier} {...query}>
				{({store}) => (
					<Layout
						renderHeader={() => this.renderHeader(store)}
						renderBody={() => (
							<Table
								onSelect={this.handleSelection}
								columns={[{
									id: '__icon',
									width: 32,
									sortable: false,
									resizable: false,
									filterable: false,
									accessor: row => row.object.icon,
									/* @TODO: Table Cell styles */
									Cell: ({value}) => (
										<div style={{textAlign: 'center', width: '100%'}}>
											<Icon className={value}/>
										</div>
									)
								},
								...store.objectIndex.tableHeads.map((tableHead, index) => ({
									id: tableHead.name,
									Header: tableHead.label,
									sortable: Boolean(tableHead.sortProperty),
									__sortProperty: tableHead.sortProperty,
									Cell: tableHead.name === '__label' ?
										({original}) => (
											<Link to={`/store/${identifier}/edit/${original._id}`}>
												{original.object.isRemoved ?
													<s>{original.tableCells[index].value}</s> :
													original.tableCells[index].value
												}
											</Link>
										) :
										({original}) => (
											<span
												dangerouslySetInnerHTML={{__html: original.tableCells[index].value}}
											/>
										)
								}))]}
								data={store.objectIndex.tableRows.map(row => ({
									_id: row.object.identifier,
									isHidden: row.object.isHidden,
									hasUnpublishedChanges: row.object.hasUnpublishedChanges,
									...row
								}))}
								sorted={query.sort ? [{
									id: store.objectIndex.tableHeads.filter(
										tableHead => tableHead.sortProperty === query.sort
									)[0].name,
									desc: query.order !== 'ASC'
								}] : []}
								manual
								onPageChange={this.handlePageChange}
								onPageSizeChange={this.handlePageSizeChange}
								onSortedChange={this.handleSortedChange}
								defaultPageSize={this.state.query.length}
								pageSize={this.state.query.length}
								page={Math.ceil(query.from / query.length)}
								pages={Math.ceil(store.objectIndex.totalNumberOfRows / this.state.query.length)}
								multiSort={false}
								className="-highlight"
							/>
						)}
						renderFooter={() => this.renderFooter(store)}
					/>
				)}
			</StoreQuery>
		);
	}

	renderFooter = store => {
		return (
			<Operations
				store={store}
				nodeTypeForCreation={store.nodeType.allowedChildNodeTypes[0].name}
				selection={this.state.selection.map(identifier => {
					const [item] = store.objectIndex.tableRows.filter(
						({object}) => object.identifier === identifier
					);

					if (item) {
						return item.object;
					}

					return null;
				}).filter(i => i)}
			/>
		);
	}
}
