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
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\Helper\StringHelper;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\Neos\Service\Mapping\NodePropertyConverterService;
use Sitegeist\Objects\Service\NodeService;
use Sitegeist\Objects\Store;
use Sitegeist\Objects\Collection;

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
     * @Flow\Inject
     * @var NodePropertyConverterService
     */
    protected $nodePropertyConverterService;

    /**
     * @Flow\Inject
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    /**
     * @Flow\Inject
     * @var StringHelper
     */
    protected $stringHelper;

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
        // Invariant: nodeType must be of type "Sitegeist.Objects:AbstractObject"
        //
        if (!$nodeType->isOfType('Sitegeist.Objects:AbstractObject')) {
            throw new \InvalidArgumentException(
                sprintf('NodeType "%s" must inherit from "Sitegeist.Objects:AbstractObject"', $nodeType->getName()),
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
            $parentNode = $this->parentNode;

            while ($parentNode->getNodeType()->isOfType('Sitegeist.Objects:Node')) {
                yield $parentNode;
                $parentNode = $parentNode->getParent();
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
     * @return string|null
     */
    public function getPreviewUri()
    {
        if (
            $this->hasNode() &&
            $this->nodeType->isOfType('Neos.Neos:Document') &&
            $this->stringHelper->startsWith($this->node->getPath(), '/sites')
        ) {
            return $this->nodeService->buildUriFromNode($this->node);
        }
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
            //
            // @TODO: There has to be a better way...
            //
            switch ($this->nodeType->getConfiguration('properties.' . $arguments['name'] . '.type')) {
                case Store::class:
                    return $this->node->getNode($arguments['name'])->getIdentifier();

                case 'Neos\\Media\\Domain\\Model\\Image':
                case 'Neos\\Media\\Domain\\Model\\Document':
                case 'Neos\\Media\\Domain\\Model\\Asset':
                    if ($asset = $this->node->getProperty($arguments['name'])) {
                        return [
                            '__identity' => $this->persistenceManager->getIdentifierByObject($asset),
                            'fileName' => $asset->getResource()->getFilename(),
                            'fileSize' => $asset->getResource()->getFileSize(),
                            'mediaType' => $asset->getResource()->getMediaType()
                        ];
                    }

                    return null;
                    break;

                case 'array<Neos\\Media\\Domain\\Model\\Image>':
                case 'array<Neos\\Media\\Domain\\Model\\Document>':
                case 'array<Neos\\Media\\Domain\\Model\\Asset>':
                    return array_map(function($asset) {
                        return [
                            '__identity' => $this->persistenceManager->getIdentifierByObject($asset),
                            'fileName' => $asset->getResource()->getFilename(),
                            'fileSize' => $asset->getResource()->getFileSize(),
                            'mediaType' => $asset->getResource()->getMediaType()
                        ];
                    }, $this->node->getProperty($arguments['name']) ?: []);

                default:
                    return $this->nodePropertyConverterService->getProperty($this->node, $arguments['name']);

            }
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
