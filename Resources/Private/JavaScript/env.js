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
window.Sitegeist = window.Sitegeist || {};
window.Sitegeist.Objects = {};

//
// Expose app container
//
window.Sitegeist.Objects.appContainer = document.getElementById('app');

//
// Expose csrfToken
//
window.Sitegeist.Objects.csrfToken = window.Sitegeist.Objects.appContainer
	.querySelector('[itemprop="csrfToken"]').getAttribute('content');
