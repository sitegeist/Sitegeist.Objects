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

class TabHelper
{
    /**
     * @var ObjectHelper
     */
    protected $object;

    /**
     * @var string
     */
    protected $tabName;

    /**
     * @var array
     */
    protected $tabConfiguration;

    public function __construct(ObjectHelper $object, string $tabName)
    {
        $this->object = $object;
        $this->tabName = $tabName;
        $this->tabConfiguration = $this->object->getNodeType()
            ->getConfiguration('ui.sitegeist/objects/detail.tabs.' . $tabName);

        //
        // Invariant: $tabName must exist in node type configuration
        //

        if (!$this->tabConfiguration) {
            throw new \InvalidArgumentException(
                sprintf(
                    'Tab "%s" does not seem to be configured in "%s"',
                    $tabName,
                    $this->object->getNodeType()->getName()
                ),
                1524936025
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
     * Get the tab name
     *
     * @return string
     */
    public function getName() : string
    {
        return $this->tabName;
    }

    /**
     * Get the tab icon
     *
     * @return string
     */
    public function getIcon()
    {
        return ObjectAccess::getPropertyPath($this->tabConfiguration, 'icon');
    }

    /**
     * Get the tab label
     *
     * @return string
     */
    public function getLabel()
    {
        return ObjectAccess::getPropertyPath($this->tabConfiguration, 'label');
    }

    /**
     * Get the tab description
     *
     * @return string
     */
    public function getDescription()
    {
        return ObjectAccess::getPropertyPath($this->tabConfiguration, 'description');
    }

    /**
     * @return \Generator<GroupHelper>
     */
    public function getGroups()
    {
        $groupConfigurations = [];

        foreach($this->object->getNodeType()->getProperties() as $propertyConfiguration) {
            $groupName = ObjectAccess::getPropertyPath($propertyConfiguration, 'ui.sitegeist/objects/detail.group');
            $tabName = $this->object->getNodeType()
                ->getConfiguration('ui.sitegeist/objects/detail.groups.' . $groupName . '.tab');

            if ($tabName === $this->tabName && $groupName && !array_key_exists($groupName, $groupConfigurations)) {
                $groupConfigurations[$groupName] = new GroupHelper($this->object, $groupName);
            }
        }

        $sorter = new PositionalArraySorter($groupConfigurations);
        return $sorter->toArray();
    }
}
