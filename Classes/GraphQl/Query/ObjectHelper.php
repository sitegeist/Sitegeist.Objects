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
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
use Sitegeist\Objects\Service\NodeService;

class ObjectHelper
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
     * Protected Constructor: Use factory methods below!
     *
     * @param NodeType $nodeType
     * @param NodeInterface|null $parentNode
     * @param NodeInterface|null $node
     * @throws \InvalidArgumentException
     */
    protected function __construct(NodeType $nodeType, NodeInterface $parentNode = null, NodeInterface $node = null)
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
        $this->parentNode = $parentNode;
        $this->node = $node;

        //
        // Invariant: nodeType must be of type "Sitegeist.Objects:Object"
        //
        if (!$nodeType->isOfType('Sitegeist.Objects:Object')) {
            throw new \InvalidArgumentException(
                sprintf('NodeType "%s" must inherit from "Sitegeist.Objects:Object"', $nodeType->getName()),
                1524931043
            );
        }
    }

    /**
     * Factory method to create ObjectHelper from node type
     *
     * @param NodeType $nodeType
     * @param NodeInterface $parentNode
     * @return ObjectHelper
     */
    public static function createFromNodeType(NodeType $nodeType, NodeInterface $parentNode)
    {
        return new static($nodeType, $parentNode);
    }

    /**
     * Factory method to create ObjectHelper from node type
     *
     * @param NodeInterface $node
     * @return ObjectHelper
     */
    public static function createFromNode(NodeInterface $node)
    {
        return new static($node->getNodeType(), $node->getParent(), $node);
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
     * Get parent nodes
     *
     * @return \Generator<NodeInterface>
     */
    public function getParents()
    {
        if ($this->parentNode !== null) {
            yield $this->parentNode;

            $flowQuery = new FlowQuery([$this->parentNode]);
            foreach($flowQuery->parentsUntil('[instanceof Sitegeist.Objects:Root]')->get() as $parentNode) {
                yield $parentNode;
            }
        }

        return [];
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
     * @return NodeInterface
     */
    public function getNode()
    {
        return $this->node;
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
     * @return string
     */
    public function getLabel()
    {
        if ($this->hasNode()) {
            return $this->node->getLabel();
        }

        return $this->nodeType->getLabel();
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
     * @TODO: method comment
     *
     * @param array  $arguments
     * @return mixed
     */
    public function getProperty(array $arguments)
    {
        if ($this->hasNode()) {
            return $this->node->getProperty($arguments['name']);
        }

        $defaultValues = $this->nodeType->getDefaultValuesForProperties();

        if (array_key_exists($arguments['name'], $defaultValues)) {
            return $defaultValues[$arguments['name']];
        }
    }

    /**
     * @TODO: method comment
     *
     * @return array
     */
    public function getProperties()
    {
        if ($this->hasNode()) {
            return $this->node->getProperties();
        }

        return $this->nodeType->getDefaultValuesForProperties();
    }

    /**
     * Route all method calls to the node, if set
     *
     * @param string $name
     * @param array $arguments
     * @return mixed
     */
    public function __call($name, $arguments)
    {
        if (!is_array($arguments)) {
            $arguments = [];
        }

        if (method_exists(NodeInterface::class, $name)) {
            if ($this->hasNode()) {
                return $this->node->{$name}(...$arguments);
            }

            return null;
        }

        throw new \BadMethodCallException(
            sprintf('Method "%s" is not implemented in "%s"', $name, NodeInterface::class),
            1525176050
        );
    }
}
