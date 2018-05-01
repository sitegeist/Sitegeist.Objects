<?php
namespace Sitegeist\Objects\GraphQl\Query\Index;

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
use Sitegeist\Objects\Service\NodeService;
use Sitegeist\Objects\GraphQl\Query\ObjectHelper;

class TableRowHelper
{
    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

    /**
     * @var NodeInterface
     */
    protected $storeNode;

    /**
     * @var ObjectHelper
     */
    protected $object;

    /**
     * @param NodeInterface $storeNode
     * @param NodeInterface|null $node
     * @param string $columnName
     * @throws \InvalidArgumentException
     */
    public function __construct(NodeInterface $storeNode, ObjectHelper $object)
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
        // Invariant: $object must be in $store
        //
        $stringHelper = new StringHelper();
        if (!$stringHelper->startsWith($object->getNode()->getPath(), $storeNode->getPath())) {
            throw new \InvalidArgumentException(
                sprintf(
                    'ObjectNode with identifier "%s" does not belong to store "%s"',
                    $object->getIdentifier(),
                    $storeNode->getName()
                ),
                1525003454
            );
        }

        $this->storeNode = $storeNode;
        $this->object = $object;
    }

    /**
     * Get the object
     *
     * @return ObjectHelper
     */
    public function getObject()
    {
        return $this->object;
    }

    /**
     * Get the table cell configurations
     *
     * @return \Generator<TableCellHelper>
     */
    public function getTableCells()
    {
        $columnConfigurations = $this->storeNode->getNodeType()->getConfiguration('ui.sitegeist/objects/list.columns');
        $sorter = new PositionalArraySorter($columnConfigurations);

        foreach($sorter->toArray() as $columnName => $columnConfiguration) {
            yield new TableCellHelper($this->storeNode, $this->object, $columnName);
        }
    }
}
