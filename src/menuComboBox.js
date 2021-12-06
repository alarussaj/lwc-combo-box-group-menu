import { LightningElement, api, track } from "lwc";
import { scrollIntoViewIfNeeded } from "c/keyboardUtils";

const KEY_ARROW_UP = 38;
const KEY_ARROW_DOWN = 40;
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const MAIN_BUTTON = 0;

export default class MenuComboBox extends LightningElement {
  // Public properties
  @api label = "";
  @api placeholder = "";
  @api required = false;

  // Template properties
  error;

  // Private properties
  @track _menuOptions = [];
  _isFirstRender = true;
  _hasFocus = false;
  _cancelBlur = false;
  _focusedResultIndex = null;
  _searchResultsCount = 0;
  _listBox;
  _value;
  _isDirty = false;

  // PUBLIC GETTERS/SETTERS

  get menuOptions() {
    return this._menuOptions ?? [];
  }

  @api
  set menuOptions(menuOptions = []) {
    const self = this;
    let i = 0;
    [...menuOptions].forEach((menuOption) => {
      const options = menuOption.options.map((item) => {
        const id = i;
        const option = {
          ...item,
          selected: false,
          id: id,
          get classes() {
            let cls =
              "menu-option-options slds-media slds-listbox__option slds-listbox__option_entity slds-listbox__option_has-meta menu-options";
            if (self._focusedResultIndex === id) {
              cls += " slds-has-focus";
            }
            return cls;
          },
        };
        i = i + 1;
        return option;
      });
      this._searchResultsCount += options.length;
      this._menuOptions.push({
        name: menuOption.name,
        options: options,
      });
    });
  }

  get value() {
    return this._value ?? null;
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

  get ariaExpanded() {
    return this._hasFocus;
  }

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

  // CALLBACKS

  renderedCallback() {
    if (this._isFirstRender) {
      this._isFirstRender = false;
      this._listBox = this.template.querySelector('[role="listbox"]');
    }
  }

  // INTERNAL FUNCTIONS

  /**
   * Sets the combo box value and dispatches value
   * @param {string} selectedValue value selected
   * @param {string} optionLabel label of value selected
   */
  setSelection(selectedValue, optionLabel) {
    this._value = optionLabel;
    this._menuOptions?.forEach((menuOption) => {
      menuOption.options.map((option) => {
        option.selected = option.value === selectedValue ? true : false;
        return option;
      });
    });
    this._hasFocus = false;
    this._isDirty = true;
    const selectionEvent = new CustomEvent("select", {
      detail: selectedValue,
    });
    this.dispatchEvent(selectionEvent);
  }

  // EVENT HANDLING

  /**
   * Input focus
   */
  handleFocus() {
    this._hasFocus = true;
    this._focusedResultIndex = null;
  }

  /**
   * Input blur
   */
  handleBlur() {
    if (this._cancelBlur) {
      return;
    }
    this._hasFocus = false;
  }

  /**
   * Input value
   */
  handleInput() {
    this._value = null;
  }

  /**
   * Input mouse down event
   * @param {Object} event
   */
  handleMouseDown(event) {
    if (event.button === MAIN_BUTTON && !this._hasFocus) {
      console.log("button pressed");
      this._hasFocus = true;
    }
  }

  /**
   * Handles the input key down using keyboard events that allow selection and scrolling
   * @param {object} event
   */
  handleKeyDown(event) {
    console.log("this._focusedResultIndex", this._focusedResultIndex);
    this._hasFocus = true;
    if (event.keyCode === KEY_ESCAPE) {
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
      this.template
        .querySelector(`[data-option-id="${this._focusedResultIndex}"]`)
        ?.click();
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
      scrollIntoViewIfNeeded(optionSelected, this._listBox);
    }
  }

  /**
   * Mouse down event that sets the input value and focus
   * @param {Object} event
   */
  handleComboboxMouseDown(event) {
    if (event.button === MAIN_BUTTON) {
      this._cancelBlur = true;
    }
  }

  /**
   * Mouse up even that handles the input focus
   */
  handleComboboxMouseUp() {
    this._cancelBlur = false;
    this._hasFocus = true;
  }

  /**
   * Selects an option and dispatches the selected value
   * @param {Object} event
   */
  handleOptionClick(event) {
    const { value: selectedValue, name: optionLabel } =
      event.currentTarget.dataset;
    this.setSelection(selectedValue, optionLabel);
  }

  // STYLE EXPRESSIONS

  get inputClass() {
    const css = ["slds-input slds-combobox__input caret-transparent"];
    css.push([
      this.required && this._isDirty && !this._value ? "has-custom-error" : "",
    ]);
    return css.join(" ");
  }

  get comboxBoxClass() {
    const css = [
      "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click",
    ];
    css.push([this._hasFocus ? "slds-is-open" : ""]);
    return css.join(" ");
  }
}
