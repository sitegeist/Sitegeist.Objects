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
import Condition from '../../../core/util/condition';
import Toggle from '../../../core/util/toggle';
import Asset from '../../../core/util/asset';

import UploadInput from '../../../lib/presentation/primitives/uploadInput';
import Button from '../../../lib/presentation/primitives/button';
import Editor from '../../../lib/presentation/structures/editor';
import MediaCard from '../../../lib/presentation/structures/mediaCard';
import MediaBrowser from '../../../lib/presentation/structures/mediaBrowser';

const {React, PropTypes} = window.Sitegeist.Objects.runtime;
const {Component} = window.Sitegeist.Objects.runtime.React;

window.Sitegeist.Objects.plugin.registerEditor('Asset', class AssetEditor extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		commit: PropTypes.func.isRequired,
		value: PropTypes.object
	};

	static defaultProps = {
		value: null
	};

	handleUpload = files => {
		const {commit} = this.props;

		commit({
			'@@sitegeist/objects/type': 'asset',
			payload: files[0]
		});
	};

	handleSelect = assetIdentifier => {
		const {commit} = this.props;

		commit({
			'@@sitegeist/objects/type': 'asset',
			payload: assetIdentifier
		});
	};

	handleDelete = () => {
		const {commit} = this.props;

		commit(null);
	};

	render() {
		const {id, value} = this.props;

		return (
			<Editor {...this.props}>
				<Condition condition={value === null}>
					<React.Fragment>
						<UploadInput allowMultiple={false} onChange={this.handleUpload} id={id}/>
						<Toggle initial={false}>
							{open => (
								<React.Fragment>
									<Button onClick={open.toggle}>
										{/* @TODO: */}
										Datei aus Media Browser auswählen
									</Button>
									{open.is ? (
										<MediaBrowser
											onClose={open.setFalse}
											onComplete={this.handleSelect}
										/>
									) : null}
								</React.Fragment>
							)}
						</Toggle>
					</React.Fragment>
				</Condition>
				<Condition condition={Boolean(value)}>
					{() => (
						<Asset asset={value}>
							{asset => (
								<MediaCard
									{...asset}
									linkToMediaBrowser={asset.link}
									onDelete={this.handleDelete}
								/>
							)}
						</Asset>
					)}
				</Condition>
			</Editor>
		);
	}
});
