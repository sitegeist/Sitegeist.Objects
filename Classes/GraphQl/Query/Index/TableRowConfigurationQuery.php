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

class TableRowConfigurationQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'TableRowConfiguration',
            'description' => 'Configuration for a table row',
            'fields' => [
                'identifier' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'Identifier of the row'
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'Icon of the row'
                ],
                'label' => [
                    'type' => Type::string(),
                    'description' => 'Label of the row'
                ],
                'isHidden' => [
                    'type' => Type::boolean(),
                    'description' => 'Is the row hidden?'
                ],
                'isRemoved' => [
                    'type' => Type::boolean(),
                    'description' => 'Has the row been removed?'
                ],
                'hasUnpublishedChanges' => [
                    'type' => Type::boolean(),
                    'description' => 'Does the object have unpublished changes?'
                ],
                'tableCellConfigurations' => [
                    'type' => Type::listOf($typeResolver->get(TableCellConfigurationQuery::class)),
                    'description' => 'All cells of this row'
                ]
            ],
            'resolveField'  => function(TableRowConfiguration $tableRowConfiguration, $arguments, $context, ResolveInfo $info) {
                return $tableRowConfiguration->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
