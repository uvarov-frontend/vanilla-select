class Select {
	constructor(option) {
		this.select = {
			custom: {
				selector: option?.select?.custom?.selector ? option.select.custom.selector : 'select',
				elements: undefined,
			},
			class: {
				parent: option?.select?.class?.parent ? option.select.class.parent : 'vanilla-select-wrapper',
				select: {
					default: option?.select?.class?.select?.default ? option.select.class.select.default : 'vanilla-select',
					show: option?.select?.class?.select?.show ? option.select.class.select.show : 'vanilla-select_show',
				},
				btn: option?.select?.class?.btn ? option.select.class.btn : 'vanilla-select__btn',
				list: option?.select?.class?.list ? option.select.class.list : 'vanilla-select__list',
				option: {
					default: option?.select?.class?.option?.default ? option.select.class.option.default : 'vanilla-select__option',
					selected: option?.select?.class?.option?.selected ? option.select.class.option.selected : 'vanilla-select__option_selected',
					disabled: option?.select?.class?.option?.disabled ? option.select.class.option.disabled : 'vanilla-select__option_disabled',
					hidden: option?.select?.class?.option?.hidden ? option.select.class.option.hidden : 'vanilla-select__option_hidden',
				},
			},
			show: false,
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

	optionSelected(option) {
		if (option.classList.contains(this.select.class.option.disabled)) return;

		const parent = option.closest(`.${this.select.class.parent}`);
		const selectDefault = parent.querySelector('select');
		const btn = parent.querySelector(`.${this.select.class.btn}`);
		const optionActive = parent.querySelector(`.${this.select.class.option.default}.${this.select.class.option.selected}`);

		optionActive.classList.remove(this.select.class.option.selected);
		selectDefault.options[selectDefault.selectedIndex].removeAttribute('selected');

		btn.innerText = option.innerText;
		option.classList.add(this.select.class.option.selected);

		const selectArr = [...selectDefault.options];
		const selectDefaultActive = selectArr.find((optionDefault) => optionDefault.value === option.dataset.selectValue);
		selectDefaultActive.setAttribute('selected', 'selected');
	}

	hasClick() {
		document.addEventListener('click', (e) => {
			const btn = e.target.classList.contains(this.select.class.btn);
			if (!this.select.show && !btn) return;

			const select = e.target.closest(`.${this.select.class.select.default}`);
			const list = e.target.closest(`.${this.select.class.list}`);
			const option = e.target.closest(`.${this.select.class.option.default}`);
			const selectActive = document.querySelector(`.${this.select.class.select.default}.${this.select.class.select.show}`);
			const btnActive = selectActive ? selectActive.querySelector(`.${this.select.class.btn}`) : undefined;

			if (!this.select.show && btn) {
				this.openSelect(select);
			} else if (this.select.show && btn && e.target !== btnActive) {
				this.closeSelect(selectActive);
				this.openSelect(select);
			} else if (this.select.show && !list) {
				this.closeSelect(selectActive);
			} else if (this.select.show && list && option) {
				this.optionSelected(e.target);
				this.closeSelect(selectActive);
			}
		});
	}

	createOption(list, btn, customSelect) {
		const selected = customSelect.querySelector('option[selected]');
		if (!selected) customSelect.childNodes[0].setAttribute('selected', 'selected');

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < customSelect.childNodes.length; i++) {
			const optionDefault = customSelect.childNodes[i];
			const option = document.createElement('li');

			option.className = this.select.class.option.default;
			option.className += ` ${optionDefault.className}`;
			option.dataset.selectValue = optionDefault.value;
			option.innerText = optionDefault.innerText;

			if (optionDefault.hasAttribute('selected')) {
				option.className += ` ${this.select.class.option.selected}`;
				btn.innerText = option.innerText;
			}

			if (optionDefault.hasAttribute('disabled')) {
				option.className += ` ${this.select.class.option.disabled}`;
			}

			if (optionDefault.hasAttribute('hidden')) {
				option.className += ` ${this.select.class.option.hidden}`;
			}

			list.append(option);
		}
	}

	createSelect() {
		this.select.custom.elements.forEach((customSelect) => {
			const parent = document.createElement('div');
			parent.className = this.select.class.parent;
			customSelect.after(parent);
			parent.append(customSelect);

			const select = document.createElement('div');
			select.className = this.select.class.select.default;
			select.className += ` ${customSelect.className}`;
			parent.append(select);

			const btn = document.createElement('button');
			btn.className = this.select.class.btn;
			btn.setAttribute('type', 'button');
			select.append(btn);

			const list = document.createElement('ul');
			list.className = this.select.class.list;
			select.append(list);

			this.createOption(list, btn, customSelect);
		});
	}

	hasSelector() {
		this.select.custom.elements = document.querySelectorAll(this.select.custom.selector);
		if (!this.select.custom.elements[0]) return;

		// eslint-disable-next-line no-return-assign
		this.select.custom.elements.forEach((select) => select.style.display = 'none');

		this.createSelect();
		this.hasClick();
	}

	init() {
		this.hasSelector();
	}
}

export default Select;
