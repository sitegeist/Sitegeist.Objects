<?php
namespace Sitegeist\Objects\Service;

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
use Neos\Eel\Helper\StringHelper;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\NodeServiceInterface;
use Neos\ContentRepository\Domain\Service\PublishingServiceInterface;

/**
 * @Flow\Scope("singleton")
 */
class NodeService
{
    /**
     * @Flow\Inject
     * @var StringHelper
     */
    protected $stringHelper;

    /**
     * @Flow\Inject
     * @var PublishingServiceInterface
     */
    protected $publishingService;

    /**
     * @Flow\Inject
     * @var NodeServiceInterface
     */
    protected $nativeNodeService;

    /**
     * For debugging purposes only!
     *
     * @Flow\Inject
     * @var \Neos\Flow\Log\SystemLoggerInterface
     */
    protected $logger;

    /**
     * Generate a unique node name
     *
     * @param NodeInterface $parentNode
     * @param string $proposedName
     * @return string
     */
    public function generateUniqueNodeName(NodeInterface $parentNode, $proposedName = 'object')
    {
        return $this->nativeNodeService->generateUniqueNodeName($parentNode->getPath(), $proposedName);
    }

    /**
     * Apply properties to node
     *
     * @param NodeInterface $node
     * @param array $properties
     * @return void
     */
    public function applyPropertiesToNode(NodeInterface $node, array $properties)
    {
        foreach ($properties as $propertyName => $propertyValue) {
            //
            // @TODO: Find a better solution for this
            //
            switch ($node->getNodeType()->getConfiguration('properties.' . $propertyName . '.type')) {
                case \DateTime::class:
                    //
                    // @TODO: There has to be a better way
                    //
                    $propertyValue = \DateTime::createFromFormat(\DateTime::W3C, $propertyValue);

                default:
                    if ($propertyName{0} === '_') {
                        ObjectAccess::setProperty($node, substr($propertyName, 1), $propertyValue);
                    } else {
                        $node->setProperty($propertyName, $propertyValue);
                    }
            }
        }
    }

    /**
     * @param NodeInterface $node
     * @return \Generator<NodeInterface>
     */
    public function getUnpublishedNodesBeneathNode(NodeInterface $node)
    {
        $unpublishedNodes = $this->publishingService->getUnpublishedNodes($node->getContext()->getWorkspace());

        foreach ($unpublishedNodes as $unpublishedNode) {
            if ($unpublishedNode === $node) {
                yield $unpublishedNode;
            }

            if ($this->stringHelper->startsWith($unpublishedNode->getPath(), $node->getPath())) {
                yield $unpublishedNode;
            }
        }
    }

    /**
     * @param NodeInterface $node
     * @return boolean
     */
    public function checkIfNodeHasUnpublishedChanges(NodeInterface $node)
    {
        foreach ($this->getUnpublishedNodesBeneathNode($node) as $unpublishedNode) {
            return true;
        }

        return false;
    }

    /**
     * @param NodeInterface $node
     * @return \Generator<NodeInterface>
     */
    public function publishNode(NodeInterface $node)
    {
        foreach ($this->getUnpublishedNodesBeneathNode($node) as $unpublishedNode) {
            $this->publishingService->publishNode($unpublishedNode);
            yield $unpublishedNode;
        }
    }

    /**
     * @param NodeInterface $node
     * @return \Generator<NodeInterface>
     */
    public function discardNode(NodeInterface $node)
    {
        foreach ($this->getUnpublishedNodesBeneathNode($node) as $unpublishedNode) {
            $this->publishingService->discardNode($unpublishedNode);
            yield $unpublishedNode;
        }
    }
}
