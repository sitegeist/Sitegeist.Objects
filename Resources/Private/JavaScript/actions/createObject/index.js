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

import Button from '../../lib/presentation/primitives/button';
import Icon from '../../lib/presentation/primitives/icon';

export default class CreateObject extends Component {
	static propTypes = {
		store: PropTypes.shape({
			identifier: PropTypes.string.isRequired
		}).isRequired,
		nodeType: PropTypes.string.isRequired,
		renderAction: PropTypes.func
	};

	static defaultProps = {
		renderAction: () => (
			<Button>
				<Icon className="icon-plus"/>
				{/* @TODO. I18n */}
				Neu erstellen
			</Button>
		)
	};

	render() {
		const {store, nodeType, renderAction} = this.props;

		return (
			<Link to={`/store/${store.identifier}/create/${nodeType}`}>
				{renderAction(this.props)}
			</Link>
		);
	}
}
