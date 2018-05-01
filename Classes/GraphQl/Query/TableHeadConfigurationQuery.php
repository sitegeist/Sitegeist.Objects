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
use Sitegeist\Objects\Domain\Model\Index\TableHeadConfiguration;
use Sitegeist\Objects\GraphQl\Scalar\JsonScalar;

class TableHeadConfigurationQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'TableHeadConfiguration',
            'description' => 'Configuration for a table head',
            'fields' => [
                'name' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'Name of the column',
                    'resolve' => function (TableHeadConfiguration $tableHeadConfiguration) {
                        return $tableHeadConfiguration->getName();
                    }
                ],
                'label' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'Label of the column',
                    'resolve' => function (TableHeadConfiguration $tableHeadConfiguration) {
                        return $tableHeadConfiguration->getLabel();
                    }
                ],
                'sorting' => [
                    'type' => JsonScalar::type(),
                    'description' => 'Sorting configuration of the column',
                    'resolve' => function (TableHeadConfiguration $tableHeadConfiguration) {
                        return $tableHeadConfiguration->getSorting();
                    }
                ],
                'filter' => [
                    'type' => Type::string(),
                    'description' => 'Filter-View for the column',
                    'resolve' => function (TableHeadConfiguration $tableHeadConfiguration) {
                        return $tableHeadConfiguration->getFilter();
                    }
                ],
                'filterOptions' => [
                    'type' => JsonScalar::type(),
                    'description' => 'Filter options configuration of the column',
                    'resolve' => function (TableHeadConfiguration $tableHeadConfiguration) {
                        return $tableHeadConfiguration->getFilterOptions();
                    }
                ],
                'filterOperations' => [
                    'type' => JsonScalar::type(),
                    'description' => 'Filter operations configuration of the column',
                    'resolve' => function (TableHeadConfiguration $tableHeadConfiguration) {
                        return $tableHeadConfiguration->getFilterOperations();
                    }
                ]
            ]
        ]);
    }
}
