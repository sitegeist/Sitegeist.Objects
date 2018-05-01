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
use Neos\Utility\PositionalArraySorter;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\Domain\Model\Detail\ObjectDetail;
use Sitegeist\Objects\Service\NodeService;

class ObjectDetailQuery extends ObjectType
{
    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

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
                    'description' => 'The id of the object node or null if empty',
                    'resolve' => function (ObjectDetail $objectDetail) {
                        return $objectDetail->getIdentifier();
                    }
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'The icon of the object node',
                    'resolve' => function (ObjectDetail $objectDetail) {
                        return $objectDetail->getIcon();
                    }
                ],
                'label' => [
                    'type' => Type::string(),
                    'description' => 'The label of the object node or null if empty',
                    'resolve' => function (ObjectDetail $objectDetail) {
                        return $objectDetail->getLabel();
                    }
                ],
                'isHidden' => [
                    'type' => Type::boolean(),
                    'description' => 'Is the object hidden?',
                    'resolve' => function (ObjectDetail $objectDetail) {
                        return $objectDetail->getNode()->isHidden();
                    }
                ],
                'isRemoved' => [
                    'type' => Type::boolean(),
                    'description' => 'Has the object been removed?',
                    'resolve' => function (ObjectDetail $objectDetail) {
                        return $objectDetail->getIsRemoved();
                    }
                ],
                'hasUnpublishedChanges' => [
                    'type' => Type::boolean(),
                    'description' => 'Does the object have unpublished changes?',
                    'resolve' => function (ObjectDetail $objectDetail) {
                        return $this->nodeService->checkIfNodeHasUnpublishedChanges($objectDetail->getNode());
                    }
                ],
                'nodeType' => [
                    'type' => $typeResolver->get(NodeTypeQuery::class),
                    'description' => 'The node type of the object node',
                    'resolve' => function(ObjectDetail $objectDetail) {
                        return $objectDetail->getNodeType();
                    }
                ],
                'tabConfigurations' => [
                    'type' => Type::listOf($typeResolver->get(TabConfigurationQuery::class)),
                    'description' => 'The tab configuration of the object node',
                    'resolve' => function(ObjectDetail $objectDetail) {
                        $sorter = new PositionalArraySorter(\iterator_to_array($objectDetail->getTabs()));
                        return $sorter->toArray();
                    }
                ]
            ]
        ]);
    }
}
