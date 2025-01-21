<?php

declare(strict_types=1);

namespace Drupal\pgov_period\Plugin\EntityReferenceSelection;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\Plugin\EntityReferenceSelection\DefaultSelection;
use Drupal\Core\Entity\Query\QueryInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Restrict the list of available "Time period" fields based on its content.
 *
 * Time periods are stored as entity references to Storage entities, such that
 * multiple items of the same time period can be grouped consistently. This
 * function reduces the list of all possible time periods to common sense
 * options based on the situation at hand.
 *
 * In general, this means following the hierarchy of content: Strategic plans
 * are parents of Goals; Goals are parents to Objectives; and so-on. It should
 * not be possible to set a Goal's value outside the date range of its parent
 * plan.
 *
 * Additionally, some of the date ranges are tracked as federal fiscal years
 * (Oct-Sept), while others follow calendar years (Jan-Dec). Ensure that the
 * selected duration type applies downstream.
 *
 * @EntityReferenceSelection(
 *   id = "pgov_period_storage_selection",
 *   label = @Translation("Time period"),
 *   group = "pgov_period_storage_selection",
 *   entity_types = {"storage"},
 * )
 */
#[EntityReferenceSelection(
  id: "pgov_period_storage_selection",
  label: new TranslatableMarkup("Time period"),
  group: "pgov_period_storage_selection",
  weight: 0,
)]
final class TimePeriod extends DefaultSelection {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    $configuration = parent::defaultConfiguration();
    $configuration['target_bundles'] = ['period'];
    return $configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state): array {
    $form = parent::buildConfigurationForm($form, $form_state);

    // Hide target_bundles because they'll always be 'Time period'.
    $form['target_bundles']['#type'] = 'value';
    $form['target_bundles']['#value'] = ['period'];

    // Hide/disable auto_create.
    $form['auto_create']['#type'] = 'value';
    $form['auto_create']['#value'] = FALSE;

    $form['sort']['#access'] = FALSE;
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  protected function buildEntityQuery($match = NULL, $match_operator = 'CONTAINS'): QueryInterface {
    $query = parent::buildEntityQuery($match, $match_operator);
    if ($parent_period = $this->parentTimePeriod($this->configuration['entity'])) {
      if ($parent_period->hasField('field_date_range')) {
        if ($range = $parent_period->get('field_date_range')->first()) {
          $query->condition('field_date_range.value', $range->get('value')?->getValue(), '>=');
          $query->condition('field_date_range.end_value', $range->get('end_value')?->getValue(), '<=');
        }
        if ($parent_period->hasField('field_duration')) {
          if ($duration = $parent_period->get('field_duration')?->first()) {
           // $query->condition('field_duration.value', $duration->getValue());
          }
        }
      }
    }
    return $query;
  }

  /**
   * Limit return the time period entry for the nearest parent.
   *
   * Given that the plan content appears in a nested hierarchy, use the time
   * period referenced by the parent entity of the current item. If the nearest
   * parent does not have a time period, look at that parent's parent, and
   * so-on until the list of parents are exhausted.
   *
   * @param EntityInterface $entity
   *   The current entity to inspect (or a parent entity, by way of recursion)
   *
   * @return false|mixed|void
   *   A Time period (period) Storage entity or FALSE.
   */
  protected function parentTimePeriod(EntityInterface $entity) {
    $hierarchy = [
      'field_indicator',
      'field_objective',
      'field_goal',
      'field_plan',
      'field_administration',
    ];
    foreach ($hierarchy as $parent_field) {
      if ($entity->hasField($parent_field)) {
        // We can't filter if a parent field exists but isn't populated: return.
        if (!$references = $entity->get($parent_field)->referencedEntities()) {
          return FALSE;
        }
        else {
          $parent_entity = current($references);

          // If the parent has a field_period value, return that.
          if ($parent_entity?->hasField('field_period')) {
            if ($period = $parent_entity->get('field_period')
              ->referencedEntities()) {
              return current($period);
            }
          }
          // Or, if it has a date range (as on Administration) return that.
          elseif ($parent_entity?->hasField('field_date_range')) {
            return $parent_entity;
          }
          else {
            // Recursively find the next level up.
            return $this->parentTimePeriod($parent_entity);
          }
        }
      }
    }
    // Return FALSE on failure.
    return FALSE;
  }

}
