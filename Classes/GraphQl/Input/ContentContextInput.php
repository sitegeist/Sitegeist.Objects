<?php
namespace Sitegeist\Objects\GraphQl\Input;

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
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\GraphQl\Scalar\JsonScalar;
use Sitegeist\Objects\GraphQl\Scalar\DateTimeScalar;

/**
 * Represents a Neos.ContentRepository Context Object
 */
class ContentContextInput extends InputObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'ContentContextInput',
            'description' => 'Neos.ContentRepository Context Object',
            'fields' => [
                'workspaceName' => [
                    'type' => Type::string(),
                    'description' => 'The workspace for this context, defaults to "live"'
                ],
                'currentDateTime' => [
                    'type' => DateTimeScalar::type(),
                    'description' => 'ISO 8601 Date Time for this context, defaults to now'
                ],
                'dimensions' => [
                    'type' => JsonScalar::type(),
                    'description' => 'Dimension configuration for this context'
                ],
                'targetDimensions' => [
                    'type' => JsonScalar::type(),
                    'description' => 'Target dimension configuration for this context'
                ],
                'invisibleContentShown' => [
                    'type' => Type::boolean(),
                    'description' => 'Determines if invisible content is shown in this context, defaults to `false`'
                ],
                'removedContentShown' => [
                    'type' => Type::boolean(),
                    'description' => 'Determines if removed content is shown in this context, defaults to `false`'
                ],
                'inaccessibleContentShown' => [
                    'type' => Type::boolean(),
                    'description' => 'Determines if inaccessible content is shown in this context, defaults to `false`'
                ]
            ]
        ]);
    }
}
