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
use Neos\Utility\ObjectAccess;
use Neos\Utility\PositionalArraySorter;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;

/**
 * @TODO: class comment
 */
class ReferenceHelper
{
    /**
     * @var NodeInterface
     */
    protected $referenceNode;

    /**
     * @param NodeInterface $referenceNode
     */
    public function __construct(NodeInterface $referenceNode)
    {
        $this->referenceNode = $referenceNode;
    }

    /**
     * Get the node type of this reference
     *
     * @return NodeType
     */
    public function getNodeType()
    {
        return $this->referenceNode->getNodeType();
    }

    /**
     * Get the identifier of this reference
     *
     * @return string
     */
    public function getIdentifier()
    {
        return $this->referenceNode->getIdentifier();
    }

    /**
     * Get the label of this reference
     *
     * @return string
     */
    public function getLabel()
    {
        return $this->referenceNode->getLabel();
    }
}
