<?php
namespace Sitegeist\Objects\GraphQl\Query;

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
use Neos\ContentRepository\Domain\Model\NodeInterface;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ResolveInfo;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\GraphQl\Query\Detail\DetailQuery;
use Sitegeist\Objects\GraphQl\Query\Index\IndexQuery;

class StoreQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'Store',
            'description' => 'A store',
            'fields' => [
                'identifier' => [
                    'type' => Type::string(),
                    'description' => 'The identifier of this store'
                ],
                'parents' => [
                    'type' => Type::listOf($typeResolver->get(ParentQuery::class)),
                    'description' => 'The parents of this store'
                ],
                'name' => [
                    'type' => Type::string(),
                    'description' => 'The name of this store'
                ],
                'label' => [
                    'type' => Type::string(),
                    'description' => 'The label of this store'
                ],
                'title' => [
                    'type' => Type::string(),
                    'description' => 'The title of this store'
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'The icon of this store'
                ],
                'description' => [
                    'type' => Type::string(),
                    'description' => 'The description of this store'
                ],
                'nodeType' => [
                    'type' => $typeResolver->get(NodeTypeQuery::class),
                    'description' => 'The node type of this store'
                ],
                'objectIndex' => [
                    'type' => Type::nonNull($typeResolver->get(IndexQuery::class)),
                    'description' => 'Index of all objects in the store',
                    'args' => [
                        'from' => [
                            'type' => Type::int(),
                            'description' => 'Limit index length, starting at {from}',
                            'defaultValue' => 0
                        ],
                        'length' => [
                            'type' => Type::int(),
                            'description' => 'Limit index length',
                            'defaultValue' => 10
                        ],
                        'sort' => [
                            'type' => Type::string(),
                            'description' => 'Name of a property to sort by',
                            'defaultValue' => '_lastModificationDateTime'
                        ],

                        //
                        // @TODO: Make this an ENUM
                        //
                        'order' => [
                            'type' => Type::string(),
                            'description' => 'Direction to sort by',
                            'defaultValue' => 'DESC'
                        ]
                    ]
                ],
                'objectDetail' => [
                    'type' => Type::nonNull($typeResolver->get(DetailQuery::class)),
                    'description' => 'Information to edit or create an object node',
                    'args' => [
                        'nodeType' => [
                            'type' => Type::string(),
                            'description' => 'NodeType of the object node to be created'
                        ],
                        'identifier' => [
                            'type' => Type::id(),
                            'description' => 'Id of the object node to be edited'
                        ]
                    ]
                ]
            ],
            'resolveField'  => function(StoreHelper $store, $arguments, $context, ResolveInfo $info) {
                return $store->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
