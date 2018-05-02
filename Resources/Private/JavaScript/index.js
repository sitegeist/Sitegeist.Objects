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
import {render} from 'react-dom';

import Application from './core/application';

import StoresView from './view/stores';

const {appContainer} = window.Sitegeist.Objects;

render(
	<Application>
		<StoresView/>
	</Application>,
	appContainer
);
