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

import SaveObject from '../../actions/saveObject';
import RemoveObjects from '../../actions/removeObjects';
import PublishObjects from '../../actions/publishObjects';
import DiscardObjects from '../../actions/discardObjects';

import ButtonList from '../../ui/primitives/buttonList';
import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';

/* @TODO: Ad-Hoc styled component  */
const Container = styled.div`
	display: flex;
	justify-content: space-between;
`;

export default class Operations extends Component {
	static propTypes = {
		object: PropTypes.shape({
			identifier: PropTypes.string,
			nodeType: PropTypes.shape({
				name: PropTypes.string.isRequired
			})
		}).isRequired,
		store: PropTypes.shape({
			identifier: PropTypes.string.isRequired
		}).isRequired,
		transient: PropTypes.object.isRequired
	};

	render() {
		const {object, store, transient} = this.props;

		return (
			<Container>
				<ButtonList>
					{object.identifier ? (
						<RemoveObjects store={store} objects={[object]}/>
					) : null}

					{object.identifier ? (
						<DiscardObjects store={store} objects={[object]}/>
					) : null}

					<Button disabled={!transient.hasValues} onClick={transient.reset}>
						<Icon className="icon-undo"/>
						{/* @TODO: I18n */}
						Zurücksetzen
					</Button>
				</ButtonList>
				<ButtonList>
					{object.identifier ? (
						<PublishObjects store={store} objects={[object]}/>
					) : null}

					<SaveObject store={store} object={object} transient={transient}/>
				</ButtonList>
			</Container>
		);
	}
}
