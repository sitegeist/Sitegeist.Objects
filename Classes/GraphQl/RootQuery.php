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
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Neos\Domain\Service\UserService;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\GraphQl\Input\ContentContextInput;
use Sitegeist\Objects\GraphQl\Query\StoreHelper;
use Sitegeist\Objects\GraphQl\Query\StoreQuery;
use Sitegeist\Objects\GraphQl\Query\NodeTypeQuery;

class RootQuery extends ObjectType
{
    /**
     * @Flow\Inject
     * @var ContextFactoryInterface
     */
    protected $contentContextFactory;

    /**
     * @Flow\Inject
     * @var NodeTypeManager
     */
    protected $nodeTypeManager;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

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
            'name' => 'ObjectsRootQuery',
            'fields' => [
                'user' => [
                    'type' => Type::string(),
                    'description' => 'The currently logged in user',
                    'resolve' => function() {
                        $user = $this->userService->getCurrentUser();

                        return $this->userService->getUserName($user);
                    }
                ],
                'stores' => [
                    'type' => Type::listOf($typeResolver->get(StoreQuery::class)),
                    'description' => 'All top-level stores available in the system',
                    'args' => [
                        'context' => [
                            'type' => Type::nonNull($typeResolver->get(ContentContextInput::class)),
                            'description' => 'The content context for this query'
                        ]
                    ],
                    'resolve' => function($_, $arguments) {
                        $contentContext = $this->contentContextFactory->create($arguments['context']);
                        $rootNode = $contentContext->getRootNode()->getNode($this->rootNodeName);

                        foreach($rootNode->getChildNodes('Sitegeist.Objects:Store') as $storeNode) {
                            yield new StoreHelper($storeNode);
                        }
                    }
                ],
                'store' => [
                    'type' => Type::nonNull($typeResolver->get(StoreQuery::class)),
                    'description' => 'Select a single store from the system',
                    'args' => [
                        'context' => [
                            'type' => Type::nonNull($typeResolver->get(ContentContextInput::class)),
                            'description' => 'The content context for this query'
                        ],
                        'identifier' => [
                            'type' => Type::nonNull(Type::id()),
                            'description' => 'The identifier of the store'
                        ]
                    ],
                    'resolve' => function($_, $arguments) {
                        $contentContext = $this->contentContextFactory->create($arguments['context']);
                        $storeNode = $contentContext->getNodeByIdentifier($arguments['identifier']);

                        //
                        // Invariant: Store must exist.
                        //
                        if (!$storeNode) {
                            throw new \InvalidArgumentException(
                                sprintf('Store with identifier "%s" does not exist', $arguments['identifier']),
                                1525028262
                            );
                        }

                        return new StoreHelper($storeNode);
                    }
                ],
                'nodeType' => [
                    'type' => $typeResolver->get(NodeTypeQuery::class),
                    'description' => 'Information about the given Neos.ContentRepository node type',
                    'args' => [
                        'name' => [
                            'type' => Type::nonNull(Type::string()),
                            'description' => 'The name of the node type'
                        ]
                    ],
                    'resolve' => function($_, $arguments) {
                        return $this->nodeTypeManager->getNodeType($arguments['name']);
                    }
                ]
            ]
        ]);
    }
}
