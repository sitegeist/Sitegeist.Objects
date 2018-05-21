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
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
use Sitegeist\Objects\GraphQl\Query\ObjectHelper;

class IndexHelper
{
    /**
     * @var NodeInterface
     */
    protected $storeNode;

    /**
     * @var iterable
     */
    protected $nodes;

    /**
     * @var integer
     */
    protected $total;

    /**
     * @param NodeInterface $storeNode
     * @param iterable $nodes
     * @param integer $total
     */
    public function __construct(NodeInterface $storeNode, iterable $nodes, int $total)
    {
        //
        // Invariant: $storeNode must be of type 'Sitegeist.Objects:Store'
        //
        if (!$storeNode->getNodeType()->isOfType('Sitegeist.Objects:Store')) {
            throw new \InvalidArgumentException(
                'StoreNode must be of type "Sitegeist.Objects:Store".',
                1525007192
            );
        }

        $this->storeNode = $storeNode;
        $this->nodes = $nodes;
        $this->total = $total;
    }

    /**
     * Get the filter configurations
     *
     * @return \Generator<FilterConfigurationHelper>
     */
    public function getFilterConfiguration()
    {
        $filterConfigurations = $this->storeNode->getNodeType()->getConfiguration('ui.sitegeist/objects/list.filters');
        $sorter = new PositionalArraySorter($filterConfigurations);

        foreach($sorter->toArray() as $filterName => $filterConfiguration) {
            yield new FilterConfigurationHelper($this->storeNode, $filterName);
        }
    }

    /**
     * Get the table head configurations
     *
     * @return \Generator<TableHeadHelper>
     */
    public function getTableHeads()
    {
        $columnConfigurations = $this->storeNode->getNodeType()->getConfiguration('ui.sitegeist/objects/list.columns');
        $sorter = new PositionalArraySorter($columnConfigurations);

        foreach($sorter->toArray() as $columnName => $columnConfiguration) {
            yield new TableHeadHelper($this->storeNode, $columnName);
        }
    }

    /**
     * Get the table row configurations
     *
     * @return \Generator<TableRowHelper>
     */
    public function getTableRows()
    {
        foreach($this->nodes as $objectNode) {
            yield new TableRowHelper($this->storeNode, ObjectHelper::createFromNode($objectNode));
        }
    }

    /**
     * Get the total number of rows
     *
     * @return integer
     */
    public function getTotalNumberOfRows()
    {
        return $this->total;
    }
}
