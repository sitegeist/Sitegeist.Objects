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
import React from 'shim/react';
import ReactDOM from 'shim/react-dom';
import PropTypes from 'shim/prop-types';
//
// @TODO: This is a breach of responsibility
//
import {Link} from 'react-router-dom';

//
// @TODO: All of this is hacky, but it provides us with the ability to override the default
//        backend module breadcrumb. Still, besides that, this breadcrumb is a global concern
//        and now needs to be repeated for every view. This should be ficed in the future.
//

const breadcrumbContainer = document.querySelector('.neos-breadcrumb');

const originalElements = Array.from(breadcrumbContainer.querySelectorAll('li a')).map(link => ({
	link: link.getAttribute('href'),
	label: link.textContent,
	icon: link.querySelector('i').getAttribute('class'),
	isInitiallyActive: link.classList.contains('active')
}));

breadcrumbContainer.innerHTML = '';

const UniversalLink = ({to, ...props}) => {
	const [currentLocation] = window.location.href.split('#');

	if (to === currentLocation) {
		return (<Link to="/" {...props}/>);
	}

	if (to.startsWith('http')) {
		return (<a href={to} {...props}/>);
	}

	return (<Link to={to} {...props}/>);
};

UniversalLink.propTypes = {
	to: PropTypes.string.isRequired
};

const Breadcrumb = ({items}) => ReactDOM.createPortal(
	<React.Fragment>
		{[
			...originalElements.map(item => ({
				...item,
				isActive: item.isInitiallyActive && !items.some(item => item.isActive)
			})),
			...items
		].map((item, index, list) => (
			<li key={item.link}>
				<UniversalLink to={item.link} className={item.isActive ? 'active' : ''}>
					<i className={item.icon} style={{marginRight: index > 1 ? '4px' : null}}/>
					{item.label}
				</UniversalLink>
				{index === list.length - 1 ? '' : (
					<span className="neos-divider">/</span>
				)}
			</li>
		))}
	</React.Fragment>,
	breadcrumbContainer
);

Breadcrumb.propTypes = {
	items: PropTypes.arrayOf(PropTypes.shape({
		link: PropTypes.string.isRequired,
		icon: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		isActive: PropTypes.bool
	}))
};

Breadcrumb.defaultProps = {
	items: []
};

export default Breadcrumb;
