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
import styled from 'shim/styled-components';

import Transient from '../../core/util/transient';

import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';
import NumberInput from '../../ui/primitives/numberInput';
import SelectBox from '../../ui/structures/selectBox';

import Filter from './filter';

const Group = styled.div`
	display: flex;
`;
const Section = styled.div`
	display: flex;
`;
const Container = styled.div`
	display: flex;
	justify-content: space-between;
	padding-bottom: 1em!important;
`;

const PageForm = styled.form`
	display: inline-block;
`;

const Pagination = styled.div`
	> *:not(:first-child) {
		margin-left: 10px;
	}
`;

const PageInput = styled(NumberInput)`
	width: 80px!important;
	margin: 0 8px!important;
`;

export default class Header extends Component {
	static propTypes = {
		initialSearchTerm: PropTypes.string,
		filterConfiguration: PropTypes.object.isRequired,
		filters: PropTypes.array,
		page: PropTypes.number.isRequired,
		pages: PropTypes.number.isRequired,
		pageSize: PropTypes.number.isRequired,
		pageSizeOptions: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
		onSearch: PropTypes.func.isRequired,
		onFilterChange: PropTypes.func.isRequired,
		onPageChange: PropTypes.func.isRequired,
		onPageSizeChange: PropTypes.func.isRequired
	};

	static defaultProps = {
		initialSearchTerm: '',
		filters: []
	};

	render() {
		return (
			<Container>
				<Section>
					{this.renderPagination()}
				</Section>
				<Section>
					{this.renderSearch()}
					{this.renderFilter()}
				</Section>
			</Container>
		);
	}

	renderSearch() {
		const {initialSearchTerm, onSearch} = this.props;

		return (
			<Transient initial={{search: initialSearchTerm}}>
				{searchState => (
					<form onSubmit={() => onSearch(searchState.get('search'))}>
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
		);
	}

	renderFilter() {
		const {filterConfiguration, filters, onFilterChange} = this.props;

		return (
			<Filter
				filterConfiguration={filterConfiguration}
				filters={filters || []}
				onChange={onFilterChange}
			/>
		);
	}

	renderPagination() {
		const {page, pages, pageSize, pageSizeOptions, onPageChange, onPageSizeChange} = this.props;

		return (
			<Pagination>
				<Button onClick={() => onPageChange(page - 1)} disabled={page === 0}>
					{/* @TODO: I18n */}
					Vorherige Seite
				</Button>
				{pages > 1 ? (
					<Transient initial={{value: page + 1}}>
						{page => (
							<PageForm onSubmit={() => onPageChange(page.get('value') - 1)}>
								{/* @TODO: I18n */}
								Seite
								<PageInput
									value={page.get('value')}
									onChange={event => page.add('value', parseInt(event.target.value, 10))}
									onClick={event => event.target.select()}
								/>
								{/* @TODO: I18n */}
								von {pages}
							</PageForm>
						)}
					</Transient>
				) : null}
				<SelectBox
					allItems={pageSizeOptions.map(option => ({
						name: `${option}-items-per-page`,
						data: {
							label: `${option} Einträge pro Seite`, /* @TODO: I18n */
							value: option
						}
					}))}
					value={`${pageSize}-items-per-page`}
					onChange={({data}) => onPageSizeChange(data.value)}
				/>
				<Button onClick={() => onPageChange(page + 1)} disabled={page === pages - 1}>
					{/* @TODO: I18n */}
					Nächste Seite
				</Button>
			</Pagination>
		);
	}
}
