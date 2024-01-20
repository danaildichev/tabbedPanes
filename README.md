# tabbedPanes

![Static Badge](https://img.shields.io/badge/version-1-blue)

Nav tabs with content panels that fade in and out. Handles keyboard input with tab, arrow right, and arrow left. 

The example file, `index.html` was built with Tailwind, Daisy UI, and some custom CSS.

## Live Demo

[https://danaildichev.net/portfolio/code-samples/tabbed-panes](https://danaildichev.net/portfolio/code-samples/tabbed-panes)

## Install

1. Clone `TabbedPanesHandler.js` and accompanying `index.html`

## Usage

### HTML and CSS

```
<style>
		
/* tabs - active */
.tab-active { color: hsl(262 80% 90%) }
.tab-bordered.tab-active:not(.tab-disabled):not([disabled]) { border-color: hsl(262 80% 90%) }

/* panes - display */
.pane { display: none; }
.pane-active { display: block; }

/* classes for fading */
.fade { transition: opacity; transition-duration: 0.3s; }
.faded-in { opacity: 100%; }
.faded-out { opacity: 0%; }

</style>

<!------------------>
<!-- tabbed panes -->
<div id="tabbedPanes_group1" class="tabbedPanesWrapper" data-active-tab="tab_1" data-active-pane="pane_1">

  <!---------->
  <!-- tabs -->
  <div id="tablist_group1" class="tabs mb-6" role="tablist" data-focus-at="0" aria-label="Sample Tabs">

    <!-- tab -->
    <button id="tab_1" class="tab tab-bordered tab-active" role="tab" aria-selected="true" aria-controls="pane_1" tabindex="0">
      First Tab
    </button>

    <!-- tab -->
    <button id="tab_2" class="tab tab-bordered" role="tab" aria-selected="false" aria-controls="pane_2" tabindex="-1">
      Second Tab
    </button>

    <!-- tab -->
    <button id="tab_3" class="tab tab-bordered" role="tab" aria-selected="false" aria-controls="pane_3" tabindex="-1">
      Third Tab
    </button>

  </div>
  <!-- end tabs -->
  <!-------------->

  <!----------->
  <!-- panes -->
  <div id="panelist_group1" class="panes">

    <!-- pane -->
    <div id="pane_1" class="pane fade pane-active faded-in" role="tabpanel" tabindex="0" aria-labelledby="tab_1">
      <p>Content for the first panel</p>
    </div>

    <!-- pane -->
    <div id="pane_2" class="pane fade faded-out" role="tabpanel" tabindex="0" aria-labelledby="tab_2" hidden>
      <p>Content for the second panel</p>
    </div>

    <!-- pane -->
    <div id="pane_3" class="pane fade faded-out" role="tabpanel" tabindex="0" aria-labelledby="tab_3" hidden>
      <p>Content for the third panel</p>
    </div>

  </div>
  <!-- end panes -->
  <!--------------->

</div>
<!-- end tabbed panes -->
<!---------------------->
```

### Create an instance of the `TabbedPanesHandler` class

```
<script src="path/to/TabbedPanesHandler.js"></script>
<script>

    window.addEventListener('DOMContentLoaded', () =>
    {
        const TPH = new TabbedPanesHandler();
    });

</script>
```

## API

The `TabbedPanesHandler` class is not intended to expose any data or functions.

## Issues

Open an issue or hit me up.

## Contributing

PRs accepted.

## To Do

## License

GPL-3.0
