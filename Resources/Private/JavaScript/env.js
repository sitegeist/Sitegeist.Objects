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
import {BehaviorSubject} from 'rxjs';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled, {keyframes} from 'styled-components';

//
// @TODO: There has to be a better way
//
import container, {constants, dropHandlers} from '../../../node_modules/smooth-dnd';

//
// Expose Runtime dependencies
//
window.Sitegeist.Objects.runtime = {
	React,
	ReactDOM,
	PropTypes,
	styled,
	styledKeyframes: keyframes,
	smoothDnd: {
		container,
		constants,
		dropHandlers
	}
};

const {registerEditor} = require('./core/plugin/editorManager');
const {registerConverter} = require('./core/plugin/converterManager');
const {registerFilterEditor} = require('./core/plugin/filterManager');
const {registerShortView} = require('./core/plugin/shortViewManager');

//
// Expose app container
//
window.Sitegeist.Objects.appContainer = document.getElementById('app');

//
// Expose csrfToken as a stream
//
window.Sitegeist.Objects.csrfToken$ = new BehaviorSubject(window.Sitegeist.Objects.csrfToken);

//
// Expose Plugin API
//
window.Sitegeist.Objects.plugin = {
	editors: {},
	registerEditor,
	converters: {},
	registerConverter,
	filterEditors: {},
	registerFilterEditor,
	shortViews: {},
	registerShortView
};
