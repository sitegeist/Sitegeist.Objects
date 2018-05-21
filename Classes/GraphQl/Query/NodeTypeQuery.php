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
use Neos\Flow\I18n\EelHelper\TranslationHelper;
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Neos\Service\UserService;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;

class NodeTypeQuery extends ObjectType
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
     * @Flow\Inject
     * @var TranslationHelper
     */
    protected $translationHelper;

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
            'name' => 'NodeType',
            'description' => 'A Neos.ContentRepository node type',
            'fields' => [
                'name' => [
                    'type' => Type::string(),
                    'description' => 'The name of the node type',
                    'resolve' => function(NodeType $nodeType) {
                        return $nodeType->getName();
                    }
                ],
                'label' => [
                    'type' => Type::string(),
                    'description' => 'The label of the node type',
                    'resolve' => function(NodeType $nodeType) {
                        $label = $nodeType->getConfiguration('ui.label');

                        if (preg_match(TranslationHelper::I18N_LABEL_ID_PATTERN, $label) === 1) {
                            $languageIdentifier = $this->userService->getInterfaceLanguage();
                            list($package, $source, $id) = explode(':', $label, 3);

                            return $this->translationHelper->id($id)
                                ->package($package)
                                ->source(str_replace('.', '/', $source))
                                ->locale($languageIdentifier)
                                ->translate();
                        }

                        return $label;
                    }
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'The icon of the node type',
                    'resolve' => function(NodeType $nodeType) {
                        return $nodeType->getConfiguration('ui.icon');
                    }
                ],
                'description' => [
                    'type' => Type::string(),
                    'description' => 'The description of the node type',
                    'resolve' => function(NodeType $nodeType) {
                        return $nodeType->getConfiguration('ui.description');
                    }
                ],
                'superTypes' => [
                    'type' => Type::listOf($typeResolver->get(NodeTypeQuery::class)),
                    'description' => 'All declared node types this node type inherits from',
                    'resolve' => function(NodeType $nodeType) {
                        return $nodeType->getDeclaredSuperTypes();
                    }
                ],
                'subTypes' => [
                    'type' => Type::listOf($typeResolver->get(NodeTypeQuery::class)),
                    'description' => 'All node types this node type inherits from',
                    'resolve' => function(NodeType $nodeType) {
                        return $this->nodeTypeManager->getSubNodeTypes($nodeType->getName());
                    }
                ],
                'allowedChildNodeTypes' => [
                    'type' => Type::listOf($typeResolver->get(NodeTypeQuery::class)),
                    'description' => 'All node types that are allowed as children of this node type',
                    'resolve' => function(NodeType $nodeType) {
                        foreach($this->nodeTypeManager->getNodeTypes() as $childNodeType) {
                            if ($nodeType->allowsChildNodeType($childNodeType)) {
                                yield $childNodeType;
                            }
                        }
                    }
                ],
                'allowedGrandChildNodeTypes' => [
                    'type' => Type::listOf($typeResolver->get(NodeTypeQuery::class)),
                    'description' => 'All node types that are allowed as grand children of this node type for the given child node',
                    'args' => [
                        'name' => [
                            'type' => Type::nonNull(Type::string()),
                            'description' => 'Name of the child node'
                        ]
                    ],
                    'resolve' => function(NodeType $nodeType, $arguments) {
                        foreach($this->nodeTypeManager->getNodeTypes() as $grandChildNodeType) {
                            if ($nodeType->allowsGrandChildNodeType($arguments['name'], $grandChildNodeType)) {
                                yield $grandChildNodeType;
                            }
                        }
                    }
                ]
            ]
        ]);
    }
}
