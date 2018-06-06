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
import styled from 'shim/styled-components';

import Icon from '../../../lib/presentation/primitives/icon';
import Button from '../../../lib/presentation/primitives/button';
import TextInput from '../../../lib/presentation/primitives/textInput';
import Editor from '../../../lib/presentation/structures/editor';

import ReferencesQuery from '../../../query/references';
import ReferenceQuery from '../../../query/reference';

const {React, PropTypes} = window.Sitegeist.Objects.runtime;
const {Component} = window.Sitegeist.Objects.runtime.React;

const ReferenceCard = styled.div`
	background-color: #1a1a1a;
	display: flex;
	align-items: center;
	max-width: 50vw;

	${Icon} {
		padding: 0 10px;
		width: 50px!important;
	}

	${Button} {
		width: 50px!important;
		height: 40px!important;
	}
`;

const ReferenceLabel = styled.span`
	display: block;
	width: 100%;
`;

const SelectButton = styled(Button)`
	display: block!important;
	width: 100%!important;
	max-width: 500px;
	text-align: left!important;
`;

window.Sitegeist.Objects.plugin.registerEditor('Reference', class ReferenceEditor extends Component {
	static propTypes = {
		commit: PropTypes.func.isRequired,
		value: PropTypes.string
	};

	static defaultProps = {
		value: null
	};

	state = {
		search: ''
	};

	handleSearch = event => {
		this.setState({search: event.target.value});
	};

	handleSelect = value => {
		const {commit} = this.props;

		commit(value);
		this.setState({search: ''});
	};

	handleDelete = () => {
		const {commit} = this.props;

		commit(null);
	};

	render() {
		const {value} = this.props;

		return (
			<Editor {...this.props}>
				{value ? (
					<ReferenceQuery identifier={value}>
						{({reference}) => (
							<ReferenceCard>
								<Icon className={reference.nodeType.icon}/>
								<ReferenceLabel>
									{reference.label}
								</ReferenceLabel>
								<Button onClick={this.handleDelete}>
									<Icon className="icon-close"/>
								</Button>
							</ReferenceCard>
						)}
					</ReferenceQuery>
				) : (
					<React.Fragment>
						{/* @TODO: I18n */}
						<TextInput placeholder="Suchbegriff eingeben..." onChange={this.handleSearch}/>
						{this.state.search.length > 2 ? (
							<ReferencesQuery search={this.state.search}>
								{({references}) => references.length ? references.map(reference => (
									<SelectButton key={reference.identifier} onClick={() => this.handleSelect(reference.identifier)}>
										<Icon className={reference.nodeType.icon}/> {reference.label}
									</SelectButton>
								)) : (
									<div>
										{/* @TODO: I18n */}
										Leider keine Ergebnisse zu &quot;{this.state.search}&quot;.
									</div>
								)}
							</ReferencesQuery>
						) : (
							<div>
								{/* @TODO: I18n */}
								Bitte geben Sie mindestens 3 Zeichen ein.
							</div>
						)}
					</React.Fragment>
				)}
			</Editor>
		);
	}
});
