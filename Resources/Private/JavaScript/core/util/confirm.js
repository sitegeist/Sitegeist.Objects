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

import Modal from '../../ui/primitives/modal';
import Button from '../../ui/primitives/button';
import ButtonList from '../../ui/primitives/buttonList';
import Separator from '../../ui/primitives/separator';

import Toggle from './toggle';
import Condition from './condition';

/**
 * @TODO Better documentation
 * @TODO This should better live in /ui
 */
export default class Confirm extends Component {
	static propTypes = {
		question: PropTypes.string.isRequired,
		onConfirm: PropTypes.func,
		onCancel: PropTypes.func,
		children: PropTypes.func
	}

	static defaultProps = {
		onConfirm: () => {},
		onCancel: () => {},
		children: () => null
	}

	handleConfirmation = () => {
		const {onConfirm} = this.props;

		onConfirm();
	};

	handleCancellation = () => {
		const {onCancel} = this.props;

		onCancel();
	};

	render() {
		return (
			<Toggle initial={false}>
				{open => (
					<React.Fragment>
						<Condition condition={open.is}>
							<Modal>
								{this.props.question}
								<Separator/>
								<ButtonList>
									<Button
										className="neos-button-danger"
										onClick={() => {
											open.setFalse();
											this.handleConfirmation();
										}}
									>
										{/* @TODO: I18n */}
										Ja
									</Button>
									<Button
										onClick={() => {
											open.setFalse();
											this.handleCancellation();
										}}
									>
										{/* @TODO: I18n */}
										Nein
									</Button>
								</ButtonList>
							</Modal>
						</Condition>
						{this.props.children({
							isOpen: open.is,
							show: open.setTrue,
							hide: open.setFalse
						})}
					</React.Fragment>
				)}
			</Toggle>
		);
	}
}
