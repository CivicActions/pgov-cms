<?php

namespace Drupal\gin_type_tray\Controller;

use Drupal\type_tray\Controller\TypeTrayController;
use Symfony\Component\HttpFoundation\Request;

/**
 * Tweaks TypeTrayController according to our needs.
 */
class GinTypeTrayController extends TypeTrayController {

  /**
   * Override the addPage so we are able to display it our way.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request object.
   *
   * @return array
   *   A render array for a list of node types that can be added.
   */
  public function addPage(Request $request = NULL) {
    $build = parent::addPage($request);
    
    // Loop through categories
    foreach ($build['#items'] as $category => $types) {
      // Loop through types
      foreach ($types as $type_id => $type) {
        // Change TYPE_TRAY_DEFAULT_ICON_PATH to a new one
        if($build['#items'][$category][$type_id]['#icon_url'] == '/' . $this->moduleList->getPath('type_tray') . static::TYPE_TRAY_DEFAULT_ICON_PATH) {
          $build['#items'][$category][$type_id]['#icon_url'] =  \Drupal::service('extension.list.module')->getPath('gin_type_tray') . '/assets/icons/file-text.svg';
        }

      }
    }
    
    return $build;
  }
 
}
