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
     * For debugging purposes only!
     *
     * @Flow\Inject
     * @var \Neos\Flow\Log\SystemLoggerInterface
     */
    protected $logger;

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
}
