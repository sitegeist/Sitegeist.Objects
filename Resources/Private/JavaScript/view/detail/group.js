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

import EditorManager from '../../core/plugin/editorManager';

import Icon from '../../lib/presentation/primitives/icon';
import Group from '../../lib/presentation/structures/group';

export default class extends Component {
	shouldComponentUpdate({transient}) {
		return this.props.properties.some(property => {
			const oldValue = this.props.transient.values[property.name];
			const newValue = transient.values[property.name];

			return (oldValue !== newValue);
		});
	}

	render() {
		const {icon, label, properties, transient, store, object} = this.props;

		return (
			<Group
				headline={
					<React.Fragment>
						<Icon className={icon}/>
						{label}
					</React.Fragment>
				}
			>
				{properties.map(property => (
					<EditorManager
						key={property.name}
						name={property.editor}
						property={property}
						transient={transient}
						storeIdentifier={store.identifier}
						objectIdentifier={object.identifier}
						nodeType={object.nodeType.name}
					/>
				))}
			</Group>
		);
	}
}
