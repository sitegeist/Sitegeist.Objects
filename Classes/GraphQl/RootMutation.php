<?php
namespace Sitegeist\Objects\GraphQl;

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
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\Domain\Model\ObjectDetail;
use Sitegeist\Objects\GraphQl\Input\ContentContextInput;
use Sitegeist\Objects\GraphQl\Mutation\StoreMutation;
use Sitegeist\Objects\GraphQl\Query\ObjectDetailQuery;
use Sitegeist\Objects\Service\NodeService;

class RootMutation extends ObjectType
{
    /**
     * @Flow\Inject
     * @var ContextFactoryInterface
     */
    protected $contentContextFactory;

    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

    /**
     * @Flow\InjectConfiguration(path="rootNodeName")
     * @var string
     */
    protected $rootNodeName;

    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'ObjectsRootMutation',
            'fields' => [
                'store' => [
                    'type' => Type::nonNull($typeResolver->get(StoreMutation::class)),
                    'description' => 'Select a single store from the system',
                    'args' => [
                        'context' => [
                            'type' => Type::nonNull($typeResolver->get(ContentContextInput::class)),
                            'description' => 'The content context for this query'
                        ],
                        'name' => [
                            'type' => Type::nonNull(Type::string()),
                            'description' => 'The name of the store'
                        ]
                    ],
                    'resolve' => function($_, $arguments) {
                        $contentContext = $this->contentContextFactory->create($arguments['context']);
                        $rootNode = $contentContext->getRootNode()->getNode($this->rootNodeName);
                        $storeNode = $rootNode->getNode($arguments['name']);

                        //
                        // Invariant: Store must exist.
                        //
                        if (!$storeNode) {
                            throw new \InvalidArgumentException(
                                sprintf('Store with name "%s" does not exist', $arguments['name']),
                                1525028262
                            );
                        }

                        return $storeNode;
                    }
                ],
                'publishAll' => [
                    'type' => Type::listOf($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Publish all objects',
                    'args' => [
                        'context' => [
                            'type' => Type::nonNull($typeResolver->get(ContentContextInput::class)),
                            'description' => 'The content context for this query'
                        ]
                    ],
                    'resolve' => function ($_, $arguments) {
                        $contentContext = $this->contentContextFactory->create($arguments['context']);
                        $rootNode = $contentContext->getRootNode()->getNode($this->rootNodeName);

                        foreach($this->nodeService->publishNode($rootNode) as $publishedNode) {
                            if ($publishedNode->getNodeType()->isOfType('Sitegeist.Objects:Object')) {
                                yield new ObjectDetail($publishedNode->getNodeType(), $publishedNode);
                            }
                        }
                    }
                ],
                'discardAll' => [
                    'type' => Type::listOf($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Discard all objects',
                    'args' => [
                        'context' => [
                            'type' => Type::nonNull($typeResolver->get(ContentContextInput::class)),
                            'description' => 'The content context for this query'
                        ]
                    ],
                    'resolve' => function ($_, $arguments) {
                        $contentContext = $this->contentContextFactory->create($arguments['context']);
                        $rootNode = $contentContext->getRootNode()->getNode($this->rootNodeName);

                        foreach($this->nodeService->discardNode($rootNode) as $discardedNode) {
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
