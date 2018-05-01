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
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Neos\Service\UserService;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;

class ParentQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'Parent',
            'description' => 'A small representation of a parent node',
            'fields' => [
                'identifier' => [
                    'type' => Type::string(),
                    'description' => 'The identifier of the node type',
                    'resolve' => function(NodeInterface $parentNode) {
                        return $parentNode->getIdentifier();
                    }
                ],
                'type' => [
                    //
                    // @TODO: Make this an ENUM and create a more intelligent implementation
                    //
                    'type' => Type::string(),
                    'description' => 'The type (store or object) of the parent node',
                    'resolve' => function(NodeInterface $parentNode) {
                        if ($parentNode->getNodeType()->isOfType('Sitegeist.Objects:Store')) {
                            return 'store';
                        }

                        return 'object';
                    }
                ],
                'name' => [
                    'type' => Type::string(),
                    'description' => 'The name of the parent node',
                    'resolve' => function(NodeInterface $parentNode) {
                        return $parentNode->getName();
                    }
                ],
                'label' => [
                    'type' => Type::string(),
                    'description' => 'The label of the parent node',
                    'resolve' => function(NodeInterface $parentNode) {
                        return $parentNode->getLabel();
                    }
                ],
                'icon' => [
                    'type' => Type::string(),
                    'description' => 'The icon of the parent node',
                    'resolve' => function(NodeInterface $parentNode) {
                        return $parentNode->getNodeType()->getConfiguration('ui.icon');
                    }
                ]
            ]
        ]);
    }
}
