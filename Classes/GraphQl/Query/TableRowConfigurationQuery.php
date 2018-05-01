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
use Sitegeist\Objects\Domain\Model\TableRowConfiguration;
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
                    'description' => 'Identifier of the row',
                    'resolve' => function (TableRowConfiguration $tableRowConfiguration) {
                        return $tableRowConfiguration->getIdentifier();
                    }
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'Icon of the row',
                    'resolve' => function (TableRowConfiguration $tableRowConfiguration) {
                        return $tableRowConfiguration->getIcon();
                    }
                ],
                'label' => [
                    'type' => Type::string(),
                    'description' => 'Label of the row',
                    'resolve' => function (TableRowConfiguration $tableRowConfiguration) {
                        return $tableRowConfiguration->getLabel();
                    }
                ],
                'isHidden' => [
                    'type' => Type::boolean(),
                    'description' => 'Is the row hidden?',
                    'resolve' => function (TableRowConfiguration $tableRowConfiguration) {
                        return $tableRowConfiguration->getNode()->isHidden();
                    }
                ],
                'isRemoved' => [
                    'type' => Type::boolean(),
                    'description' => 'Has the row been removed?',
                    'resolve' => function (TableRowConfiguration $tableRowConfiguration) {
                        return $tableRowConfiguration->getIsRemoved();
                    }
                ],
                'tableCellConfigurations' => [
                    'type' => Type::listOf($typeResolver->get(TableCellConfigurationQuery::class)),
                    'description' => 'All cells of this row',
                    'resolve' => function (TableRowConfiguration $tableRowConfiguration) {
                        return $tableRowConfiguration->getTableCellConfigurations();
                    }
                ]

            ]
        ]);
    }
}
