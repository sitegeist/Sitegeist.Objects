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
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;

class FilterConfigurationHelper
{
    /**
     * @var string
     */
    protected $filterName;

    /**
     * @var array
     */
    protected $filterConfiguration;

    /**
     * @param NodeInterface $storeNode
     * @param string $filterName
     */
    public function __construct(NodeInterface $storeNode, string $filterName)
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
        $filterConfiguration = $nodeType->getConfiguration('ui.sitegeist/objects/list.filters.' . $filterName);

        //
        // Invariant: nodeType must have configuration for $filterName
        //
        if (!$filterConfiguration) {
            throw new \InvalidArgumentException(
                sprintf(
                    'NodeType "%s" has no configuration for filter "%s"',
                    $nodeType->getName(),
                    $filterName
                ),
                1525002299
            );
        }

        $this->filterName = $filterName;
        $this->filterConfiguration = $filterConfiguration;
    }

    /**
     * Get the column name
     *
     * @return string
     */
    public function getName()
    {
        return $this->filterName;
    }

    /**
     * Get the property
     *
     * @return string
     */
    public function getProperty()
    {
        return ObjectAccess::getPropertyPath($this->filterConfiguration, 'property');
    }

    /**
     * Get the label
     *
     * @return string
     */
    public function getLabel()
    {
        return ObjectAccess::getPropertyPath($this->filterConfiguration, 'label');
    }

    /**
     * Get the filter operation configuration
     *
     * @return array|null
     */
    public function getOperations()
    {
        return ObjectAccess::getPropertyPath($this->filterConfiguration, 'operations');
    }
}
