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
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\GraphQl\Scalar\JsonScalar;
use Sitegeist\Objects\Service\NodeService;
use Sitegeist\Objects\GraphQl\Query\ObjectHelper;
use Sitegeist\Objects\GraphQl\Query\ObjectQuery;

class ObjectMutation extends ObjectType
{
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
            'name' => 'ObjectMutation',
            'fields' => [
                'update' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectQuery::class)),
                    'description' => 'Update the object',
                    'args' => [
                        'properties' => [
                            'type' => JsonScalar::type(),
                            'description' => 'Properties for the newly created node'
                        ]
                    ],
                    'resolve' => function (ObjectHelper $object, $arguments) {
                        $this->nodeService->applyPropertiesToNode($object->getNode(), $arguments['properties']);

                        return ObjectHelper::createFromNode($object->getNode());
                    }
                ],
                'hide' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectQuery::class)),
                    'description' => 'Hide the object',
                    'resolve' => function (ObjectHelper $object, $arguments) {
                        $object->getNode()->setHidden(true);

                        return ObjectHelper::createFromNode($object->getNode());
                    }
                ],
                'show' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectQuery::class)),
                    'description' => 'Show (unhide) the object',
                    'resolve' => function (ObjectHelper $object, $arguments) {
                        $object->getNode()->setHidden(false);

                        return ObjectHelper::createFromNode($object->getNode());
                    }
                ],
                'publish' => [
                    'type' => Type::listOf($typeResolver->get(ObjectQuery::class)),
                    'description' => 'Publish the object',
                    'resolve' => function (ObjectHelper $object, $arguments) {
                        $publishedNodes = $this->nodeService->publishNode($object->getNode());

                        foreach ($publishedNodes as $publishedNode) {
                            yield ObjectHelper::createFromNode($publishedNode);
                        }
                    }
                ],
                'discard' => [
                    'type' => Type::listOf($typeResolver->get(ObjectQuery::class)),
                    'description' => 'Publish the object',
                    'resolve' => function (ObjectHelper $object, $arguments) {
                        $discardedNodes = $this->nodeService->discardNode($object->getNode());

                        foreach ($discardedNodes as $discardedNode) {
                            yield ObjectHelper::createFromNode($discardedNode);
                        }
                    }
                ],
                'remove' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectQuery::class)),
                    'description' => 'Remove the object',
                    'resolve' => function (ObjectHelper $object, $arguments) {
                        $object->getNode()->remove();

                        return ObjectHelper::createFromNode($object->getNode());
                    }
                ],
                'copy' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectQuery::class)),
                    'description' => 'Copy the object',
                    'resolve' => function (ObjectHelper $object, $arguments) {
                        $original = $object->getNode();
                        $storeNode = $original->getParent();

                        $copy = $storeNode->createNode(
                            $this->nodeService->generateUniqueNodeName($storeNode),
                            $original->getNodeType()
                        );

                        foreach ($original->getProperties() as $propertyName => $propertyValue) {
                            $copy->setProperty($propertyName, $propertyValue);
                        }

                        $copy->setProperty('object__copyOf', $original);
                        //
                        // @TODO: I18n
                        //
                        $copy->setProperty('title', sprintf('Kopie von %s', $original->getProperty('title')));

                        return ObjectHelper::createFromNode($copy);
                    }
                ]
            ]
        ]);
    }
}
