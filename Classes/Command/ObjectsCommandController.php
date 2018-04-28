<?php
namespace Sitegeist\Objects\Command;

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
 use Neos\Flow\Cli\CommandController;
 use Neos\Neos\Controller\CreateContentContextTrait;
 use Neos\ContentRepository\Domain\Service\NodeTypeManager;
 use Neos\ContentRepository\Domain\Model\NodeInterface;

 /**
  * @Flow\Scope("singleton")
  */
class ObjectsCommandController extends CommandController
{
    use CreateContentContextTrait;

    /**
     * @Flow\Inject
     * @var NodeTypeManager
     */
    protected $nodeTypeManager;

    /**
     * @Flow\InjectConfiguration(path="rootNodeName")
     * @var string
     */
    protected $rootNodeName;

    /**
     * Create or get the root node for all stores
     *
     * @return NodeInterface
     */
    protected function createOrGetRootNode()
    {
        $contentContext = $this->createContentContext('live');
        $rootNode = $contentContext->getRootNode()->getNode($this->rootNodeName);

        if (!$rootNode) {
            $this->outputLine('<b>Warning: </b> Could not find root node at "/%s"', [$this->rootNodeName]);
            $rootNode = $contentContext->getRootNode()->createNode($this->rootNodeName, $this->nodeTypeManager->getNodeType('Sitegeist.Objects:Root'));
            $this->outputLine('Created root node at "/%s"', [$this->rootNodeName]);
        }

        return $rootNode;
    }

    /**
     * Get a list of all available stores
     *
     * @return void
     */
    public function listStoresCommand()
    {
        $rootNode = $this->createOrGetRootNode();
        $availableStores = [];

        foreach ($rootNode->getChildNodes('Sitegeist.Objects:Store') as $storeNode) {
            $availableStores[] = [
                'title' => $storeNode->getProperty('title'),
                'name' => $storeNode->getName(),
                'nodeType' => $storeNode->getNodeType()->getName()
            ];
        }

        if (count($availableStores)) {
            $this->output->outputTable($availableStores, ['Title', 'NodeName', 'NodeType']);
        } else {
            $this->outputLine('There are no stores available.');
        }
    }

    /**
     * Create a new store
     *
     * @param string $name
     * @param string $nodeType
     * @return void
     */
    public function createStoreCommand($name, $nodeType = '')
    {
        $rootNode = $this->createOrGetRootNode();

        if ($rootNode->getNode($name)) {
            $this->outputLine('<error>A store with the name "%s" already exists</error>', [$name]);
            $this->quit(1);
            return;
        }

        if (!$nodeType) {
            $possibleNodeTypes = $this->nodeTypeManager->getSubNodeTypes('Sitegeist.Objects:Store');
            $possibleNodeTypeNames = [];

            foreach ($possibleNodeTypes as $possibleNodeType) {
                $possibleNodeTypeNames[] = $possibleNodeType->getName();
            }

            $chosenNodeTypeIndex = $this->output->select('Which node type do you wish to store?', $possibleNodeTypeNames);
            $chosenNodeTypeName = $possibleNodeTypeNames[$chosenNodeTypeIndex];
            $nodeType = $chosenNodeTypeName;
        }

        $nodeType = $this->nodeTypeManager->getNodeType($nodeType);
        $properties = [];

        foreach($nodeType->getProperties() as $propertyName => $propertyConfiguration) {
            $isSuitableForCLIEditing = (
                $propertyName{0} !== '_' &&
                array_key_exists('type', $propertyConfiguration) &&
                $propertyConfiguration['type'] === 'string'
            );

            if ($isSuitableForCLIEditing) {
                $default = array_key_exists('defaultValue', $propertyConfiguration) ?
                    $propertyConfiguration['defaultValue'] : '';

                $value = $this->output->ask(sprintf('<b>%s:</b> (%s) ', $propertyName, $default), $default);
                $properties[$propertyName] = $value;
            }
        }

        $storeNode = $rootNode->createNode($name, $this->nodeTypeManager->getNodeType('Sitegeist.Objects:Store'));
        foreach($properties as $propertyName => $value) {
            $storeNode->setProperty($propertyName, $value);
        }

        $title = $storeNode->getProperty('title') ?? $storeNode->getName();
        $this->outputLine('<success>Store "%s" successfully created</success>', [$title]);
    }

    /**
     * Update data on an existing store
     *
     * @param string $name
     * @param string $icon
     * @param string $title
     * @param string $description
     * @return void
     */
    public function updateStoreCommand($name, $icon = '', $title = '', $description = '')
    {
        $rootNode = $this->createOrGetRootNode();
        $storeNode = $rootNode->getNode($name);
        $title = $storeNode->getProperty('title') ?? $storeNode->getName();

        if (!$storeNode) {
            $this->outputLine('<error>A store with the name "%s" does not exist.</error>', [$name]);
            $this->quit(1);
            return;
        }

        $this->outputLine('Editing Store: %s', [$title]);

        foreach($storeNode->getNodeType()->getProperties() as $propertyName => $propertyConfiguration) {
            $isSuitableForCLIEditing = (
                $propertyName{0} !== '_' &&
                array_key_exists('type', $propertyConfiguration) &&
                $propertyConfiguration['type'] === 'string'
            );

            if ($isSuitableForCLIEditing) {
                $default = $storeNode->getProperty($propertyName);
                $value = $this->output->ask(sprintf('<b>%s:</b> (%s) ', $propertyName, $default), $default);
                $properties[$propertyName] = $value;
            }
        }

        foreach($properties as $propertyName => $value) {
            $storeNode->setProperty($propertyName, $value);
        }

        $this->outputLine('<success>Store "%s" successfully updated</success>', [$title]);
    }

    /**
     * Delete an existing store
     *
     * @param string $name
     * @return void
     */
    public function deleteStoreCommand($name)
    {
        $rootNode = $this->createOrGetRootNode();
        $storeNode = $rootNode->getNode($name);

        if (!$storeNode) {
            $this->outputLine('<error>A store with the name "%s" does not exist.</error>', [$name]);
            $this->quit(1);
            return;
        }

        $title = $storeNode->getProperty('title') ?? $storeNode->getName();
        $numberOfChildNodes = count($storeNode->getChildNodes());

        $this->outputLine('<b>Do you really want to delete the store "%s"?</b>', [$title]);
        $this->outputLine('If you confirm the operation, all %sitems in the store and the store itself are going to be deleted.', [$numberOfChildNodes > 1 ? $numberOfChildNodes . ' ' : '']);
        $this->outputLine('<b>This can not be undone</b>');


        if (!$this->output->askConfirmation('Do wish to continue? (y/N) ', false)) {
            $this->outputLine('<error>The store with the name "%s" will not be deleted.</error>', [$name]);
            $this->quit(1);
            return;
        }

        $storeNode->remove();
        $this->outputLine('<success>Store "%s" successfully deleted</success>', [$title]);
    }
}
