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
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Sitegeist\Objects\Service\NodeService;
use Sitegeist\Objects\GraphQl\Query\Detail\DetailHelper;
use Sitegeist\Objects\GraphQl\Query\Index\IndexHelper;
use Neos\Eel\Helper\StringHelper;

class StoreHelper
{
    /**
     * @Flow\Inject
     * @var NodeTypeManager
     */
    protected $nodeTypeManager;

    /**
     * @Flow\Inject
     * @var StringHelper
     */
    protected $stringHelper;

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
     * For debugging purposes only!
     *
     * @Flow\Inject
     * @var \Neos\Flow\Log\SystemLoggerInterface
     */
    protected $logger;

    /**
     * @param NodeInterface $node
     * @throws \InvalidArgumentException
     */
    public function __construct(NodeInterface $node = null)
    {
        //
        // Invariant: $node must be of type "Sitegeist.Objects:Store"
        //
        if (!$node->getNodeType()->isOfType('Sitegeist.Objects:Store')) {
            throw new \InvalidArgumentException(
                sprintf('NodeType "%s" must inherit from "Sitegeist.Objects:Store"', $nodeType->getName()),
                1524931043
            );
        }

        $this->node = $node;
    }

    /**
     * Get parent nodes
     *
     * @return array<NodeInterface>
     */
    public function getParents()
    {
        $flowQuery = new FlowQuery([$this->node]);
        return $flowQuery->parentsUntil('[instanceof Sitegeist.Objects:Root]')->get();
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
     * Get the title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->node->getProperty('title');
    }

    /**
     * Get the icon
     *
     * @return string
     */
    public function getIcon()
    {
        return $this->node->getProperty('icon');
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->node->getProperty('description');
    }

    /**
     * Get objects from the store
     *
     * @param array $arguments
     * @return array<NodeInterface>
     */
    public function getObjects(array $arguments)
    {
        $flowQuery = new FlowQuery([$this->node]);
        $flowQuery = $flowQuery->children('[instanceof Sitegeist.Objects:Object]');
        $flowQuery = $flowQuery->slice($arguments['from'], $arguments['length']);

        if (array_key_exists('sort', $arguments)) {
            $flowQuery = $flowQuery->sort($arguments['sort'], $arguments['order']);
        }

        return $flowQuery->get();
    }

    /**
     * Get object index from the store
     *
     * @param array $arguments
     * @return IndexHelper
     */
    public function getObjectIndex(array $arguments)
    {
        return new IndexHelper($this->node, $this->getObjects($arguments));
    }

    /**
     * Get a single object from the store
     *
     * @param array $arguments
     * @return ObjectHelper
     */
    public function getObject(array $arguments)
    {
        if (array_key_exists('identifier', $arguments)) {
            $objectNode = $this->node->getContext()->getNodeByIdentifier($arguments['identifier']);

            //
            // Invariant: $objectNode must exist
            //
            if (!$objectNode) {
                throw new \InvalidArgumentException(
                    sprintf('Node "%s" does not exist.', $arguments['identifier']),
                    1524932459
                );
            }

            //
            // Invariant: $objectNode must be of type 'Sitegeist.Objects:Object'
            //
            if (!$objectNode->getNodeType()->isOfType('Sitegeist.Objects:Object')) {
                throw new \InvalidArgumentException(
                    'Node must be of type "Sitegeist.Objects:Object".',
                    1524932467
                );
            }

            //
            // Invariant: $objectNode must be in $store
            //
            if (!$this->stringHelper->startsWith($objectNode->getPath(), $this->node->getPath())) {
                throw new \InvalidArgumentException(
                    sprintf(
                        'Node identifier "%s" does not belong to store "%s"',
                        $objectNode->getIdentifier(),
                        $this->node->getName()
                    ),
                    1522671880
                );
            }

            return ObjectHelper::createFromNode($objectNode);
        } else if (array_key_exists('nodeType', $arguments)) {
            $nodeType = $this->nodeTypeManager->getNodeType($arguments['nodeType']);

            //
            // Invariant: $nodeType must be of type 'Sitegeist.Objects:Object'
            //
            if (!$nodeType->isOfType('Sitegeist.Objects:Object')) {
                throw new \InvalidArgumentException(
                    'NodeType must inherit from "Sitegeist.Objects:Object".',
                    1524932499
                );
            }

            //
            // Invariant: $this->node must allow $nodeType as child node type
            //
            if (!$this->node->getNodeType()->allowsChildNodeType($nodeType)) {
                throw new \InvalidArgumentException(
                    sprintf(
                        'NodeType "%s" is not allowed in Store "%s".',
                        $nodeType->getName(),
                        $this->node->getName()
                    ),
                    1524932459
                );
            }

            return ObjectHelper::createFromNodeType($nodeType, $this->node);
        }

        //
        // Invariant: Either nodeType or identifier must be given
        //
        throw new \InvalidArgumentException(
            'Either nodeType or identifier must be given',
            1524932452
        );
    }

    /**
     * Get detailed information on an object from the store
     *
     * @param array $arguments
     * @return DetailHelper
     */
    public function getObjectDetail(array $arguments)
    {
        $object = $this->getObject($arguments);

        return new DetailHelper($object);
    }

    /**
     * Route all method calls to the node
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
            return $this->node->{$name}(...$arguments);
        }

        throw new \BadMethodCallException(
            sprintf('Method "%s" is not implemented in "%s"', $name, NodeInterface::class),
            1525176050
        );
    }
}
