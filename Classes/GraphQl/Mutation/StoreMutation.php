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
use Sitegeist\Objects\GraphQl\Scalar\JsonScalar;
use Sitegeist\Objects\Service\NodeService;
use Sitegeist\Objects\GraphQl\Query\StoreHelper;
use Sitegeist\Objects\GraphQl\Query\ObjectHelper;
use Sitegeist\Objects\GraphQl\Query\ObjectQuery;

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
                    'type' => Type::nonNull($typeResolver->get(ObjectQuery::class)),
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
                    'resolve' => function (StoreHelper $store, $arguments) {
                        //
                        // @TODO: Invariant: nodeType must be of type Sitegeist.Objects:Object
                        //
                        $objectNode = $store->getNode()->createNode(
                            $this->nodeService->generateUniqueNodeName($store->getNode()),
                            $this->nodeTypeManager->getNodeType($arguments['nodeType'])
                        );

                        $this->nodeService->applyPropertiesToNode($objectNode, $arguments['properties']);

                        return ObjectHelper::createFromNode($objectNode);
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
                    'resolve' => function(StoreHelper $store, $arguments) {
                        return $store->getObject($arguments);
                    }
                ],
                'publish' => [
                    'type' => Type::listOf($typeResolver->get(ObjectQuery::class)),
                    'description' => 'Publish all objects in the store',
                    'resolve' => function (StoreHelper $store) {
                        foreach($this->nodeService->publishNode($store->getNode()) as $publishedNode) {
                            if ($publishedNode->getNodeType()->isOfType('Sitegeist.Objects:Object')) {
                                yield ObjectHelper::createFromNode($publishedNode);
                            }
                        }
                    }
                ],
                'discard' => [
                    'type' => Type::listOf($typeResolver->get(ObjectQuery::class)),
                    'description' => 'Discard all objects in the store',
                    'resolve' => function (StoreHelper $store) {
                        foreach($this->nodeService->discardNode($store->getNode()) as $discardedNode) {
                            if ($discardedNode->getNodeType()->isOfType('Sitegeist.Objects:Object')) {
                                yield ObjectHelper::createFromNode($discardedNode);
                            }
                        }
                    }
                ]
            ]
        ]);
    }
}
