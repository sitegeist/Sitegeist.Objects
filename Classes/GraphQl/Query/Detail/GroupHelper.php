<?php
namespace Sitegeist\Objects\GraphQl\Query\Detail;

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
use Sitegeist\Objects\GraphQl\Query\ObjectHelper;

class GroupHelper
{
    /**
     * @var ObjectHelper
     */
    protected $object;

    /**
     * @var string
     */
    protected $groupName;

    /**
     * @var array
     */
    protected $groupConfiguration;

    public function __construct(ObjectHelper $object, string $groupName)
    {
        $this->object = $object;
        $this->groupName = $groupName;
        $this->groupConfiguration = $this->object->getNodeType()
            ->getConfiguration('ui.sitegeist/objects/detail.groups.' . $groupName);

        //
        // Invariant: $groupName must exist in node type configuration
        //

        if (!$this->groupConfiguration) {
            throw new \InvalidArgumentException(
                sprintf(
                    'Group "%s" does not seem to be configured in "%s"',
                    $groupName,
                    $this->object->getNodeType()->getName()
                ),
                1524937588
            );
        }
    }

    /**
     * Get the object
     *
     * @return ObjectHelper
     */
    public function getObject() : ObjectHelper
    {
        return $this->object;
    }

    /**
     * Get the group name
     *
     * @return string
     */
    public function getName() : string
    {
        return $this->groupName;
    }

    /**
     * Get the group icon
     *
     * @return string
     */
    public function getIcon()
    {
        return ObjectAccess::getPropertyPath($this->groupConfiguration, 'icon');
    }

    /**
     * Get the group label
     *
     * @return string
     */
    public function getLabel()
    {
        return ObjectAccess::getPropertyPath($this->groupConfiguration, 'label');
    }

    /**
     * Get the group description
     *
     * @return string
     */
    public function getDescription()
    {
        return ObjectAccess::getPropertyPath($this->groupConfiguration, 'description');
    }

    /**
     * @return \Generator<PropertyHelper>
     */
    public function getProperties()
    {
        $properties = [];

        foreach($this->object->getNodeType()->getProperties() as $propertyName => $propertyConfiguration) {
            $groupName = ObjectAccess::getPropertyPath($propertyConfiguration, 'ui.sitegeist/objects/detail.group');
            if ($groupName === $this->groupName) {
                $properties[$propertyName] = new PropertyHelper($this->object, $propertyName);
            }
        }

        $sorter = new PositionalArraySorter($properties);
        return $sorter->toArray();
    }
}
