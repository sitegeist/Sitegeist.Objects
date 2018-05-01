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
use Neos\Neos\Controller\Module\AbstractModuleController;

/**
 * @Flow\Scope("singleton")
 */
class ModuleController extends AbstractModuleController
{
    /**
     * @Flow\InjectConfiguration(path="endpoints")
     * @var array
     */
    protected $endpointConfigurations;

    /**
     * @return void
     */
    public function indexAction()
    {
        //
        // @TODO: Find a better way to determine the endpoint
        //
        list($apiEndpoint) = array_keys($this->endpointConfigurations);

        $this->view->assign('apiEndpoint', $apiEndpoint);
    }
}
