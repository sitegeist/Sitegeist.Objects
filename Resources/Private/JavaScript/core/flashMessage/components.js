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
import React, {Component} from 'shim/react';
import ReactDOM from 'shim/react-dom';
import styled from 'shim/styled-components';
import PropTypes from 'shim/prop-types';
import mergeClassNames from 'classnames';

import Toggle from '../../core/util/toggle';

const FlashMessage = ({content, severity, message, onClose, ...props}) => (
	<Toggle initial={false}>
		{expanded => (
			<div className={`neos-notification neos-notification-${severity}`}>
				<i className="icon-remove neos-close-button" onClick={onClose}/>
				<div className="neos-title">{message}</div>
				<div className="neos-message">
					<div
						className={mergeClassNames({
							'neos-notification-content expandable': Boolean(content),
							expanded: expanded.is
						})}
					>
						<i className={`icon-${severity}`}/>
						<div className="neos-notification-heading" onClick={expanded.toggle}>{message}</div>
						{content ? (
							<div className="neos-expand-content" style={{display: expanded.is ? 'block' : 'none'}}>
								{content}
							</div>
						) : null}
					</div>
				</div>
			</div>
		)}
	</Toggle>
);

const flashMessageContainer = document.getElementById('neos-notification-container');

const FlashMessageContainer = ({children}) => ReactDOM.createPortal(
	children,
	flashMessageContainer
);

export default FlashMessage;
export {FlashMessageContainer};
