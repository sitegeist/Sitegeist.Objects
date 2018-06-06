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

import Button from '../../lib/presentation/primitives/button';
import Icon from '../../lib/presentation/primitives/icon';

export default class PreviewObject extends Component {
	static propTypes = {
		object: PropTypes.shape({
			previewUri: PropTypes.string
		}).isRequired,
		renderAction: PropTypes.func
	};

	static defaultProps = {
		renderAction: ({object}) => (
			<Button disabled={!object.previewUri}>
				<Icon className="icon-external-link"/>
				{/* @TODO: I18n */}
				Vorschau
			</Button>
		)
	};

	render() {
		const {object, renderAction} = this.props;

		return (
			<a href={object.previewUri} target="_blank">
				{renderAction(this.props)}
			</a>
		);
	}
}
