// ===== Animation on scroll ========================================================================================================================================================

/* @@include('animation-on-scroll.js */

// ===== Burger ========================================================================================================================================================

const burger = document.querySelector('.icon-menu');

burger.addEventListener('click', () => {
	const sectionTitle = document.querySelector('.section-title');
	const menuList = document.querySelector('.dropdown-menu__list');
	const flex = document.querySelector('.flex-size-2');

	document.body.classList.toggle('hidden');
	menuList.classList.toggle('active');
	flex.classList.toggle('active');
	burger.classList.toggle('active');
	sectionTitle.classList.toggle('active');
}); 

// ===== Dinamic adaptive ========================================================================================================================================================

// Dynamic Adapt v. 1.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle
// copy from github 02.06.2020

// ===== recoding ========================================================================================================================================================

// Dynamic Adapt v. 1.2
// HTML data-da="where(uniq class name), position(digi), when(breakpoint), mobile first or computer first('min' or 'max'), when back (second breakpoint)"
// e.x. data-da="item, 2, 992, max, 768"
// Artyom Rassadin 2021
// My brains
// copy from my head 22.02.2021

// ===== /recoding ========================================================================================================================================================

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];

	// Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');

			if (daMove != '') {
				const daArray = daMove.split(','); // разбиваем массив
				const daPlace = daArray[1] ? daArray[1].trim() : 'last'; // место в какое по счету перемещаем
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767'; // на каком разрешении перемещаем
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daSecondBreakpoint = daArray[4] ? daArray[4].trim() : '';

				const daDestination = document.querySelector('.' + daArray[0].trim()) // место куда перемещаем ( элемент в DOM-дереве )

				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);

					// Заполняем массив первоначальных позиций

					originalPositions[number] = {
						"parent": daElement.parentNode, // получаем родителя
						"index": indexInParent(daElement) // получаем индекс ЭТОГО элемента в элементе РОДИТЕЛЯ
					};

					// Заполняем массив элементов

					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType,
						"secondBreakpoint": daSecondBreakpoint,
					}

					number++;
				}
			}
		}

		dynamicAdaptSort(daElementsArray);

		// Создаем события в точке брейкпоинта

		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;
			const daSecondBreakpoint = el.secondBreakpoint;
				
			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px) and (min-width: " + daSecondBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}

	// Основная функция
	
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element; // сам элемент
			const daDestination = el.destination; // то куда перебрасываем элемент
			const daPlace = el.place; // место в какое по счету перемещаем
			const daBreakpoint = el.breakpoint; // на каком брейкпоинте перемещаем элемент
			const daSecondBreakpoint = el.secondBreakpoint;

			const daClassname = "_dynamic_adapt_" + daBreakpoint; // создание нейминга класса

			if (daMatchMedia[index].matches) {
				// Перебрасываем элементы
				if (!daElement.classList.contains(daClassname) && document.body.clientWidth > daSecondBreakpoint) {
					let actualIndex = indexOfElements(daDestination)[daPlace];

					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}

					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				// Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}

				if (document.body.clientWidth <= daSecondBreakpoint || document.body.clientWidth > daBreakpoint) {
					dynamicAdaptBack(daElement);
				}
			}
		}

		customAdapt();
	}

	// Вызов основной функции

	dynamicAdapt();

	// Функция возврата на место

	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex]; // получаем расположение элемента 
		const parentPlace = originalPlace['parent']; // получаем родителя элемента
		const indexPlace = originalPlace['index']; // получаем индекс этого элемента в элементе родителя
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace]; // определенный элемент из функции получения массива индексов элементов внутри родителя
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]); // создаем новый элемент с каким-либо HTML-кодом
	}

	// Функция получения индекса внутри родителя

	function indexInParent(el) {
		let children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}

	// Функция получения массива индексов элементов внутри родителя 

	function indexOfElements(parent, back) {
		const children = parent.children; // получение всех детей в виде коллекции
		const childrenArray = []; 

		for (let i = 0; i < children.length; i++) { // перебираем каждый из детей
			const childrenElement = children[i]; // получаем одного из детей из коллекции

			if (back) {
				childrenArray.push(i);
			} else {
				// Исключая перенесенный элемент

				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}

		return childrenArray;
	}

	// Сортировка объекта

	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}

	// Дополнительные сценарии адаптации

	function customAdapt() {
		// const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());; 

// ===== noUiSlider ===========================================================================================================================================================

// Подключать непосредственно выше этого файла в основом проекте

// ===== Slider ========================================================================================================================================================

let swiper = new Swiper('.slider', {
	slidesPerView: 14,

	navigation: {
		nextEl: '.swiper-button-next-1',
    	prevEl: '.swiper-button-prev-1',	
	},

	breakpoints: {
		1225: {
			slidesPerView: 14,
		}, 

		1150: {
			slidesPerView: 10,
		},

		992: {
			slidesPerView: 7,
		},

		768: {
			slidesPerView: 5,
		},

		450: {
			slidesPerView: 4,
			slidesPerGroup: 2,
		},

		320: {
			slidesPerView: 2,
			slidesPerGroup: 2,
		}
	}
})
;

// ===== Number animation with slow motion ========================================================================================================================================================

/* let animationTime = 1000; // ms
let numb = 150;
let step = 1;
let value = animationTime / numb / step;
let i = 0;
let number = 0;

function animation(num, elem) {
	let timeout = setTimeout(() => {
		if (num >= number) {
			if (i > numb / step - 15) { // замедление "15" нужно менять
				value += 10;
			}
			i++;

			elem.firstChild.innerHTML = number; // изменение числа
			number += step;
			animation(num, elem);
		} else if (num < number) {
			clearTimeout(timeout)
		}
	}, value)
}; */

// ===== Dropdown menu ========================================================================================================================================================

 let isMobile = {
	Android: function() {return navigator.userAgent.match(/Android/i);},
	BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
	iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
	Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
	Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
	any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};

let body = document.querySelector('body');

if (isMobile.any()) { // открываем и закрываем выпадающее меню

	body.classList.add('touch');
	let arrow = document.querySelectorAll('.dropdown-menu__li');
	let i = 0;

	while (i < arrow.length) {
		let thisLink = arrow[i].children[0];
		let subMenu = arrow[i].children[1];
		let thisArrow = arrow[i].children[0].children[0];
		arrow[i].classList.toggle('open')
		thisLink.classList.add('parent');

		arrow[i].addEventListener('click', function() {

			let subMenuElements = document.querySelectorAll('.sub-dropdown-menu.open');

			for (let elem of subMenuElements) {
				if (elem != subMenu) {
					let previousChildren = elem.previousElementSibling.children[0];
					
					previousChildren.classList.remove('active');
					elem.classList.remove('open')
				}
			}

			subMenu.classList.toggle('open');
			thisArrow.classList.toggle('active');
		});

		i++;
	}

} else {
	body.classList.add('mouse');
}; ;

let countries = document.querySelector('.cursor');

countries.addEventListener('click', (event) => {
	let country = document.querySelector('.header__dropdown-countries');
	let headerCountry = document.querySelector('.header__country');

	country.classList.toggle("toggle");
	headerCountry.classList.toggle('toggle')
	if (document.body.clientWidth > 650) {
		country.style.width = countries.clientWidth + 19 + 'px';
	} else {
		country.style.width = document.body.clientWidth - 20 + 'px';
	}
})

let ulCountries = document.querySelectorAll('.countries__country');

for (let elem of ulCountries) {
	elem.addEventListener('click', (event) => {
		let countryActive = document.querySelector('.header__country');
			countryFooterActive = document.querySelector('.footer__country');
			countryFooterInfo = elem.getAttribute('data-info');

		countryActive.innerHTML = elem.innerHTML;
		countryFooterActive.innerHTML = `${elem.innerHTML} ( ${countryFooterInfo} )`
	})
}

// ===== align-items(title) ========================================================================================================================================================

let sectionTitle = document.querySelector('.section-title');
	sectionWrapper = document.querySelector('.section-wrapper');
	headerContent = document.querySelector('.header');

sectionTitle.style.height = sectionWrapper.clientHeight - headerContent.clientHeight + 'px';

window.onresize = () => {
    sectionTitle.style.height = sectionWrapper.clientHeight - headerContent.clientHeight + 'px';
}

sectionTitle.style.display = 'flex';
sectionTitle.style.alignItems = 'center';

// ===== block-games ========================================================================================================================================================

window.onload = () => {
	let blockGames = document.querySelector('.block-games.none-icon');

	let blockGamesWrapper = blockGames.querySelector('.block-games__wrapper-1');
	let blockGamesIcon = blockGames.querySelector('.block-games__icon');

	if (blockGamesIcon && document.body.clientWidth > 992) {
		blockGamesWrapper.style.height = blockGames.clientHeight - blockGamesIcon.clientHeight + 'px';
		window.onresize = () => {
			blockGamesWrapper.style.height = blockGames.clientHeight - blockGamesIcon.clientHeight + 'px';
		}
	} else {
		blockGamesIcon.style.height = blockGamesWrapper.clientHeight + 'px';
		
		window.onresize = () => {
			blockGamesIcon.style.height = blockGamesWrapper.clientHeight + 'px';
		}
	}

	window.onresize = () => {
		if (blockGamesIcon && document.body.clientWidth > 992) {
			blockGamesWrapper.style.height = blockGames.clientHeight - blockGamesIcon.clientHeight + 'px';
		} else {
			blockGamesIcon.style.height = blockGamesWrapper.clientHeight + 'px';
			blockGamesWrapper.style.height = blockGamesIcon.clientHeight + 'px';
		}
	}

	let blockGamesWrapper1 = document.querySelector('.block-games:first-child .block-games__wrapper');

	if (document.body.clientWidth < 550) {
		blockGamesWrapper1.classList.add('other-color');
	}

	window.onresize = () => {
		if (document.body.clientWidth < 550 && !blockGamesWrapper1.classList.contains('other-color')) {
			blockGamesWrapper1.classList.add('other-color');
		} else if (document.body.clientWidth >= 550) {
			if (blockGamesWrapper1.classList.contains('other-color')) {
				blockGamesWrapper1.classList.remove('other-color')		
			}
		}
	}

	// ===== item-workUs ========================================================================================================================================================

	let itemWorkUs = document.querySelectorAll(".item-workUs");
		i = 0;

	for (let item of itemWorkUs) {
		if (i < item.clientHeight) {
			i = item.clientHeight;
		}
	}

	for (let item of itemWorkUs) {
		if (item.clientHeight < i) {
			item.style.height = i + 'px';
		}
	}

	window.onresize = () => {
		if (document.body.clientWidth > 1100) {
			i = 0;

			for (let item of itemWorkUs) {
				if (i < item.clientHeight) {
					i = item.clientHeight;
				}
			}

			for (let item of itemWorkUs) {
				if (item.clientHeight < i) {
					item.style.height = i + 'px';
				}
			}
		} else {
			for (let item of itemWorkUs) {
				item.style.height = null;
			}
		}
	}

	// ===== blog ========================================================================================================================================================

	if (document.body.clientWidth > 767.98) {
		let itemBlog = document.querySelectorAll('.special');
		let j = 0;

		for (let item of itemBlog) {
			if (j < item.clientHeight) {
				j = item.clientHeight;
			}
		}

		for (let item of itemBlog) {
			if (item.clientHeight < j) {
				item.style.height = j + 'px';
			}
		}
	}

	window.onresize = () => {
		if (document.body.clientWidth > 767.98) {
			let itemBlog = document.querySelectorAll('.special');
			let j = 0;

			for (let item of itemBlog) {
				if (j < item.clientHeight) {
					j = item.clientHeight;
				}
			}

			for (let item of itemBlog) {
				if (item.clientHeight < j) {
					item.style.height = j + 'px';
				}
			}
		} else if (document.body.clientWidth <= 767.98) {
			let itemBlog = document.querySelectorAll('.special');
			for (let item of itemBlog) {
				item.style.height = null;
			}
		}
	}
}

// ===== swiper-slider ========================================================================================================================================================

let swiperSlide = document.querySelectorAll('.swiper__icon');
	swiperContentDiv = document.querySelector('.swiper__name')
	swiperContentSpan = document.querySelector('.swiper__profession');

for (let elem of swiperSlide) {
	elem.addEventListener('click', (event) => {
		swiperContentDiv.innerHTML = '';
		swiperContentSpan.innerHTML = '';

		for (let item of swiperSlide) {
			if (item.classList.contains('active')) {
				item.classList.remove('active')
			}
		}

		elem.classList.add('active')

		let text = elem.alt;
			array = text.split(',');

			swiperContentDiv.innerHTML = `<div>${array[0]},<span>${array[1]}</span></div>`;
	})
}

// ===== Ellipsis ========================================================================================================================================================

!function(){"use strict";function a(a){var c=k(b,a||{});this.create(c),this.add()}var b={ellipsis:"…",debounce:0,responsive:!0,className:".clamp",lines:2,portrait:null,break_word:!0},c=0,d=!!window.requestAnimationFrame,e=function(){return c+=1},f=function(a,b){a.setAttribute("data-ellipsis-id",b)},g=function(a){return a.getAttribute("data-ellipsis-id")},h=function(a,b){var c=e();f(b,c),a[c]=a[c]||{},a[c].element=b,a[c].innerHTML=b.innerHTML},i=function(a,b){return a?a[g(b)]:null},j=function(a){return Object.keys(a).map(function(b,c){return a[b].element})},k=function(a,b){var c={};for(var d in a)c[d]=a[d];for(var e in b)c[e]=b[e];return c};a.prototype={conf:{},prop:{},lines:{},temp:null,listener:null,create:function(a){if(this.conf=a,this.lines={get current(){return a.portrait&&window.innerHeight>window.innerWidth?a.portrait:a.lines}},this.conf.responsive){this.temp={};var b,c=this.conf.debounce;if(d&&!c){this._isScheduled=!1;var e=this;b=function(a){e._isScheduled||(e._isScheduled=!0,window.requestAnimationFrame(function(){e._isScheduled=!1,e.add(j(e.temp))}))}}else{c=c||16;var f;b=function(a){clearTimeout(f),f=setTimeout(function(){this.add(j(this.temp))}.bind(this),c)}}this.listener=b.bind(this),window.addEventListener("resize",this.listener,!1),window.removeEventListener("beforeunload",this.listener,!1)}},destroy:function(){this.listener&&window.removeEventListener("resize",this.listener,!1)},createProp:function(a){this.prop={get height(){var b=a.getBoundingClientRect();return parseInt(b.bottom-b.top,10)},get lineheight(){var b=getComputedStyle(a).getPropertyValue("line-height");return String("normal|initial|inherit").indexOf(b)>-1&&(b=parseInt(getComputedStyle(a).getPropertyValue("font-size"),10)+2),parseInt(b,10)}}},add:function(a){if(!a&&this.conf.className&&(a=document.querySelectorAll(this.conf.className)),a)if(a.length)for(var b=0;b<a.length;b++)this.addElement(a[b]);else void 0===a.length&&this.addElement(a)},addElement:function(a){if(this.conf.responsive){var b=i(this.temp,a);b?a.innerHTML!==b.innerHTML&&(a.innerHTML=b.innerHTML):h(this.temp,a)}this.createProp(a),this.isNotCorrect()&&(a.childNodes.length&&a.childNodes.length>1?this.handleChildren(a):a.childNodes.length&&1===a.childNodes.length&&3===a.childNodes[0].nodeType&&this.simpleText(a))},breakWord:function(a,b,c){var d=a.split(" ");if(d.pop(),c&&d.pop(),!b)return d[d.length-1]&&(d[d.length-1]=d[d.length-1].replace(/(,$)/g,"").replace(/(\.$)/g,"")),d.push(this.conf.ellipsis),d.join(" ");if(d[d.length-1])return d[d.length-1]=d[d.length-1].replace(/(,$)/g,"").replace(/(\.$)/g,""),d.push(this.conf.ellipsis),[d.join(" "),b];if(!d[d.length-1]&&b){var e=" "+b.trim().replace(/(,$)/g,"").replace(/(\.$)/g,"")+" ";return d.push(this.conf.ellipsis),[d.join(" "),e]}},simpleText:function(a){for(var b=a.childNodes[0].nodeValue;this.prop.height>this.prop.lineheight*this.lines.current;)a.childNodes[0].nodeValue=b.slice(0,-1),b=a.childNodes[0].nodeValue;this.conf.break_word?(a.childNodes[0].nodeValue=b.slice(0,-this.conf.ellipsis.length)+this.conf.ellipsis,this.isNotCorrect()&&(a.childNodes[0].nodeValue=" "+a.childNodes[0].nodeValue.slice(0,-(this.conf.ellipsis.length+1)).trim().slice(0,-this.conf.ellipsis.length)+this.conf.ellipsis)):(a.childNodes[0].nodeValue=this.breakWord(a.childNodes[0].nodeValue),this.isNotCorrect()&&(a.childNodes[0].nodeValue=this.breakWord(a.childNodes[0].nodeValue,null,!0)))},isNotCorrect:function(){return this.prop.height>this.prop.lineheight*this.lines.current},processBreak:function(a,b,c){var d=this.breakWord(a.innerText||a.nodeValue,b.innerText||b.nodeValue,c);a.innerText?a.innerText=d[0]:a.nodeValue=d[0],b.innerText?b.innerText=d[1]:b.nodeValue=d[1]},handleChildren:function(a){for(var b,c=a.childNodes,d=c.length-1;d>=0;d--){var e;if(8!==c[d].nodeType){if(3===c[d].nodeType?(e=c[d].nodeValue,c[d].nodeValue=""):(e=getComputedStyle(c[d]).getPropertyValue("display"),c[d].style.display="none"),this.prop.height<=this.prop.lineheight*this.lines.current){if(3===c[d].nodeType){for(c[d].nodeValue=e,b=c[d].nodeValue;this.prop.height>this.prop.lineheight*this.lines.current;)c[d].nodeValue=b.slice(0,-1),b=c[d].nodeValue;if(this.conf.break_word){if(c[d].nodeValue=b.slice(0,-this.conf.ellipsis.length)+this.conf.ellipsis,this.isNotCorrect()){if(c[d].nodeValue=" "+c[d].nodeValue.slice(0,-this.conf.ellipsis.length).trim().slice(0,-this.conf.ellipsis.length),!(c[d].nodeValue.length>1))continue;c[d].nodeValue=c[d].nodeValue.slice(0,-this.conf.ellipsis.length)+this.conf.ellipsis}}else{if(!c[d].innerText&&!c[d].nodeValue)continue;if(this.processBreak(c[d],c[d-1]),this.isNotCorrect()&&(this.processBreak(c[d],c[d-1],!0),this.isNotCorrect())){a.removeChild(c[d]);continue}}}else{for(c[d].style.display=e,b=c[d].innerText;this.prop.height>this.prop.lineheight*this.lines.current;)c[d].innerText=b.slice(0,-1),b=c[d].innerText;if(this.conf.break_word){if(c[d].innerText=b.slice(0,-this.conf.ellipsis.length)+this.conf.ellipsis,this.isNotCorrect()){if(c[d].innerText=" "+c[d].innerText.slice(0,-this.conf.ellipsis.length).trim().slice(0,-this.conf.ellipsis.length),!(c[d].innerText.length>1))continue;c[d].innerText=c[d].innerText.slice(0,-this.conf.ellipsis.length)+this.conf.ellipsis}}else{if(!c[d].innerText&&!c[d].nodeValue)continue;if(this.processBreak(c[d],c[d-1]),this.isNotCorrect()&&(this.processBreak(c[d],c[d-1],!0),this.isNotCorrect())){a.removeChild(c[d]);continue}}}break}a.removeChild(c[d])}}}};var l=function(b){return new a(b)};"function"==typeof define&&define.amd&&define("ellipsis",[],function(){return l}),self.Ellipsis=l}();;

Ellipsis({
  ellipsis: '…', //default ellipsis value
  debounce: 0, //if you want to chill out your memory usage on resizing
  responsive: true, //if you want the ellipsis to move with the window resizing
  className: '.item-blog__date.modify', //default class to apply the ellipsis
  lines: 6, //default number of lines when the ellipsis will appear
  portrait: null, //default no change, put a number of lines if you want a different number of lines in portrait mode,
  break_word: true, //default the ellipsis can truncate words
});