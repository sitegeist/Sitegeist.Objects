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
import ProseMirror from '../../../ui/prosemirror';
import Editor from '../../../ui/structures/editor';

const {React, PropTypes} = window.Sitegeist.Objects.runtime;
const {Component} = window.Sitegeist.Objects.runtime.React;

window.Sitegeist.Objects.plugin.registerEditor('RichText', class RichText extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		commit: PropTypes.func.isRequired,
		value: PropTypes.string
	};

	static defaultProps = {
		value: null
	};

	handleChange = value => {
		const {commit} = this.props;

		if (value !== this.props.value) {
			commit(value || null);
		}
	}

	render() {
		const {id, value} = this.props;

		return (
			<Editor {...this.props}>
				<ProseMirror
					id={id}
					value={value || ''}
					placeholder="Hier Text eingeben..."
					onChange={this.handleChange}
				/>
			</Editor>
		);
	}
});
