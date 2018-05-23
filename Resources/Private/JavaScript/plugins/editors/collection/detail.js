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
import React, {Fragment, Component} from 'shim/react';
import styled from 'shim/styled-components';

import Button from '../../../ui/primitives/button';
import Icon from '../../../ui/primitives/icon';

import Transient from '../../../core/util/transient';
import Confirm from '../../../core/util/confirm';

import EditorManager from '../../../core/plugin/editorManager';
import ShortViewManager from '../../../core/plugin/shortViewManager';

const Table = styled.div`
	padding: 0 0 0 1em!important;
	margin-bottom: 4px!important;

	${props => {
		if (props.isOpen) {
			return 'background-color: #333;';
		}
	}}

	&:hover {
		background-color: #333;
	}

	> :nth-child(even) {
		padding-left: 20px;
	}
`;

const Toggler = styled.div`
	width: 32px;
	text-align: center;
	cursor: pointer;
	flex-grow: 0;
	flex-shrink: 0;
`;

const IconAndLabel = styled.div`
	width: 100px;
	flex-grow: 0;
	flex-shrink: 0;

	${Icon} {
		cursor: move;
		margin-right: 8px;
	}
`;

const ShortView = styled.div`
	width: calc(100% - 228px);
	flex-grow: 0;
	flex-shrink: 0;
`;

const Operations = styled.div`
	width: 96px;
	flex-grow: 0;
	flex-shrink: 0;
`;

const TableHeader = styled.div`
	position:relative;
	opacity: ${props => props.isHidden ? '.5' : '1'}
	display: flex;

	${props => {
		if (props.isRemoved) {
			return `
				&::before {
					content: '';
					border-bottom: 1px solid #ccc;
					position: absolute;
					top: 50%;
					left: 32px;
					width: calc(100% - 232px);
				}
			`;
		}
	}}

	> * {
		display: flex;
		align-items: center;
	}
`;

const EditorArea = styled.div`
	padding: 0 1em 0 0!important;
`;

export default class Detail extends Component {
	static getDerivedStateFromProps = (props, state) => ({
		originalProperties: state && 'originalProperties' in state ?
			state.originalProperties :
			props.item.payload.properties
	});

	state = {
		//
		// This is needed to track the dirty state of editors created
		// by this component.
		//
		originalProperties: this.props.item.payload.properties
	};

	render() {
		const {item} = this.props;

		return (
			<Transient
				onChange={({values: properties}) => item.update(payload => ({
					...payload,
					properties: payload.properties.map(property => ({
						...property,
						value: (
							property.name in properties ?
								properties[property.name] : property.value
						)
					}))
				}))}
			>
				{transient => this.renderContent(transient)}
			</Transient>
		);
	}

	renderContent(transient) {
		const {item, isOpen, storeIdentifier, onToggle, shortView, shortViewOptions, nodeType, label} = this.props;
		const {originalProperties} = this.state;
		const isHidden = (item.payload.isHidden && !item.hasMode('show')) || item.hasMode('hide');

		return (
			<Table isOpen={isOpen}>
				<TableHeader isHidden={isHidden} isRemoved={item.hasMode('remove')}>
					<Toggler onClick={() => onToggle(item.identifier)}>
						<Icon className={isOpen ? 'icon-chevron-up' : 'icon-chevron-down'}/>
					</Toggler>
					<IconAndLabel>
						<Icon className={item.payload.icon}/>
						{item.payload.label}
					</IconAndLabel>
					<ShortView>
						<ShortViewManager
							name={shortView}
							options={shortViewOptions}
							nodeType={nodeType}
							label={label}
							properties={item.payload.properties.reduce((properties, property) => {
								if (transient.has(property.name)) {
									properties[property.name] = transient.get(property.name);
								} else {
									properties[property.name] = property.value;
								}

								return properties;
							}, {})}
						/>
					</ShortView>
					<Operations>
						{/* @TODO: This is a desctructive operation - the user needs to confirm this */}
						<Confirm
							question={
								<Fragment>
									Möchten Sie{' '}
									<ShortViewManager
										name={shortView}
										options={shortViewOptions}
										nodeType={nodeType}
										label={label}
										properties={item.payload.properties.reduce((properties, property) => {
											if (transient.has(property.name)) {
												properties[property.name] = transient.get(property.name);
											} else {
												properties[property.name] = property.value;
											}

											return properties;
										}, {})}
									/>
									{' '}wirklich löschen?
								</Fragment>
							}
							onConfirm={() => item.toggleMode('remove')}
						>
							{confirm => (
								<Button
									className={item.hasMode('remove') ? 'neos-button-success' : 'neos-button-danger'}
									onClick={confirm.show}
								>
									<Icon className={item.hasMode('remove') ? 'icon-recycle' : 'icon-trash'}/>
								</Button>
							)}
						</Confirm>
						<Button
							onClick={() => item.toggleMode(item.payload.isHidden ? 'show' : 'hide')}
						>
							{isHidden ?
								<Icon className="icon-eye"/> :
								<Icon className="icon-eye-close"/>
							}
						</Button>
					</Operations>
				</TableHeader>
				{isOpen ? (
					/* @TODO: Proper Styles */
					<EditorArea>
						{originalProperties.map(property => (
							<EditorManager
								key={property.name}
								name={property.editor}
								property={property}
								transient={transient}
								storeIdentifier={storeIdentifier}
								nodeType={item.payload.nodeType}
							/>
						))}
					</EditorArea>
				) : null}
			</Table>
		);
	}
}
