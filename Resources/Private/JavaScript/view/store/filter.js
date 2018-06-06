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
import uuid from 'uuid';

import FilterManager from '../../core/plugin/filterManager';

import List from '../../core/util/list';
import Toggle from '../../core/util/toggle';

import Button from '../../lib/presentation/primitives/button';
import ButtonList from '../../lib/presentation/primitives/buttonList';
import Icon from '../../lib/presentation/primitives/icon';
import Modal from '../../lib/presentation/primitives/modal';
import OriginalSelectBox from '../../lib/presentation/structures/selectBox';

const Container = styled.div`
	display: flex;

	> * {
		display: block;
		margin-right: 10px!important;
		margin-bottom: 10px!important;
	}

	> :nth-child(1) {
		width: 20%;

		button {
			width: 100%;
		}
	}

	> :nth-child(2) {
		width: 20%;

		button {
			width: 100%;
		}
	}

	> :nth-child(3) {
		width: 60%;
	}

	${Button} {
		white-space: nowrap!important;
		text-overflow: ellipsis;
	}
`;

const SelectBox = styled(OriginalSelectBox)`
	display: block;
`;

const Form = styled.form`
	width: 80vw;
	max-width: 900px;
`;

const Spacer = styled.div`
	height: 20px;
`;

export default class Filter extends Component {
	getAllOperationsForProperty(propertyName) {
		const {filterConfiguration} = this.props;

		return filterConfiguration.filter(({property}) => property === propertyName)[0].operations;
	}

	getFirstOperationForProperty(propertyName) {
		const [firstOperation] = this.getAllOperationsForProperty(propertyName);

		return firstOperation;
	}

	getFilterEditorForPropertyAndOperation(propertyName, operationName) {
		const {editor} = this.getAllOperationsForProperty(propertyName).filter(
			({type}) => type === operationName
		)[0];

		return editor;
	}

	renderFilterEditor(filters, handleChange, handleCancel) {
		const {filterConfiguration} = this.props;

		return (
			<Form onSubmit={() => handleChange(filters.values)}>
				{filters.map(filter => (
					<Container key={filter.value.id}>
						<div>
							<SelectBox
								value={filter.value.property}
								allItems={filterConfiguration.map(filterConfiguration => ({
									name: filterConfiguration.property,
									data: {
										label: filterConfiguration.label,
										value: filterConfiguration.property
									}
								}))}
								onChange={selectedItem => {
									console.log({selectedItem});
									filter.replace(filter => ({
										...filter,
										property: selectedItem.data.value,
										operation: this.getFirstOperationForProperty(selectedItem.data.value).type
									}));
								}}
							/>
						</div>

						<div>
							<SelectBox
								value={filter.value.operation}
								allItems={this.getAllOperationsForProperty(filter.value.property).map(
									operation => ({
										name: operation.type,
										data: {
											label: operation.label,
											value: operation.type
										}
									})
								)}
								onChange={selectedItem => {
									filter.replace(filter => ({
										...filter,
										operation: selectedItem.data.value
									}));
								}}
							/>
						</div>

						<div>
							<FilterManager
								value={filter.value.value}
								name={this.getFilterEditorForPropertyAndOperation(
									filter.value.property,
									filter.value.operation
								)}
								onChange={value => {
									filter.replace(filter => ({...filter, value}));
								}}
							/>
						</div>

						<div>
							<Button onClick={filter.remove}>
								<Icon className="icon-close"/>
							</Button>
						</div>
					</Container>
				))}
				<Spacer/>
				<ButtonList>
					<Button
						type="button"
						onClick={() => filters.add({
							id: uuid.v4(),
							property: filterConfiguration[0].property,
							operation: filterConfiguration[0].operations[0].type,
							value: null
						})}
					>
						{/* @TODO. I18n */}
						<Icon className="icon-plus"/>
						Filter hinzufügen
					</Button>
					<Button type="submit">
						{/* @TODO. I18n */}
						<Icon className="icon-check"/>
						Anwenden
					</Button>
					<Button onClick={filters.clear}>
						{/* @TODO. I18n */}
						<Icon className="icon-undo"/>
						Zurücksetzen
					</Button>
					<Button onClick={handleCancel}>
						{/* @TODO. I18n */}
						<Icon className="icon-close"/>
						Abbrechen
					</Button>
				</ButtonList>
			</Form>
		);
	}

	render() {
		const {filterConfiguration, filters, onChange} = this.props;

		return (
			<List initial={filters}>
				{filters => (
					<Toggle initial={false}>
						{open => (
							<React.Fragment>
								<Button
									type="button"
									onClick={() => {
										if (filters.isEmpty) {
											filters.add({
												id: uuid.v4(),
												property: filterConfiguration[0].property,
												operation: filterConfiguration[0].operations[0].type,
												value: null
											});
										}

										open.setTrue();
									}}
									className={filters.isNotEmpty && 'neos-active'}
								>
									{/* @TODO. I18n */}
									<Icon className="icon-filter"/>
									Filtern{filters.length > 0 ? (` (${filters.length})`) : null}
								</Button>
								{open.is ? (
									<Modal>
										{this.renderFilterEditor(filters, values => {
											onChange(values);
											open.setFalse();
										}, () => open.setFalse())}
									</Modal>
								) : null}
							</React.Fragment>
						)}
					</Toggle>

				)}
			</List>
		);
	}
}
