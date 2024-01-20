class TabbedPanesHandler
{
    /**
     * Creates a new TabbedPanesHandler instance.
     *
     * @param {Number} fadeDuration Milliseconds for the fade animation to happen. Default 300.
     * @param {Number} fadeInDelay Delay for fade in after a pane's display changes from hidden to block.
     *
     * @return {undefined}
     */
    constructor(fadeDuration = 300, fadeInDelay= 100)
    {
        this.fadeDuration = fadeDuration;
        this.fadeInDelay = fadeInDelay;

        // get each tablist component on the page and assign arrow key event listener
        this.tablists = document.querySelectorAll('.tabbedPanesWrapper > .tabs');
        this.handleArrowKeysForEachTablist();

        // get each tab and assign click event listener
        this.tabs = document.querySelectorAll('.tabbedPanesWrapper > .tabs > .tab');
        this.handleEachTab();
    }
    // end constructor()


    /**
     * Assign right and left arrow keydown events to each tablist.
     *
     * @return {undefined}
     */
    handleArrowKeysForEachTablist()
    {
        this.tablists.forEach((tablist) =>
        {
            // get the current tablist's tab-focus data attribute
            let tabFocus = tablist.dataset.focusAt;

            // get the current tablist's tabs
            const tabs = tablist.querySelectorAll('.tab');

            // add event listener for right and left arrow keys
            tablist.addEventListener('keydown', (ev) =>
            {
                if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft')
                {
                    // disable tabindex for the currently active tab
                    tabs[tabFocus].setAttribute("tabindex", -1);

                    // move right, increment tab focus, if we're at the end, go to the start
                    if (ev.key === "ArrowRight")
                    {
                        tabFocus++;
                        if (tabFocus >= tabs.length) { tabFocus = 0; }
                    }

                    // move left. decrement tab focus, if we're at the start, move to the end
                    else if (ev.key === "ArrowLeft")
                    {
                        tabFocus--;
                        if (tabFocus < 0) { tabFocus = tabs.length - 1; }
                    }

                    // enable tabindex and set focus for tab we are moving to
                    tabs[tabFocus].setAttribute("tabindex", 0);
                    tabs[tabFocus].focus();
                }
            })

        });
    }
    // end handleArrowKeysForEachTablist()


    /**
     * Assign click event listener to each tab.
     *
     * @return {undefined}
     */
    handleEachTab()
    {
        this.tabs.forEach((tab) =>
        {
            tab.addEventListener('click', () =>
            {
                // get currently active tab and pane element ids
                const activeEls = this.getActiveElementsFromTabOuterWrapperData(tab);

                // if clicking on a tab that is not currently active
                if (tab.id !== activeEls.active.tab.id)
                {
                    // swap active elements for target elements
                    this.swapTabsAndPanes(this.getEventElements(activeEls, tab));
                }

            })
        })
    }
    // end handleEachTab()


    /**
     * Builds an object to store the (active tab and pane), the (target tab and pane), and the tabs outer wrapper.
     *
     * @param {Object} activeEls Derived from dataset of the tab's tablist's parent element.
     * @param {HTMLElement} tab The tab that was clicked on.
     *
     * @return {Object}
     */
    getEventElements(activeEls, tab)
    {
        // get target pane element by id
        const targetPaneID = tab.getAttribute("aria-controls");
        const targetPane = document.getElementById(targetPaneID);

        // return the (active tab and pane) elements, the (target tab and pane) elements,
        // and the tab's outer wrapper grouped into an object
        return {
            ...activeEls,
            'target': {'tab': tab, 'pane': targetPane},
            'outerWrapper': this.getTabOuterWrapper(tab)
        };
    }
    // end getEventElements()


    /**
     * Finds active tab and pane elements by id from the tab's outer wrapper's dataset.
     *
     * @param {HTMLElement} tab The tab that was clicked on.
     *
     * @return {Object} {active: {tab: HTMLElement, pane: HTMLElement}}
     */
    getActiveElementsFromTabOuterWrapperData(tab)
    {
        const tabWrapper = this.getTabOuterWrapper(tab)
        const activeTab = document.getElementById(tabWrapper.dataset.activeTab);
        const activePane = document.getElementById(tabWrapper.dataset.activePane);

        return { 'active': {'tab': activeTab, 'pane': activePane} };
    }
    // end getActiveElementsFromTabOuterWrapperData()


    /**
     * Gets the top level container of a tab. E.g. 'div.tabbedPanesWrapper'.
     *
     * @param tab The tab that was clicked on.
     *
     * @return HTMLElement That tab's tablist's parent node.
     */
    getTabOuterWrapper(tab)
    {
        const tablist = tab.parentNode;
        return tablist.parentNode;
    }
    // end getTabOuterWrapper()


    /**
     * Deactivate the currently active tab and pane, then activate the target tab and pane
     *
     * @param {Object} eventElements The (active tab and pane) and (target tab and pane), and their top level container.
     *
     * @return {undefined}
     */
    swapTabsAndPanes(eventElements)
    {
        // swap tabs
        this.deactivateTab(eventElements.active.tab);
        this.activateTab(eventElements.target.tab, eventElements.outerWrapper);

        // swap panes
        this.deactivatePane(eventElements.active.pane);
        this.sleep(this.fadeDuration).then(() =>
        {
            this.activatePane(eventElements.target.pane, eventElements.outerWrapper);
        });
    }
    // end swapTabsAndPanes()


    /**
     * Deactivates a tab.
     *
     * @param {HTMLElement} tab The currently active tab.
     *
     * @return {undefined}
     */
    deactivateTab(tab)
    {
        tab.setAttribute("aria-selected", false);
        tab.classList.remove('tab-active');
    }
    // end deactivateTab()


    /**
     * Deactivates a pane.
     *
     * @param {HTMLElement} pane The currently active pane to be hidden.
     *
     * @return {undefined}
     */
    deactivatePane(pane)
    {
        pane.classList.replace('faded-in', 'faded-out');
        this.sleep(this.fadeDuration).then(() =>
        {
            pane.classList.remove('pane-active');
            pane.hidden = true;
        });
    }
    // end deactivatePane()


    /**
     * Activates a tab.
     *
     * @param {HTMLElement} tab The tab that was clicked on.
     * @param {HTMLElement} outerWrapper The tab's top level container.
     *
     * @return {undefined}
     */
    activateTab(tab, outerWrapper)
    {
        this.updateOuterWrapperDataAttribute(outerWrapper, 'activeTab', tab.id);
        tab.setAttribute("aria-selected", true);
        tab.classList.add('tab-active');
    }
    // end activateTab()


    /**
     * Activates a pane.
     *
     * @param {HTMLElement} pane The pane to be shown.
     * @param {HTMLElement} outerWrapper The pane's top level container.
     *
     * @return {undefined}
     */
    activatePane(pane, outerWrapper)
    {
        this.updateOuterWrapperDataAttribute(outerWrapper, 'activePane', pane.id);
        pane.classList.add('pane-active');
        pane.hidden = false;
        setTimeout(() => { pane.classList.replace('faded-out', 'faded-in'); }, this.fadeInDelay);
    }
    // end activatePane()


    /**
     * Updates a dataset attribute of a tabbedPanes component top level container. E.g. the 'activeTab' or 'activePane'
     * of a 'div.tabbedPanesWrapper'.
     *
     * @param {HTMLElement} outerWrapper A tabbedPanes component top level container.
     * @param {String} attribute Which attribute to update.
     * @param {String} value The HTMl element id of the tab or pane that will be activated.
     *
     * @return {undefined}
     */
    updateOuterWrapperDataAttribute(outerWrapper, attribute, value)
    {
        outerWrapper.dataset[attribute] = value;
    }
    // end updateOuterWrapperDataAttribute()

    /**
     * Gets a new Promise that contains a setTimeout.
     *
     * @param {Number} time Milliseconds to sleep for.
     *
     * @return {Promise<unknown>}
     */
    sleep(time)
    {
        return new Promise(resolve => { setTimeout(resolve, time) });
    }
    // end sleep()

}
// end class TabbedPanesHandler
