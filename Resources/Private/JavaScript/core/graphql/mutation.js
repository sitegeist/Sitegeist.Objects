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

class Mutation extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		variables: PropTypes.object
	};

	static defaultProps = {
		variables: {}
	};

	state = {
		isLoading: false,
		hasError: false,
		error: null,
		result: null,
		cacheIdentifier: JSON.stringify(this.props.variables)
	};

	static getDerivedStateFromProps = ({variables}) => ({
		cacheIdentifier: JSON.stringify(variables)
	});

	execute = async (overrideVariables = {}) => {
		const {query, variables, authorize, onCompleted} = this.props;
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
				body: JSON.stringify({
					query,
					variables: Object.assign({}, variables, overrideVariables)
				})
			});

			if (httpResult.ok) {
				const jsonResult = await httpResult.json();

				this.setState({
					isLoading: false,
					hasError: false,
					result: jsonResult.data
				}, () => onCompleted(jsonResult.data));
			} else {
				if (httpResult.status === 401) {
					await authorize();
					return this.execute(overrideVariables);
				}

				this.setState({
					isLoading: false,
					hasError: true,
					result: null,
					error: httpResult.statusText
				});
			}
		} catch (error) {
			console.error(error);
			this.setState({
				isLoading: false,
				hasError: true,
				error
			});
		}
	};

	render() {
		const {children} = this.props;
		const {cacheIdentifier} = this.state;

		return (
			<Fragment key={cacheIdentifier}>
				{children({
					...this.state,
					execute: this.execute
				})}
			</Fragment>
		);
	}
}

export default props => (
	<Authorize>
		{authorize => (<Mutation {...props} authorize={authorize}/>)}
	</Authorize>
);
