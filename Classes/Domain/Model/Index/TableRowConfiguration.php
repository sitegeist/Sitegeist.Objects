<?php
namespace Sitegeist\Objects\Domain\Model\Index;

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
use Neos\Eel\Helper\StringHelper;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;

class TableRowConfiguration
{

    /**
     * @var NodeInterface
     */
    protected $storeNode;

    /**
     * @var NodeInterface
     */
    protected $objectNode;

    /**
     * @param NodeInterface $storeNode
     * @param NodeInterface|null $node
     * @param string $columnName
     * @throws \InvalidArgumentException
     */
    public function __construct(NodeInterface $storeNode, NodeInterface $objectNode)
    {
        //
        // Invariant: $storeNode must be of type 'Sitegeist.Objects:Store'
        //
        if (!$storeNode->getNodeType()->isOfType('Sitegeist.Objects:Store')) {
            throw new \InvalidArgumentException(
                'StoreNode must be of type "Sitegeist.Objects:Store".',
                1525007200
            );
        }

        //
        // Invariant: $objectNode must be of type 'Sitegeist.Objects:Object'
        //
        if (!$objectNode->getNodeType()->isOfType('Sitegeist.Objects:Object')) {
            throw new \InvalidArgumentException(
                'ObjectNode must be of type "Sitegeist.Objects:Object".',
                1525007201
            );
        }

        //
        // Invariant: $objectNode must be in $store
        //
        $stringHelper = new StringHelper();
        if (!$stringHelper->startsWith($objectNode->getPath(), $storeNode->getPath())) {
            throw new \InvalidArgumentException(
                sprintf(
                    'ObjectNode with identifier "%s" does not belong to store "%s"',
                    $objectNode->getIdentifier(),
                    $storeNode->getName()
                ),
                1525007202
            );
        }

        $this->storeNode = $storeNode;
        $this->objectNode = $objectNode;
    }

    /**
     * Get the node
     *
     * @return NodeInterface
     */
    public function getNode()
    {
        return $this->objectNode;
    }

    /**
     * Get the identifier
     *
     * @return string
     */
    public function getIdentifier()
    {
        return $this->objectNode->getIdentifier();
    }

    /**
     * Get the icon
     *
     * @return string
     */
    public function getIcon()
    {
        return $this->objectNode->getNodeType()->getConfiguration('ui.icon');
    }

    /**
     * Get the label
     *
     * @return string
     */
    public function getLabel()
    {
        return $this->objectNode->getLabel();
    }

    /**
     * Get if the object node has been removed
     *
     * @return boolean
     */
    public function getIsRemoved()
    {
        return $this->objectNode->isRemoved();
    }

    /**
     * Get the table cell configurations
     *
     * @return \Generator<TableCellConfiguration>
     */
    public function getTableCellConfigurations()
    {
        $columnConfigurations = $this->storeNode->getNodeType()->getConfiguration('ui.sitegeist/objects/list.columns');
        $sorter = new PositionalArraySorter($columnConfigurations);

        foreach($sorter->toArray() as $columnName => $columnConfiguration) {
            yield new TableCellConfiguration($this->storeNode, $this->objectNode, $columnName);
        }
    }
}
