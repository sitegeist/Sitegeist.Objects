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
window.Sitegeist.Objects.plugin.registerConverter('asset', async ({payload}) => {
	if (typeof payload === 'object') {
		const formData = new FormData();

		formData.append('asset[resource]', payload);

		const response = await fetch(window.Sitegeist.Objects.uploadEndpoint, {
			method: 'POST',
			credentials: 'include',
			body: formData
		});
		const asset = await response.json();

		return asset;
	}

	return {__identity: payload};
});
