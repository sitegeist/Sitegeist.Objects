<?php
namespace Sitegeist\Objects\GraphQl\Query\Index;

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

class ObjectIndexQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'ObjectIndex',
            'description' => 'A List of Object',
            'fields' => [
                'tableHeads' => [
                    'type' => Type::listOf($typeResolver->get(TableHeadQuery::class)),
                    'description' => 'All table heads for this list'
                ],
                'tableRows' => [
                    'type' => Type::listOf($typeResolver->get(TableRowQuery::class)),
                    'description' => 'All table rows for this list'
                ]
            ],
            'resolveField'  => function(ObjectIndex $objectList, $arguments, $context, ResolveInfo $info) {
                return $objectList->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
