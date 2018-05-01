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
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Neos\Eel\Helper\StringHelper;
use Sitegeist\Objects\GraphQl\Query\Detail\ObjectDetail;
use Sitegeist\Objects\GraphQl\Query\Detail\ObjectDetailQuery;
use Sitegeist\Objects\GraphQl\Query\Index\ObjectIndex;
use Sitegeist\Objects\GraphQl\Query\Index\ObjectIndexQuery;

class StoreQuery extends ObjectType
{
    /**
     * @Flow\Inject
     * @var StringHelper
     */
    protected $stringHelper;

    /**
     * @Flow\Inject
     * @var NodeTypeManager
     */
    protected $nodeTypeManager;

    /**
     * For debugging purposes only!
     *
     * @Flow\Inject
     * @var \Neos\Flow\Log\SystemLoggerInterface
     */
    protected $logger;

    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'Store',
            'description' => 'A store',
            'fields' => [
                'name' => [
                    'type' => Type::string(),
                    'description' => 'The name of this store',
                    'resolve' => function(NodeInterface $storeNode) {
                        return $storeNode->getName();
                    }
                ],
                'label' => [
                    'type' => Type::string(),
                    'description' => 'The label of this store',
                    'resolve' => function(NodeInterface $storeNode) {
                        return $storeNode->getLabel();
                    }
                ],
                'title' => [
                    'type' => Type::string(),
                    'description' => 'The title of this store',
                    'resolve' => function(NodeInterface $storeNode) {
                        return $storeNode->getProperty('title');
                    }
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'The icon of this store',
                    'resolve' => function(NodeInterface $storeNode) {
                        return $storeNode->getProperty('icon');
                    }
                ],
                'description' => [
                    'type' => Type::string(),
                    'description' => 'The description of this store',
                    'resolve' => function(NodeInterface $storeNode) {
                        return $storeNode->getProperty('description');
                    }
                ],
                'nodeType' => [
                    'type' => $typeResolver->get(NodeTypeQuery::class),
                    'description' => 'The node type of this store',
                    'resolve' => function(NodeInterface $storeNode) {
                        return $storeNode->getNodeType();
                    }
                ],
                'objectIndex' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectIndexQuery::class)),
                    'description' => 'Index of all objects in the store',
                    'args' => [
                        'from' => [
                            'type' => Type::int(),
                            'description' => 'Limit index length, starting at {from}',
                            'defaultValue' => 0
                        ],
                        'length' => [
                            'type' => Type::int(),
                            'description' => 'Limit index length',
                            'defaultValue' => 10
                        ],
                        'sort' => [
                            'type' => Type::string(),
                            'description' => 'Name of a property to sort by'
                        ],

                        //
                        // @TODO: Make this an ENUM
                        //
                        'order' => [
                            'type' => Type::string(),
                            'description' => 'Direction to sort by',
                            'defaultValue' => 'ASC'
                        ]
                    ],
                    'resolve' => function (NodeInterface $storeNode, $arguments) {
                        $flowQuery = new FlowQuery([$storeNode]);
                        $flowQuery = $flowQuery->children('[instanceof Sitegeist.Objects:Object]');
                        $flowQuery = $flowQuery->slice($arguments['from'], $arguments['length']);

                        if (array_key_exists('sort', $arguments)) {
                            $flowQuery = $flowQuery->sort($arguments['sort'], $arguments['order']);
                        }

                        $nodes = $flowQuery->get();

                        return new ObjectIndex($storeNode, $nodes);
                    }
                ],
                'objectDetail' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Information to edit or create an object node',
                    'args' => [
                        'nodeType' => [
                            'type' => Type::string(),
                            'description' => 'NodeType of the object node to be created'
                        ],
                        'identifier' => [
                            'type' => Type::id(),
                            'description' => 'Id of the object node to be edited'
                        ]
                    ],
                    'resolve' => function(NodeInterface $storeNode, $arguments) {
                        if (array_key_exists('identifier', $arguments)) {
                            $objectNode = $storeNode->getContext()->getNodeByIdentifier($arguments['identifier']);

                            //
                            // Invariant: $objectNode must exist
                            //
                            if (!$objectNode) {
                                throw new \InvalidArgumentException(
                                    sprintf('Node "%s" does not exist.', $arguments['identifier']),
                                    1524932459
                                );
                            }

                            //
                            // Invariant: $objectNode must be of type 'Sitegeist.Objects:Object'
                            //
                            if (!$objectNode->getNodeType()->isOfType('Sitegeist.Objects:Object')) {
                                throw new \InvalidArgumentException(
                                    'Node must be of type "Sitegeist.Objects:Object".',
                                    1524932467
                                );
                            }

                            //
                            // Invariant: $objectNode must be in $store
                            //
                            if (!$this->stringHelper->startsWith($objectNode->getPath(), $storeNode->getPath())) {
                                throw new \InvalidArgumentException(
                                    sprintf(
                                        'Node identifier "%s" does not belong to store "%s"',
                                        $objectNode->getIdentifier(),
                                        $storeNode->getName()
                                    ),
                                    1522671880
                                );
                            }

                            return new ObjectDetail($objectNode->getNodeType(), $objectNode);
                        } else if (array_key_exists('nodeType', $arguments)) {
                            $nodeType = $this->nodeTypeManager->getNodeType($arguments['nodeType']);

                            //
                            // Invariant: $nodeType must be of type 'Sitegeist.Objects:Object'
                            //
                            if (!$nodeType->isOfType('Sitegeist.Objects:Object')) {
                                throw new \InvalidArgumentException(
                                    'NodeType must inherit from "Sitegeist.Objects:Object".',
                                    1524932499
                                );
                            }

                            //
                            // Invariant: $storeNode must allow $nodeType as child node type
                            //
                            if (!$storeNode->getNodeType()->allowsChildNodeType($nodeType)) {
                                throw new \InvalidArgumentException(
                                    sprintf(
                                        'NodeType "%s" is not allowed in Store "%s".',
                                        $nodeType->getName(),
                                        $storeNode->getName()
                                    ),
                                    1524932459
                                );
                            }

                            return new ObjectDetail($nodeType);
                        }

                        //
                        // Invariant: Either nodeType or identifier must be given
                        //
                        throw new \InvalidArgumentException(
                            'Either nodeType or identifier must be given',
                            1524932452
                        );
                    }
                ]
            ]
        ]);
    }
}
