/**
 * We only import the necessary modules
 * from D3, to keep resulting bundded
 * JS files minimal in size.
 */

import { select, selectAll, event } from 'd3-selection'
import * as hierarchy from 'd3-hierarchy'
import * as zoom from 'd3-zoom'
import { linkHorizontal, linkVertical } from 'd3-shape'

// create a Object with only the subset of functions/submodules/plugins that we need
var d3 = {
  select,
  selectAll,
  // For more information on live bindings, refer to:
  //   https://stackoverflow.com/questions/40012016/importing-d3-event-into-a-custom-build-using-rollup
  get event() { return event; },
  linkHorizontal,
  linkVertical,
  ...hierarchy,
  ...zoom,
};

export default d3;