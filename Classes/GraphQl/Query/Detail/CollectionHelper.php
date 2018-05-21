<?php
namespace Sitegeist\Objects\GraphQl\Query\Detail;

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
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Sitegeist\Objects\GraphQl\Query\ObjectHelper;

class CollectionHelper
{
    /**
     * @Flow\Inject
     * @var NodeTypeManager
     */
    protected $nodeTypeManager;

    /**
     * @var ObjectHelper
     */
    protected $object;

    /**
     * @var string
     */
    protected $propertyName;

    /**
     * @var array
     */
    protected $propertyConfiguration;

    public function __construct(ObjectHelper $object, string $propertyName)
    {
        $this->object = $object;
        $this->propertyName = $propertyName;
        $this->propertyConfiguration = $this->object->getNodeType()
            ->getConfiguration('properties.' . $propertyName . '.ui.sitegeist/objects/detail');

        //
        // Invariant: $propertyName must exist in node type configuration
        //

        if (!$this->propertyConfiguration) {
            throw new \InvalidArgumentException(
                sprintf(
                    'Collection "%s" does not seem to be configured in "%s"',
                    $propertyName,
                    $this->object->getNodeType()->getName()
                ),
                1526658122
            );
        }
    }

    /**
     * @return NodeType
     */
    public function getNodeType()
    {
        $collectionType = $this->propertyConfiguration['collectionType'];

        if ($nodeType = $this->nodeTypeManager->getNodeType($collectionType)) {
            return $nodeType;
        }

        throw new \Exception(
            sprintf(
                'NodeType "%s"  configured as collection type for "%s" in "%s" does not exist',
                $collectionType,
                $propertyName,
                $this->object->getNodeType()->getName()
            ),
            1526658137
        );
    }

    /**
     * @return \Generator<DetailHelper>
     */
    public function getObjectDetails()
    {
        if ($this->object->hasNode()) {
            $collectionNode = $this->object->getNode()->getNode($this->propertyName);

            foreach ($collectionNode->getChildNodes() as $childNode) {
                yield new DetailHelper(new ObjectHelper($childNode->getNodeType(), $collectionNode, $childNode));
            }
        }

        return [];
    }

    /**
     * @param array $arguments
     * @return DetailHelper
     */
    public function getEmptyObjectDetail($arguments)
    {
        /**
         * @TODO: Invariant: NodeType must be allowed in collection
         * @TODO: Invariant: collection must be of type Sitegeist.Objects:Collection
         */
         $nodeType = $this->nodeTypeManager->getNodeType($arguments['nodeType']);

        if ($this->object->hasNode()) {
            $collectionNode = $this->object->getNode()->getNode($this->propertyName);

            return new DetailHelper(new ObjectHelper($nodeType, $collectionNode));
        }

        return new DetailHelper(new ObjectHelper($nodeType));
    }
}
