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
use Neos\Utility\ObjectAccess;
use Neos\Utility\PositionalArraySorter;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
use Sitegeist\Objects\Service\NodeService;

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
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

    /**
     * @param NodeType $nodeType
     * @param NodeInterface|null $node
     * @throws \InvalidArgumentException
     */
    public function __construct(NodeType $nodeType, NodeInterface $node = null)
    {
        //
        // Invariant: Type of $node must be equal to type $nodeType
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
     * Get if the object node is hidden
     *
     * @return boolean
     */
    public function getIsHidden()
    {
        if ($this->hasNode()) {
            return $this->node->isHidden();
        }

        return false;
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

        return false;
    }

    /**
     * Get if the object node has unpublished changes
     *
     * @return boolean
     */
    public function getHasUnpublishedChanges()
    {
        if ($this->hasNode()) {
            return $this->nodeService->checkIfNodeHasUnpublishedChanges($this->getNode());
        }

        return false;
    }

    /**
     * @return array<TabHelper>
     */
    public function getTabs()
    {
        $tabConfigurations = [];

        foreach($this->nodeType->getProperties() as $propertyConfiguration) {
            $groupName = ObjectAccess::getPropertyPath($propertyConfiguration, 'ui.sitegeist/objects/detail.group');
            if ($groupName) {
                $tabName = $this->nodeType
                    ->getConfiguration('ui.sitegeist/objects/detail.groups.' . $groupName . '.tab');

                if ($tabName && !array_key_exists($tabName, $tabConfigurations)) {
                    $tabConfigurations[$tabName] = new TabHelper($this, $tabName);
                }
            }
        }

        $sorter = new PositionalArraySorter($tabConfigurations);
        return $sorter->toArray();
    }
}
