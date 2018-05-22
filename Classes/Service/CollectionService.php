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
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;

/**
 * @Flow\Scope("singleton")
 */
class CollectionService
{
    /**
     * @Flow\Inject
     * @var NodeTypeManager
     */
    protected $nodeTypeManager;

    public function performCollectionOperations(NodeInterface $collectionNode, array $payload, NodeService $nodeService)
    {
        //
        // Remove all nodes that are marked for removal
        //
        $removedNodes = [];
        foreach ($payload as $item) {
            if (in_array('remove', $item['modes'])) {
                $itemNode = $collectionNode->getContext()->getNodeByIdentifier($item['identifier']);

                if ($itemNode) {
                    $itemNode->remove();
                }

                $removedNodes[$item['identifier']] = true;
            }
        }

        //
        // Create all nodes that are marked for creation
        //
        $createdNodes = [];
        foreach ($payload as $item) {
            if (in_array('add', $item['modes']) && !array_key_exists($item['identifier'], $removedNodes)) {
                $itemNode = $collectionNode->createNode(
                    $nodeService->generateUniqueNodeName($collectionNode, 'item'),
                    $this->nodeTypeManager->getNodeType($item['payload']['nodeType'])
                );

                $createdNodes[$item['identifier']] = $itemNode;
            }
        }

        //
        // Update all nodes that are marked for update
        //
        foreach ($payload as $item) {
            if (in_array('update', $item['modes']) && !array_key_exists($item['identifier'], $removedNodes)) {
                $itemNode = null;
                if (array_key_exists($item['identifier'], $createdNodes)) {
                    $itemNode = $createdNodes[$item['identifier']];
                } else {
                    $itemNode = $collectionNode->getContext()->getNodeByIdentifier($item['identifier']);
                }

                if ($itemNode) {
                    $nodeService->applyPropertiesToNode($itemNode, $item['payload']['properties']);
                }
            }
        }

        //
        // Hide all nodes that are marked to be hidden
        //
        foreach ($payload as $item) {
            if (in_array('hide', $item['modes']) && !array_key_exists($item['identifier'], $removedNodes)) {
                $itemNode = null;
                if (array_key_exists($item['identifier'], $createdNodes)) {
                    $itemNode = $createdNodes[$item['identifier']];
                } else {
                    $itemNode = $collectionNode->getContext()->getNodeByIdentifier($item['identifier']);
                }

                if ($itemNode) {
                    $itemNode->setHidden(true);
                }
            }
        }

        //
        // Show all nodes that are marked to be shown
        //
        foreach ($payload as $item) {
            if (in_array('show', $item['modes']) && !array_key_exists($item['identifier'], $removedNodes)) {
                $itemNode = null;
                if (array_key_exists($item['identifier'], $createdNodes)) {
                    $itemNode = $createdNodes[$item['identifier']];
                } else {
                    $itemNode = $collectionNode->getContext()->getNodeByIdentifier($item['identifier']);
                }

                if ($itemNode) {
                    $itemNode->setHidden(false);
                }
            }
        }

        //
        // Move all nodes that are marked for moving
        //
        foreach ($payload as $item) {
            if ((
                    in_array('move-before', $item['modes']) || in_array('move-after', $item['modes'])
            ) && !array_key_exists($item['identifier'], $removedNodes)) {
                $itemNode = null;
                if (array_key_exists($item['identifier'], $createdNodes)) {
                    $itemNode = $createdNodes[$item['identifier']];
                } else {
                    $itemNode = $collectionNode->getContext()->getNodeByIdentifier($item['identifier']);
                }

                $referenceNode = null;
                if (array_key_exists($item['moveReference'], $createdNodes)) {
                    $referenceNode = $createdNodes[$item['moveReference']];
                } else {
                    $referenceNode = $collectionNode->getContext()->getNodeByIdentifier($item['moveReference']);
                }

                if ($referenceNode && $itemNode) {
                    if (in_array('move-before', $item['modes'])) {
                        $itemNode->moveBefore($referenceNode);
                    } else if (in_array('move-after', $item['modes'])) {
                        $itemNode->moveAfter($referenceNode);
                    }
                }

            }
        }
    }
}
