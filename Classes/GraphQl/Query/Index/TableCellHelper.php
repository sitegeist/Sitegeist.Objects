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
use Neos\Eel\EelEvaluatorInterface;
use Neos\Eel\Utility as EelUtility;
use Neos\Eel\Helper\StringHelper;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
use Sitegeist\Objects\GraphQl\Query\ObjectHelper;

class TableCellHelper
{
    /**
     * @var NodeInterface
     */
    protected $storeNode;

    /**
     * @var ObjectHelper
     */
    protected $object;

    /**
     * @var string
     */
    protected $columnName;

    /**
     * @var array
     */
    protected $columnConfiguration;

    /**
     * @Flow\InjectConfiguration(package="Neos.Fusion", path="defaultContext")
     * @var array
     */
    protected $defaultContextConfiguration;

    /**
     * @Flow\Inject
     * @var EelEvaluatorInterface
     */
    protected $eelEvaluator;

    /**
     * @param NodeInterface $storeNode
     * @param NodeInterface|null $node
     * @param string $columnName
     * @throws \InvalidArgumentException
     */
    public function __construct(NodeInterface $storeNode, ObjectHelper $object, string $columnName)
    {
        //
        // Invariant: $storeNode must be of type 'Sitegeist.Objects:Store'
        //
        if (!$storeNode->getNodeType()->isOfType('Sitegeist.Objects:Store')) {
            throw new \InvalidArgumentException(
                'StoreNode must be of type "Sitegeist.Objects:Store".',
                1525003452
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
                1525003455
            );
        }

        $this->storeNode = $storeNode;
        $this->object = $object;
        $this->columnName = $columnName;
        $this->columnConfiguration = $columnConfiguration;
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
     * Get the view
     *
     * @return string|null
     */
    public function getView()
    {
        //
        // @TODO: Allow the object node type to override this on a per-property basis
        //
        return ObjectAccess::getPropertyPath($this->columnConfiguration, 'view');
    }

    /**
     * Get the view options configuration
     *
     * @return array|null
     */
    public function getViewOptions()
    {
        //
        // @TODO: Allow the object node type to override this on a per-property basis
        //
        return ObjectAccess::getPropertyPath($this->columnConfiguration, 'viewOptions');
    }

    /**
     * Get the property name
     *
     * @return string
     * @throws \Exception
     */
    public function getPropertyName()
    {
        if (ObjectAccess::getPropertyPath($this->columnConfiguration, 'computed')) {
            //
            // @TODO: Invariant: Setting both computed and propertyName is not allowed
            //
            return '[computed:' . $this->columnName . ']';
        }

        if ($propertyName = ObjectAccess::getPropertyPath($this->columnConfiguration, 'propertyName')) {
            if (is_array($propertyName)) {
                if (array_key_exists($this->object->getNodeType()->getName(), $propertyName)) {
                    return $propertyName[$this->object->getNodeType()->getName()];
                }

                foreach($propertyName as $nodeTypeName => $propertyNameCandidate) {
                    if ($nodeTypeName !== 'default' && $this->object->getNodeType()->isOfType($nodeTypeName)) {
                        return $propertyNameCandidate;
                    }
                }

                if (!array_key_exists('default', $propertyName)) {
                    throw new \Exception(
                        sprintf(
                            'Missing property name configuration for column "%s" and NodeType "%s" in ' .
                            'store "%s" ("%s"). You need to specify a propertyName for "%s", one of it\'s ' .
                            'superTypes or a "default" value.',
                            $this->columnName,
                            $this->object->getNodeType()->getName(),
                            $this->storeNode->getName(),
                            $this->storeNode->getNodeType()->getName(),
                            $this->object->getNodeType()->getName()
                        ),
                        1525005161
                    );
                }

                return $propertyName['default'];
            }

            return $propertyName;
        }

        return $this->columnName;
    }

    /**
     * Get the value
     *
     * @return mixed
     * @throws \Exception
     */
    public function getValue()
    {
        if ($eelExpression = ObjectAccess::getPropertyPath($this->columnConfiguration, 'computed')) {
            return EelUtility::evaluateEelExpression(
                $eelExpression,
                $this->eelEvaluator,
                [
                    'node' => $this->object->getNode(),
                    'store' => $this->storeNode,
                    'columnName' => $this->columnName
                ],
                $this->defaultContextConfiguration
            );
        }

        return $this->object->getProperty($this->getPropertyName());
    }
}
