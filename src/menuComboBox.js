import { LightningElement, api, track } from "lwc";

const KEY_ARROW_UP = 38;
const KEY_ARROW_DOWN = 40;
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;

export default class MenuComboBox extends LightningElement {
  // Public properties
  @api label = "";
  @api placeholder = "";

  get menuOptions() {
    return this._menuOptions ?? [];
  }

  get value() {
    return this._value ?? null;
  }

  @api
  set menuOptions(menuOptions = []) {
    const self = this;
    [...menuOptions].forEach((menuOption, i) => {
      const options = menuOption.options.map((option, j) => ({
        ...option,
        selected: false,
        id: i > 0 ? i + j + i : i + j,
        get classes() {
          let cls =
            "menu-option-options slds-media slds-listbox__option slds-listbox__option_entity slds-listbox__option_has-meta menu-options";
          if (self._focusedResultIndex === (i > 0 ? i + j + i : i + j)) {
            cls += " slds-has-focus";
          }
          return cls;
        },
      }));
      this._searchResultsCount += options.length;
      this._menuOptions.push({
        name: menuOption.name,
        options: options,
      });
    });
    this._defaultMenuOptions = this._menuOptions;
  }

  get selectedOptions() {
    const selectedOptions = this._options.filter((option) => {
      return option.selected;
    });
    return selectedOptions ?? [];
  }

  get selectedOptionsCount() {
    return this.selectedOptions.length;
  }

  get ariaExapanded() {
    return this._hasFocus;
  }

  renderedCallback() {
    if (this._isFirstRender) {
      this._isFirstRender = false;
      this._listBox = this.template.querySelector('[role="listbox"]');
    }
  }

  // Private properties
  @track _menuOptions = [];
  @track __defaultMenuOptions;
  _isFirstRender = true;
  _hasFocus = false;
  _cancelBlur = false;
  _focusedResultIndex = null;
  _searchResultsCount = 0;
  _listBox;
  _value;


  get searchResultsCount() {
    let total = 0;
    this._menuOptions.forEach((menuOption) => {
      total += menuOption.options.length;
    });
    if (total === 0) {
      this._focusedResultIndex = null;
    }
    return total;
  }

  

  // INTERNAL FUNCTIONS

  hasSelection() {
    return this._value;
  }

  setSelection(selectedValue, optionLabel) {
    this._value = optionLabel;
    this._menuOptions?.forEach((menuOption) => {
      menuOption.options.map((option) => {
        option.selected = option.value === selectedValue ? true : false;
        return option;
      });
    });
    this._hasFocus = false;
    const selectionEvent = new CustomEvent("select", {
      detail: selectedValue,
    });
    this.dispatchEvent(selectionEvent);
  }

  search(newSearchTerm) {
    this._searchTerm = newSearchTerm;
    const newCleanSearchTerm = newSearchTerm
      .trim()
      .replace(/\*/g, "")
      .toLowerCase();
    if (this._cleanSearchTerm === newCleanSearchTerm) {
      return;
    }
    this._cleanSearchTerm = newCleanSearchTerm;
    if (newCleanSearchTerm) {
      this._searchResultsCount = 0;
      const menuOptions = [];
      [...this._menuOptions].forEach((menuOption) => {
        const options =
          menuOption.options.filter((option) => {
            return option.label.toLowerCase().indexOf(newCleanSearchTerm) > -1;
          }) ?? [];
        menuOptions.push({
          name: menuOption.name,
          options: options,
        });
      });
      this._menuOptions = menuOptions;
    } else {
      this._menuOptions = this._defaultMenuOptions;
    }
  }

  scrollIntoViewIfNeeded(element, scrollingParent) {
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

  // EVENT HANDLING

  handleFocus() {
    console.log("focus");
    this._hasFocus = true;
    this._focusedResultIndex = null;
  }

  handleBlur() {
    if (this._cancelBlur) {
      return;
    }
    this._hasFocus = false;
  }

  handleInput(event) {
    this._value = null;
  }

  handleKeyDown(event) {
    this._hasFocus = true;
    if (event.keyCode == KEY_ESCAPE) {
      this._hasFocus = false;
      return;
    }
    if (this._focusedResultIndex === null) {
      this._focusedResultIndex = -1;
    }
    if (event.keyCode === KEY_ARROW_DOWN) {
      this._focusedResultIndex++;
      if (this._focusedResultIndex >= this.searchResultsCount) {
        this._focusedResultIndex = 0;
      }
      event.preventDefault();
    } else if (event.keyCode === KEY_ARROW_UP) {
      // If we hit 'up', select the previous item, or cycle over.
      this._focusedResultIndex--;
      if (this._focusedResultIndex < 0) {
        this._focusedResultIndex = this.searchResultsCount - 1;
      }
      event.preventDefault();
    } else if (
      event.keyCode === KEY_ENTER &&
      this._hasFocus &&
      this._focusedResultIndex >= 0
    ) {
      this.template.querySelector(
        `[data-option-id="${this._focusedResultIndex}"]`
      )?.click();
      event.preventDefault();
    }
    if (
      this._hasFocus &&
      this.searchResultsCount > 0 &&
      this._focusedResultIndex >= 0
    ) {
      const optionSelected = this.template.querySelector(
        `[data-option-id="${this._focusedResultIndex}"]`
      );
      this.scrollIntoViewIfNeeded(optionSelected, this._listBox);
    }
  }

  handleComboboxMouseDown(event) {
    const mainButton = 0;
    if (event.button === mainButton) {
      this._cancelBlur = true;
    }
  }

  handleComboboxMouseUp() {
    this._cancelBlur = false;
    this.template.querySelector("input").focus();
  }

  handleOptionClick(event) {
    const { value: selectedValue, name: optionLabel } = event.currentTarget.dataset;
    this.setSelection(selectedValue, optionLabel);
  }

  // STYLE EXPRESSIONS

  get comboxBoxClass() {
    let css =
      "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ";
    css += this._hasFocus ? "slds-is-open" : "";
    return css;
  }
}
