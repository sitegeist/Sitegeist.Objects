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
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\Domain\Model\ObjectList;

class ObjectListQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'ObjectList',
            'description' => 'A List of Object',
            'fields' => [
                'tableHeadConfigurations' => [
                    'type' => Type::listOf($typeResolver->get(TableHeadConfigurationQuery::class)),
                    'description' => 'All table heads for this list',
                    'resolve' => function (ObjectList $objectList) {
                        return $objectList->getTableHeadConfigurations();
                    }
                ],
                'tableRowConfigurations' => [
                    'type' => Type::listOf($typeResolver->get(TableRowConfigurationQuery::class)),
                    'description' => 'All table rows for this list',
                    'resolve' => function (ObjectList $objectList) {
                        return $objectList->getTableRowConfigurations();
                    }
                ]
            ]
        ]);
    }
}
