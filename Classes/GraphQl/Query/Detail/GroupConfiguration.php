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
use Sitegeist\Objects\Domain\Model\Detail\PropertyConfiguration;

class GroupConfiguration
{
    /**
     * @var ObjectDetail
     */
    protected $objectDetail;

    /**
     * @var string
     */
    protected $groupName;

    /**
     * @var array
     */
    protected $groupConfiguration;

    public function __construct(ObjectDetail $objectDetail, string $groupName)
    {
        $this->objectDetail = $objectDetail;
        $this->groupName = $groupName;
        $this->groupConfiguration = $this->objectDetail->getNodeType()
            ->getConfiguration('ui.sitegeist/objects/detail.groups.' . $groupName);

        //
        // Invariant: $groupName must exist in node type configuration
        //

        if (!$this->groupConfiguration) {
            throw new \InvalidArgumentException(
                sprintf(
                    'Group "%s" does not seem to be configured in "%s"',
                    $groupName,
                    $this->objectDetail->getNodeType()->getName()
                ),
                1524937588
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
     * @return \Generator<PropertyConfiguration>
     */
    public function getProperties()
    {
        foreach($this->objectDetail->getNodeType()->getProperties() as $propertyName => $propertyConfiguration) {
            $groupName = ObjectAccess::getPropertyPath($propertyConfiguration, 'ui.sitegeist/objects/detail.group');
            if ($groupName === $this->groupName) {
                yield new PropertyConfiguration($this->objectDetail, $propertyName);
            }
        }
    }
}
