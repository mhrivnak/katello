/**
 * Copyright 2013 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 */

/**
 * @ngdoc object
 * @name  Bastion.systems.controller:SystemDetailsController
 *
 * @requires $scope
 * @requires $state
 * @requires $q
 * @requires gettext
 * @requires System
 * @requires Organization
 * @requires MenuExpander
 *
 * @description
 *   Provides the functionality for the system details action pane.
 */
angular.module('Bastion.systems').controller('SystemDetailsController',
    ['$scope', '$state', '$q', 'gettext', 'System', 'Organization', 'MenuExpander',
    function ($scope, $state, $q, gettext, System, Organization, MenuExpander) {

        $scope.menuExpander = MenuExpander;
        $scope.successMessages = [];
        $scope.errorMessages = [];

        if ($scope.system) {
            $scope.panel = {loading: false};
        } else {
            $scope.panel = {loading: true};
        }

        $scope.system = System.get({id: $scope.$stateParams.systemId}, function (system) {
            $scope.$watch("systemTable.rows.length > 0", function () {
                $scope.systemTable.replaceRow(system);
            });

            $scope.$broadcast('system.loaded', system);
            $scope.panel.loading = false;
        });

        $scope.save = function (system) {
            var deferred = $q.defer();

            system.$update(function (response) {
                deferred.resolve(response);
                $scope.successMessages.push(gettext('Save Successful.'));
            }, function (response) {
                deferred.reject(response);
                _.each(response.data.errors, function (errorMessage) {
                    $scope.errorMessages.push(gettext("An error occurred saving the System: ") + errorMessage);
                });
            });

            return deferred.promise;
        };

        $scope.transitionTo = function (state, params) {
            var systemId = $scope.$stateParams.systemId;

            if ($scope.system && $scope.system.uuid) {
                systemId = $scope.system.uuid;
            }

            if (systemId) {
                params = params ? params : {};
                params.systemId  = systemId;
                $state.transitionTo(state, params);
                return true;
            }
            return false;
        };

        $scope.serviceLevels = function () {
            var deferred = $q.defer();

            Organization.get(function (organization) {
                deferred.resolve(organization['service_levels']);
            });

            return deferred.promise;
        };
    }]
);
