<?php
namespace Sitegeist\Objects\TypeConverter;

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

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Property\PropertyMappingConfigurationInterface;
use Neos\Flow\Property\TypeConverter\AbstractTypeConverter;
use Sitegeist\Objects\Json;

/**
 * @Flow\Scope("singleton")
 */
class JsonTypeConverter extends AbstractTypeConverter
{
    /**
     * @var array
     */
    protected $sourceTypes = ['string', 'array'];

    /**
     * @var string
     */
    protected $targetType = Json::class;

    /**
     * @var integer
     */
    protected $priority = 1;

    /**
     * @param mixed $source not used
     * @param string $targetType not used
     * @param array $subProperties not used
     * @param PropertyMappingConfigurationInterface $configuration
     * @return string
     */
    public function convertFrom($source, $targetType = null, array $subProperties = array(), PropertyMappingConfigurationInterface $configuration = null)
    {
        if (is_array($source)) {
            return new Json($source);
        }

        if (is_string($source)) {
            return new Json(json_decode($source, true));
        }

        return null;
    }
}
