<?php
namespace Sitegeist\Objects\Domain\Model\Detail;

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
use Neos\Utility\ObjectAccess;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;

/**
 * Provides information about a (possibly empty) object node
 */
class ObjectDetail
{
    /**
     * @var NodeType
     */
    protected $nodeType;

    /**
     * @var NodeInterface
     */
    protected $node;

    /**
     * @param NodeType $nodeType
     * @param NodeInterface|null $node
     * @throws \InvalidArgumentException
     */
    public function __construct(NodeType $nodeType, NodeInterface $node = null)
    {
        //
        // Invariant: $node must be equal to type $nodeType
        //
        if ($node !== null && $node->getNodeType() !== $nodeType) {
            throw new \InvalidArgumentException(
                sprintf('Node must be of type "%s"', $nodeType->getName()),
                1524931043
            );
        }

        $this->nodeType = $nodeType;
        $this->node = $node;
    }

    /**
     * Get the node type
     *
     * @return NodeType
     */
    public function getNodeType() : NodeType
    {
        return $this->nodeType;
    }

    /**
     * Check if node is set
     *
     * @return boolean
     */
    public function hasNode()
    {
        return $this->node !== null;
    }

    /**
     * Get the node
     *
     * @return NodeInterface|null
     */
    public function getNode()
    {
        return $this->node;
    }

    /**
     * Get the identifier
     *
     * @return string|null
     */
    public function getIdentifier()
    {
        if ($this->hasNode()) {
            return $this->node->getIdentifier();
        }
    }

    /**
     * Get the icon
     *
     * @return string
     */
    public function getIcon()
    {
        return $this->nodeType->getConfiguration('ui.icon');
    }

    /**
     * Get the label
     *
     * @return string|null
     */
    public function getLabel()
    {
        if ($this->hasNode()) {
            return $this->node->getLabel();
        }
    }

    /**
     * Get if the object node has been removed
     *
     * @return boolean
     */
    public function getIsRemoved()
    {
        if ($this->hasNode()) {
            return $this->node->isRemoved();
        }
    }

    /**
     * @return \Generator<TabConfiguration>
     */
    public function getTabs()
    {
        $alreadyYieldedTabConfigurations = [];

        foreach($this->nodeType->getProperties() as $propertyConfiguration) {
            $groupName = ObjectAccess::getPropertyPath($propertyConfiguration, 'ui.sitegeist/objects/detail.group');
            if ($groupName) {
                $tabName = $this->nodeType
                    ->getConfiguration('ui.sitegeist/objects/detail.groups.' . $groupName . '.tab');

                if ($tabName && !in_array($tabName, $alreadyYieldedTabConfigurations)) {
                    $alreadyYieldedTabConfigurations[] = $tabName;
                    yield new TabConfiguration($this, $tabName);
                }
            }
        }
    }
}
