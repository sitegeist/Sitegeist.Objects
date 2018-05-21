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
export const registerConverter = (name, converterFunction) => {
	window.Sitegeist.Objects.plugin.converters[name] = converterFunction;
};

export default async function convertPropertiesRecursively(value) {
	//
	// Value is not an object. Just echo.
	//
	if (typeof value !== 'object') {
		return value;
	}

	//
	// Value is an array. Convert all items.
	//
	if (Array.isArray(value)) {
		return Promise.all(value.map(convertPropertiesRecursively));
	}

	if ('__identity' in value) {
		return {__identity: value.__identity};
	}

	if ('@@sitegeist/objects/type' in value) {
		const converterFunction = window.Sitegeist.Objects.plugin.converters[value['@@sitegeist/objects/type']];

		if (!converterFunction) {
			throw new Error(`Could not find converter for ${value['@@sitegeist/objects/type']}`);
		}

		return converterFunction(value, convertPropertiesRecursively);
	}

	const convertedProperties = await Promise.all(
		Object.keys(value).map(async propertyName => {
			const propertyValue = value[propertyName];
			return {
				propertyName,
				propertyValue: await convertPropertiesRecursively(propertyValue)
			};
		})
	);

	const finalProperties = convertedProperties.reduce((properties, {propertyName, propertyValue}) => {
		if (propertyValue !== undefined) {
			properties[propertyName] = propertyValue;
		}

		return properties;
	}, {});

	return finalProperties;
}
