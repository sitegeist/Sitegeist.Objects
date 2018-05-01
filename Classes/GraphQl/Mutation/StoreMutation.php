<?php
namespace Sitegeist\Objects\GraphQl\Mutation;

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
use Neos\Eel\Helper\StringHelper;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\GraphQl\Query\Detail\ObjectDetail;
use Sitegeist\Objects\GraphQl\Query\Detail\ObjectDetailQuery;
use Sitegeist\Objects\GraphQl\Query\StoreQuery;
use Sitegeist\Objects\GraphQl\Scalar\JsonScalar;
use Sitegeist\Objects\Service\NodeService;

class StoreMutation extends ObjectType
{
    /**
     * @Flow\Inject
     * @var StringHelper
     */
    protected $stringHelper;

    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

    /**
     * @Flow\Inject
     * @var NodeTypeManager
     */
    protected $nodeTypeManager;

    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'StoreMutation',
            'fields' => [
                'createObject' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Create a new object',
                    'args' => [
                        'nodeType' => [
                            'type' => Type::nonNull(Type::string()),
                            'description' => 'The node type for the newly created object node'
                        ],
                        'properties' => [
                            'type' => JsonScalar::type(),
                            'description' => 'Properties for the newly created node'
                        ]
                    ],
                    'resolve' => function (NodeInterface $storeNode, $arguments) {
                        //
                        // @TODO: Invariant: nodeType must be of type Sitegeist.Objects:Object
                        //
                        $objectNode = $storeNode->createNode(
                            $this->nodeService->generateUniqueNodeName($storeNode),
                            $this->nodeTypeManager->getNodeType($arguments['nodeType'])
                        );

                        $this->nodeService->applyPropertiesToNode($objectNode, $arguments['properties']);

                        return new ObjectDetail($objectNode->getNodeType(), $objectNode);
                    }
                ],
                'object' => [
                    //
                    // @TODO: description
                    //
                    'type' => Type::nonNull($typeResolver->get(ObjectMutation::class)),
                    'args' => [
                        'identifier' => [
                            'type' => Type::nonNull(Type::id()),
                            'description' => 'Id of the object node to be edited'
                        ]
                    ],
                    'resolve' => function(NodeInterface $storeNode, $arguments) {
                        $objectNode = $storeNode->getContext()->getNodeByIdentifier($arguments['identifier']);

                        //
                        // Invariant: $objectNode must exist
                        //
                        if (!$objectNode) {
                            throw new \InvalidArgumentException(
                                sprintf('Node "%s" does not exist.', $arguments['identifier']),
                                1525160323
                            );
                        }

                        //
                        // Invariant: $objectNode must be of type 'Sitegeist.Objects:Object'
                        //
                        if (!$objectNode->getNodeType()->isOfType('Sitegeist.Objects:Object')) {
                            throw new \InvalidArgumentException(
                                'Node must be of type "Sitegeist.Objects:Object".',
                                1525160324
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
                                1525160325
                            );
                        }

                        return $objectNode;
                    }
                ],
                'publish' => [
                    'type' => Type::listOf($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Publish all objects in the store',
                    'resolve' => function (NodeInterface $storeNode) {
                        foreach($this->nodeService->publishNode($storeNode) as $publishedNode) {
                            if ($publishedNode->getNodeType()->isOfType('Sitegeist.Objects:Object')) {
                                yield new ObjectDetail($publishedNode->getNodeType(), $publishedNode);
                            }
                        }
                    }
                ],
                'discard' => [
                    'type' => Type::listOf($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Discard all objects in the store',
                    'resolve' => function (NodeInterface $storeNode) {
                        foreach($this->nodeService->discardNode($storeNode) as $discardedNode) {
                            if ($discardedNode->getNodeType()->isOfType('Sitegeist.Objects:Object')) {
                                yield new ObjectDetail($discardedNode->getNodeType(), $discardedNode);
                            }
                        }
                    }
                ]
            ]
        ]);
    }
}
