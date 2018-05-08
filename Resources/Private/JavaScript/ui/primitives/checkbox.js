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
import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({id, isChecked, onChange}) => (
	<label
		htmlFor={id}
		className="neos-checkbox"
	>
		<input
			id={id}
			type="checkbox"
			checked={Boolean(isChecked)}
			onChange={onChange}
		/>
		<span/>
	</label>
);

Checkbox.propTypes = {
	id: PropTypes.string.isRequired,
	isChecked: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired
};

export default Checkbox;
