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
use Neos\Flow\I18n\Locale;
use Neos\Flow\I18n\Service as I18nService;
use Neos\Flow\Property\TypeConverter\PersistentObjectConverter;
use Wwwision\GraphQL\Controller\StandardController as GraphQlController;
use Neos\Media\TypeConverter\AssetInterfaceConverter;
use Neos\Media\Domain\Repository\AssetRepository;
use Neos\Media\Domain\Model\Asset;
use Neos\Media\Domain\Model\ThumbnailConfiguration;
use Neos\Media\Domain\Service\AssetService;
use Neos\Neos\Service\UserService;

class ApiController extends GraphQlController
{
    /**
     * @Flow\Inject
     * @var I18nService
     */
    protected $i18nService;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var AssetRepository
     */
    protected $assetRepository;

    /**
     * @Flow\Inject
     * @var AssetService
     */
    protected $assetService;

    protected function initializeObject()
    {
        $this->i18nService->getConfiguration()->setCurrentLocale(
            new Locale($this->userService->getInterfaceLanguage())
        );
    }

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

    /**
     * @param Asset $asset
     * @param integer $width Desired width of the image
     * @param integer $maximumWidth Desired maximum width of the image
     * @param integer $height Desired height of the image
     * @param integer $maximumHeight Desired maximum height of the image
     * @param boolean $allowCropping Whether the image should be cropped if the given sizes would hurt the aspect ratio
     * @param boolean $allowUpScaling Whether the resulting image size might exceed the size of the original image
     * @param integer $quality Quality of the processed image
     * @param boolean $async Whether the thumbnail can be generated asynchronously
     */
    public function thumbnailAction(Asset $asset, $width = null, $maximumWidth = null, $height = null, $maximumHeight = null, $allowCropping = false, $allowUpScaling = false, $async = false, $quality = null)
    {
        $thumbnailConfiguration = new ThumbnailConfiguration($width, $maximumWidth, $height, $maximumHeight, $allowCropping, $allowUpScaling, $async, $quality);
        $thumbnailUriAndSize = $this->assetService->getThumbnailUriAndSizeForAsset($asset, $thumbnailConfiguration, $this->request);

        if (!$thumbnailUriAndSize || !array_key_exists('src', $thumbnailUriAndSize)) {
            $this->response->setStatus(404);
            return;
        }

        $this->redirectToUri($thumbnailUriAndSize['src'], 0, 302);
    }
}
