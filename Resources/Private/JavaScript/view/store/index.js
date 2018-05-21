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
import styled from 'styled-components';

import Condition from '../../core/util/condition';
import Transient from '../../core/util/transient';

import StoreQuery from '../../query/store';

import Icon from '../../ui/primitives/icon';
import Button from '../../ui/primitives/button';
import ButtonList from '../../ui/primitives/buttonList';
import Breadcrumb from '../../ui/structures/breadcrumb';
import NumberInput from '../../ui/primitives/numberInput';
import SelectBox from '../../ui/structures/selectBox';
import Table from '../../ui/structures/table';

import Layout from '../../ui/layout';

import Filter from './filter';

const HeaderPanel = styled.div`
	display: flex;
	> * {
		display: block;
		margin-right: 10px!important;
	}
`;

const Pagination = styled.div`
	> *:not(:first-child) {
		margin-left: 40px;
	}
`;

const PageInput = styled(NumberInput)`
	width: 80px!important;
	margin: 0 8px!important;
`;

const Form = styled.form`
	display: inline-block;
`;

const defaultPageSize = 10;

/**
 * @TODO: renderParent Redundancy
 */
const renderParent = (parent, index, parents) => {
	switch (parent.type) {
		case 'object': {
			const grandparent = parents[index - 1];

			return {
				icon: parent.icon,
				label: parent.label,
				link: `/${grandparent.type}/${grandparent.identifier}/edit/${parent.identifier}`
			};
		}

		case 'store':
		default:
			return {
				icon: parent.icon,
				label: parent.label,
				link: `/${parent.type}/${parent.identifier}`
			};
	}
};

export default class StoreView extends Component {
	static propTypes = {
		identifier: PropTypes.string.isRequired
	};

	state = {
		selection: [],
		query: {
			from: 0,
			length: defaultPageSize
		}
	};

	handleSelection = ({items}) => {
		this.setState({selection: items});
	};

	handleFetchData = ({page, pageSize, sorted}) => {
		const from = page * pageSize;
		const length = pageSize;
		const sort = sorted[0] ? sorted[0].id : undefined;
		const order = sorted[0] ? (
			sorted[0].desc ? 'DESC' : 'ASC'
		) : undefined;

		this.setState(({query}) => ({
			query: {...query, from, length, sort, order}
		}));
	}

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
				filters
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
				order
			}
		}));
	};

	handleSearch = searchTerm => {
		this.setState(({query}) => ({
			selection: [],
			query: {
				...query,
				search: searchTerm
			}
		}));
	}

	renderHeader = store => (
		<React.Fragment>
			<Breadcrumb
				items={[
					...[...store.parents].reverse().map(renderParent),
					{
						icon: store.icon,
						label: store.label,
						link: `/store/${store.identifier}`,
						isActive: true
					}
				]}
			/>
			<HeaderPanel>
				<Transient initial={{search: this.state.query.search}}>
					{searchState => (
						<form onSubmit={() => this.handleSearch(searchState.get('search'))}>
							<input
								type="text"
								placeholder="Suchbegriff..."
								value={searchState.get('search')}
								onChange={event => searchState.add('search', event.target.value)}
							/>
							<Button>
								<Icon className="icon-search"/>
							</Button>
						</form>
					)}
				</Transient>
				{/* @TODO: NodeType Selector */}
				<Link to={`/store/${this.props.identifier}/create/${store.nodeType.allowedChildNodeTypes[0].name}`}>
					<Button>
						{/* @TODO. I18n */}
						<Icon className="icon-plus"/>
						Neu erstellen
					</Button>
				</Link>

				<Filter
					filterConfiguration={store.objectIndex.filterConfiguration}
					filters={this.state.query.filters || []}
					onChange={this.handleFilterChange}
				/>
			</HeaderPanel>

			<ButtonList>
				<Condition condition={this.state.selection.length > 1}>
					<Button>
						{/* @TODO. I18n */}
						{this.state.selection.length} Objekte
					</Button>
				</Condition>
			</ButtonList>
		</React.Fragment>
	)

	render() {
		const {identifier} = this.props;
		const {query} = this.state;

		return (
			<StoreQuery identifier={identifier} {...query}>
				{({store}) => (
					<Layout
						renderHeader={() => this.renderHeader(store)}
						renderFooter={() => this.renderFooter(store)}
					>
						{() => (
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
									__sortProperty: 'title',
									accessor: row => row.object.label,
									Cell: ({value, original}) => (
										<Link to={`/store/${identifier}/edit/${original._id}`}>
											{original.object.isRemoved ? <s>{value}</s> : value}
										</Link>
									)
								},
								...store.objectIndex.tableHeads.map((tableHead, index) => ({
									id: tableHead.name,
									Header: tableHead.label,
									sortable: Boolean(tableHead.sortProperty),
									__sortProperty: tableHead.sortProperty,
									Cell: ({original}) => original.tableCells[index].value
								}))]}
								data={store.objectIndex.tableRows.map(row => ({
									_id: row.object.identifier,
									...row
								}))}
								manual
								onPageChange={this.handlePageChange}
								onPageSizeChange={this.handlePageSizeChange}
								onSortedChange={this.handleSortedChange}
								defaultPageSize={this.state.query.length}
								pageSize={this.state.query.length}
								page={Math.ceil(query.from / query.length)}
								pages={Math.ceil(store.objectIndex.totalNumberOfRows / this.state.query.length)}
								multiSort={false}
								className="-striped -highlight"
							/>
						)}
					</Layout>
				)}
			</StoreQuery>
		);
	}

	renderFooter = store => {
		const {query} = this.state;
		const pageSize = query.length;
		const page = Math.ceil(query.from / query.length);
		const pages = Math.ceil(store.objectIndex.totalNumberOfRows / this.state.query.length);
		const pageSizeOptions = [5, 10, 20, 50, 100];

		return (
			<Pagination>
				<Button onClick={() => this.handlePageChange(page - 1)} disabled={!this.state.query.from}>
					{/* @TODO: I18n */}
					Vorherige Seite
				</Button>
				<Condition condition={pages > 1}>
					<Transient initial={{value: page + 1}}>
						{page => (
							<Form onSubmit={() => this.handlePageChange(page.get('value') - 1)}>
							Seite
								<PageInput
									value={page.get('value')}
									onChange={event => page.add('value', parseInt(event.target.value, 10))}
									onClick={event => event.target.select()}
								/>
							von {pages}
							</Form>
						)}
					</Transient>
				</Condition>
				<SelectBox
					allItems={pageSizeOptions.map(option => ({
						name: `${option}-items-per-page`,
						data: {
							label: `${option} Einträge pro Seite`, /* @TODO: I18n */
							value: option
						}
					}))}
					value={`${pageSize}-items-per-page`}
					onChange={({data}) => this.handlePageSizeChange(data.value)}
				/>
				<Button onClick={() => this.handlePageChange(page + 1)} disabled={page === pages - 1}>
					{/* @TODO: I18n */}
					Nächste Seite
				</Button>
			</Pagination>
		);
	}
}
