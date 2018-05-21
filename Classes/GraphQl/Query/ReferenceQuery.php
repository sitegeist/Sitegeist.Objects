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
use GraphQL\Type\Definition\ResolveInfo;
use Wwwision\GraphQL\TypeResolver;

/**
 * @TODO: class comment
 */
class ReferenceQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'Reference',
            'description' => 'Find references to other nodes',
            'fields' => [
                'nodeType' => [
                    'type' => $typeResolver->get(NodeTypeQuery::class),
                    'description' => 'NodeType of this reference'
                ],
                'identifier' => [
                    'type' => Type::id(),
                    'description' => 'Identifier of this reference'
                ],
                'label' => [
                    'type' => Type::string(),
                    'description' => 'Label of this reference'
                ]
            ],
            'resolveField'  => function(ReferenceHelper $objectList, $arguments, $context, ResolveInfo $info) {
                return $objectList->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
