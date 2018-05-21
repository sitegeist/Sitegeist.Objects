<?php
namespace Sitegeist\Objects\Controller;

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
use Wwwision\GraphQL\Controller\StandardController as GraphQlController;
use Neos\Media\Domain\Repository\AssetRepository;
use Neos\Media\Domain\Model\Asset;

class ApiController extends GraphQlController
{
    /**
     * @Flow\Inject
     * @var AssetRepository
     */
    protected $assetRepository;

    /**
     * Initialization for uploadAction
     *
     * @return void
     */
    protected function initializeUploadAction()
    {
        $assetMappingConfiguration = $this->arguments->getArgument('asset')->getPropertyMappingConfiguration();
        $assetMappingConfiguration->allowProperties('title', 'resource', 'assetCollections');
        $assetMappingConfiguration->setTypeConverterOption(PersistentObjectConverter::class, PersistentObjectConverter::CONFIGURATION_CREATION_ALLOWED, true);
        $assetMappingConfiguration->setTypeConverterOption(AssetInterfaceConverter::class, AssetInterfaceConverter::CONFIGURATION_ONE_PER_RESOURCE, true);

        $assetMappingConfiguration->forProperty('assetCollections')
            ->allowAllProperties();
    }

    /**
     * Upload a new asset. No redirection and no response body, for use by plupload (or similar).
     *
     * @param Asset $asset
     * @return string
     */
    public function uploadAction(Asset $asset)
    {
        if ($this->persistenceManager->isNewObject($asset)) {
            $this->assetRepository->add($asset);
            $this->response->setStatus(201);
        } else {
            $this->assetRepository->update($asset);
            $this->response->setStatus(200);
        }

        return json_encode([
            '__identity' => $this->persistenceManager->getIdentifierByObject($asset)
        ]);
    }

    /**
     * @param Asset $asset
     */
    public function assetAction(Asset $asset)
    {
        return json_encode([
            '__identity' => $this->persistenceManager->getIdentifierByObject($asset),
            '__type' => get_class($asset),
            'fileName' => $asset->getResource()->getFilename(),
            'fileSize' => $asset->getResource()->getFileSize(),
            'mediaType' => $asset->getResource()->getMediaType()
        ]);
    }
}
