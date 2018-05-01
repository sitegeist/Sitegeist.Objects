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
                    'description' => 'The name of the group'
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'The icon of the group'
                ],
                'label' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The label of the group'
                ],
                'description' => [
                    'type' => Type::string(),
                    'description' => 'The description of the group'
                ],
                'propertyConfigurations' => [
                    'type' => Type::listOf($typeResolver->get(PropertyConfigurationQuery::class)),
                    'description' => 'All property configurations belonging to this group'
                ]
            ],
            'resolveField'  => function(GroupConfiguration $groupConfiguration, $arguments, $context, ResolveInfo $info) {
                return $groupConfiguration->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
