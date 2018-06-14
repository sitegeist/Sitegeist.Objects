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
use Neos\Flow\I18n\EelHelper\TranslationHelper;
use Neos\Utility\ObjectAccess;
use Neos\Eel\EelEvaluatorInterface;
use Neos\Eel\Utility as EelUtility;
use Neos\Eel\Helper\StringHelper;
use Sitegeist\Objects\GraphQl\Query\ObjectHelper;

class PropertyHelper
{
    /**
     * @var ObjectHelper
     */
    protected $object;

    /**
     * @var string
     */
    protected $propertyName;

    /**
     * @var array
     */
    protected $propertyConfiguration;

    /**
     * @Flow\Inject
     * @var EelEvaluatorInterface
     */
    protected $eelEvaluator;

    /**
     * @Flow\Inject
     * @var StringHelper
     */
    protected $stringHelper;

    /**
     * @Flow\InjectConfiguration(package="Neos.Fusion", path="defaultContext")
     * @var array
     */
    protected $defaultContextConfiguration;

    public function __construct(ObjectHelper $object, string $propertyName)
    {
        $this->object = $object;
        $this->propertyName = $propertyName;
        $this->propertyConfiguration = $this->object->getNodeType()
            ->getConfiguration('properties.' . $propertyName . '.ui.sitegeist/objects/detail');

        //
        // Invariant: $propertyName must exist in node type configuration
        //

        if (!$this->propertyConfiguration) {
            throw new \InvalidArgumentException(
                sprintf(
                    'Property "%s" does not seem to be configured in "%s"',
                    $propertyName,
                    $this->object->getNodeType()->getName()
                ),
                1524938252
            );
        }
    }

    /**
     * Get the ObjectHelper
     *
     * @return ObjectHelper
     */
    public function getObjectHelper() : ObjectHelper
    {
        return $this->object;
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
        $label = $this->object->getNodeType()
            ->getConfiguration('properties.' . $this->propertyName . '.ui.label');
        $translationHelper = new TranslationHelper();

        return $translationHelper->translate($label);
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
        $options = ObjectAccess::getPropertyPath($this->propertyConfiguration, 'editorOptions');

        if (is_array($options)) {
            return $this->evaluateEditorOptionsRecursively($options);
        }

        return $options;
    }

    protected function evaluateEditorOptionsRecursively(array $options)
    {
        $result = [];

        foreach ($options as $key => $value) {
            if (is_string($value) && $this->stringHelper->startsWith($value, '${')) {
                $result[$key] = EelUtility::evaluateEelExpression(
                    $value,
                    $this->eelEvaluator,
                    [
                        'node' => $this->object->getNode()
                    ],
                    $this->defaultContextConfiguration
                );
                continue;
            }

            if (is_array($value)) {
                $result[$key] = $this->evaluateEditorOptionsRecursively($value);
                continue;
            }

            $result[$key] = $value;
        }

        return $result;
    }

    /**
     * Get the property value
     *
     * @return mixed
     */
    public function getValue()
    {
        if ($this->object->hasNode()) {
            return $this->object->getProperty(['name' => $this->propertyName]);
        }

        return $this->object->getNodeType()
            ->getConfiguration('properties.' . $this->propertyName . '.defaultValue');
    }
}
