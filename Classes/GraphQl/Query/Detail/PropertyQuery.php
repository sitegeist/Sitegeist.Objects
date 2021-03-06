<?php
namespace Sitegeist\Objects\GraphQl\Query\Detail;

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
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ResolveInfo;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\GraphQl\Scalar\JsonScalar;
use Sitegeist\Objects\GraphQl\Query\ObjectQuery;

class PropertyQuery extends ObjectType
{
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'Property',
            'description' => 'A property configuration',
            'fields' => [
                'object' => [
                    'type' => $typeResolver->get(ObjectQuery::class),
                    'description' => 'The object this property belongs to'
                ],
                'name' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The name of the property'
                ],
                'label' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The label of the property'
                ],
                'editable' => [
                    'type' => Type::nonNull(Type::boolean()),
                    'description' => 'true, if the property is editable in detail view'
                ],
                'editor' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The editor for the property'
                ],
                'editorOptions' => [
                    'type' => JsonScalar::type(),
                    'description' => 'The editor options for the property'
                ],
                'value' => [
                    'type' => JsonScalar::type(),
                    'description' => 'The value of the property'
                ]
            ],
            'resolveField'  => function(PropertyHelper $propertyConfiguration, $arguments, $context, ResolveInfo $info) {
                return $propertyConfiguration->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
