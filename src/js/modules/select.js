class Select {
	constructor(option) {
		this.select = {
			default: {
				selector: option?.select?.default?.selector ? option.select.default.selector : 'select',
				elements: undefined,
			},
			class: {
				parent: option?.select?.class?.parent ? option.select.class.parent : 'vanilla-select-wrapper',
				select: {
					default: option?.select?.class?.select?.default ? option.select.class.select.default : 'vanilla-select',
					show: option?.select?.class?.select?.show ? option.select.class.select.show : 'vanilla-select_show',
					multiple: option?.select?.class?.select?.multiple ? option.select.class.select.multiple : 'vanilla-select_multiple',
				},
				btn: option?.select?.class?.btn ? option.select.class.btn : 'vanilla-select__btn',
				wrapper: option?.select?.class?.wrapper ? option.select.class.wrapper : 'vanilla-select__wrapper',
				label: option?.select?.class?.label ? option.select.class.label : 'vanilla-select__label',
				group: option?.select?.class?.group ? option.select.class.group : 'vanilla-select__group',
				list: option?.select?.class?.list ? option.select.class.list : 'vanilla-select__list',
				option: {
					default: option?.select?.class?.option?.default ? option.select.class.option.default : 'vanilla-select__option',
					selected: option?.select?.class?.option?.selected ? option.select.class.option.selected : 'vanilla-select__option_selected',
					disabled: option?.select?.class?.option?.disabled ? option.select.class.option.disabled : 'vanilla-select__option_disabled',
					hidden: option?.select?.class?.option?.hidden ? option.select.class.option.hidden : 'vanilla-select__option_hidden',
				},
			},
			show: false,
			multiple: {
				text: option?.select?.multiple?.text ? option?.select?.multiple?.text : 'Выбрано:',
			},
		};
	}

	openSelect(select) {
		select.classList.add(this.select.class.select.show);
		this.select.show = true;
	}

	closeSelect(select) {
		select.classList.remove(this.select.class.select.show);
		this.select.show = false;
	}

	selectedMultipleOption(option, btn, selectArr, selectDefault, selectDefaultActive) {
		const lastOptionSelected = selectDefault.options[selectDefault.selectedIndex];

		if (lastOptionSelected && lastOptionSelected.hasAttribute('hidden')) lastOptionSelected.removeAttribute('selected');
		if (option.classList.contains(this.select.class.option.selected)) {
			option.classList.remove(this.select.class.option.selected);
			selectDefaultActive.removeAttribute('selected');
		} else {
			option.classList.add(this.select.class.option.selected);
			selectDefaultActive.setAttribute('selected', 'selected');
		}

		const selectDefaultActiveOptions = selectArr.filter((defaultOption) => defaultOption.hasAttribute('selected'));
		btn.innerText = `${this.select.multiple.text} ${selectDefaultActiveOptions.length}`;
	}

	selectedSingleOption(option, btn, parent, selectDefault, selectDefaultActive) {
		const optionActive = parent.querySelector(`.${this.select.class.option.default}.${this.select.class.option.selected}`);

		optionActive.classList.remove(this.select.class.option.selected);
		selectDefault.options[selectDefault.selectedIndex].removeAttribute('selected');

		option.classList.add(this.select.class.option.selected);
		btn.innerText = option.innerText;
		selectDefaultActive.setAttribute('selected', 'selected');
	}

	selectedOption(select, option) {
		if (option.classList.contains(this.select.class.option.disabled)) return;

		const parent = option.closest(`.${this.select.class.parent}`);
		const btn = parent.querySelector(`.${this.select.class.btn}`);
		const selectDefault = parent.querySelector('select');
		const selectArr = [...selectDefault.options];
		const selectDefaultActive = selectArr.find((defaultOption) => defaultOption.value === option.dataset.selectValue);

		if (select.classList.contains(this.select.class.select.multiple)) {
			this.selectedMultipleOption(option, btn, selectArr, selectDefault, selectDefaultActive);
		} else {
			this.selectedSingleOption(option, btn, parent, selectDefault, selectDefaultActive);
		}
	}

	hasClick() {
		document.addEventListener('click', (e) => {
			const btn = e.target.closest(`.${this.select.class.btn}`);
			if (!this.select.show && !btn) return;

			const select = e.target.closest(`.${this.select.class.select.default}`);
			const label = e.target.closest(`.${this.select.class.label}`);
			const list = e.target.closest(`.${this.select.class.list}`);
			const option = e.target.closest(`.${this.select.class.option.default}`);
			const selectActive = document.querySelector(`.${this.select.class.select.default}.${this.select.class.select.show}`);
			const btnActive = selectActive ? selectActive.querySelector(`.${this.select.class.btn}`) : undefined;

			if (!this.select.show && btn) {
				this.openSelect(select);
			} else if (this.select.show && btn && btn !== btnActive) {
				this.closeSelect(selectActive);
				this.openSelect(select);
			} else if (this.select.show && !list && !label) {
				this.closeSelect(selectActive);
			} else if (this.select.show && list && option) {
				this.selectedOption(select, e.target);
				if (!select.classList.contains(this.select.class.select.multiple)) this.closeSelect(selectActive);
			}
		});
	}

	createOption(list, btn, defaultParent) {
		const child = defaultParent.childNodes;

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < child.length; i++) {
			if (child[i].localName !== 'option') return;

			const defaultOption = child[i];
			const option = document.createElement('li');

			option.className = this.select.class.option.default;
			option.className += ` ${defaultOption.className}`;
			option.dataset.selectValue = defaultOption.value;
			option.innerText = defaultOption.innerText;

			if (defaultOption.hasAttribute('selected')) {
				option.className += ` ${this.select.class.option.selected}`;
				btn.innerText = option.innerText;
			}

			if (defaultOption.hasAttribute('disabled')) {
				option.className += ` ${this.select.class.option.disabled}`;
			}

			if (defaultOption.hasAttribute('hidden')) {
				option.className += ` ${this.select.class.option.hidden}`;
			}

			list.append(option);
		}
	}

	hasSelectedOption(defaultSelect, btn) {
		const selected = defaultSelect.querySelector('option[selected]');
		if (selected) return;

		if (!defaultSelect.hasAttribute('multiple')) {
			const options = defaultSelect.querySelectorAll('option');
			options[0].setAttribute('selected', 'selected');
		} else {
			btn.innerText = `${this.select.multiple.text} 0`;
		}
	}

	createListSelect(wrapper, btn, defaultParent) {
		const list = document.createElement('ul');
		list.className = this.select.class.list;
		wrapper.append(list);

		this.createOption(list, btn, defaultParent);
	}

	createGroupSelect(wrapper, btn, defaultSelect) {
		const optgroup = defaultSelect.querySelectorAll('optgroup');

		if (!optgroup.length) return;

		optgroup.forEach((defaultGroup) => {
			const group = document.createElement('div');
			group.className = this.select.class.group;
			wrapper.append(group);

			const label = document.createElement('b');
			label.className = this.select.class.label;
			label.innerText = defaultGroup.getAttribute('label');
			group.append(label);

			this.createListSelect(group, btn, defaultGroup);
		});
	}

	hasMultipleSelect(defaultSelect, select) {
		if (!defaultSelect.hasAttribute('multiple')) return;
		select.classList.add(this.select.class.select.multiple);
	}

	createSelect() {
		this.select.default.elements.forEach((defaultSelect) => {
			const parent = document.createElement('div');
			parent.className = this.select.class.parent;
			defaultSelect.after(parent);
			parent.append(defaultSelect);

			const select = document.createElement('div');
			select.className = this.select.class.select.default;
			select.className += ` ${defaultSelect.className}`;
			parent.append(select);

			const btn = document.createElement('button');
			btn.className = this.select.class.btn;
			btn.setAttribute('type', 'button');
			select.append(btn);

			const wrapper = document.createElement('div');
			wrapper.className = this.select.class.wrapper;
			select.append(wrapper);

			this.hasSelectedOption(defaultSelect, btn);
			this.createListSelect(wrapper, btn, defaultSelect);
			this.createGroupSelect(wrapper, btn, defaultSelect);
			this.hasMultipleSelect(defaultSelect, select);
		});
	}

	hasSelector() {
		this.select.default.elements = document.querySelectorAll(this.select.default.selector);
		if (!this.select.default.elements[0]) return;

		this.createSelect();
		this.hasClick();
	}

	init() {
		this.hasSelector();
	}
}

export default Select;
