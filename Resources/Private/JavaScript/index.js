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
import {render} from 'shim/react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';

import Application from './core/application';

import StoresView from './view/stores';
import StoreView from './view/store';
import DetailView from './view/detail';

//
// Core Editors
//
import './plugins/editors/singleLineText';
import './plugins/editors/multiLineText';
import './plugins/editors/richText';
import './plugins/editors/boolean';
import './plugins/editors/asset';
import './plugins/editors/assets';
import './plugins/editors/collection';
import './plugins/editors/store';
import './plugins/editors/date';
import './plugins/editors/reference';
import './plugins/editors/references';

//
// Core converters
//
import './plugins/converters/asset';
import './plugins/converters/collection';

//
// Core filter editors
//
import './plugins/filterEditors/singleLineText';
import './plugins/filterEditors/date';

//
// Core Short Views
//
import './plugins/shortViews/dateRange';

const {appContainer} = window.Sitegeist.Objects;

render(
	<HashRouter>
		<Application>
			<Switch>
				<Route
					exact
					path="/"
					render={() => <StoresView/>}
				/>
				<Route
					exact
					path="/store/:identifier"
					render={({match}) => (<StoreView {...match.params}/>)}
				/>
				<Route
					exact
					path="/store/:storeIdentifier/create/:nodeType"
					render={({match}) => (<DetailView {...match.params}/>)}
				/>
				<Route
					exact
					path="/store/:storeIdentifier/edit/:objectIdentifier"
					render={({match}) => (<DetailView {...match.params}/>)}
				/>
			</Switch>
		</Application>
	</HashRouter>,
	appContainer
);
