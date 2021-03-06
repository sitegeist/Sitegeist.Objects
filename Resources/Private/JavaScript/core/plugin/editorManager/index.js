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

export const registerEditor = (name, component) => {
	window.Sitegeist.Objects.plugin.editors[name] = component;
};

const Container = styled.div`
	display: flex;
	flex-direction: row;
`;

const IndicatorContainer = styled.div`
	position: relative;
`;

const Indicator = styled.div`
	position: absolute;
	top: 1.75em;
	left: -9px;
	bottom: 2em;
	width: 4px;
	${props => {
		if (props.isDirty) {
			//
			// @TODO: Color tbd.
			//
			return `background-color: #ce00a8;`;
		}
	}}
`;

export default class EditorManager extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		options: PropTypes.object,
		transient: PropTypes.object.isRequired,
		property: PropTypes.object.isRequired,
		storeIdentifier: PropTypes.string,
		objectIdentifier: PropTypes.string,
		nodeType: PropTypes.string
	};

	static defaultProps = {
		options: null,
		storeIdentifier: null,
		objectIdentifier: null,
		nodeType: null
	};

	shouldComponentUpdate({transient}) {
		const oldValue = this.props.transient.values[this.props.property.name];
		const newValue = transient.values[this.props.property.name];

		return (oldValue !== newValue);
	}

	render() {
		const {name, options, transient, property, storeIdentifier, objectIdentifier, nodeType} = this.props;

		if (!(name in window.Sitegeist.Objects.plugin.editors)) {
			throw new Error(`Could not find Editor "${name}"`);
		}

		const Editor = window.Sitegeist.Objects.plugin.editors[name];
		const editorProps = {
			storeIdentifier,
			objectIdentifier,
			nodeType,
			options: options || property.editorOptions,
			name: property.name,
			id: `property-${property.name}`,
			label: property.label,
			value: transient.has(property.name) ? transient.get(property.name) : property.value,
			isDirty: transient.has(property.name) && transient.get(property.name) !== property.value
		};

		editorProps.commit = value => {
			if (value === property.value) {
				transient.remove(property.name);
			} else {
				transient.add(property.name, value);
			}
		};

		return (
			<Container>
				<IndicatorContainer>
					<Indicator isDirty={editorProps.isDirty}/>
				</IndicatorContainer>
				<Editor {...editorProps}/>
			</Container>
		);
	}
}
