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
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\Domain\Model\Index\TableCellConfiguration;
use Sitegeist\Objects\GraphQl\Scalar\JsonScalar;

class TableCellConfigurationQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'TableCellConfiguration',
            'description' => 'Configuration for a table cell',
            'fields' => [
                'view' => [
                    'type' => Type::string(),
                    'description' => 'The View for this cell',
                    'resolve' => function (TableCellConfiguration $tableCellConfiguration) {
                        return $tableCellConfiguration->getView();
                    }
                ],
                'viewOptions' => [
                    'type' => JsonScalar::type(),
                    'description' => 'The View options configuration of this cell',
                    'resolve' => function (TableCellConfiguration $tableCellConfiguration) {
                        return $tableCellConfiguration->getViewOptions();
                    }
                ],
                'propertyName' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The property name of this cell',
                    'resolve' => function (TableCellConfiguration $tableCellConfiguration) {
                        return $tableCellConfiguration->getPropertyName();
                    }
                ],
                'value' => [
                    'type' => JsonScalar::type(),
                    'description' => 'The property value of this cell',
                    'resolve' => function (TableCellConfiguration $tableCellConfiguration) {
                        return $tableCellConfiguration->getValue();
                    }
                ]
            ]
        ]);
    }
}
