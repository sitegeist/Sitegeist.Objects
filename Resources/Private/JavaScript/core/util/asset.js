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

export default class Asset extends Component {
	static propTypes = {
		asset: PropTypes.oneOfType([
			PropTypes.shape({
				'@@sitegeist/objects/type': PropTypes.oneOf(['asset']).isRequired,
				payload: PropTypes.string.isRequired
			}),
			PropTypes.shape({
				'@@sitegeist/objects/type': PropTypes.oneOf(['asset']).isRequired,
				payload: PropTypes.shape({
					name: PropTypes.string.isRequired,
					size: PropTypes.number.isRequired,
					type: PropTypes.string.isRequired
				}).isRequired
			}),
			PropTypes.shape({
				__identity: PropTypes.string.isRequired,
				mediaType: PropTypes.string.isRequired,
				fileName: PropTypes.string.isRequired,
				fileSize: PropTypes.string.isRequired
			})
		]).isRequired,
		children: PropTypes.func.isRequired
	};

	state = {
		isLoading: 'payload' in this.props.asset && typeof this.props.asset.payload === 'string',
		asset: null
	};

	componentDidMount() {
		const {asset} = this.props;

		if ('payload' in asset && typeof asset.payload === 'string') {
			//
			// @TODO: Error handling
			//
			fetch(
				`${window.Sitegeist.Objects.assetEndpoint}&asset[__identity]=${asset.payload}`,
				{credentials: 'include'}
			)
				.then(res => res.json())
				.then(asset => this.setState({asset, isLoading: false}));
		}
	}

	getAsset() {
		return this.state.asset || this.props.asset;
	}

	renderFileName = () => {
		const asset = this.getAsset();

		if (asset) {
			switch (true) {
				case 'fileName' in asset:
					return asset.fileName;

				case 'payload' in asset:
					return asset.payload.name;

				default:
					return 'Unknown';
			}
		}
	}

	renderFileSize = () => {
		const asset = this.getAsset();

		if (asset) {
			switch (true) {
				case 'fileSize' in asset:
					return parseInt(asset.fileSize, 10);

				case 'payload' in asset:
					return asset.payload.size;

				default:
					return 0;
			}
		}
	}

	renderMediaType = () => {
		const asset = this.getAsset();

		if (asset) {
			switch (true) {
				case 'mediaType' in asset:
					return asset.mediaType;

				case 'payload' in asset:
					return asset.payload.type;

				default:
					return 'Unknown';
			}
		}
	}

	renderLink = () => {
		const asset = this.getAsset();

		if (asset) {
			switch (true) {
				case '__identity' in asset:
					return `${window.Sitegeist.Objects.mediaEditUrl}?moduleArguments[asset][__identity]=${asset.__identity}`;

				default:
					return null;
			}
		}
	}

	renderThumbnailUri = () => {
		const asset = this.getAsset();

		if (asset) {
			switch (true) {
				case '__identity' in asset:
					return `${window.Sitegeist.Objects.thumbnailUrl}?asset[__identity]=${asset.__identity}&width=100&height=100&allowCropping=true`;

				case 'payload' in asset && 'preview' in asset.payload:
					return asset.payload.preview;

				default:
					return null;
			}
		}
	}

	renderAsset() {
		return {
			fileName: this.renderFileName(),
			fileSize: this.renderFileSize(),
			mediaType: this.renderMediaType(),
			link: this.renderLink(),
			thumbnailUri: this.renderThumbnailUri()
		};
	}

	render() {
		//
		// @TODO: better load handling
		//
		if (this.state.isLoading) {
			return (<div>Loading...</div>);
		}

		return this.props.children(this.renderAsset());
	}
}
