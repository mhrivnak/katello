#
# Copyright 2013 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Fort
  module Actions

    class ContentViewRefresh < Dynflow::Action

      def self.subscribe
        Katello::Actions::ContentViewRefresh
      end

      def run
        view = ContentView.find(input['id'])
        env = view.organization.library
        Node.with_environment(env).each do |node|
          node.sync(:environment => env, :content_view => view)
        end
      end

    end

  end

end
