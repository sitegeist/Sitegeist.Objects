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
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Neos\Domain\Service\UserService;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\GraphQl\Query\NodeTypeQuery;

class RootQuery extends ObjectType
{

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
