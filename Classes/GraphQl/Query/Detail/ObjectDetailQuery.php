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
use Neos\ContentRepository\Domain\Model\NodeInterface;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ResolveInfo;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\GraphQl\Query\Detail\ObjectDetail;
use Sitegeist\Objects\GraphQl\Query\NodeTypeQuery;

class ObjectDetailQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'Object',
            'description' => 'An Object',
            'fields' => [
                'identifier' => [
                    'type' => Type::id(),
                    'description' => 'The id of the object node or null if empty'
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'The icon of the object node'
                ],
                'label' => [
                    'type' => Type::string(),
                    'description' => 'The label of the object node or null if empty'
                ],
                'isHidden' => [
                    'type' => Type::boolean(),
                    'description' => 'Is the object hidden?'
                ],
                'isRemoved' => [
                    'type' => Type::boolean(),
                    'description' => 'Has the object been removed?'
                ],
                'hasUnpublishedChanges' => [
                    'type' => Type::boolean(),
                    'description' => 'Does the object have unpublished changes?'
                ],
                'nodeType' => [
                    'type' => $typeResolver->get(NodeTypeQuery::class),
                    'description' => 'The node type of the object node'
                ],
                'tabs' => [
                    'type' => Type::listOf($typeResolver->get(TabQuery::class)),
                    'description' => 'The tab configuration of the object node'
                ]
            ],
            'resolveField'  => function(ObjectDetail $objectDetail, $arguments, $context, ResolveInfo $info) {
                return $objectDetail->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
