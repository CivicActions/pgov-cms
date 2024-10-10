<?php

namespace Drupal\gin_type_tray\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;
use Drupal\Core\Routing\RoutingEvents;

/**
 * Subscriber for gin_type_tray routes.
 * Note: For some reason, I can't seem to extend TypeTrayRouteSubscriber and set the _controller default.
 */
class GinTypeTrayRouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {

    // Modify the "/node/add" route to use our own controller instead.
    if ($route = $collection->get('node.add_page')) {
      $defaults = $route->getDefaults();
      $defaults['_controller'] = "\Drupal\gin_type_tray\Controller\GinTypeTrayController::addPage";
      $route->setDefaults($defaults);
    }
  }

}
