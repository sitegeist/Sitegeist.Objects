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
use Sitegeist\Objects\GraphQl\Query\ObjectQuery;

class CollectionQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'Collection',
            'description' => 'Detailed information about a collection',
            'fields' => [
                'owner' => [
                    'type' => $typeResolver->get(ObjectQuery::class),
                    'description' => 'The id of the object node or null if empty'
                ],
                'objectDetails' => [
                    'type' => Type::listOf($typeResolver->get(DetailQuery::class)),
                    'description' => 'Information to edit object nodes'
                ],
                'emptyObjectDetail' => [
                    'type' => $typeResolver->get(DetailQuery::class),
                    'description' => 'Information to create object nodes',
                    'args' => [
                        'nodeType' => [
                            'type' => Type::string(),
                            'description' => 'NodeType of the empty object'
                        ]
                    ]
                ]
            ],
            'resolveField'  => function(CollectionHelper $collection, $arguments, $context, ResolveInfo $info) {
                return $collection->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
