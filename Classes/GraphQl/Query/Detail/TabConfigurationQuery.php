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
use Neos\Utility\PositionalArraySorter;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\Domain\Model\Detail\TabConfiguration;

class TabConfigurationQuery extends ObjectType
{
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'TabConfiguration',
            'description' => 'An tab configuration',
            'fields' => [
                'name' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The name of the tab',
                    'resolve' => function (TabConfiguration $tabConfiguration) {
                        return $tabConfiguration->getName();
                    }
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'The icon of the tab',
                    'resolve' => function (TabConfiguration $tabConfiguration) {
                        return $tabConfiguration->getIcon();
                    }
                ],
                'label' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The label of the tab',
                    'resolve' => function (TabConfiguration $tabConfiguration) {
                        return $tabConfiguration->getLabel();
                    }
                ],
                'description' => [
                    'type' => Type::string(),
                    'description' => 'The description of the tab',
                    'resolve' => function (TabConfiguration $tabConfiguration) {
                        return $tabConfiguration->getDescription();
                    }
                ],
                'groupConfigurations' => [
                    'type' => Type::listOf($typeResolver->get(GroupConfigurationQuery::class)),
                    'description' => 'All group configurations belonging to this tab',
                    'resolve' => function (TabConfiguration $tabConfiguration) {
                        $sorter = new PositionalArraySorter(\iterator_to_array($tabConfiguration->getGroups()));
                        return $sorter->toArray();
                    }
                ]
            ]
        ]);
    }
}
