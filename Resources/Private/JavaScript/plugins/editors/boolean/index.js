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
import Checkbox from '../../../ui/primitives/checkbox';

const {React, PropTypes} = window.Sitegeist.Objects.runtime;
const {Component} = window.Sitegeist.Objects.runtime.React;

window.Sitegeist.Objects.plugin.registerEditor('Boolean', class BooleanEditor extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		commit: PropTypes.func.isRequired,
		value: PropTypes.bool
	};

	static defaultProps = {
		value: ''
	};

	handleChange = () => {
		const {commit, value} = this.props;

		commit(!value);
	}

	render() {
		const {id, label, value} = this.props;

		return (
			<div>
				<label htmlFor={id}>
					<Checkbox id={id} isChecked={value} onChange={this.handleChange}>
						{label}
					</Checkbox>
				</label>
			</div>
		);
	}
});
