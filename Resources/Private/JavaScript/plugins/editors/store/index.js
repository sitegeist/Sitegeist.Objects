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
import {Link} from 'react-router-dom';

import Editor from '../../../ui/structures/editor';

import Button from '../../../ui/primitives/button';

const {React, PropTypes} = window.Sitegeist.Objects.runtime;
const {Component} = window.Sitegeist.Objects.runtime.React;

window.Sitegeist.Objects.plugin.registerEditor('Store', class Store extends Component {
	static propTypes = {
		label: PropTypes.string.isRequired,
		value: PropTypes.string
	};

	static defaultProps = {
		value: ''
	};

	renderButton() {
		if (this.props.value) {
			return (
				<Link to={`/store/${this.props.value}`}>
					<Button>
						{/* @TODO: I18n */}
						{this.props.label} bearbeiten
					</Button>
				</Link>
			);
		}

		return (
			/* @TODO: I18n */
			<Button disabled title="Kann erst nach dem Erstellen bearbeitet werden">
				{/* @TODO: I18n */}
				{this.props.label} bearbeiten
			</Button>
		);
	}

	render() {
		return (
			<Editor {...this.props}>
				{this.renderButton()}
			</Editor>
		);
	}
});
