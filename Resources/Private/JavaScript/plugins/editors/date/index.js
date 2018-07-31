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
import DatePicker from 'react-datepicker';
import moment from 'moment';
import styled from 'shim/styled-components';

import Button from '../../../lib/presentation/primitives/button';
import Icon from '../../../lib/presentation/primitives/icon';
import Editor from '../../../lib/presentation/structures/editor';
import {DateContext} from '../../../core/application';

const {React, PropTypes} = window.Sitegeist.Objects.runtime;
const {Component} = window.Sitegeist.Objects.runtime.React;

const AdjustStyles = styled.div`
	display: flex;

	> div:first-child {
		width: 100%;
	}

	.react-datepicker-wrapper,
	.react-datepicker__input-container,
	.react-datepicker-wrapper input[type="text"] {
		width: 100%;
	}

	.react-datepicker__triangle {
		&::before {
			border-bottom-color: #3f3f3f;
		}
	}

	.react-datepicker,
	.react-datepicker__header {
		border-radius: 0;
		background-color: #3f3f3f;
		color: #fff;
	}

	.react-datepicker__day:hover,
	.react-datepicker__day--keyboard-selected {
		border-radius: 0;
	}

	.react-datepicker__navigation {
		padding: 5px 10px;
		line-height: 1;
		height: auto;
	}

	.react-datepicker__navigation--previous::after {
		content: '<';
	}

	.react-datepicker__navigation--next::after {
		content: '>';
	}

	.react-datepicker__current-month {
		padding: 15px 0;
		color: #fff;
	}

	.react-datepicker__day:hover {
		background-color: #fff;
		color: #000;
	}

	.react-datepicker__day-name,
	.react-datepicker__day,
	.react-datepicker__time-name {
		width: 3em;
		line-height: 3em;
		color: #fff;
	}

	.react-datepicker__day--outside-month {
		opacity: .5;
	}
`;

//
// @TODO: I18n
//
window.Sitegeist.Objects.plugin.registerEditor('Date', class DateEditor extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		commit: PropTypes.func.isRequired,
		value: PropTypes.string
	};

	static defaultProps = {
		value: ''
	};

	static getDerivedStateFromProps = ({value}) => ({
		value: value ? moment(value) : null
	});

	state = {
		value: null
	};

	handleChange = value => {
		const {commit} = this.props;

		commit(value === null ? null : value.format('YYYY-MM-DDTHH:mm:ssZ'));
	}

	render() {
		const {id} = this.props;
		const {value} = this.state;

		return (
			<Editor {...this.props}>
				<AdjustStyles>
					{/* @TODO: I18n */}
					{/* @TODO: Make dateFormat configurable */}
					<DateContext.Consumer>
						{({today, lastChosenDate, setLastChosenDate}) => (
							<DatePicker
								id={id}
								locale="de"
								openToDate={lastChosenDate || today}
								selected={value}
								onChange={value => {
									setLastChosenDate(value);
									this.handleChange(value);
								}}
								dateFormat="LL"
							/>
						)}
					</DateContext.Consumer>
					<Button onClick={() => this.handleChange(null)}>
						<Icon className="icon-times"/>
					</Button>
				</AdjustStyles>
			</Editor>
		);
	}
});
