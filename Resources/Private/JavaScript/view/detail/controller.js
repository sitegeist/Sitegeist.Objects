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
import React from 'shim/react';
import PropTypes from 'shim/prop-types';

import createController from '../../core/controller';

import Transient from '../../core/util/transient';

import DetailQuery from '../../query/detail';

export default createController({
	propTypes: {
		storeIdentifier: PropTypes.string.isRequired,
		objectIdentifier: PropTypes.string,
		nodeType: PropTypes.string
	},
	components: ({storeIdentifier, objectIdentifier, nodeType}) => ({
		detailQuery: (
			<DetailQuery
				storeIdentifier={storeIdentifier}
				objectIdentifier={objectIdentifier}
				nodeType={nodeType}
			/>
		),
		transient: (<Transient/>)
	}),
	mapProps: ({detailQuery}) => ({
		store: detailQuery.store
	})
});
