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
import PropTypes from 'shim/prop-types';
import ReactDOM from 'shim/react-dom';
import styled from 'shim/styled-components';

import Overlay from './overlay';

const modalRoot = document.getElementById('modals');

const DialogContainer = styled.div`
`;

export default class Modal extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired
	};

	constructor(props) {
		super(props);
		this.el = document.createElement('div');
	}

	componentDidMount() {
		modalRoot.appendChild(this.el);
	}

	componentWillUnmount() {
		modalRoot.removeChild(this.el);
	}

	render() {
		return ReactDOM.createPortal(
			<Overlay>
				<DialogContainer>
					{this.props.children}
				</DialogContainer>
			</Overlay>,
			this.el
		);
	}
}
