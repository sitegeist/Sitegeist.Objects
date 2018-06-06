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
import styled from 'shim/styled-components';

import ButtonList from '../primitives/buttonList';

const Container = styled.div`
	display: flex;
	position: relative;
	top: 40px;
	flex-direction: column;
	height: calc(100vh - 149px);
	max-height: calc(100vh - 149px);
	margin-left: -54px!important;
	margin-top: -40px!important;
	width: calc(100% + 108px);
	box-sizing: border-box;

	*, *::after, *::before {
		box-sizing: border-box;
	}
`;

const Header = styled.header`
	max-height: 100px;
	flex-grow: 0;
	flex-shrink: 0;
	padding: 0 54px!important;
`;

const Body = styled.main`
	overflow-y: auto;
	flex-grow: 1;
`;

const Footer = styled.footer`
	max-height: 100px;
	flex-grow: 0;
	flex-shrink: 0;
	padding: 1em 54px!important;

	${ButtonList} {
		margin-bottom: 0!important;
	}
`;

export default class Layout extends Component {
	static propTypes = {
		renderHeader: PropTypes.func.isRequired,
		renderBody: PropTypes.func.isRequired,
		renderFooter: PropTypes.func.isRequired
	};

	render() {
		return (
			<Container>
				<Header>
					{this.props.renderHeader()}
				</Header>
				<Body>
					{this.props.renderBody()}
				</Body>
				<Footer>
					{this.props.renderFooter()}
				</Footer>
			</Container>
		);
	}
}
