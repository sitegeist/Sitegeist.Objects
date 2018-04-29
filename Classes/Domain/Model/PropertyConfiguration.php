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

class PropertyConfiguration
{
    /**
     * @var ObjectDetail
     */
    protected $objectDetail;

    /**
     * @var string
     */
    protected $propertyName;

    /**
     * @var array
     */
    protected $propertyConfiguration;

    public function __construct(ObjectDetail $objectDetail, string $propertyName)
    {
        $this->objectDetail = $objectDetail;
        $this->propertyName = $propertyName;
        $this->propertyConfiguration = $this->objectDetail->getNodeType()
            ->getConfiguration('properties.' . $propertyName . '.ui.sitegeist/objects/detail');

        //
        // Invariant: $propertyName must exist in node type configuration
        //

        if (!$this->propertyConfiguration) {
            throw new \InvalidArgumentException(
                sprintf(
                    'Property "%s" does not seem to be configured in "%s"',
                    $propertyName,
                    $this->objectDetail->getNodeType()->getName()
                ),
                1524938252
            );
        }
    }

    /**
     * Get the ObjectDetail
     *
     * @return ObjectDetail
     */
    public function getObjectDetail() : ObjectDetail
    {
        return $this->objectDetail;
    }

    /**
     * Get the property name
     *
     * @return string
     */
    public function getName() : string
    {
        return $this->propertyName;
    }

    /**
     * Get the property label
     *
     * @return string
     */
    public function getLabel()
    {
        return $this->objectDetail->getNodeType()->getConfiguration('properties.' . $propertyName . '.ui.label');
    }

    /**
     * Get if the property is editable in detail view
     *
     * @return boolean
     */
    public function getEditable()
    {
        return ObjectAccess::getPropertyPath($this->propertyConfiguration, 'editable') ?: false;
    }

    /**
     * Get the property editor
     *
     * @return string
     */
    public function getEditor()
    {
        return ObjectAccess::getPropertyPath($this->propertyConfiguration, 'editor');
    }

    /**
     * Get the property editor options
     *
     * @return array|null
     */
    public function getEditorOptions()
    {
        return ObjectAccess::getPropertyPath($this->propertyConfiguration, 'editorOptions');
    }

    /**
     * Get the property value
     *
     * @return mixed
     */
    public function getValue()
    {
        if ($this->objectDetail->hasNode()) {
            return $this->objectDetail->getNode()->getProperty($this->propertyName);
        }
    }
}
