<?php
namespace Sitegeist\Objects\Domain\Model;

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
use Neos\ContentRepository\Domain\Service\NodeTypeManager;

class TableHeadConfiguration
{
    /**
     * @var string
     */
    protected $columnName;

    /**
     * @var array
     */
    protected $columnConfiguration;

    /**
     * @param NodeInterface $storeNode
     * @param string $columnName
     */
    public function __construct(NodeInterface $storeNode, string $columnName)
    {
        //
        // Invariant: $storeNode must be of type 'Sitegeist.Objects:Store'
        //
        if (!$storeNode->getNodeType()->isOfType('Sitegeist.Objects:Store')) {
            throw new \InvalidArgumentException(
                'Node must be of type "Sitegeist.Objects:Store".',
                1525002290
            );
        }

        $nodeType = $storeNode->getNodeType();
        $columnConfiguration = $nodeType->getConfiguration('ui.sitegeist/objects/list.columns.' . $columnName);

        //
        // Invariant: nodeType must have configuration for $columnName
        //
        if (!$columnConfiguration) {
            throw new \InvalidArgumentException(
                sprintf(
                    'NodeType "%s" has no configuration for table column "%s"',
                    $nodeType->getName(),
                    $columnName
                ),
                1525002299
            );
        }

        $this->columnName = $columnName;
        $this->columnConfiguration = $columnConfiguration;
    }

    /**
     * Get the column name
     *
     * @return string
     */
    public function getName()
    {
        return $this->columnName;
    }

    /**
     * Get the label
     *
     * @return string
     */
    public function getLabel()
    {
        return ObjectAccess::getPropertyPath($this->columnConfiguration, 'label');
    }

    /**
     * Get the sorting configuration
     *
     * @return array|null
     */
    public function getSorting()
    {
        return ObjectAccess::getPropertyPath($this->columnConfiguration, 'sorting');
    }

    /**
     * Get the filter
     *
     * @return string|null
     */
    public function getFilter()
    {
        return ObjectAccess::getPropertyPath($this->columnConfiguration, 'filter');
    }

    /**
     * Get the filter options configuration
     *
     * @return array|null
     */
    public function getFilterOptions()
    {
        return ObjectAccess::getPropertyPath($this->columnConfiguration, 'filterOptions');
    }

    /**
     * Get the filter operation configuration
     *
     * @return array|null
     */
    public function getFilterOperations()
    {
        return ObjectAccess::getPropertyPath($this->columnConfiguration, 'filterOperations');
    }
}
