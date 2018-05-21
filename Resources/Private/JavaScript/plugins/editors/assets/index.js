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
import {Container, Draggable} from 'react-smooth-dnd';

import Toggle from '../../../core/util/toggle';
import List from '../../../core/util/list';
import Asset from '../../../core/util/asset';

import UploadInput from '../../../ui/primitives/uploadInput';
import Button from '../../../ui/primitives/button';
import Editor from '../../../ui/structures/editor';
import MediaCard from '../../../ui/structures/mediaCard';
import MediaBrowser from '../../../ui/structures/mediaBrowser';

const {React, PropTypes} = window.Sitegeist.Objects.runtime;
const {Component} = window.Sitegeist.Objects.runtime.React;

window.Sitegeist.Objects.plugin.registerEditor('Assets', class AssetsEditor extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		commit: PropTypes.func.isRequired,
		value: PropTypes.array
	};

	static defaultProps = {
		value: []
	};

	handleUpload = files => {
		const {commit, value} = this.props;

		commit([
			...(value || []),
			...files.map(file => ({
				'@@sitegeist/objects/type': 'asset',
				payload: file
			}))
		]);
	};

	handleSelect = assetIdentifier => {
		const {commit, value} = this.props;

		commit([
			...(value || []),
			{
				'@@sitegeist/objects/type': 'asset',
				payload: assetIdentifier
			}
		]);
	};

	handleListChange = values => {
		const {commit} = this.props;

		commit(values);
	};

	render() {
		const {id, value} = this.props;

		return (
			<Editor {...this.props}>
				<List
					value={value}
					onChange={this.handleListChange}
				>
					{assets => (
						<Container onDrop={({removedIndex, addedIndex}) => assets.move(removedIndex, addedIndex)}>
							{assets.map(({value, remove}) => (
								/* @TODO: key prop is not unique */
								<Draggable key={JSON.stringify(value)}>
									<Asset asset={value}>
										{asset => (
											<MediaCard
												{...asset}
												linkToMediaBrowser={asset.link}
												onDelete={remove}
											/>
										)}
									</Asset>
								</Draggable>
							))}
						</Container>
					)}
				</List>

				<UploadInput allowMultiple onChange={this.handleUpload} id={id}/>

				<Toggle initial={false}>
					{open => (
						<React.Fragment>
							<Button onClick={open.toggle}>
								{/* @TODO: I18n */}
								Datei aus Media Browser auswählen
							</Button>
							{open.is ? (
								<MediaBrowser
									onClose={open.setFalse}
									onComplete={assetIdentifier => {
										this.handleSelect(assetIdentifier);
										open.setFalse();
									}}
								/>
							) : null}
						</React.Fragment>
					)}
				</Toggle>

			</Editor>
		);
	}
});
