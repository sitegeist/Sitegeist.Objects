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
use Sitegeist\Objects\GraphQl\Scalar\JsonScalar;
use Sitegeist\Objects\GraphQl\Query\ObjectQuery;

class TableRowQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'TableRow',
            'description' => 'Configuration for a table row',
            'fields' => [
                'object' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectQuery::class)),
                    'description' => 'Get the object represented by this row'
                ],
                'tableCells' => [
                    'type' => Type::listOf($typeResolver->get(TableCellQuery::class)),
                    'description' => 'All cells of this row'
                ]
            ],
            'resolveField'  => function(TableRowHelper $tableRowConfiguration, $arguments, $context, ResolveInfo $info) {
                return $tableRowConfiguration->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
