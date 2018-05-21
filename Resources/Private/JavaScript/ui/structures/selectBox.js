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
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Condition from '../../core/util/condition';
import Toggle from '../../core/util/toggle';
import Select from '../../core/util/select';

import Button from '../../ui/primitives/button';
import Icon from '../../ui/primitives/icon';

const Overlay = styled.div`
	${props => props.isOpen && `
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 19999;
	`}
`;

const Container = styled.div`
	position: relative;
	display: inline-block;

	${props => props.isOpen && `
		z-index: 20000;
	`}
`;

const Chevron = styled(Icon)``;

const Head = styled.div`
	width: 100%;

	${Chevron} {
		margin-right: 0;
		margin-left: 10px;
		/* @TODO: There must be a better way... */
		font-size: 10px!important;
	}
`;

const Body = styled.div`
	position: absolute;
	left: 0;
	top: 100%;
	display: ${props => props.isOpen ? 'block' : 'none'};
	width: 100%;
	min-width: 300px;
	height: 300px;
	overflow-y: scroll;
	background-color: #3f3f3f;

	${Button} {
		width: 100%;
	}
`;

const DefaultSelectHead = ({open, select}) => (
	<div>
		<Button>
			<Condition condition={Boolean(select.selectedItem.data.icon)}>
				<Icon className={select.selectedItem.data.icon}/>
			</Condition>
			{select.selectedItem.data.label}
			<Chevron className={open.is ? 'icon-chevron-up' : 'icon-chevron-down'}/>
		</Button>
	</div>
);

DefaultSelectHead.propTypes = {
	open: PropTypes.object.isRequired,
	select: PropTypes.shape({
		selectedItem: PropTypes.shape({
			data: PropTypes.shape({
				icon: PropTypes.string,
				label: PropTypes.string.isRequired
			})
		})
	}).isRequired
};

const DefaultSelectBody = ({select}) => (
	<React.Fragment>
		{select.allItems.map(({name, data}) => (
			<Button key={name} onClick={() => select.select(name)}>
				<Condition condition={Boolean(data.icon)}>
					<Icon className={data.icon}/>
				</Condition>
				{data.label}
			</Button>
		))}
	</React.Fragment>
);

DefaultSelectBody.propTypes = {
	select: PropTypes.shape({
		allItems: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			data: PropTypes.shape({
				icon: PropTypes.string,
				value: PropTypes.string.isRequired,
				label: PropTypes.string.isRequired
			})
		}))
	}).isRequired
};

export default class SelectBox extends Component {
	static propTypes = {
		renderHead: PropTypes.func,
		children: PropTypes.func,
		onChange: PropTypes.func
	};

	static defaultProps = {
		renderHead: DefaultSelectHead,
		children: DefaultSelectBody,
		onChange: () => {}
	};

	render() {
		const {renderHead, children, onChange, ...rest} = this.props;

		return (
			<Toggle initial={false}>
				{open => (
					<Select
						onChange={({selectedItem}) => {
							onChange(selectedItem);
							open.setFalse();
						}}
						{...rest}
					>
						{select => (
							<Select {...rest}>
								{focus => (
									<React.Fragment>
										<Overlay isOpen={open.is} onClick={open.toggle}/>
										<Container isOpen={open.is}>
											<Head onClick={open.toggle}>
												{renderHead({open, select, focus})}
											</Head>
											<Body isOpen={open.is}>
												{children({open, select, focus})}
											</Body>
										</Container>
									</React.Fragment>
								)}
							</Select>
						)}
					</Select>
				)}
			</Toggle>
		);
	}
}
