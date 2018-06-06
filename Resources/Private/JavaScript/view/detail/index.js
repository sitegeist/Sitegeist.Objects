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
import invariant from 'invariant';

import Transient from '../../core/util/transient';
import {query} from '../../core/graphql/gql';

import Breadcrumb from '../../lib/presentation/structures/breadcrumb';

import DetailView from './view';

const GetDetailQuery = query/* GraphQL */`
	query getDetail($context: ContentContextInput!, $storeIdentifier: ID!, $objectIdentifier: ID, $nodeType: String) {
		store(context: $context, identifier: $storeIdentifier) {
			identifier
			objectDetail(nodeType: $nodeType, identifier: $objectIdentifier) {
				object {
					identifier
					parents {
						type
						identifier
						icon
						label
					}
					icon
					label
					nodeType {
						name
					}
					hasUnpublishedChanges
					previewUri
				}
				tabs {
					name
					icon
					label
					groups {
						name
						icon
						label
						properties {
							name
							label
							value
							editor
							editorOptions
						}
					}
				}
			}
		}
	}
`;

GetDetailQuery.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext
};

export default class extends Component {
	static propTypes = {
		storeIdentifier: PropTypes.string.isRequired,
		objectIdentifier: PropTypes.string,
		nodeType: PropTypes.string
	};

	static defaultProps = {
		objectIdentifier: null,
		nodeType: null
	};

	render() {
		const {storeIdentifier, objectIdentifier, nodeType} = this.props;

		invariant(objectIdentifier || nodeType, 'Either objectIdentifier or nodeType must be set');

		return (
			<GetDetailQuery
				storeIdentifier={storeIdentifier}
				objectIdentifier={objectIdentifier}
				nodeType={nodeType}
			>
				{({store}) => {
					const {object} = store.objectDetail;

					return (
						<Fragment>
							<Breadcrumb
								parents={object.parents}
								current={{
									icon: object.icon,
									label: object.identifier ?
										`${object.label} bearbeiten` : /* @TODO: I18n */
										`Neues ${object.label} erstellen`, /* @TODO: I18n */
									link: object.identifier ?
										`/store/${store.identifier}/edit/${object.identifier}` :
										`/store/${store.identifier}/create/${object.nodeType.name}`
								}}
							/>
							<Transient>
								{transient => (
									<DetailView
										store={store}
										transient={transient}
										{...store.objectDetail}
									/>
								)}
							</Transient>
						</Fragment>
					);
				}}
			</GetDetailQuery>
		);
	}
}
