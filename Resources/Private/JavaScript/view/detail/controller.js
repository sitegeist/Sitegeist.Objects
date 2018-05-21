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
import React from 'react';
import PropTypes from 'prop-types';

import createController from '../../core/controller';

import Transient from '../../core/util/transient';

import DetailQuery from '../../query/detail';
import CreateObjectMutation from '../../mutation/createObject';
import UpdateObjectMutation from '../../mutation/updateObject';
import RemoveObjectMutation from '../../mutation/removeObject';

export default createController({
	propTypes: {
		storeIdentifier: PropTypes.string.isRequired,
		objectIdentifier: PropTypes.string,
		nodeType: PropTypes.string
	},
	components: ({storeIdentifier, objectIdentifier, nodeType, history}) => ({
		detailQuery: (
			<DetailQuery
				storeIdentifier={storeIdentifier}
				objectIdentifier={objectIdentifier}
				nodeType={nodeType}
			/>
		),
		createObjectMutation: (
			<CreateObjectMutation
				storeIdentifier={storeIdentifier}
				nodeType={nodeType}
				onCompleted={({store}) => {
					/* @TODO: Flash Message */
					/**
					 * @TODO: Workaround as per
					 *        https://github.com/ReactTraining/react-router/issues/1982#issuecomment-314167564
					 *        Everybody seems to make their libraries defensive as hell nowadays... 🙄
					 *        I know it's wrong to do this at this point, but I do not have an alternative, since the
					 *        Apollo Cache Invalidation doesn't work properly.
					 */
					history.push(`/empty`);
					setTimeout(() => {
						history.replace(`/store/${storeIdentifier}/edit/${store.createObject.identifier}`);
					});
				}}
			/>
		),
		createObjectAndContinueMutation: (
			<CreateObjectMutation
				storeIdentifier={storeIdentifier}
				nodeType={nodeType}
				onCompleted={() => {
					/* @TODO: Flash Message */
				}}
			/>
		),
		updateObjectMutation: (
			<UpdateObjectMutation
				storeIdentifier={storeIdentifier}
				objectIdentifier={objectIdentifier}
				onCompleted={() => {
					/* @TODO: Flash Message */
					/**
					 * @TODO: Workaround as per
					 *        https://github.com/ReactTraining/react-router/issues/1982#issuecomment-314167564
					 *        Everybody seems to make their libraries defensive as hell nowadays... 🙄
					 *        I know it's wrong to do this at this point, but I do not have an alternative, since the
					 *        Apollo Cache Invalidation doesn't work properly.
					 */
					history.push(`/empty`);
					setTimeout(() => {
						history.replace(`/store/${storeIdentifier}/edit/${objectIdentifier}`);
					});
				}}
			/>
		),
		removeObjectMutation: (
			<RemoveObjectMutation
				storeIdentifier={storeIdentifier}
				objectIdentifier={objectIdentifier}
				onCompleted={() => {
					/* @TODO: Flash Message */
					history.push(`/store/${storeIdentifier}`);
				}}
			/>
		),
		transient: (<Transient/>)
	}),
	mapProps: ({detailQuery, createObjectMutation, createObjectAndContinueMutation, updateObjectMutation}) => ({
		isBusy: (
			(createObjectMutation.status && createObjectMutation.status.loading) ||
			(createObjectAndContinueMutation.status && createObjectAndContinueMutation.status.loading) ||
			(updateObjectMutation.status && updateObjectMutation.status.loading)
		),
		store: detailQuery.store
	})
});
