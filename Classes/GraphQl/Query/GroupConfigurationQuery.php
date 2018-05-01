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
use Sitegeist\Objects\Domain\Model\Detail\GroupConfiguration;
use Neos\Utility\PositionalArraySorter;

class GroupConfigurationQuery extends ObjectType
{
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'GroupConfiguration',
            'description' => 'An group configuration',
            'fields' => [
                'name' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The name of the group',
                    'resolve' => function (GroupConfiguration $groupConfiguration) {
                        return $groupConfiguration->getName();
                    }
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'The icon of the group',
                    'resolve' => function (GroupConfiguration $groupConfiguration) {
                        return $groupConfiguration->getIcon();
                    }
                ],
                'label' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The label of the group',
                    'resolve' => function (GroupConfiguration $groupConfiguration) {
                        return $groupConfiguration->getLabel();
                    }
                ],
                'description' => [
                    'type' => Type::string(),
                    'description' => 'The description of the group',
                    'resolve' => function (GroupConfiguration $groupConfiguration) {
                        return $groupConfiguration->getDescription();
                    }
                ],
                'propertyConfigurations' => [
                    'type' => Type::listOf($typeResolver->get(PropertyConfigurationQuery::class)),
                    'description' => 'All property configurations belonging to this group',
                    'resolve' => function (GroupConfiguration $groupConfiguration) {
                        $sorter = new PositionalArraySorter(\iterator_to_array($groupConfiguration->getProperties()));
                        return $sorter->toArray();
                    }
                ]
            ]
        ]);
    }
}
