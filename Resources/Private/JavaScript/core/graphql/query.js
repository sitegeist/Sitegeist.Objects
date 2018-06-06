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
import React, {Component, Fragment} from 'shim/react';
import PropTypes from 'shim/prop-types';

import Authorize from '../application/authorize';

import Loader from './loader';

class Query extends Component {
	static propTypes = {
		cache: PropTypes.object,
		query: PropTypes.string.isRequired,
		children: PropTypes.func.isRequired,
		variables: PropTypes.object
	};

	static defaultProps = {
		cache: null,
		variables: {}
	};

	state = {
		isLoading: true,
		hasError: false,
		error: null,
		result: null,
		cacheIdentifier: JSON.stringify(this.props.variables)
	};

	static getDerivedStateFromProps = ({variables}) => ({
		cacheIdentifier: JSON.stringify(variables)
	});

	async runQuery() {
		const {query, variables, cache, authorize} = this.props;
		const {cacheIdentifier} = this.state;
		const {csrfToken, apiEndpoint} = window.Sitegeist.Objects;

		this.setState({isLoading: true});

		try {
			const httpResult = await fetch(apiEndpoint, {
				method: 'POST',
				headers: {
					'X-Flow-Csrftoken': csrfToken,
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({query, variables})
			});

			if (httpResult.ok) {
				const jsonResult = await httpResult.json();

				this.setState({
					isLoading: false,
					hasError: false,
					result: jsonResult.data
				}, () => {
					if (cache) {
						cache.set(cacheIdentifier, this.state);
					}
				});
			} else {
				if (httpResult.status === 401) {
					await authorize();
					return this.runQuery();
				}

				this.setState({
					isLoading: false,
					hasError: true,
					result: null,
					error: httpResult.statusText
				});
			}
		} catch (error) {
			this.setState({
				isLoading: false,
				hasError: true,
				error
			});
		}
	}

	componentDidMount() {
		this.runQuery();
	}

	componentDidUpdate({variables}) {
		if (JSON.stringify(variables) !== JSON.stringify(this.props.variables)) {
			this.runQuery();
		}
	}

	render() {
		const {cache, children} = this.props;
		const {cacheIdentifier} = this.state;

		if (cache && cache.get(cacheIdentifier)) {
			return children(cache.get(cacheIdentifier));
		}

		return (
			<Fragment key={cacheIdentifier}>
				{this.state.isLoading ? (<Loader/>) : null}
				{children(this.state)}
			</Fragment>
		);
	}
}

export default props => (
	<Authorize>
		{authorize => (<Query {...props} authorize={authorize}/>)}
	</Authorize>
);
