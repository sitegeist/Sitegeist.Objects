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
use Sitegeist\Objects\GraphQl\Scalar\JsonScalar;

class ObjectQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'Object',
            'description' => 'An object',
            'fields' => [
                'identifier' => [
                    'type' => Type::id(),
                    'description' => 'The id of the object node or null if empty'
                ],
                'name' => [
                    'type' => Type::string(),
                    'description' => 'The name of the object node or null if empty'
                ],
                'nodeType' => [
                    'type' => $typeResolver->get(NodeTypeQuery::class),
                    'description' => 'The node type of the object node'
                ],
                'parents' => [
                    'type' => Type::listOf($typeResolver->get(ParentQuery::class)),
                    'description' => 'The parents of the object node'
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
                'previewUri' => [
                    'type' => Type::string(),
                    'description' => 'Preview Uri for this object'
                ],
                'frontendUri' => [
                    'type' => Type::string(),
                    'description' => 'Frontend Uri for this object'
                ],
                'properties' => [
                    'type' => JsonScalar::type(),
                    'description' => 'All properties of this object'
                ]
            ],
            'resolveField'  => function(ObjectHelper $object, $arguments, $context, ResolveInfo $info) {
                return $object->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
