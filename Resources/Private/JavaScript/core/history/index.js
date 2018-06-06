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
import {Component} from 'shim/react';
import PropTypes from 'shim/prop-types';
import {withRouter} from 'react-router';

class History extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		history: PropTypes.object.isRequired
	};

	render() {
		const {history} = this.props;

		return this.props.children({
			push: (...args) => history.push(...args),
			replace: (...args) => history.replace(...args),
			goTo: target => {
				/**
				 * @TODO: Workaround as per
				 *        https://github.com/ReactTraining/react-router/issues/1982#issuecomment-314167564
				 *        Everybody seems to make their libraries defensive as hell nowadays... 🙄
				 *        I know it's wrong to do this at this point, but I do not have an alternative, since the
				 *        Apollo Cache Invalidation doesn't work properly.
				 */
				history.push(`/empty`);
				setTimeout(() => {
					history.replace(target);
				});
			}
		});
	}
}

export default withRouter(History);
