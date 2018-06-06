import React from 'shim/react';

import Query from './query';
import Mutation from './mutation';

export const query = strings => {
	const queryString = strings.join('');

	return ({cache, children, ...variables}) => (
		<Query
			query={queryString}
			variables={variables}
			cache={cache}
		>
			{({isLoading, hasError, error, result}) => {
				//
				// @TODO: Better load handling
				//
				if (isLoading) {
					return 'Loading...';
				}
				if (hasError) {
					return `Error: ${error}`;
				}

				return children(result);
			}}
		</Query>
	);
};

export const mutation = strings => {
	const queryString = strings.join('');

	return ({children, onCompleted, ...variables}) => (
		<Mutation
			query={queryString}
			variables={variables}
			onCompleted={onCompleted}
		>
			{children}
		</Mutation>
	);
};
