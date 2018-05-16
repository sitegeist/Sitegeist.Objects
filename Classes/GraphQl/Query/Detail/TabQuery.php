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

class TabQuery extends ObjectType
{
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'Tab',
            'description' => 'A tab configuration',
            'fields' => [
                'object' => [
                    'type' => $typeResolver->get(ObjectQuery::class),
                    'description' => 'The object this tab belongs to'
                ],
                'name' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The name of the tab'
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'The icon of the tab'
                ],
                'label' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The label of the tab'
                ],
                'description' => [
                    'type' => Type::string(),
                    'description' => 'The description of the tab'
                ],
                'groups' => [
                    'type' => Type::listOf($typeResolver->get(GroupQuery::class)),
                    'description' => 'All groups belonging to this tab'
                ],
                'properties' => [
                    'type' => Type::listOf($typeResolver->get(PropertyQuery::class)),
                    'description' => 'All properties belonging to this tab'
                ]
            ],
            'resolveField'  => function(TabHelper $tabConfiguration, $arguments, $context, ResolveInfo $info) {
                return $tabConfiguration->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
