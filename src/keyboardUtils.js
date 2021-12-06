/**
 * Scrolls into view when using keyboard arrow up/down keys
 * @param {object} element selected element
 * @param {object} scrollingParent elements parents
 */
function scrollIntoViewIfNeeded(element, scrollingParent) {
    const parentRect = scrollingParent.getBoundingClientRect();
    const findMeRect = element.getBoundingClientRect();
    if (findMeRect.top < parentRect.top) {
        if (element.offsetTop + findMeRect.height < parentRect.height) {
            scrollingParent.scrollTop = 0;
        } else {
            scrollingParent.scrollTop = element.offsetTop;
        }
    } else if (findMeRect.bottom > parentRect.bottom) {
        scrollingParent.scrollTop += findMeRect.bottom - parentRect.bottom;
    }
}
/** Scroll into view. */
export { scrollIntoViewIfNeeded }