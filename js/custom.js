/*
 * jQuery Form Styler v1.5.1
 * https://github.com/Dimox/jQueryFormStyler
 *
 * Copyright 2012-2014 Dimox (http://dimox.name/)
 * Released under the MIT license.
 *
 * Date: 2014.05.03
 *
 */

(function($) {
	$.fn.styler = function(opt) {

		var opt = $.extend({
			wrapper: 'form',
			idSuffix: '-styler',
			filePlaceholder: 'Файл не выбран',
			fileBrowse: 'Обзор...',
			selectSearch: true,
			selectSearchLimit: 10,
			selectSearchNotFound: 'Совпадений не найдено',
			selectSearchPlaceholder: 'Поиск...',
			selectVisibleOptions: 0,
			singleSelectzIndex: '100',
			selectSmartPositioning: true,
			onSelectOpened: function() {},
			onSelectClosed: function() {},
			onFormStyled: function() {}
		}, opt);

		return this.each(function() {
			var el = $(this);

			function attributes() {
				var id = '',
						title = '',
						classes = '',
						dataList = '';
				if (el.attr('id') !== undefined && el.attr('id') != '') id = ' id="' + el.attr('id') + opt.idSuffix + '"';
				if (el.attr('title') !== undefined && el.attr('title') != '') title = ' title="' + el.attr('title') + '"';
				if (el.attr('class') !== undefined && el.attr('class') != '') classes = ' ' + el.attr('class');
				var data = el.data();
				for (var i in data) {
					if (data[i] != '') dataList += ' data-' + i + '="' + data[i] + '"';
				}
				id += dataList;
				this.id = id;
				this.title = title;
				this.classes = classes;
			}

			// checkbox
			if (el.is(':checkbox')) {
				el.each(function() {
					if (el.parent('div.jq-checkbox').length < 1) {

						function checkbox() {

							var att = new attributes();
							var checkbox = $('<div' + att.id + ' class="jq-checkbox' + att.classes + '"' + att.title + '><div class="jq-checkbox__div"></div></div>');

							// прячем оригинальный чекбокс
							el.css({
								position: 'absolute',
								zIndex: '-1',
								opacity: 0,
								margin: 0,
								padding: 0
							}).after(checkbox).prependTo(checkbox);

							checkbox.attr('unselectable', 'on').css({
								'-webkit-user-select': 'none',
								'-moz-user-select': 'none',
								'-ms-user-select': 'none',
								'-o-user-select': 'none',
								'user-select': 'none',
								display: 'inline-block',
								position: 'relative',
								overflow: 'hidden'
							});

							if (el.is(':checked')) checkbox.addClass('checked');
							if (el.is(':disabled')) checkbox.addClass('disabled');

							// клик на псевдочекбокс
							checkbox.click(function() {
								if (!checkbox.is('.disabled')) {
									if (el.is(':checked')) {
										el.prop('checked', false);
										checkbox.removeClass('checked');
									} else {
										el.prop('checked', true);
										checkbox.addClass('checked');
									}
									el.change();
									return false;
								} else {
									return false;
								}
							});
							// клик на label
							el.closest('label').add('label[for="' + el.attr('id') + '"]').click(function(e) {
								checkbox.click();
								e.preventDefault();
							});
							// переключение по Space или Enter
							el.change(function() {
								if (el.is(':checked')) checkbox.addClass('checked');
								else checkbox.removeClass('checked');
							})
							// чтобы переключался чекбокс, который находится в теге label
							.keydown(function(e) {
								if (e.which == 32) checkbox.click();
							})
							.focus(function() {
								if (!checkbox.is('.disabled')) checkbox.addClass('focused');
							})
							.blur(function() {
								checkbox.removeClass('focused');
							})

						} // end checkbox()

						checkbox();

						// обновление при динамическом изменении
						el.on('refresh', function() {
							el.parent().before(el).remove();
							checkbox();
						});

					}
				});
			// end checkbox

			// radio
			} else if (el.is(':radio')) {
				el.each(function() {
					if (el.parent('div.jq-radio').length < 1) {

						function radio() {

							var att = new attributes();
							var radio = $('<div' + att.id + ' class="jq-radio' + att.classes + '"' + att.title + '><div class="jq-radio__div"></div></div>');

							// прячем оригинальную радиокнопку
							el.css({
								position: 'absolute',
								zIndex: '-1',
								opacity: 0,
								margin: 0,
								padding: 0
							}).after(radio).prependTo(radio);

							radio.attr('unselectable', 'on').css({
								'-webkit-user-select': 'none',
								'-moz-user-select': 'none',
								'-ms-user-select': 'none',
								'-o-user-select': 'none',
								'user-select': 'none',
								display: 'inline-block',
								position: 'relative'
							});

							if (el.is(':checked')) radio.addClass('checked');
							if (el.is(':disabled')) radio.addClass('disabled');

							// клик на псевдорадиокнопке
							radio.click(function() {
								if (!radio.is('.disabled')) {
									radio.closest(opt.wrapper).find('input[name="' + el.attr('name') + '"]').prop('checked', false).parent().removeClass('checked');
									el.prop('checked', true).parent().addClass('checked');
									el.change();
									return false;
								} else {
									return false;
								}
							});
							// клик на label
							el.closest('label').add('label[for="' + el.attr('id') + '"]').click(function(e) {
								radio.click();
								e.preventDefault();
							});
							// переключение стрелками
							el.change(function() {
								el.parent().addClass('checked');
							})
							.focus(function() {
								if (!radio.is('.disabled')) radio.addClass('focused');
							})
							.blur(function() {
								radio.removeClass('focused');
							})

						} // end radio()

						radio();

						// обновление при динамическом изменении
						el.on('refresh', function() {
							el.parent().before(el).remove();
							radio();
						});

					}
				});
			// end radio

			// file
			} else if (el.is(':file')) {
				// прячем оригинальное поле
				el.css({
					position: 'absolute',
					top: 0,
					right: 0,
					width: '100%',
					height: '100%',
					opacity: 0,
					margin: 0,
					padding: 0
				}).each(function() {
					if (el.parent('div.jq-file').length < 1) {

						function file() {

							var att = new attributes();
							var file = $('<div' + att.id + ' class="jq-file' + att.classes + '"' + att.title + ' style="display: inline-block; position: relative; overflow: hidden"></div>');
							var name = $('<div class="jq-file__name">' + opt.filePlaceholder + '</div>').appendTo(file);
							var browse = $('<div class="jq-file__browse">' + opt.fileBrowse + '</div>').appendTo(file);
							el.after(file);
							file.append(el);
							if (el.is(':disabled')) file.addClass('disabled');
							el.change(function() {
								name.text(el.val().replace(/.+[\\\/]/, ''));
								if (el.val() == '') {
									name.text(opt.filePlaceholder);
									file.removeClass('changed');
								} else {
									file.addClass('changed');
								}
							})
							.focus(function() {
								file.addClass('focused');
							})
							.blur(function() {
								file.removeClass('focused');
							})
							.click(function() {
								file.removeClass('focused');
							})

						} // end file()

						file();

						// обновление при динамическом изменении
						el.on('refresh', function() {
							el.parent().before(el).remove();
							file();
						})

					}
				});
			// end file

			// select
			} else if (el.is('select')) {
				el.each(function() {
					if (el.parent('div.jqselect').length < 1) {

						function selectbox() {

							// запрещаем прокрутку страницы при прокрутке селекта
							function preventScrolling(selector) {
								selector.off('mousewheel DOMMouseScroll').on('mousewheel DOMMouseScroll', function(e) {
									var scrollTo = null;
									if (e.type == 'mousewheel') { scrollTo = (e.originalEvent.wheelDelta * -1); }
									else if (e.type == 'DOMMouseScroll') { scrollTo = 40 * e.originalEvent.detail; }
									if (scrollTo) {
										e.stopPropagation();
										e.preventDefault();
										$(this).scrollTop(scrollTo + $(this).scrollTop());
									}
								});
							}

							var option = $('option', el);
							var list = '';
							// формируем список селекта
							function makeList() {
								for (i = 0, len = option.length; i < len; i++) {
									var li = '',
											liClass = '',
											dataList = '',
											optionClass = '',
											optgroupClass = '',
											dataJqfsClass = '';
									var disabled = 'disabled';
									var selDis = 'selected sel disabled';
									if (option.eq(i).prop('selected')) liClass = 'selected sel';
									if (option.eq(i).is(':disabled')) liClass = disabled;
									if (option.eq(i).is(':selected:disabled')) liClass = selDis;
									if (option.eq(i).attr('class') !== undefined) {
										optionClass = ' ' + option.eq(i).attr('class');
										dataJqfsClass = ' data-jqfs-class="' + option.eq(i).attr('class') + '"';
									}

									var data = option.eq(i).data();
									for (var k in data) {
										if (data[k] != '') dataList += ' data-' + k + '="' + data[k] + '"';
									}

									li = '<li' + dataJqfsClass + dataList + ' class="' + liClass + optionClass + '">'+ option.eq(i).text() +'</li>';

									// если есть optgroup
									if (option.eq(i).parent().is('optgroup')) {
										if (option.eq(i).parent().attr('class') !== undefined) optgroupClass = ' ' + option.eq(i).parent().attr('class');
										li = '<li' + dataJqfsClass + ' class="' + liClass + optionClass + ' option' + optgroupClass + '">'+ option.eq(i).text() +'</li>';
										if (option.eq(i).is(':first-child')) {
											li = '<li class="optgroup' + optgroupClass + '">' + option.eq(i).parent().attr('label') + '</li>' + li;
										}
									}

									list += li;
								}
							} // end makeList()

							// одиночный селект
							function doSelect() {
								var att = new attributes();
								var selectbox =
									$('<div' + att.id + ' class="jq-selectbox jqselect' + att.classes + '" style="display: inline-block; position: relative; z-index:' + opt.singleSelectzIndex + '">' +
											'<div class="jq-selectbox__select"' + att.title + ' style="position: relative">' +
												'<div class="jq-selectbox__select-text"></div>' +
												'<div class="jq-selectbox__trigger"><div class="jq-selectbox__trigger-arrow"></div></div>' +
											'</div>' +
										'</div>');

								el.css({margin: 0, padding: 0}).after(selectbox).prependTo(selectbox);

								var divSelect = $('div.jq-selectbox__select', selectbox);
								var divText = $('div.jq-selectbox__select-text', selectbox);
								var optionSelected = option.filter(':selected');

								// берем опцию по умолчанию
								if (optionSelected.length) {
									divText.html(optionSelected.text());
								} else {
									divText.html(option.first().text());
								}

								makeList();
								var searchHTML = '';
								if (opt.selectSearch) searchHTML =
									'<div class="jq-selectbox__search"><input type="search" autocomplete="off" placeholder="' + opt.selectSearchPlaceholder + '"></div>' +
									'<div class="jq-selectbox__not-found">' + opt.selectSearchNotFound + '</div>';
								var dropdown =
									$('<div class="jq-selectbox__dropdown" style="position: absolute">' +
											searchHTML +
											'<ul style="position: relative; list-style: none; overflow: auto; overflow-x: hidden">' + list + '</ul>' +
										'</div>');
								selectbox.append(dropdown);
								var ul = $('ul', dropdown);
								var li = $('li', dropdown);
								var search = $('input', dropdown);
								var notFound = $('div.jq-selectbox__not-found', dropdown).hide();
								if (li.length < opt.selectSearchLimit) search.parent().hide();

								// определяем самый широкий пункт селекта
								var liWidth1 = 0,
										liWidth2 = 0;
								li.each(function() {
									var l = $(this);
									l.css({'display': 'inline-block', 'white-space': 'nowrap'});
									if (l.innerWidth() > liWidth1) {
										liWidth1 = l.innerWidth();
										liWidth2 = l.width();
									}
									l.css({'display': 'block'});
								});

								// подстраиваем ширину псевдоселекта и выпадающего списка
								// в зависимости от самого широкого пункта
								var selClone = selectbox.clone().appendTo('body').width('auto');
								var selCloneWidth = selClone.width();
								selClone.remove();
								if (selCloneWidth == selectbox.width()) {
									divText.width(liWidth2);
									liWidth1 += selectbox.find('div.jq-selectbox__trigger').width();
								}
								if ( liWidth1 > selectbox.width() ) {
									dropdown.width(liWidth1);
								}

								// прячем оригинальный селект
								el.css({
									position: 'absolute',
									left: 0,
									top: 0,
									width: '100%',
									height: '100%',
									opacity: 0
								});

								var selectHeight = selectbox.outerHeight();
								var searchHeight = search.outerHeight();
								var isMaxHeight = ul.css('max-height');
								var liSelected = li.filter('.selected');
								if (liSelected.length < 1) li.first().addClass('selected sel');
								if (li.data('li-height') === undefined) li.data('li-height', li.outerHeight());
								var position = dropdown.css('top');
								if (dropdown.css('left') == 'auto') dropdown.css({left: 0});
								if (dropdown.css('top') == 'auto') dropdown.css({top: selectHeight});
								dropdown.hide();

								// если выбран не дефолтный пункт
								if (liSelected.length) {
									// добавляем класс, показывающий изменение селекта
									if (option.first().text() != optionSelected.text()) {
										selectbox.addClass('changed');
									}
									// передаем селекту класс выбранного пункта
									selectbox.data('jqfs-class', liSelected.data('jqfs-class'));
									selectbox.addClass(liSelected.data('jqfs-class'));
								}

								// если селект неактивный
								if (el.is(':disabled')) {
									selectbox.addClass('disabled');
									return false;
								}

								// при клике на псевдоселекте
								divSelect.click(function() {
									el.focus();

									// колбек при закрытии селекта
									if ($('div.jq-selectbox').filter('.opened').length) {
										opt.onSelectClosed.call($('div.jq-selectbox').filter('.opened'));
									}

									// если iOS, то не показываем выпадающий список
									var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
									if (iOS) return;

									// умное позиционирование
									if (opt.selectSmartPositioning) {
										var win = $(window);
										var topOffset = selectbox.offset().top;
										var bottomOffset = win.height() - selectHeight - (topOffset - win.scrollTop());
										var visible = opt.selectVisibleOptions;
										var liHeight = li.data('li-height');
										var	minHeight = liHeight * 5;
										var	newHeight = liHeight * visible;
										if (visible > 0 && visible < 6) minHeight = newHeight;
										if (visible == 0) newHeight = 'auto';

										// раскрытие вниз
										if (bottomOffset > (minHeight + searchHeight + 20))	{
											dropdown.height('auto').css({bottom: 'auto', top: position});
											function maxHeightBottom() {
												ul.css('max-height', Math.floor((bottomOffset - 20 - searchHeight) / liHeight) * liHeight);
											}
											maxHeightBottom();
											ul.css('max-height', newHeight);
											if (isMaxHeight != 'none') {
												ul.css('max-height', isMaxHeight);
											}
											if (bottomOffset < (dropdown.outerHeight() + 20)) {
												maxHeightBottom();
											}

										// раскрытие вверх
										} else {
											dropdown.height('auto').css({top: 'auto', bottom: position});
											function maxHeightTop() {
												ul.css('max-height', Math.floor((topOffset - win.scrollTop() - 20 - searchHeight) / liHeight) * liHeight);
											}
											maxHeightTop();
											ul.css('max-height', newHeight);
											if (isMaxHeight != 'none') {
												ul.css('max-height', isMaxHeight);
											}
											if ((topOffset - win.scrollTop() - 20) < (dropdown.outerHeight() + 20)) {
												maxHeightTop();
											}
										}
									}

									$('div.jqselect').css({zIndex: (opt.singleSelectzIndex - 1)}).removeClass('opened');
									selectbox.css({zIndex: opt.singleSelectzIndex});
									if (dropdown.is(':hidden')) {
										$('div.jq-selectbox__dropdown:visible').hide();
										dropdown.show();
										selectbox.addClass('opened focused');
										// колбек при открытии селекта
										opt.onSelectOpened.call(selectbox);
									} else {
										dropdown.hide();
										selectbox.removeClass('opened');
										// колбек при закрытии селекта
										if ($('div.jq-selectbox').filter('.opened').length) {
											opt.onSelectClosed.call(selectbox);
										}
									}

									// прокручиваем до выбранного пункта при открытии списка
									if (li.filter('.selected').length) {
										// если нечетное количество видимых пунктов,
										// то высоту пункта делим пополам для последующего расчета
										if ( (ul.innerHeight() / liHeight) % 2 != 0 ) liHeight = liHeight / 2;
										ul.scrollTop(ul.scrollTop() + li.filter('.selected').position().top - ul.innerHeight() / 2 + liHeight);
									}

									// поисковое поле
									if (search.length) {
										search.val('').keyup();
										notFound.hide();
										search.focus().keyup(function() {
											var query = $(this).val();
											li.each(function() {
												if (!$(this).html().match(new RegExp('.*?' + query + '.*?', 'i'))) {
													$(this).hide();
												} else {
													$(this).show();
												}
											});
											if (li.filter(':visible').length < 1) {
												notFound.show();
											} else {
												notFound.hide();
											}
										});
									}

									preventScrolling(ul);
									return false;
								});

								// при наведении курсора на пункт списка
								li.hover(function() {
									$(this).siblings().removeClass('selected');
								});
								var selectedText = li.filter('.selected').text();
								var selText = li.filter('.selected').text();

								// при клике на пункт списка
								li.filter(':not(.disabled):not(.optgroup)').click(function() {
									var t = $(this);
									var liText = t.text();
									if (selectedText != liText) {
										var index = t.index();
										if (t.is('.option')) index -= t.prevAll('.optgroup').length;
										t.addClass('selected sel').siblings().removeClass('selected sel');
										option.prop('selected', false).eq(index).prop('selected', true);
										selectedText = liText;
										divText.html(liText);

										// передаем селекту класс выбранного пункта
										if (selectbox.data('jqfs-class')) selectbox.removeClass(selectbox.data('jqfs-class'));
										selectbox.data('jqfs-class', t.data('jqfs-class'));
										selectbox.addClass(t.data('jqfs-class'));

										el.change();
									}
									if (search.length) {
										search.val('').keyup();
										notFound.hide();
									}
									dropdown.hide();
									selectbox.removeClass('opened');
									// колбек при закрытии селекта
									opt.onSelectClosed.call(selectbox);

								});
								dropdown.mouseout(function() {
									$('li.sel', dropdown).addClass('selected');
								});

								// изменение селекта
								el.change(function() {
									divText.html(option.filter(':selected').text());
									li.removeClass('selected sel').not('.optgroup').eq(el[0].selectedIndex).addClass('selected sel');
									// добавляем класс, показывающий изменение селекта
									if (option.first().text() != li.filter('.selected').text()) {
										selectbox.addClass('changed');
									} else {
										selectbox.removeClass('changed');
									}
								})
								.focus(function() {
									selectbox.addClass('focused');
									$('div.jqselect').removeClass('opened');
								})
								.blur(function() {
									selectbox.removeClass('focused');
								})
								// изменение селекта с клавиатуры
								.on('keydown keyup', function(e) {
									divText.html(option.filter(':selected').text());
									li.removeClass('selected sel').not('.optgroup').eq(el[0].selectedIndex).addClass('selected sel');
									// вверх, влево, PageUp
									if (e.which == 38 || e.which == 37 || e.which == 33) {
										dropdown.scrollTop(dropdown.scrollTop() + li.filter('.selected').position().top);
									}
									// вниз, вправо, PageDown
									if (e.which == 40 || e.which == 39 || e.which == 34) {
										dropdown.scrollTop(dropdown.scrollTop() + li.filter('.selected').position().top - dropdown.innerHeight() + liHeight);
									}
									// открываем выпадающий список при нажатии Space
									if (e.which == 32) {
										e.preventDefault();
										// можно было бы открывать через запуск divSelect.click(),
										// но почему-то список после открытия сразу закрывается
										// решение пока не найдено
										// divSelect.click();
									}
									// закрываем выпадающий список при нажатии Enter
									if (e.which == 13) {
										e.preventDefault();
										dropdown.hide();
									}
								});

								// прячем выпадающий список при клике за пределами селекта
								$(document).on('click', function(e) {
									// e.target.nodeName != 'OPTION' - добавлено для обхода бага в Opera на движке Presto
									// (при изменении селекта с клавиатуры срабатывает событие onclick)
									if (!$(e.target).parents().hasClass('jq-selectbox') && e.target.nodeName != 'OPTION') {

										// колбек при закрытии селекта
										if ($('div.jq-selectbox').filter('.opened').length) {
											opt.onSelectClosed.call($('div.jq-selectbox').filter('.opened'));
										}

										if (search.length) search.val('').keyup();
										dropdown.hide().find('li.sel').addClass('selected');
										selectbox.removeClass('focused opened');

									}
								});

							} // end doSelect()

							// мультиселект
							function doMultipleSelect() {
								var att = new attributes();
								var selectbox = $('<div' + att.id + ' class="jq-select-multiple jqselect' + att.classes + '"' + att.title + ' style="display: inline-block; position: relative"></div>');

								el.css({margin: 0, padding: 0}).after(selectbox);

								makeList();
								selectbox.append('<ul>' + list + '</ul>');
								var ul = $('ul', selectbox).css({
									'position': 'relative',
									'overflow-x': 'hidden',
									'-webkit-overflow-scrolling': 'touch'
								});
								var li = $('li', selectbox).attr('unselectable', 'on').css({'-webkit-user-select': 'none', '-moz-user-select': 'none', '-ms-user-select': 'none', '-o-user-select': 'none', 'user-select': 'none', 'white-space': 'nowrap'});
								var size = el.attr('size');
								var ulHeight = ul.outerHeight();
								var liHeight = li.outerHeight();
								if (size !== undefined && size > 0) {
									ul.css({'height': liHeight * size});
								} else {
									ul.css({'height': liHeight * 4});
								}
								if (ulHeight > selectbox.height()) {
									ul.css('overflowY', 'scroll');
									preventScrolling(ul);
									// прокручиваем до выбранного пункта
									if (li.filter('.selected').length) {
										ul.scrollTop(ul.scrollTop() + li.filter('.selected').position().top);
									}
								}

								// прячем оригинальный селект
								el.prependTo(selectbox).css({
									position: 'absolute',
									left: 0,
									top: 0,
									width: '100%',
									height: '100%',
									opacity: 0
								});

								// если селект неактивный
								if (el.is(':disabled')) {
									selectbox.addClass('disabled');
									option.each(function() {
										if ($(this).is(':selected')) li.eq($(this).index()).addClass('selected');
									});

								// если селект активный
								} else {

									// при клике на пункт списка
									li.filter(':not(.disabled):not(.optgroup)').click(function(e) {
										el.focus();
										selectbox.removeClass('focused');
										var clkd = $(this);
										if(!e.ctrlKey && !e.metaKey) clkd.addClass('selected');
										if(!e.shiftKey) clkd.addClass('first');
										if(!e.ctrlKey && !e.metaKey && !e.shiftKey) clkd.siblings().removeClass('selected first');

										// выделение пунктов при зажатом Ctrl
										if(e.ctrlKey || e.metaKey) {
											if (clkd.is('.selected')) clkd.removeClass('selected first');
												else clkd.addClass('selected first');
											clkd.siblings().removeClass('first');
										}

										// выделение пунктов при зажатом Shift
										if(e.shiftKey) {
											var prev = false,
													next = false;
											clkd.siblings().removeClass('selected').siblings('.first').addClass('selected');
											clkd.prevAll().each(function() {
												if ($(this).is('.first')) prev = true;
											});
											clkd.nextAll().each(function() {
												if ($(this).is('.first')) next = true;
											});
											if (prev) {
												clkd.prevAll().each(function() {
													if ($(this).is('.selected')) return false;
														else $(this).not('.disabled, .optgroup').addClass('selected');
												});
											}
											if (next) {
												clkd.nextAll().each(function() {
													if ($(this).is('.selected')) return false;
														else $(this).not('.disabled, .optgroup').addClass('selected');
												});
											}
											if (li.filter('.selected').length == 1) clkd.addClass('first');
										}

										// отмечаем выбранные мышью
										option.prop('selected', false);
										li.filter('.selected').each(function() {
											var t = $(this);
											var index = t.index();
											if (t.is('.option')) index -= t.prevAll('.optgroup').length;
											option.eq(index).prop('selected', true);
										});
										el.change();

									});

									// отмечаем выбранные с клавиатуры
									option.each(function(i) {
										$(this).data('optionIndex', i);
									});
									el.change(function() {
										li.removeClass('selected');
										var arrIndexes = [];
										option.filter(':selected').each(function() {
											arrIndexes.push($(this).data('optionIndex'));
										});
										li.not('.optgroup').filter(function(i) {
											return $.inArray(i, arrIndexes) > -1;
										}).addClass('selected');
									})
									.focus(function() {
										selectbox.addClass('focused');
									})
									.blur(function() {
										selectbox.removeClass('focused');
									});

									// прокручиваем с клавиатуры
									if (ulHeight > selectbox.height()) {
										el.keydown(function(e) {
											// вверх, влево, PageUp
											if (e.which == 38 || e.which == 37 || e.which == 33) {
												ul.scrollTop(ul.scrollTop() + li.filter('.selected').position().top - liHeight);
											}
											// вниз, вправо, PageDown
											if (e.which == 40 || e.which == 39 || e.which == 34) {
												ul.scrollTop(ul.scrollTop() + li.filter('.selected:last').position().top - ul.innerHeight() + liHeight * 2);
											}
										});
									}

								}
							} // end doMultipleSelect()
							if (el.is('[multiple]')) doMultipleSelect(); else doSelect();
						} // end selectbox()

						selectbox();

						// обновление при динамическом изменении
						el.on('refresh', function() {
							el.parent().before(el).remove();
							selectbox();
						});

					}
				});
			// end select

			// reset
			} else if (el.is(':reset')) {
				el.click(function() {
					setTimeout(function() {
						el.closest(opt.wrapper).find('input, select').trigger('refresh');
					}, 1)
				});
			}
			// end reset

		})

		// колбек после выполнения плагина
		.promise()
		.done(function() {
			opt.onFormStyled.call();
		});

	}
})(jQuery);





/*
== malihu jquery custom scrollbars plugin == 
version: 2.8.3 
author: malihu (http://manos.malihu.gr) 
plugin home: http://manos.malihu.gr/jquery-custom-content-scroller 
*/

/*
Copyright 2010-2013 Manos Malihutsakis 

This program is free software: you can redistribute it and/or modify 
it under the terms of the GNU Lesser General Public License as published by 
the Free Software Foundation, either version 3 of the License, or 
any later version. 

This program is distributed in the hope that it will be useful, 
but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
GNU Lesser General Public License for more details. 

You should have received a copy of the GNU Lesser General Public License 
along with this program.  If not, see http://www.gnu.org/licenses/lgpl.html. 
*/
(function($){
	/*plugin script*/
	var methods={
		init:function(options){
			var defaults={ 
				set_width:false, /*optional element width: boolean, pixels, percentage*/
				set_height:false, /*optional element height: boolean, pixels, percentage*/
				horizontalScroll:false, /*scroll horizontally: boolean*/
				scrollInertia:950, /*scrolling inertia: integer (milliseconds)*/
				mouseWheel:true, /*mousewheel support: boolean*/
				mouseWheelPixels:"auto", /*mousewheel pixels amount: integer, "auto"*/
				autoDraggerLength:true, /*auto-adjust scrollbar dragger length: boolean*/
				autoHideScrollbar:false, /*auto-hide scrollbar when idle*/
				alwaysShowScrollbar:false, /*always show scrollbar even when there's nothing to scroll (disables autoHideScrollbar): boolean*/
				snapAmount:null, /* optional element always snaps to a multiple of this number in pixels */
				snapOffset:0, /* when snapping, snap with this number in pixels as an offset */
				scrollButtons:{ /*scroll buttons*/
					enable:false, /*scroll buttons support: boolean*/
					scrollType:"continuous", /*scroll buttons scrolling type: "continuous", "pixels"*/
					scrollSpeed:"auto", /*scroll buttons continuous scrolling speed: integer, "auto"*/
					scrollAmount:40 /*scroll buttons pixels scroll amount: integer (pixels)*/
				},
				advanced:{
					updateOnBrowserResize:true, /*update scrollbars on browser resize (for layouts based on percentages): boolean*/
					updateOnContentResize:false, /*auto-update scrollbars on content resize (for dynamic content): boolean*/
					autoExpandHorizontalScroll:false, /*auto-expand width for horizontal scrolling: boolean*/
					autoScrollOnFocus:true, /*auto-scroll on focused elements: boolean*/
					normalizeMouseWheelDelta:false /*normalize mouse-wheel delta (-1/1)*/
				},
				contentTouchScroll:true, /*scrolling by touch-swipe content: boolean*/
				callbacks:{
					onScrollStart:function(){}, /*user custom callback function on scroll start event*/
					onScroll:function(){}, /*user custom callback function on scroll event*/
					onTotalScroll:function(){}, /*user custom callback function on scroll end reached event*/
					onTotalScrollBack:function(){}, /*user custom callback function on scroll begin reached event*/
					onTotalScrollOffset:0, /*scroll end reached offset: integer (pixels)*/
					onTotalScrollBackOffset:0, /*scroll begin reached offset: integer (pixels)*/
					whileScrolling:function(){} /*user custom callback function on scrolling event*/
				},
				theme:"light" /*"light", "dark", "light-2", "dark-2", "light-thick", "dark-thick", "light-thin", "dark-thin"*/
			},
			options=$.extend(true,defaults,options);
			return this.each(function(){
				var $this=$(this);
				/*set element width/height, create markup for custom scrollbars, add classes*/
				if(options.set_width){
					$this.css("width",options.set_width);
				}
				if(options.set_height){
					$this.css("height",options.set_height);
				}
				if(!$(document).data("mCustomScrollbar-index")){
					$(document).data("mCustomScrollbar-index","1");
				}else{
					var mCustomScrollbarIndex=parseInt($(document).data("mCustomScrollbar-index"));
					$(document).data("mCustomScrollbar-index",mCustomScrollbarIndex+1);
				}
				$this.wrapInner("<div class='mCustomScrollBox"+" mCS-"+options.theme+"' id='mCSB_"+$(document).data("mCustomScrollbar-index")+"' style='position:relative; height:100%; overflow:hidden; max-width:100%;' />").addClass("mCustomScrollbar _mCS_"+$(document).data("mCustomScrollbar-index"));
				var mCustomScrollBox=$this.children(".mCustomScrollBox");
				if(options.horizontalScroll){
					mCustomScrollBox.addClass("mCSB_horizontal").wrapInner("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />");
					var mCSB_h_wrapper=mCustomScrollBox.children(".mCSB_h_wrapper");
					mCSB_h_wrapper.wrapInner("<div class='mCSB_container' style='position:absolute; left:0;' />").children(".mCSB_container").css({"width":mCSB_h_wrapper.children().outerWidth(),"position":"relative"}).unwrap();
				}else{
					mCustomScrollBox.wrapInner("<div class='mCSB_container' style='position:relative; top:0;' />");
				}
				var mCSB_container=mCustomScrollBox.children(".mCSB_container");
				if($.support.touch){
					mCSB_container.addClass("mCS_touch");
				}
				mCSB_container.after("<div class='mCSB_scrollTools' style='position:absolute;'><div class='mCSB_draggerContainer'><div class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' style='position:relative;'></div></div><div class='mCSB_draggerRail'></div></div></div>");
				var mCSB_scrollTools=mCustomScrollBox.children(".mCSB_scrollTools"),
					mCSB_draggerContainer=mCSB_scrollTools.children(".mCSB_draggerContainer"),
					mCSB_dragger=mCSB_draggerContainer.children(".mCSB_dragger");
				if(options.horizontalScroll){
					mCSB_dragger.data("minDraggerWidth",mCSB_dragger.width());
				}else{
					mCSB_dragger.data("minDraggerHeight",mCSB_dragger.height());
				}
				if(options.scrollButtons.enable){
					if(options.horizontalScroll){
						mCSB_scrollTools.prepend("<a class='mCSB_buttonLeft' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonRight' oncontextmenu='return false;'></a>");
					}else{
						mCSB_scrollTools.prepend("<a class='mCSB_buttonUp' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonDown' oncontextmenu='return false;'></a>");
					}
				}
				/*mCustomScrollBox scrollTop and scrollLeft is always 0 to prevent browser focus scrolling*/
				mCustomScrollBox.bind("scroll",function(){
					if(!$this.is(".mCS_disabled")){ /*native focus scrolling for disabled scrollbars*/
						mCustomScrollBox.scrollTop(0).scrollLeft(0);
					}
				});
				/*store options, global vars/states, intervals*/
				$this.data({
					/*init state*/
					"mCS_Init":true,
					/*instance index*/
					"mCustomScrollbarIndex":$(document).data("mCustomScrollbar-index"),
					/*option parameters*/
					"horizontalScroll":options.horizontalScroll,
					"scrollInertia":options.scrollInertia,
					"scrollEasing":"mcsEaseOut",
					"mouseWheel":options.mouseWheel,
					"mouseWheelPixels":options.mouseWheelPixels,
					"autoDraggerLength":options.autoDraggerLength,
					"autoHideScrollbar":options.autoHideScrollbar,
					"alwaysShowScrollbar":options.alwaysShowScrollbar,
					"snapAmount":options.snapAmount,
					"snapOffset":options.snapOffset,
					"scrollButtons_enable":options.scrollButtons.enable,
					"scrollButtons_scrollType":options.scrollButtons.scrollType,
					"scrollButtons_scrollSpeed":options.scrollButtons.scrollSpeed,
					"scrollButtons_scrollAmount":options.scrollButtons.scrollAmount,
					"autoExpandHorizontalScroll":options.advanced.autoExpandHorizontalScroll,
					"autoScrollOnFocus":options.advanced.autoScrollOnFocus,
					"normalizeMouseWheelDelta":options.advanced.normalizeMouseWheelDelta,
					"contentTouchScroll":options.contentTouchScroll,
					"onScrollStart_Callback":options.callbacks.onScrollStart,
					"onScroll_Callback":options.callbacks.onScroll,
					"onTotalScroll_Callback":options.callbacks.onTotalScroll,
					"onTotalScrollBack_Callback":options.callbacks.onTotalScrollBack,
					"onTotalScroll_Offset":options.callbacks.onTotalScrollOffset,
					"onTotalScrollBack_Offset":options.callbacks.onTotalScrollBackOffset,
					"whileScrolling_Callback":options.callbacks.whileScrolling,
					/*events binding state*/
					"bindEvent_scrollbar_drag":false,
					"bindEvent_content_touch":false,
					"bindEvent_scrollbar_click":false,
					"bindEvent_mousewheel":false,
					"bindEvent_buttonsContinuous_y":false,
					"bindEvent_buttonsContinuous_x":false,
					"bindEvent_buttonsPixels_y":false,
					"bindEvent_buttonsPixels_x":false,
					"bindEvent_focusin":false,
					"bindEvent_autoHideScrollbar":false,
					/*buttons intervals*/
					"mCSB_buttonScrollRight":false,
					"mCSB_buttonScrollLeft":false,
					"mCSB_buttonScrollDown":false,
					"mCSB_buttonScrollUp":false
				});
				/*max-width/max-height*/
				if(options.horizontalScroll){
					if($this.css("max-width")!=="none"){
						if(!options.advanced.updateOnContentResize){ /*needs updateOnContentResize*/
							options.advanced.updateOnContentResize=true;
						}
					}
				}else{
					if($this.css("max-height")!=="none"){
						var percentage=false,maxHeight=parseInt($this.css("max-height"));
						if($this.css("max-height").indexOf("%")>=0){
							percentage=maxHeight,
							maxHeight=$this.parent().height()*percentage/100;
						}
						$this.css("overflow","hidden");
						mCustomScrollBox.css("max-height",maxHeight);
					}
				}
				$this.mCustomScrollbar("update");
				/*window resize fn (for layouts based on percentages)*/
				if(options.advanced.updateOnBrowserResize){
					var mCSB_resizeTimeout,currWinWidth=$(window).width(),currWinHeight=$(window).height();
					$(window).bind("resize."+$this.data("mCustomScrollbarIndex"),function(){
						if(mCSB_resizeTimeout){
							clearTimeout(mCSB_resizeTimeout);
						}
						mCSB_resizeTimeout=setTimeout(function(){
							if(!$this.is(".mCS_disabled") && !$this.is(".mCS_destroyed")){
								var winWidth=$(window).width(),winHeight=$(window).height();
								if(currWinWidth!==winWidth || currWinHeight!==winHeight){ /*ie8 fix*/
									if($this.css("max-height")!=="none" && percentage){
										mCustomScrollBox.css("max-height",$this.parent().height()*percentage/100);
									}
									$this.mCustomScrollbar("update");
									currWinWidth=winWidth; currWinHeight=winHeight;
								}
							}
						},150);
					});
				}
				/*content resize fn (for dynamically generated content)*/
				if(options.advanced.updateOnContentResize){
					var mCSB_onContentResize;
					if(options.horizontalScroll){
						var mCSB_containerOldSize=mCSB_container.outerWidth();
					}else{
						var mCSB_containerOldSize=mCSB_container.outerHeight();
					}
					mCSB_onContentResize=setInterval(function(){
						if(options.horizontalScroll){
							if(options.advanced.autoExpandHorizontalScroll){
								mCSB_container.css({"position":"absolute","width":"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({"width":mCSB_container.outerWidth(),"position":"relative"}).unwrap();
							}
							var mCSB_containerNewSize=mCSB_container.outerWidth();
						}else{
							var mCSB_containerNewSize=mCSB_container.outerHeight();
						}
						if(mCSB_containerNewSize!=mCSB_containerOldSize){
							$this.mCustomScrollbar("update");
							mCSB_containerOldSize=mCSB_containerNewSize;
						}
					},300);
				}
			});
		},
		update:function(){
			var $this=$(this),
				mCustomScrollBox=$this.children(".mCustomScrollBox"),
				mCSB_container=mCustomScrollBox.children(".mCSB_container");
			mCSB_container.removeClass("mCS_no_scrollbar");
			$this.removeClass("mCS_disabled mCS_destroyed");
			mCustomScrollBox.scrollTop(0).scrollLeft(0); /*reset scrollTop/scrollLeft to prevent browser focus scrolling*/
			var mCSB_scrollTools=mCustomScrollBox.children(".mCSB_scrollTools"),
				mCSB_draggerContainer=mCSB_scrollTools.children(".mCSB_draggerContainer"),
				mCSB_dragger=mCSB_draggerContainer.children(".mCSB_dragger");
			if($this.data("horizontalScroll")){
				var mCSB_buttonLeft=mCSB_scrollTools.children(".mCSB_buttonLeft"),
					mCSB_buttonRight=mCSB_scrollTools.children(".mCSB_buttonRight"),
					mCustomScrollBoxW=mCustomScrollBox.width();
				if($this.data("autoExpandHorizontalScroll")){
					mCSB_container.css({"position":"absolute","width":"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({"width":mCSB_container.outerWidth(),"position":"relative"}).unwrap();
				}
				var mCSB_containerW=mCSB_container.outerWidth();
			}else{
				var mCSB_buttonUp=mCSB_scrollTools.children(".mCSB_buttonUp"),
					mCSB_buttonDown=mCSB_scrollTools.children(".mCSB_buttonDown"),
					mCustomScrollBoxH=mCustomScrollBox.height(),
					mCSB_containerH=mCSB_container.outerHeight();
			}
			if(mCSB_containerH>mCustomScrollBoxH && !$this.data("horizontalScroll")){ /*content needs vertical scrolling*/
				mCSB_scrollTools.css("display","block");
				var mCSB_draggerContainerH=mCSB_draggerContainer.height();
				/*auto adjust scrollbar dragger length analogous to content*/
				if($this.data("autoDraggerLength")){
					var draggerH=Math.round(mCustomScrollBoxH/mCSB_containerH*mCSB_draggerContainerH),
						minDraggerH=mCSB_dragger.data("minDraggerHeight");
					if(draggerH<=minDraggerH){ /*min dragger height*/
						mCSB_dragger.css({"height":minDraggerH});
					}else if(draggerH>=mCSB_draggerContainerH-10){ /*max dragger height*/
						var mCSB_draggerContainerMaxH=mCSB_draggerContainerH-10;
						mCSB_dragger.css({"height":mCSB_draggerContainerMaxH});
					}else{
						mCSB_dragger.css({"height":draggerH});
					}
					mCSB_dragger.children(".mCSB_dragger_bar").css({"line-height":mCSB_dragger.height()+"px"});
				}
				var mCSB_draggerH=mCSB_dragger.height(),
				/*calculate and store scroll amount, add scrolling*/
					scrollAmount=(mCSB_containerH-mCustomScrollBoxH)/(mCSB_draggerContainerH-mCSB_draggerH);
				$this.data("scrollAmount",scrollAmount).mCustomScrollbar("scrolling",mCustomScrollBox,mCSB_container,mCSB_draggerContainer,mCSB_dragger,mCSB_buttonUp,mCSB_buttonDown,mCSB_buttonLeft,mCSB_buttonRight);
				/*scroll*/
				var mCSB_containerP=Math.abs(mCSB_container.position().top);
				$this.mCustomScrollbar("scrollTo",mCSB_containerP,{scrollInertia:0,trigger:"internal"});
			}else if(mCSB_containerW>mCustomScrollBoxW && $this.data("horizontalScroll")){ /*content needs horizontal scrolling*/
				mCSB_scrollTools.css("display","block");
				var mCSB_draggerContainerW=mCSB_draggerContainer.width();
				/*auto adjust scrollbar dragger length analogous to content*/
				if($this.data("autoDraggerLength")){
					var draggerW=Math.round(mCustomScrollBoxW/mCSB_containerW*mCSB_draggerContainerW),
						minDraggerW=mCSB_dragger.data("minDraggerWidth");
					if(draggerW<=minDraggerW){ /*min dragger height*/
						mCSB_dragger.css({"width":minDraggerW});
					}else if(draggerW>=mCSB_draggerContainerW-10){ /*max dragger height*/
						var mCSB_draggerContainerMaxW=mCSB_draggerContainerW-10;
						mCSB_dragger.css({"width":mCSB_draggerContainerMaxW});
					}else{
						mCSB_dragger.css({"width":draggerW});
					}
				}
				var mCSB_draggerW=mCSB_dragger.width(),
				/*calculate and store scroll amount, add scrolling*/
					scrollAmount=(mCSB_containerW-mCustomScrollBoxW)/(mCSB_draggerContainerW-mCSB_draggerW);
				$this.data("scrollAmount",scrollAmount).mCustomScrollbar("scrolling",mCustomScrollBox,mCSB_container,mCSB_draggerContainer,mCSB_dragger,mCSB_buttonUp,mCSB_buttonDown,mCSB_buttonLeft,mCSB_buttonRight);
				/*scroll*/
				var mCSB_containerP=Math.abs(mCSB_container.position().left);
				$this.mCustomScrollbar("scrollTo",mCSB_containerP,{scrollInertia:0,trigger:"internal"});
			}else{ /*content does not need scrolling*/
				/*unbind events, reset content position, hide scrollbars, remove classes*/
				mCustomScrollBox.unbind("mousewheel focusin");
				if($this.data("horizontalScroll")){
					mCSB_dragger.add(mCSB_container).css("left",0);
				}else{
					mCSB_dragger.add(mCSB_container).css("top",0);
				}
				if ($this.data("alwaysShowScrollbar")) {
					if(!$this.data("horizontalScroll")){ /*vertical scrolling*/
						mCSB_dragger.css({"height":mCSB_draggerContainer.height()});
					}else if($this.data("horizontalScroll")){ /*horizontal scrolling*/
						mCSB_dragger.css({"width":mCSB_draggerContainer.width()});
					}
				} else {
					mCSB_scrollTools.css("display","none");
					mCSB_container.addClass("mCS_no_scrollbar");
				}
				$this.data({"bindEvent_mousewheel":false,"bindEvent_focusin":false});
			}
		},
		scrolling:function(mCustomScrollBox,mCSB_container,mCSB_draggerContainer,mCSB_dragger,mCSB_buttonUp,mCSB_buttonDown,mCSB_buttonLeft,mCSB_buttonRight){
			var $this=$(this);
			/*scrollbar drag scrolling*/
			if(!$this.data("bindEvent_scrollbar_drag")){
				var mCSB_draggerDragY,mCSB_draggerDragX,
					mCSB_dragger_downEvent,mCSB_dragger_moveEvent,mCSB_dragger_upEvent;
				if($.support.pointer){ /*pointer*/
					mCSB_dragger_downEvent="pointerdown";
					mCSB_dragger_moveEvent="pointermove";
					mCSB_dragger_upEvent="pointerup";
				}else if($.support.msPointer){ /*MSPointer*/
					mCSB_dragger_downEvent="MSPointerDown";
					mCSB_dragger_moveEvent="MSPointerMove";
					mCSB_dragger_upEvent="MSPointerUp";
				}
				if($.support.pointer || $.support.msPointer){ /*pointer, MSPointer*/
					mCSB_dragger.bind(mCSB_dragger_downEvent,function(e){
						e.preventDefault();
						$this.data({"on_drag":true}); mCSB_dragger.addClass("mCSB_dragger_onDrag");
						var elem=$(this),
							elemOffset=elem.offset(),
							x=e.originalEvent.pageX-elemOffset.left,
							y=e.originalEvent.pageY-elemOffset.top;
						if(x<elem.width() && x>0 && y<elem.height() && y>0){
							mCSB_draggerDragY=y;
							mCSB_draggerDragX=x;
						}
					});
					$(document).bind(mCSB_dragger_moveEvent+"."+$this.data("mCustomScrollbarIndex"),function(e){
						e.preventDefault();
						if($this.data("on_drag")){
							var elem=mCSB_dragger,
								elemOffset=elem.offset(),
								x=e.originalEvent.pageX-elemOffset.left,
								y=e.originalEvent.pageY-elemOffset.top;
							scrollbarDrag(mCSB_draggerDragY,mCSB_draggerDragX,y,x);
						}
					}).bind(mCSB_dragger_upEvent+"."+$this.data("mCustomScrollbarIndex"),function(e){
						$this.data({"on_drag":false}); mCSB_dragger.removeClass("mCSB_dragger_onDrag");
					});
				}else{ /*mouse/touch*/
					mCSB_dragger.bind("mousedown touchstart",function(e){
						e.preventDefault(); e.stopImmediatePropagation();
						var	elem=$(this),elemOffset=elem.offset(),x,y;
						if(e.type==="touchstart"){
							var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
							x=touch.pageX-elemOffset.left; y=touch.pageY-elemOffset.top;
						}else{
							$this.data({"on_drag":true}); mCSB_dragger.addClass("mCSB_dragger_onDrag");
							x=e.pageX-elemOffset.left; y=e.pageY-elemOffset.top;
						}
						if(x<elem.width() && x>0 && y<elem.height() && y>0){
							mCSB_draggerDragY=y; mCSB_draggerDragX=x;
						}
					}).bind("touchmove",function(e){
						e.preventDefault(); e.stopImmediatePropagation();
						var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
							elem=$(this),
							elemOffset=elem.offset(),
							x=touch.pageX-elemOffset.left,
							y=touch.pageY-elemOffset.top;
						scrollbarDrag(mCSB_draggerDragY,mCSB_draggerDragX,y,x);
					});
					$(document).bind("mousemove."+$this.data("mCustomScrollbarIndex"),function(e){
						if($this.data("on_drag")){
							var elem=mCSB_dragger,
								elemOffset=elem.offset(),
								x=e.pageX-elemOffset.left,
								y=e.pageY-elemOffset.top;
							scrollbarDrag(mCSB_draggerDragY,mCSB_draggerDragX,y,x);
						}
					}).bind("mouseup."+$this.data("mCustomScrollbarIndex"),function(e){
						$this.data({"on_drag":false}); mCSB_dragger.removeClass("mCSB_dragger_onDrag");
					});
				}
				$this.data({"bindEvent_scrollbar_drag":true});
			}
			function scrollbarDrag(mCSB_draggerDragY,mCSB_draggerDragX,y,x){
				if($this.data("horizontalScroll")){
					$this.mCustomScrollbar("scrollTo",(mCSB_dragger.position().left-(mCSB_draggerDragX))+x,{moveDragger:true,trigger:"internal"});
				}else{
					$this.mCustomScrollbar("scrollTo",(mCSB_dragger.position().top-(mCSB_draggerDragY))+y,{moveDragger:true,trigger:"internal"});
				}
			}
			/*content touch-drag*/
			if($.support.touch && $this.data("contentTouchScroll")){
				if(!$this.data("bindEvent_content_touch")){
					var touch,
						elem,elemOffset,y,x,mCSB_containerTouchY,mCSB_containerTouchX;
					mCSB_container.bind("touchstart",function(e){
						e.stopImmediatePropagation();
						touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						elem=$(this);
						elemOffset=elem.offset();
						x=touch.pageX-elemOffset.left;
						y=touch.pageY-elemOffset.top;
						mCSB_containerTouchY=y;
						mCSB_containerTouchX=x;
					});
					mCSB_container.bind("touchmove",function(e){
						e.preventDefault(); e.stopImmediatePropagation();
						touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						elem=$(this).parent();
						elemOffset=elem.offset();
						x=touch.pageX-elemOffset.left;
						y=touch.pageY-elemOffset.top;
						if($this.data("horizontalScroll")){
							$this.mCustomScrollbar("scrollTo",mCSB_containerTouchX-x,{trigger:"internal"});
						}else{
							$this.mCustomScrollbar("scrollTo",mCSB_containerTouchY-y,{trigger:"internal"});
						}
					});
				}
			}
			/*dragger rail click scrolling*/
			if(!$this.data("bindEvent_scrollbar_click")){
				mCSB_draggerContainer.bind("click",function(e){
					var scrollToPos=(e.pageY-mCSB_draggerContainer.offset().top)*$this.data("scrollAmount"),target=$(e.target);
					if($this.data("horizontalScroll")){
						scrollToPos=(e.pageX-mCSB_draggerContainer.offset().left)*$this.data("scrollAmount");
					}
					if(target.hasClass("mCSB_draggerContainer") || target.hasClass("mCSB_draggerRail")){
						$this.mCustomScrollbar("scrollTo",scrollToPos,{trigger:"internal",scrollEasing:"draggerRailEase"});
					}
				});
				$this.data({"bindEvent_scrollbar_click":true});
			}
			/*mousewheel scrolling*/
			if($this.data("mouseWheel")){
				if(!$this.data("bindEvent_mousewheel")){
					mCustomScrollBox.bind("mousewheel",function(e,delta){
						var scrollTo,mouseWheelPixels=$this.data("mouseWheelPixels"),absPos=Math.abs(mCSB_container.position().top),
							draggerPos=mCSB_dragger.position().top,limit=mCSB_draggerContainer.height()-mCSB_dragger.height();
						if($this.data("normalizeMouseWheelDelta")){
							if(delta<0){delta=-1;}else{delta=1;}
						}
						if(mouseWheelPixels==="auto"){
							mouseWheelPixels=100+Math.round($this.data("scrollAmount")/2);
						}
						if($this.data("horizontalScroll")){
							draggerPos=mCSB_dragger.position().left; 
							limit=mCSB_draggerContainer.width()-mCSB_dragger.width();
							absPos=Math.abs(mCSB_container.position().left);
						}
						if((delta>0 && draggerPos!==0) || (delta<0 && draggerPos!==limit)){e.preventDefault(); e.stopImmediatePropagation();}
						scrollTo=absPos-(delta*mouseWheelPixels);
						$this.mCustomScrollbar("scrollTo",scrollTo,{trigger:"internal"});
					});
					$this.data({"bindEvent_mousewheel":true});
				}
			}
			/*buttons scrolling*/
			if($this.data("scrollButtons_enable")){
				if($this.data("scrollButtons_scrollType")==="pixels"){ /*scroll by pixels*/
					if($this.data("horizontalScroll")){
						mCSB_buttonRight.add(mCSB_buttonLeft).unbind("mousedown touchstart MSPointerDown pointerdown mouseup MSPointerUp pointerup mouseout MSPointerOut pointerout touchend",mCSB_buttonRight_stop,mCSB_buttonLeft_stop);
						$this.data({"bindEvent_buttonsContinuous_x":false});
						if(!$this.data("bindEvent_buttonsPixels_x")){
							/*scroll right*/
							mCSB_buttonRight.bind("click",function(e){
								e.preventDefault();
								PixelsScrollTo(Math.abs(mCSB_container.position().left)+$this.data("scrollButtons_scrollAmount"));
							});
							/*scroll left*/
							mCSB_buttonLeft.bind("click",function(e){
								e.preventDefault();
								PixelsScrollTo(Math.abs(mCSB_container.position().left)-$this.data("scrollButtons_scrollAmount"));
							});
							$this.data({"bindEvent_buttonsPixels_x":true});
						}
					}else{
						mCSB_buttonDown.add(mCSB_buttonUp).unbind("mousedown touchstart MSPointerDown pointerdown mouseup MSPointerUp pointerup mouseout MSPointerOut pointerout touchend",mCSB_buttonRight_stop,mCSB_buttonLeft_stop);
						$this.data({"bindEvent_buttonsContinuous_y":false});
						if(!$this.data("bindEvent_buttonsPixels_y")){
							/*scroll down*/
							mCSB_buttonDown.bind("click",function(e){
								e.preventDefault();
								PixelsScrollTo(Math.abs(mCSB_container.position().top)+$this.data("scrollButtons_scrollAmount"));
							});
							/*scroll up*/
							mCSB_buttonUp.bind("click",function(e){
								e.preventDefault();
								PixelsScrollTo(Math.abs(mCSB_container.position().top)-$this.data("scrollButtons_scrollAmount"));
							});
							$this.data({"bindEvent_buttonsPixels_y":true});
						}
					}
					function PixelsScrollTo(to){
						if(!mCSB_dragger.data("preventAction")){
							mCSB_dragger.data("preventAction",true);
							$this.mCustomScrollbar("scrollTo",to,{trigger:"internal"});
						}
					}
				}else{ /*continuous scrolling*/
					if($this.data("horizontalScroll")){
						mCSB_buttonRight.add(mCSB_buttonLeft).unbind("click");
						$this.data({"bindEvent_buttonsPixels_x":false});
						if(!$this.data("bindEvent_buttonsContinuous_x")){
							/*scroll right*/
							mCSB_buttonRight.bind("mousedown touchstart MSPointerDown pointerdown",function(e){
								e.preventDefault();
								var scrollButtonsSpeed=ScrollButtonsSpeed();
								$this.data({"mCSB_buttonScrollRight":setInterval(function(){
									$this.mCustomScrollbar("scrollTo",Math.abs(mCSB_container.position().left)+scrollButtonsSpeed,{trigger:"internal",scrollEasing:"easeOutCirc"});
								},17)});
							});
							var mCSB_buttonRight_stop=function(e){
								e.preventDefault(); clearInterval($this.data("mCSB_buttonScrollRight"));
							}
							mCSB_buttonRight.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout",mCSB_buttonRight_stop);
							/*scroll left*/
							mCSB_buttonLeft.bind("mousedown touchstart MSPointerDown pointerdown",function(e){
								e.preventDefault();
								var scrollButtonsSpeed=ScrollButtonsSpeed();
								$this.data({"mCSB_buttonScrollLeft":setInterval(function(){
									$this.mCustomScrollbar("scrollTo",Math.abs(mCSB_container.position().left)-scrollButtonsSpeed,{trigger:"internal",scrollEasing:"easeOutCirc"});
								},17)});
							});	
							var mCSB_buttonLeft_stop=function(e){
								e.preventDefault(); clearInterval($this.data("mCSB_buttonScrollLeft"));
							}
							mCSB_buttonLeft.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout",mCSB_buttonLeft_stop);
							$this.data({"bindEvent_buttonsContinuous_x":true});
						}
					}else{
						mCSB_buttonDown.add(mCSB_buttonUp).unbind("click");
						$this.data({"bindEvent_buttonsPixels_y":false});
						if(!$this.data("bindEvent_buttonsContinuous_y")){
							/*scroll down*/
							mCSB_buttonDown.bind("mousedown touchstart MSPointerDown pointerdown",function(e){
								e.preventDefault();
								var scrollButtonsSpeed=ScrollButtonsSpeed();
								$this.data({"mCSB_buttonScrollDown":setInterval(function(){
									$this.mCustomScrollbar("scrollTo",Math.abs(mCSB_container.position().top)+scrollButtonsSpeed,{trigger:"internal",scrollEasing:"easeOutCirc"});
								},17)});
							});
							var mCSB_buttonDown_stop=function(e){
								e.preventDefault(); clearInterval($this.data("mCSB_buttonScrollDown"));
							}
							mCSB_buttonDown.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout",mCSB_buttonDown_stop);
							/*scroll up*/
							mCSB_buttonUp.bind("mousedown touchstart MSPointerDown pointerdown",function(e){
								e.preventDefault();
								var scrollButtonsSpeed=ScrollButtonsSpeed();
								$this.data({"mCSB_buttonScrollUp":setInterval(function(){
									$this.mCustomScrollbar("scrollTo",Math.abs(mCSB_container.position().top)-scrollButtonsSpeed,{trigger:"internal",scrollEasing:"easeOutCirc"});
								},17)});
							});	
							var mCSB_buttonUp_stop=function(e){
								e.preventDefault(); clearInterval($this.data("mCSB_buttonScrollUp"));
							}
							mCSB_buttonUp.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout",mCSB_buttonUp_stop);
							$this.data({"bindEvent_buttonsContinuous_y":true});
						}
					}
					function ScrollButtonsSpeed(){
						var speed=$this.data("scrollButtons_scrollSpeed");
						if($this.data("scrollButtons_scrollSpeed")==="auto"){
							speed=Math.round(($this.data("scrollInertia")+100)/40);
						}
						return speed;
					}
				}
			}
			/*scrolling on element focus (e.g. via TAB key)*/
			if($this.data("autoScrollOnFocus")){
				if(!$this.data("bindEvent_focusin")){
					mCustomScrollBox.bind("focusin",function(){
						mCustomScrollBox.scrollTop(0).scrollLeft(0);
						var focusedElem=$(document.activeElement);
						if(focusedElem.is("input,textarea,select,button,a[tabindex],area,object")){
							var mCSB_containerPos=mCSB_container.position().top,
								focusedElemPos=focusedElem.position().top,
								visibleLimit=mCustomScrollBox.height()-focusedElem.outerHeight();
							if($this.data("horizontalScroll")){
								mCSB_containerPos=mCSB_container.position().left;
								focusedElemPos=focusedElem.position().left;
								visibleLimit=mCustomScrollBox.width()-focusedElem.outerWidth();
							}
							if(mCSB_containerPos+focusedElemPos<0 || mCSB_containerPos+focusedElemPos>visibleLimit){
								$this.mCustomScrollbar("scrollTo",focusedElemPos,{trigger:"internal"});
							}
						}
					});
					$this.data({"bindEvent_focusin":true});
				}
			}
			/*auto-hide scrollbar*/
			if($this.data("autoHideScrollbar") && !$this.data("alwaysShowScrollbar")){
				if(!$this.data("bindEvent_autoHideScrollbar")){
					mCustomScrollBox.bind("mouseenter",function(e){
						mCustomScrollBox.addClass("mCS-mouse-over");
						functions.showScrollbar.call(mCustomScrollBox.children(".mCSB_scrollTools"));
					}).bind("mouseleave touchend",function(e){
						mCustomScrollBox.removeClass("mCS-mouse-over");
						if(e.type==="mouseleave"){functions.hideScrollbar.call(mCustomScrollBox.children(".mCSB_scrollTools"));}
					});
					$this.data({"bindEvent_autoHideScrollbar":true});
				}
			}
		},
		scrollTo:function(scrollTo,options){
			var $this=$(this),
				defaults={
					moveDragger:false,
					trigger:"external",
					callbacks:true,
					scrollInertia:$this.data("scrollInertia"),
					scrollEasing:$this.data("scrollEasing")
				},
				options=$.extend(defaults,options),
				draggerScrollTo,
				mCustomScrollBox=$this.children(".mCustomScrollBox"),
				mCSB_container=mCustomScrollBox.children(".mCSB_container"),
				mCSB_scrollTools=mCustomScrollBox.children(".mCSB_scrollTools"),
				mCSB_draggerContainer=mCSB_scrollTools.children(".mCSB_draggerContainer"),
				mCSB_dragger=mCSB_draggerContainer.children(".mCSB_dragger"),
				contentSpeed=draggerSpeed=options.scrollInertia,
				scrollBeginning,scrollBeginningOffset,totalScroll,totalScrollOffset;
			if(!mCSB_container.hasClass("mCS_no_scrollbar")){
				$this.data({"mCS_trigger":options.trigger});
				if($this.data("mCS_Init")){options.callbacks=false;}
				if(scrollTo || scrollTo===0){
					if(typeof(scrollTo)==="number"){ /*if integer, scroll by number of pixels*/
						if(options.moveDragger){ /*scroll dragger*/
							draggerScrollTo=scrollTo;
							if($this.data("horizontalScroll")){
								scrollTo=mCSB_dragger.position().left*$this.data("scrollAmount");
							}else{
								scrollTo=mCSB_dragger.position().top*$this.data("scrollAmount");
							}
							draggerSpeed=0;
						}else{ /*scroll content by default*/
							draggerScrollTo=scrollTo/$this.data("scrollAmount");
						}
					}else if(typeof(scrollTo)==="string"){ /*if string, scroll by element position*/
						var target;
						if(scrollTo==="top"){ /*scroll to top*/
							target=0;
						}else if(scrollTo==="bottom" && !$this.data("horizontalScroll")){ /*scroll to bottom*/
							target=mCSB_container.outerHeight()-mCustomScrollBox.height();
						}else if(scrollTo==="left"){ /*scroll to left*/
							target=0;
						}else if(scrollTo==="right" && $this.data("horizontalScroll")){ /*scroll to right*/
							target=mCSB_container.outerWidth()-mCustomScrollBox.width();
						}else if(scrollTo==="first"){ /*scroll to first element position*/
							target=$this.find(".mCSB_container").find(":first");
						}else if(scrollTo==="last"){ /*scroll to last element position*/
							target=$this.find(".mCSB_container").find(":last");
						}else{ /*scroll to element position*/
							target=$this.find(scrollTo);
						}
						if(target.length===1){ /*if such unique element exists, scroll to it*/
							if($this.data("horizontalScroll")){
								scrollTo=target.position().left;
							}else{
								scrollTo=target.position().top;
							}
							draggerScrollTo=scrollTo/$this.data("scrollAmount");
						}else{
							draggerScrollTo=scrollTo=target;
						}
					}
					/*scroll to*/
					if($this.data("horizontalScroll")){
						if($this.data("onTotalScrollBack_Offset")){ /*scroll beginning offset*/
							scrollBeginningOffset=-$this.data("onTotalScrollBack_Offset");
						}
						if($this.data("onTotalScroll_Offset")){ /*total scroll offset*/
							totalScrollOffset=mCustomScrollBox.width()-mCSB_container.outerWidth()+$this.data("onTotalScroll_Offset");
						}
						if(draggerScrollTo<0){ /*scroll start position*/
							draggerScrollTo=scrollTo=0; clearInterval($this.data("mCSB_buttonScrollLeft"));
							if(!scrollBeginningOffset){scrollBeginning=true;}
						}else if(draggerScrollTo>=mCSB_draggerContainer.width()-mCSB_dragger.width()){ /*scroll end position*/
							draggerScrollTo=mCSB_draggerContainer.width()-mCSB_dragger.width();
							scrollTo=mCustomScrollBox.width()-mCSB_container.outerWidth(); clearInterval($this.data("mCSB_buttonScrollRight"));
							if(!totalScrollOffset){totalScroll=true;}
						}else{scrollTo=-scrollTo;}
						var snapAmount = $this.data("snapAmount");
						if (snapAmount) {
							scrollTo = Math.round(scrollTo / snapAmount) * snapAmount - $this.data("snapOffset");
						}
						/*scrolling animation*/
						functions.mTweenAxis.call(this,mCSB_dragger[0],"left",Math.round(draggerScrollTo),draggerSpeed,options.scrollEasing);
						functions.mTweenAxis.call(this,mCSB_container[0],"left",Math.round(scrollTo),contentSpeed,options.scrollEasing,{
							onStart:function(){
								if(options.callbacks && !$this.data("mCS_tweenRunning")){callbacks("onScrollStart");}
								if($this.data("autoHideScrollbar") && !$this.data("alwaysShowScrollbar")){functions.showScrollbar.call(mCSB_scrollTools);}
							},
							onUpdate:function(){
								if(options.callbacks){callbacks("whileScrolling");}
							},
							onComplete:function(){
								if(options.callbacks){
									callbacks("onScroll");
									if(scrollBeginning || (scrollBeginningOffset && mCSB_container.position().left>=scrollBeginningOffset)){callbacks("onTotalScrollBack");}
									if(totalScroll || (totalScrollOffset && mCSB_container.position().left<=totalScrollOffset)){callbacks("onTotalScroll");}
								}
								mCSB_dragger.data("preventAction",false); $this.data("mCS_tweenRunning",false);
								if($this.data("autoHideScrollbar") && !$this.data("alwaysShowScrollbar")){if(!mCustomScrollBox.hasClass("mCS-mouse-over")){functions.hideScrollbar.call(mCSB_scrollTools);}}
							}
						});
					}else{
						if($this.data("onTotalScrollBack_Offset")){ /*scroll beginning offset*/
							scrollBeginningOffset=-$this.data("onTotalScrollBack_Offset");
						}
						if($this.data("onTotalScroll_Offset")){ /*total scroll offset*/
							totalScrollOffset=mCustomScrollBox.height()-mCSB_container.outerHeight()+$this.data("onTotalScroll_Offset");
						}
						if(draggerScrollTo<0){ /*scroll start position*/
							draggerScrollTo=scrollTo=0; clearInterval($this.data("mCSB_buttonScrollUp"));
							if(!scrollBeginningOffset){scrollBeginning=true;}
						}else if(draggerScrollTo>=mCSB_draggerContainer.height()-mCSB_dragger.height()){ /*scroll end position*/
							draggerScrollTo=mCSB_draggerContainer.height()-mCSB_dragger.height();
							scrollTo=mCustomScrollBox.height()-mCSB_container.outerHeight(); clearInterval($this.data("mCSB_buttonScrollDown"));
							if(!totalScrollOffset){totalScroll=true;}
						}else{scrollTo=-scrollTo;}
						var snapAmount = $this.data("snapAmount");
						if (snapAmount) {
							scrollTo = Math.round(scrollTo / snapAmount) * snapAmount - $this.data("snapOffset");
						}
						/*scrolling animation*/
						functions.mTweenAxis.call(this,mCSB_dragger[0],"top",Math.round(draggerScrollTo),draggerSpeed,options.scrollEasing);
						functions.mTweenAxis.call(this,mCSB_container[0],"top",Math.round(scrollTo),contentSpeed,options.scrollEasing,{
							onStart:function(){
								if(options.callbacks && !$this.data("mCS_tweenRunning")){callbacks("onScrollStart");}
								if($this.data("autoHideScrollbar") && !$this.data("alwaysShowScrollbar")){functions.showScrollbar.call(mCSB_scrollTools);}
							},
							onUpdate:function(){
								if(options.callbacks){callbacks("whileScrolling");}
							},
							onComplete:function(){
								if(options.callbacks){
									callbacks("onScroll");
									if(scrollBeginning || (scrollBeginningOffset && mCSB_container.position().top>=scrollBeginningOffset)){callbacks("onTotalScrollBack");}
									if(totalScroll || (totalScrollOffset && mCSB_container.position().top<=totalScrollOffset)){callbacks("onTotalScroll");}
								}
								mCSB_dragger.data("preventAction",false); $this.data("mCS_tweenRunning",false);
								if($this.data("autoHideScrollbar") && !$this.data("alwaysShowScrollbar")){if(!mCustomScrollBox.hasClass("mCS-mouse-over")){functions.hideScrollbar.call(mCSB_scrollTools);}}
							}
						});
					}
					if($this.data("mCS_Init")){$this.data({"mCS_Init":false});}
				}
			}
			/*callbacks*/
			function callbacks(cb){
				if ($this.data("mCustomScrollbarIndex")) {
					this.mcs = {
						top: mCSB_container.position().top, left: mCSB_container.position().left,
						draggerTop: mCSB_dragger.position().top, draggerLeft: mCSB_dragger.position().left,
						topPct: Math.round((100 * Math.abs(mCSB_container.position().top)) / Math.abs(mCSB_container.outerHeight() - mCustomScrollBox.height())),
						leftPct: Math.round((100 * Math.abs(mCSB_container.position().left)) / Math.abs(mCSB_container.outerWidth() - mCustomScrollBox.width()))
					};
					switch (cb) {
						/*start scrolling callback*/
						case "onScrollStart":
							$this.data("mCS_tweenRunning", true).data("onScrollStart_Callback").call($this, this.mcs);
							break;
						case "whileScrolling":
							$this.data("whileScrolling_Callback").call($this, this.mcs);
							break;
						case "onScroll":
							$this.data("onScroll_Callback").call($this, this.mcs);
							break;
						case "onTotalScrollBack":
							$this.data("onTotalScrollBack_Callback").call($this, this.mcs);
							break;
						case "onTotalScroll":
							$this.data("onTotalScroll_Callback").call($this, this.mcs);
							break;
					}
				}
			}
		},
		stop:function(){
			var $this=$(this),
				mCSB_container=$this.children().children(".mCSB_container"),
				mCSB_dragger=$this.children().children().children().children(".mCSB_dragger");
			functions.mTweenAxisStop.call(this,mCSB_container[0]);
			functions.mTweenAxisStop.call(this,mCSB_dragger[0]);
		},
		disable:function(resetScroll){
			var $this=$(this),
				mCustomScrollBox=$this.children(".mCustomScrollBox"),
				mCSB_container=mCustomScrollBox.children(".mCSB_container"),
				mCSB_scrollTools=mCustomScrollBox.children(".mCSB_scrollTools"),
				mCSB_dragger=mCSB_scrollTools.children().children(".mCSB_dragger");
			mCustomScrollBox.unbind("mousewheel focusin mouseenter mouseleave touchend");
			mCSB_container.unbind("touchstart touchmove")
			if(resetScroll){
				if($this.data("horizontalScroll")){
					mCSB_dragger.add(mCSB_container).css("left",0);
				}else{
					mCSB_dragger.add(mCSB_container).css("top",0);
				}
			}
			mCSB_scrollTools.css("display","none");
			mCSB_container.addClass("mCS_no_scrollbar");
			$this.data({"bindEvent_mousewheel":false,"bindEvent_focusin":false,"bindEvent_content_touch":false,"bindEvent_autoHideScrollbar":false}).addClass("mCS_disabled");
		},
		destroy:function(){
			var $this=$(this);
			$this.removeClass("mCustomScrollbar _mCS_"+$this.data("mCustomScrollbarIndex")).addClass("mCS_destroyed").children().children(".mCSB_container").unwrap().children().unwrap().siblings(".mCSB_scrollTools").remove();
			$(document).unbind("mousemove."+$this.data("mCustomScrollbarIndex")+" mouseup."+$this.data("mCustomScrollbarIndex")+" MSPointerMove."+$this.data("mCustomScrollbarIndex")+" MSPointerUp."+$this.data("mCustomScrollbarIndex"));
			$(window).unbind("resize."+$this.data("mCustomScrollbarIndex"));
		}
	},
	functions={
		/*hide/show scrollbar*/
		showScrollbar:function(){
			this.stop().animate({opacity:1},"fast");
		},
		hideScrollbar:function(){
			this.stop().animate({opacity:0},"fast");
		},
		/*js animation tween*/
		mTweenAxis:function(el,prop,to,duration,easing,callbacks){
			var callbacks=callbacks || {},
				onStart=callbacks.onStart || function(){},onUpdate=callbacks.onUpdate || function(){},onComplete=callbacks.onComplete || function(){};
			var startTime=_getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style;
			if(prop==="left"){from=el.offsetLeft;}
			var diff=to-from;
			_cancelTween();
			_startTween();
			function _getTime(){
				if(window.performance && window.performance.now){
					return window.performance.now();
				}else{
					if(window.performance && window.performance.webkitNow){
						return window.performance.webkitNow();
					}else{
						if(Date.now){return Date.now();}else{return new Date().getTime();}
					}
				}
			}
			function _step(){
				if(!progress){onStart.call();}
				progress=_getTime()-startTime;
				_tween();
				if(progress>=el._time){
					el._time=(progress>el._time) ? progress+_delay-(progress- el._time) : progress+_delay-1;
					if(el._time<progress+1){el._time=progress+1;}
				}
				if(el._time<duration){el._id=_request(_step);}else{onComplete.call();}
			}
			function _tween(){
				if(duration>0){
					el.currVal=_ease(el._time,from,diff,duration,easing);
					elStyle[prop]=Math.round(el.currVal)+"px";
				}else{
					elStyle[prop]=to+"px";
				}
				onUpdate.call();
			}
			function _startTween(){
				_delay=1000/60;
				el._time=progress+_delay;
				_request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
				el._id=_request(_step);
			}
			function _cancelTween(){
				if(el._id==null){return;}
				if(!window.requestAnimationFrame){clearTimeout(el._id);
				}else{window.cancelAnimationFrame(el._id);}
				el._id=null;
			}
			function _ease(t,b,c,d,type){
				switch(type){
					case "linear":
						return c*t/d + b;
						break;
					case "easeOutQuad":
						t /= d; return -c * t*(t-2) + b;
						break;
					case "easeInOutQuad":
						t /= d/2;
						if (t < 1) return c/2*t*t + b;
						t--;
						return -c/2 * (t*(t-2) - 1) + b;
						break;
					case "easeOutCubic":
						t /= d; t--; return c*(t*t*t + 1) + b;
						break;
					case "easeOutQuart":
						t /= d; t--; return -c * (t*t*t*t - 1) + b;
						break;
					case "easeOutQuint":
						t /= d; t--; return c*(t*t*t*t*t + 1) + b;
						break;
					case "easeOutCirc":
						t /= d; t--; return c * Math.sqrt(1 - t*t) + b;
						break;
					case "easeOutSine":
						return c * Math.sin(t/d * (Math.PI/2)) + b;
						break;
					case "easeOutExpo":
						return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
						break;
					case "mcsEaseOut":
						var ts=(t/=d)*t,tc=ts*t;
						return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
						break;
					case "draggerRailEase":
						t /= d/2;
						if (t < 1) return c/2*t*t*t + b;
						t -= 2;
						return c/2*(t*t*t + 2) + b;
						break;
				}
			}
		},
		/*stop js animation tweens*/
		mTweenAxisStop:function(el){
			if(el._id==null){return;}
			if(!window.requestAnimationFrame){clearTimeout(el._id);
			}else{window.cancelAnimationFrame(el._id);}
			el._id=null;
		},
		/*detect requestAnimationFrame and polyfill*/
		rafPolyfill:function(){
			var pfx=["ms","moz","webkit","o"],i=pfx.length;
			while(--i > -1 && !window.requestAnimationFrame){
				window.requestAnimationFrame=window[pfx[i]+"RequestAnimationFrame"];
				window.cancelAnimationFrame=window[pfx[i]+"CancelAnimationFrame"] || window[pfx[i]+"CancelRequestAnimationFrame"];
			}
		}
	}
	/*detect features*/
	functions.rafPolyfill.call(); /*requestAnimationFrame*/
	$.support.touch=!!('ontouchstart' in window); /*touch*/
	$.support.pointer=window.navigator.pointerEnabled; /*pointer support*/
	$.support.msPointer=window.navigator.msPointerEnabled; /*MSPointer support*/
	/*plugin dependencies*/
	var _dlp=("https:"==document.location.protocol) ? "https:" : "http:";
	$.event.special.mousewheel || document.write('<script src="'+_dlp+'//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.0.6/jquery.mousewheel.min.js"><\/script>');
	/*plugin fn*/
	$.fn.mCustomScrollbar=function(method){
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
})(jQuery);


/*! jQuery UI - v1.11.4 - 2015-07-20
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, slider.js
* Copyright 2015 jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {
/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */


// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.11.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	scrollParent: function( includeHidden ) {
		var position = this.css( "position" ),
			excludeStaticParent = position === "absolute",
			overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
			scrollParent = this.parents().filter( function() {
				var parent = $( this );
				if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
					return false;
				}
				return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
			}).eq( 0 );

		return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
	},

	uniqueId: (function() {
		var uuid = 0;

		return function() {
			return this.each(function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			});
		};
	})(),

	removeUniqueId: function() {
		return this.each(function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
		return !!img && visible( img );
	}
	return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	disableSelection: (function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.bind( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
		};
	})(),

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	}
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};


/*!
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */


var widget_uuid = 0,
	widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
})( $.cleanData );

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widget_slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = widget_slice.call( arguments, 1 ),
			returnValue = this;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( options === "instance" ) {
					returnValue = instance;
					return false;
				}
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat(args) );
			}

			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widget_uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled", !!value );

			// If the widget is becoming disabled, then nothing is interactive
			if ( value ) {
				this.hoverable.removeClass( "ui-state-hover" );
				this.focusable.removeClass( "ui-state-focus" );
			}
		}

		return this;
	},

	enable: function() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

var widget = $.widget;


/*!
 * jQuery UI Mouse 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 */


var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

var mouse = $.widget("ui.mouse", {
	version: "1.11.4",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown." + this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click." + this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("." + this.widgetName);
		if ( this._mouseMoveDelegate ) {
			this.document
				.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if ( mouseHandled ) {
			return;
		}

		this._mouseMoved = false;

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};

		this.document
			.bind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.bind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// Only check for mouseups outside the document if you've moved inside the document
		// at least once. This prevents the firing of mouseup in the case of IE<9, which will
		// fire a mousemove event if content is placed under the cursor. See #7778
		// Support: IE <9
		if ( this._mouseMoved ) {
			// IE mouseup check - mouseup happened when mouse was out of window
			if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
				return this._mouseUp(event);

			// Iframe mouseup check - mouseup occurred in another document
			} else if ( !event.which ) {
				return this._mouseUp( event );
			}
		}

		if ( event.which || event.button ) {
			this._mouseMoved = true;
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		this.document
			.unbind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.unbind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		mouseHandled = false;
		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});


/*!
 * jQuery UI Position 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),

			// support: jQuery 1.6.x
			// jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
			width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !supportsOffsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			} else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
					position.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function() {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

})();

var position = $.ui.position;


/*!
 * jQuery UI Slider 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/slider/
 */


var slider = $.widget( "ui.slider", $.ui.mouse, {
	version: "1.11.4",
	widgetEventPrefix: "slide",

	options: {
		animate: false,
		distance: 0,
		max: 100,
		min: 0,
		orientation: "horizontal",
		range: false,
		step: 1,
		value: 0,
		values: null,

		// callbacks
		change: null,
		slide: null,
		start: null,
		stop: null
	},

	// number of pages in a slider
	// (how many times can you page up/down to go through the whole range)
	numPages: 5,

	_create: function() {
		this._keySliding = false;
		this._mouseSliding = false;
		this._animateOff = true;
		this._handleIndex = null;
		this._detectOrientation();
		this._mouseInit();
		this._calculateNewMax();

		this.element
			.addClass( "ui-slider" +
				" ui-slider-" + this.orientation +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all");

		this._refresh();
		this._setOption( "disabled", this.options.disabled );

		this._animateOff = false;
	},

	_refresh: function() {
		this._createRange();
		this._createHandles();
		this._setupEvents();
		this._refreshValue();
	},

	_createHandles: function() {
		var i, handleCount,
			options = this.options,
			existingHandles = this.element.find( ".ui-slider-handle" ).addClass( "ui-state-default ui-corner-all" ),
			handle = "<span class='ui-slider-handle ui-state-default ui-corner-all' tabindex='0'></span>",
			handles = [];

		handleCount = ( options.values && options.values.length ) || 1;

		if ( existingHandles.length > handleCount ) {
			existingHandles.slice( handleCount ).remove();
			existingHandles = existingHandles.slice( 0, handleCount );
		}

		for ( i = existingHandles.length; i < handleCount; i++ ) {
			handles.push( handle );
		}

		this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( this.element ) );

		this.handle = this.handles.eq( 0 );

		this.handles.each(function( i ) {
			$( this ).data( "ui-slider-handle-index", i );
		});
	},

	_createRange: function() {
		var options = this.options,
			classes = "";

		if ( options.range ) {
			if ( options.range === true ) {
				if ( !options.values ) {
					options.values = [ this._valueMin(), this._valueMin() ];
				} else if ( options.values.length && options.values.length !== 2 ) {
					options.values = [ options.values[0], options.values[0] ];
				} else if ( $.isArray( options.values ) ) {
					options.values = options.values.slice(0);
				}
			}

			if ( !this.range || !this.range.length ) {
				this.range = $( "<div></div>" )
					.appendTo( this.element );

				classes = "ui-slider-range" +
				// note: this isn't the most fittingly semantic framework class for this element,
				// but worked best visually with a variety of themes
				" ui-widget-header ui-corner-all";
			} else {
				this.range.removeClass( "ui-slider-range-min ui-slider-range-max" )
					// Handle range switching from true to min/max
					.css({
						"left": "",
						"bottom": ""
					});
			}

			this.range.addClass( classes +
				( ( options.range === "min" || options.range === "max" ) ? " ui-slider-range-" + options.range : "" ) );
		} else {
			if ( this.range ) {
				this.range.remove();
			}
			this.range = null;
		}
	},

	_setupEvents: function() {
		this._off( this.handles );
		this._on( this.handles, this._handleEvents );
		this._hoverable( this.handles );
		this._focusable( this.handles );
	},

	_destroy: function() {
		this.handles.remove();
		if ( this.range ) {
			this.range.remove();
		}

		this.element
			.removeClass( "ui-slider" +
				" ui-slider-horizontal" +
				" ui-slider-vertical" +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" );

		this._mouseDestroy();
	},

	_mouseCapture: function( event ) {
		var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
			that = this,
			o = this.options;

		if ( o.disabled ) {
			return false;
		}

		this.elementSize = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
		this.elementOffset = this.element.offset();

		position = { x: event.pageX, y: event.pageY };
		normValue = this._normValueFromMouse( position );
		distance = this._valueMax() - this._valueMin() + 1;
		this.handles.each(function( i ) {
			var thisDistance = Math.abs( normValue - that.values(i) );
			if (( distance > thisDistance ) ||
				( distance === thisDistance &&
					(i === that._lastChangedValue || that.values(i) === o.min ))) {
				distance = thisDistance;
				closestHandle = $( this );
				index = i;
			}
		});

		allowed = this._start( event, index );
		if ( allowed === false ) {
			return false;
		}
		this._mouseSliding = true;

		this._handleIndex = index;

		closestHandle
			.addClass( "ui-state-active" )
			.focus();

		offset = closestHandle.offset();
		mouseOverHandle = !$( event.target ).parents().addBack().is( ".ui-slider-handle" );
		this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
			left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
			top: event.pageY - offset.top -
				( closestHandle.height() / 2 ) -
				( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
				( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
				( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
		};

		if ( !this.handles.hasClass( "ui-state-hover" ) ) {
			this._slide( event, index, normValue );
		}
		this._animateOff = true;
		return true;
	},

	_mouseStart: function() {
		return true;
	},

	_mouseDrag: function( event ) {
		var position = { x: event.pageX, y: event.pageY },
			normValue = this._normValueFromMouse( position );

		this._slide( event, this._handleIndex, normValue );

		return false;
	},

	_mouseStop: function( event ) {
		this.handles.removeClass( "ui-state-active" );
		this._mouseSliding = false;

		this._stop( event, this._handleIndex );
		this._change( event, this._handleIndex );

		this._handleIndex = null;
		this._clickOffset = null;
		this._animateOff = false;

		return false;
	},

	_detectOrientation: function() {
		this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
	},

	_normValueFromMouse: function( position ) {
		var pixelTotal,
			pixelMouse,
			percentMouse,
			valueTotal,
			valueMouse;

		if ( this.orientation === "horizontal" ) {
			pixelTotal = this.elementSize.width;
			pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
		} else {
			pixelTotal = this.elementSize.height;
			pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
		}

		percentMouse = ( pixelMouse / pixelTotal );
		if ( percentMouse > 1 ) {
			percentMouse = 1;
		}
		if ( percentMouse < 0 ) {
			percentMouse = 0;
		}
		if ( this.orientation === "vertical" ) {
			percentMouse = 1 - percentMouse;
		}

		valueTotal = this._valueMax() - this._valueMin();
		valueMouse = this._valueMin() + percentMouse * valueTotal;

		return this._trimAlignValue( valueMouse );
	},

	_start: function( event, index ) {
		var uiHash = {
			handle: this.handles[ index ],
			value: this.value()
		};
		if ( this.options.values && this.options.values.length ) {
			uiHash.value = this.values( index );
			uiHash.values = this.values();
		}
		return this._trigger( "start", event, uiHash );
	},

	_slide: function( event, index, newVal ) {
		var otherVal,
			newValues,
			allowed;

		if ( this.options.values && this.options.values.length ) {
			otherVal = this.values( index ? 0 : 1 );

			if ( ( this.options.values.length === 2 && this.options.range === true ) &&
					( ( index === 0 && newVal > otherVal) || ( index === 1 && newVal < otherVal ) )
				) {
				newVal = otherVal;
			}

			if ( newVal !== this.values( index ) ) {
				newValues = this.values();
				newValues[ index ] = newVal;
				// A slide can be canceled by returning false from the slide callback
				allowed = this._trigger( "slide", event, {
					handle: this.handles[ index ],
					value: newVal,
					values: newValues
				} );
				otherVal = this.values( index ? 0 : 1 );
				if ( allowed !== false ) {
					this.values( index, newVal );
				}
			}
		} else {
			if ( newVal !== this.value() ) {
				// A slide can be canceled by returning false from the slide callback
				allowed = this._trigger( "slide", event, {
					handle: this.handles[ index ],
					value: newVal
				} );
				if ( allowed !== false ) {
					this.value( newVal );
				}
			}
		}
	},

	_stop: function( event, index ) {
		var uiHash = {
			handle: this.handles[ index ],
			value: this.value()
		};
		if ( this.options.values && this.options.values.length ) {
			uiHash.value = this.values( index );
			uiHash.values = this.values();
		}

		this._trigger( "stop", event, uiHash );
	},

	_change: function( event, index ) {
		if ( !this._keySliding && !this._mouseSliding ) {
			var uiHash = {
				handle: this.handles[ index ],
				value: this.value()
			};
			if ( this.options.values && this.options.values.length ) {
				uiHash.value = this.values( index );
				uiHash.values = this.values();
			}

			//store the last changed value index for reference when handles overlap
			this._lastChangedValue = index;

			this._trigger( "change", event, uiHash );
		}
	},

	value: function( newValue ) {
		if ( arguments.length ) {
			this.options.value = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, 0 );
			return;
		}

		return this._value();
	},

	values: function( index, newValue ) {
		var vals,
			newValues,
			i;

		if ( arguments.length > 1 ) {
			this.options.values[ index ] = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, index );
			return;
		}

		if ( arguments.length ) {
			if ( $.isArray( arguments[ 0 ] ) ) {
				vals = this.options.values;
				newValues = arguments[ 0 ];
				for ( i = 0; i < vals.length; i += 1 ) {
					vals[ i ] = this._trimAlignValue( newValues[ i ] );
					this._change( null, i );
				}
				this._refreshValue();
			} else {
				if ( this.options.values && this.options.values.length ) {
					return this._values( index );
				} else {
					return this.value();
				}
			}
		} else {
			return this._values();
		}
	},

	_setOption: function( key, value ) {
		var i,
			valsLength = 0;

		if ( key === "range" && this.options.range === true ) {
			if ( value === "min" ) {
				this.options.value = this._values( 0 );
				this.options.values = null;
			} else if ( value === "max" ) {
				this.options.value = this._values( this.options.values.length - 1 );
				this.options.values = null;
			}
		}

		if ( $.isArray( this.options.values ) ) {
			valsLength = this.options.values.length;
		}

		if ( key === "disabled" ) {
			this.element.toggleClass( "ui-state-disabled", !!value );
		}

		this._super( key, value );

		switch ( key ) {
			case "orientation":
				this._detectOrientation();
				this.element
					.removeClass( "ui-slider-horizontal ui-slider-vertical" )
					.addClass( "ui-slider-" + this.orientation );
				this._refreshValue();

				// Reset positioning from previous orientation
				this.handles.css( value === "horizontal" ? "bottom" : "left", "" );
				break;
			case "value":
				this._animateOff = true;
				this._refreshValue();
				this._change( null, 0 );
				this._animateOff = false;
				break;
			case "values":
				this._animateOff = true;
				this._refreshValue();
				for ( i = 0; i < valsLength; i += 1 ) {
					this._change( null, i );
				}
				this._animateOff = false;
				break;
			case "step":
			case "min":
			case "max":
				this._animateOff = true;
				this._calculateNewMax();
				this._refreshValue();
				this._animateOff = false;
				break;
			case "range":
				this._animateOff = true;
				this._refresh();
				this._animateOff = false;
				break;
		}
	},

	//internal value getter
	// _value() returns value trimmed by min and max, aligned by step
	_value: function() {
		var val = this.options.value;
		val = this._trimAlignValue( val );

		return val;
	},

	//internal values getter
	// _values() returns array of values trimmed by min and max, aligned by step
	// _values( index ) returns single value trimmed by min and max, aligned by step
	_values: function( index ) {
		var val,
			vals,
			i;

		if ( arguments.length ) {
			val = this.options.values[ index ];
			val = this._trimAlignValue( val );

			return val;
		} else if ( this.options.values && this.options.values.length ) {
			// .slice() creates a copy of the array
			// this copy gets trimmed by min and max and then returned
			vals = this.options.values.slice();
			for ( i = 0; i < vals.length; i += 1) {
				vals[ i ] = this._trimAlignValue( vals[ i ] );
			}

			return vals;
		} else {
			return [];
		}
	},

	// returns the step-aligned value that val is closest to, between (inclusive) min and max
	_trimAlignValue: function( val ) {
		if ( val <= this._valueMin() ) {
			return this._valueMin();
		}
		if ( val >= this._valueMax() ) {
			return this._valueMax();
		}
		var step = ( this.options.step > 0 ) ? this.options.step : 1,
			valModStep = (val - this._valueMin()) % step,
			alignValue = val - valModStep;

		if ( Math.abs(valModStep) * 2 >= step ) {
			alignValue += ( valModStep > 0 ) ? step : ( -step );
		}

		// Since JavaScript has problems with large floats, round
		// the final value to 5 digits after the decimal point (see #4124)
		return parseFloat( alignValue.toFixed(5) );
	},

	_calculateNewMax: function() {
		var max = this.options.max,
			min = this._valueMin(),
			step = this.options.step,
			aboveMin = Math.floor( ( +( max - min ).toFixed( this._precision() ) ) / step ) * step;
		max = aboveMin + min;
		this.max = parseFloat( max.toFixed( this._precision() ) );
	},

	_precision: function() {
		var precision = this._precisionOf( this.options.step );
		if ( this.options.min !== null ) {
			precision = Math.max( precision, this._precisionOf( this.options.min ) );
		}
		return precision;
	},

	_precisionOf: function( num ) {
		var str = num.toString(),
			decimal = str.indexOf( "." );
		return decimal === -1 ? 0 : str.length - decimal - 1;
	},

	_valueMin: function() {
		return this.options.min;
	},

	_valueMax: function() {
		return this.max;
	},

	_refreshValue: function() {
		var lastValPercent, valPercent, value, valueMin, valueMax,
			oRange = this.options.range,
			o = this.options,
			that = this,
			animate = ( !this._animateOff ) ? o.animate : false,
			_set = {};

		if ( this.options.values && this.options.values.length ) {
			this.handles.each(function( i ) {
				valPercent = ( that.values(i) - that._valueMin() ) / ( that._valueMax() - that._valueMin() ) * 100;
				_set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
				$( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
				if ( that.options.range === true ) {
					if ( that.orientation === "horizontal" ) {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { left: valPercent + "%" }, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( { width: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
						}
					} else {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { bottom: ( valPercent ) + "%" }, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( { height: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
						}
					}
				}
				lastValPercent = valPercent;
			});
		} else {
			value = this.value();
			valueMin = this._valueMin();
			valueMax = this._valueMax();
			valPercent = ( valueMax !== valueMin ) ?
					( value - valueMin ) / ( valueMax - valueMin ) * 100 :
					0;
			_set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
			this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

			if ( oRange === "min" && this.orientation === "horizontal" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { width: valPercent + "%" }, o.animate );
			}
			if ( oRange === "max" && this.orientation === "horizontal" ) {
				this.range[ animate ? "animate" : "css" ]( { width: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
			}
			if ( oRange === "min" && this.orientation === "vertical" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { height: valPercent + "%" }, o.animate );
			}
			if ( oRange === "max" && this.orientation === "vertical" ) {
				this.range[ animate ? "animate" : "css" ]( { height: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
			}
		}
	},

	_handleEvents: {
		keydown: function( event ) {
			var allowed, curVal, newVal, step,
				index = $( event.target ).data( "ui-slider-handle-index" );

			switch ( event.keyCode ) {
				case $.ui.keyCode.HOME:
				case $.ui.keyCode.END:
				case $.ui.keyCode.PAGE_UP:
				case $.ui.keyCode.PAGE_DOWN:
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					event.preventDefault();
					if ( !this._keySliding ) {
						this._keySliding = true;
						$( event.target ).addClass( "ui-state-active" );
						allowed = this._start( event, index );
						if ( allowed === false ) {
							return;
						}
					}
					break;
			}

			step = this.options.step;
			if ( this.options.values && this.options.values.length ) {
				curVal = newVal = this.values( index );
			} else {
				curVal = newVal = this.value();
			}

			switch ( event.keyCode ) {
				case $.ui.keyCode.HOME:
					newVal = this._valueMin();
					break;
				case $.ui.keyCode.END:
					newVal = this._valueMax();
					break;
				case $.ui.keyCode.PAGE_UP:
					newVal = this._trimAlignValue(
						curVal + ( ( this._valueMax() - this._valueMin() ) / this.numPages )
					);
					break;
				case $.ui.keyCode.PAGE_DOWN:
					newVal = this._trimAlignValue(
						curVal - ( (this._valueMax() - this._valueMin()) / this.numPages ) );
					break;
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
					if ( curVal === this._valueMax() ) {
						return;
					}
					newVal = this._trimAlignValue( curVal + step );
					break;
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					if ( curVal === this._valueMin() ) {
						return;
					}
					newVal = this._trimAlignValue( curVal - step );
					break;
			}

			this._slide( event, index, newVal );
		},
		keyup: function( event ) {
			var index = $( event.target ).data( "ui-slider-handle-index" );

			if ( this._keySliding ) {
				this._keySliding = false;
				this._stop( event, index );
				this._change( event, index );
				$( event.target ).removeClass( "ui-state-active" );
			}
		}
	}
});


}));




/*
 *	jQuery elevateZoom 3.0.8
 *	Demo's and documentation:
 *	www.elevateweb.co.uk/image-zoom
 *
 *	Copyright (c) 2012 Andrew Eades
 *	www.elevateweb.co.uk
 *
 *	Dual licensed under the GPL and MIT licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 *

/*
 *	jQuery elevateZoom 3.0.3
 *	Demo's and documentation:
 *	www.elevateweb.co.uk/image-zoom
 *
 *	Copyright (c) 2012 Andrew Eades
 *	www.elevateweb.co.uk
 *
 *	Dual licensed under the GPL and MIT licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {
	var ElevateZoom = {
			init: function( options, elem ) {
				var self = this;

				self.elem = elem;
				self.$elem = $( elem );

				self.imageSrc = self.$elem.data("zoom-image") ? self.$elem.data("zoom-image") : self.$elem.attr("src");

				self.options = $.extend( {}, $.fn.elevateZoom.options, options );

				//TINT OVERRIDE SETTINGS
				if(self.options.tint) {
					self.options.lensColour = "none", //colour of the lens background
					self.options.lensOpacity =  "1" //opacity of the lens
				}
				//INNER OVERRIDE SETTINGS
				if(self.options.zoomType == "inner") {self.options.showLens = false;}


				//Remove alt on hover

				self.$elem.parent().removeAttr('title').removeAttr('alt');

				self.zoomImage = self.imageSrc;

				self.refresh( 1 );



				//Create the image swap from the gallery 
				$('#'+self.options.gallery + ' a').click( function(e) { 

					//Set a class on the currently active gallery image
					if(self.options.galleryActiveClass){
						$('#'+self.options.gallery + ' a').removeClass(self.options.galleryActiveClass);
						$(this).addClass(self.options.galleryActiveClass);
					}
					//stop any link on the a tag from working
					e.preventDefault();

					//call the swap image function            
					if($(this).data("zoom-image")){self.zoomImagePre = $(this).data("zoom-image")}
					else{self.zoomImagePre = $(this).data("image");}
					self.swaptheimage($(this).data("image"), self.zoomImagePre);
					return false;
				});

			},

			refresh: function( length ) {
				var self = this;

				setTimeout(function() {
					self.fetch(self.imageSrc);

				}, length || self.options.refresh );
			},

			fetch: function(imgsrc) {
				//get the image
				var self = this;
				var newImg = new Image();
				newImg.onload = function() {
					//set the large image dimensions - used to calculte ratio's
					self.largeWidth = newImg.width;
					self.largeHeight = newImg.height;
					//once image is loaded start the calls
					self.startZoom();
					self.currentImage = self.imageSrc;
					//let caller know image has been loaded
					self.options.onZoomedImageLoaded(self.$elem);
				}
				newImg.src = imgsrc; // this must be done AFTER setting onload

				return;

			},

			startZoom: function( ) {
				var self = this;
				//get dimensions of the non zoomed image
				self.nzWidth = self.$elem.width();
				self.nzHeight = self.$elem.height();

				//activated elements
				self.isWindowActive = false;
				self.isLensActive = false;
				self.isTintActive = false;
				self.overWindow = false;    

				//CrossFade Wrappe
				if(self.options.imageCrossfade){
					self.zoomWrap = self.$elem.wrap('<div style="height:'+self.nzHeight+'px;width:'+self.nzWidth+'px;" class="zoomWrapper" />');        
					self.$elem.css('position', 'absolute'); 
				}

				self.zoomLock = 1;
				self.scrollingLock = false;
				self.changeBgSize = false;
				self.currentZoomLevel = self.options.zoomLevel;


				//get offset of the non zoomed image
				self.nzOffset = self.$elem.offset();
				//calculate the width ratio of the large/small image
				self.widthRatio = (self.largeWidth/self.currentZoomLevel) / self.nzWidth;
				self.heightRatio = (self.largeHeight/self.currentZoomLevel) / self.nzHeight; 


				//if window zoom        
				if(self.options.zoomType == "window") {
					self.zoomWindowStyle = "overflow: hidden;"
						+ "background-position: 0px 0px;text-align:center;"  
						+ "background-color: " + String(self.options.zoomWindowBgColour)            
						+ ";width: " + String(self.options.zoomWindowWidth) + "px;"
						+ "height: " + String(self.options.zoomWindowHeight)
						+ "px;float: left;"
						+ "background-size: "+ self.largeWidth/self.currentZoomLevel+ "px " +self.largeHeight/self.currentZoomLevel + "px;"
						+ "display: none;z-index:100;"
						+ "border: " + String(self.options.borderSize) 
						+ "px solid " + self.options.borderColour 
						+ ";background-repeat: no-repeat;"
						+ "position: absolute;";
				}    


				//if inner  zoom    
				if(self.options.zoomType == "inner") {
					//has a border been put on the image? Lets cater for this

					var borderWidth = self.$elem.css("border-left-width");

					self.zoomWindowStyle = "overflow: hidden;"
						+ "margin-left: " + String(borderWidth) + ";" 
						+ "margin-top: " + String(borderWidth) + ";"         
						+ "background-position: 0px 0px;"
						+ "width: " + String(self.nzWidth) + "px;"
						+ "height: " + String(self.nzHeight) + "px;"
						+ "px;float: left;"
						+ "display: none;"
						+ "cursor:"+(self.options.cursor)+";"
						+ "px solid " + self.options.borderColour 
						+ ";background-repeat: no-repeat;"
						+ "position: absolute;";
				}    



				//lens style for window zoom
				if(self.options.zoomType == "window") {


					// adjust images less than the window height

					if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
						lensHeight = self.nzHeight;              
					}
					else{
						lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
					}
					if(self.largeWidth < self.options.zoomWindowWidth){
						lensWidth = self.nzWidth;
					}       
					else{
						lensWidth =  (self.options.zoomWindowWidth/self.widthRatio);
					}


					self.lensStyle = "background-position: 0px 0px;width: " + String((self.options.zoomWindowWidth)/self.widthRatio) + "px;height: " + String((self.options.zoomWindowHeight)/self.heightRatio)
					+ "px;float: right;display: none;"
					+ "overflow: hidden;"
					+ "z-index: 999;"   
					+ "-webkit-transform: translateZ(0);"               
					+ "opacity:"+(self.options.lensOpacity)+";filter: alpha(opacity = "+(self.options.lensOpacity*100)+"); zoom:1;"
					+ "width:"+lensWidth+"px;"
					+ "height:"+lensHeight+"px;"
					+ "background-color:"+(self.options.lensColour)+";"					
					+ "cursor:"+(self.options.cursor)+";"
					+ "border: "+(self.options.lensBorderSize)+"px" +
					" solid "+(self.options.lensBorderColour)+";background-repeat: no-repeat;position: absolute;";
				} 


				//tint style
				self.tintStyle = "display: block;"
					+ "position: absolute;"
					+ "background-color: "+self.options.tintColour+";"	
					+ "filter:alpha(opacity=0);"		
					+ "opacity: 0;"	
					+ "width: " + self.nzWidth + "px;"
					+ "height: " + self.nzHeight + "px;"

					;

				//lens style for lens zoom with optional round for modern browsers
				self.lensRound = '';

				if(self.options.zoomType == "lens") {

					self.lensStyle = "background-position: 0px 0px;"
						+ "float: left;display: none;"
						+ "border: " + String(self.options.borderSize) + "px solid " + self.options.borderColour+";"
						+ "width:"+ String(self.options.lensSize) +"px;"
						+ "height:"+ String(self.options.lensSize)+"px;"
						+ "background-repeat: no-repeat;position: absolute;";


				}


				//does not round in all browsers
				if(self.options.lensShape == "round") {
					self.lensRound = "border-top-left-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
					+ "border-top-right-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
					+ "border-bottom-left-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
					+ "border-bottom-right-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;";

				}

				//create the div's                                                + ""
				//self.zoomContainer = $('<div/>').addClass('zoomContainer').css({"position":"relative", "height":self.nzHeight, "width":self.nzWidth});

				self.zoomContainer = $('<div class="zoomContainer" style="-webkit-transform: translateZ(0);position:absolute;left:'+self.nzOffset.left+'px;top:'+self.nzOffset.top+'px;height:'+self.nzHeight+'px;width:'+self.nzWidth+'px;"></div>');
				$('body').append(self.zoomContainer);	


				//this will add overflow hidden and contrain the lens on lens mode       
				if(self.options.containLensZoom && self.options.zoomType == "lens"){
					self.zoomContainer.css("overflow", "hidden");
				}
				if(self.options.zoomType != "inner") {
					self.zoomLens = $("<div class='zoomLens' style='" + self.lensStyle + self.lensRound +"'>&nbsp;</div>")
					.appendTo(self.zoomContainer)
					.click(function () {
						self.$elem.trigger('click');
					});


					if(self.options.tint) {
						self.tintContainer = $('<div/>').addClass('tintContainer');	
						self.zoomTint = $("<div class='zoomTint' style='"+self.tintStyle+"'></div>");


						self.zoomLens.wrap(self.tintContainer);


						self.zoomTintcss = self.zoomLens.after(self.zoomTint);	

						//if tint enabled - set an image to show over the tint

						self.zoomTintImage = $('<img style="position: absolute; left: 0px; top: 0px; max-width: none; width: '+self.nzWidth+'px; height: '+self.nzHeight+'px;" src="'+self.imageSrc+'">')
						.appendTo(self.zoomLens)
						.click(function () {

							self.$elem.trigger('click');
						});

					}          

				}







				//create zoom window 
				if(isNaN(self.options.zoomWindowPosition)){
					self.zoomWindow = $("<div style='z-index:999;left:"+(self.windowOffsetLeft)+"px;top:"+(self.windowOffsetTop)+"px;" + self.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>")
					.appendTo('body')
					.click(function () {
						self.$elem.trigger('click');
					});
				}else{
					self.zoomWindow = $("<div style='z-index:999;left:"+(self.windowOffsetLeft)+"px;top:"+(self.windowOffsetTop)+"px;" + self.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>")
					.appendTo(self.zoomContainer)
					.click(function () {
						self.$elem.trigger('click');
					});
				}              
				self.zoomWindowContainer = $('<div/>').addClass('zoomWindowContainer').css("width",self.options.zoomWindowWidth);
				self.zoomWindow.wrap(self.zoomWindowContainer);


				//  self.captionStyle = "text-align: left;background-color: black;color: white;font-weight: bold;padding: 10px;font-family: sans-serif;font-size: 11px";                                                                                                                                                                                                                                          
				// self.zoomCaption = $('<div class="elevatezoom-caption" style="'+self.captionStyle+'display: block; width: 280px;">INSERT ALT TAG</div>').appendTo(self.zoomWindow.parent());

				if(self.options.zoomType == "lens") {
					self.zoomLens.css({ backgroundImage: "url('" + self.imageSrc + "')" }); 
				}
				if(self.options.zoomType == "window") {
					self.zoomWindow.css({ backgroundImage: "url('" + self.imageSrc + "')" }); 
				}
				if(self.options.zoomType == "inner") {
					self.zoomWindow.css({ backgroundImage: "url('" + self.imageSrc + "')" }); 
				}
				/*-------------------END THE ZOOM WINDOW AND LENS----------------------------------*/
				//touch events
				self.$elem.bind('touchmove', function(e){    
					e.preventDefault();
					var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];  
					self.setPosition(touch);

				});  
				self.zoomContainer.bind('touchmove', function(e){ 
					if(self.options.zoomType == "inner") {
						self.showHideWindow("show");

					}
					e.preventDefault();
					var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];  
					self.setPosition(touch); 

				});  	
				self.zoomContainer.bind('touchend', function(e){ 
					self.showHideWindow("hide");
					if(self.options.showLens) {self.showHideLens("hide");}
					if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("hide");}
				});  	

				self.$elem.bind('touchend', function(e){ 
					self.showHideWindow("hide");
					if(self.options.showLens) {self.showHideLens("hide");}
					if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("hide");}
				});  	
				if(self.options.showLens) {
					self.zoomLens.bind('touchmove', function(e){ 

						e.preventDefault();
						var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];  
						self.setPosition(touch); 
					});    


					self.zoomLens.bind('touchend', function(e){ 
						self.showHideWindow("hide");
						if(self.options.showLens) {self.showHideLens("hide");}
						if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("hide");}
					});  
				}
				//Needed to work in IE
				self.$elem.bind('mousemove', function(e){   
					if(self.overWindow == false){self.setElements("show");}
					//make sure on orientation change the setposition is not fired
					if(self.lastX !== e.clientX || self.lastY !== e.clientY){
						self.setPosition(e);
						self.currentLoc = e;
					}   
					self.lastX = e.clientX;
					self.lastY = e.clientY;    

				});  	

				self.zoomContainer.bind('mousemove', function(e){ 

					if(self.overWindow == false){self.setElements("show");} 

					//make sure on orientation change the setposition is not fired 
					if(self.lastX !== e.clientX || self.lastY !== e.clientY){
						self.setPosition(e);
						self.currentLoc = e;
					}   
					self.lastX = e.clientX;
					self.lastY = e.clientY;    
				});  	
				if(self.options.zoomType != "inner") {
					self.zoomLens.bind('mousemove', function(e){      
						//make sure on orientation change the setposition is not fired
						if(self.lastX !== e.clientX || self.lastY !== e.clientY){
							self.setPosition(e);
							self.currentLoc = e;
						}   
						self.lastX = e.clientX;
						self.lastY = e.clientY;    
					});
				}
				if(self.options.tint && self.options.zoomType != "inner") {
					self.zoomTint.bind('mousemove', function(e){ 
						//make sure on orientation change the setposition is not fired
						if(self.lastX !== e.clientX || self.lastY !== e.clientY){
							self.setPosition(e);
							self.currentLoc = e;
						}   
						self.lastX = e.clientX;
						self.lastY = e.clientY;    
					});

				}
				if(self.options.zoomType == "inner") {
					self.zoomWindow.bind('mousemove', function(e) {
						//self.overWindow = true;
						//make sure on orientation change the setposition is not fired
						if(self.lastX !== e.clientX || self.lastY !== e.clientY){
							self.setPosition(e);
							self.currentLoc = e;
						}   
						self.lastX = e.clientX;
						self.lastY = e.clientY;    
					});

				}


				//  lensFadeOut: 500,  zoomTintFadeIn
				self.zoomContainer.add(self.$elem).mouseenter(function(){

					if(self.overWindow == false){self.setElements("show");} 


				}).mouseleave(function(){
					if(!self.scrollLock){
						self.setElements("hide");
            self.options.onDestroy(self.$elem);
					}
				});
				//end ove image





				if(self.options.zoomType != "inner") {
					self.zoomWindow.mouseenter(function(){
						self.overWindow = true;   
						self.setElements("hide");                  
					}).mouseleave(function(){

						self.overWindow = false;
					});
				}
				//end ove image



//				var delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail);

				//      $(this).empty();    
				//    return false;

				//fix for initial zoom setting
				if (self.options.zoomLevel != 1){
					//	self.changeZoomLevel(self.currentZoomLevel);
				}
				//set the min zoomlevel
				if(self.options.minZoomLevel){
					self.minZoomLevel = self.options.minZoomLevel;
				}
				else{
					self.minZoomLevel = self.options.scrollZoomIncrement * 2;
				}


				if(self.options.scrollZoom){


					self.zoomContainer.add(self.$elem).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(e){


//						in IE there is issue with firing of mouseleave - So check whether still scrolling
//						and on mouseleave check if scrolllock          
						self.scrollLock = true;
						clearTimeout($.data(this, 'timer'));
						$.data(this, 'timer', setTimeout(function() {
							self.scrollLock = false;
							//do something
						}, 250));

						var theEvent = e.originalEvent.wheelDelta || e.originalEvent.detail*-1


						//this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
						//   e.preventDefault();


						e.stopImmediatePropagation();
						e.stopPropagation();
						e.preventDefault();


						if(theEvent /120 > 0) {
							//scrolling up
							if(self.currentZoomLevel >= self.minZoomLevel){ 
								self.changeZoomLevel(self.currentZoomLevel-self.options.scrollZoomIncrement);        
							}

						}
						else{
							//scrolling down


							if(self.options.maxZoomLevel){
								if(self.currentZoomLevel <= self.options.maxZoomLevel){           
									self.changeZoomLevel(parseFloat(self.currentZoomLevel)+self.options.scrollZoomIncrement);
								}
							}
							else{
								//andy 

								self.changeZoomLevel(parseFloat(self.currentZoomLevel)+self.options.scrollZoomIncrement);
							}

						}
						return false;
					});
				}


			},
			setElements: function(type) {
				var self = this;
        if(!self.options.zoomEnabled){return false;}
				if(type=="show"){
					if(self.isWindowSet){
						if(self.options.zoomType == "inner") {self.showHideWindow("show");}
						if(self.options.zoomType == "window") {self.showHideWindow("show");}
						if(self.options.showLens) {self.showHideLens("show");}
						if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("show");
						}
					}
				}

				if(type=="hide"){
					if(self.options.zoomType == "window") {self.showHideWindow("hide");}
					if(!self.options.tint) {self.showHideWindow("hide");}
					if(self.options.showLens) {self.showHideLens("hide");}
					if(self.options.tint) {	self.showHideTint("hide");}
				}   
			},
			setPosition: function(e) {
      
				var self = this;
        
        if(!self.options.zoomEnabled){return false;}

				//recaclc offset each time in case the image moves
				//this can be caused by other on page elements
				self.nzHeight = self.$elem.height();
				self.nzWidth = self.$elem.width();
				self.nzOffset = self.$elem.offset();

				if(self.options.tint && self.options.zoomType != "inner") {
					self.zoomTint.css({ top: 0});
					self.zoomTint.css({ left: 0});
				}
				//set responsive       
				//will checking if the image needs changing before running this code work faster?
				if(self.options.responsive && !self.options.scrollZoom){
					if(self.options.showLens){ 
						if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
							lensHeight = self.nzHeight;              
						}
						else{
							lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
						}
						if(self.largeWidth < self.options.zoomWindowWidth){
							lensWidth = self.nzWidth;
						}       
						else{
							lensWidth =  (self.options.zoomWindowWidth/self.widthRatio);
						}
						self.widthRatio = self.largeWidth / self.nzWidth;
						self.heightRatio = self.largeHeight / self.nzHeight;        
						if(self.options.zoomType != "lens") {


							//possibly dont need to keep recalcalculating
							//if the lens is heigher than the image, then set lens size to image size
							if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
								lensHeight = self.nzHeight;  

							}
							else{
								lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
							}

							if(self.nzWidth < self.options.zoomWindowHeight/self.heightRatio){
								lensWidth = self.nzWidth;
							}       
							else{
								lensWidth =  String((self.options.zoomWindowWidth/self.widthRatio));
							}            

							self.zoomLens.css('width', lensWidth);    
							self.zoomLens.css('height', lensHeight); 

							if(self.options.tint){    
								self.zoomTintImage.css('width', self.nzWidth);    
								self.zoomTintImage.css('height', self.nzHeight); 
							}

						}                     
						if(self.options.zoomType == "lens") {  

							self.zoomLens.css({ width: String(self.options.lensSize) + 'px', height: String(self.options.lensSize) + 'px' })      


						}        
						//end responsive image change
					}
				}

				//container fix
				self.zoomContainer.css({ top: self.nzOffset.top});
				self.zoomContainer.css({ left: self.nzOffset.left});
				self.mouseLeft = parseInt(e.pageX - self.nzOffset.left);
				self.mouseTop = parseInt(e.pageY - self.nzOffset.top);
				//calculate the Location of the Lens

				//calculate the bound regions - but only if zoom window
				if(self.options.zoomType == "window") {
					self.Etoppos = (self.mouseTop < (self.zoomLens.height()/2));
					self.Eboppos = (self.mouseTop > self.nzHeight - (self.zoomLens.height()/2)-(self.options.lensBorderSize*2));
					self.Eloppos = (self.mouseLeft < 0+((self.zoomLens.width()/2))); 
					self.Eroppos = (self.mouseLeft > (self.nzWidth - (self.zoomLens.width()/2)-(self.options.lensBorderSize*2)));  
				}
				//calculate the bound regions - but only for inner zoom
				if(self.options.zoomType == "inner"){ 
					self.Etoppos = (self.mouseTop < ((self.nzHeight/2)/self.heightRatio) );
					self.Eboppos = (self.mouseTop > (self.nzHeight - ((self.nzHeight/2)/self.heightRatio)));
					self.Eloppos = (self.mouseLeft < 0+(((self.nzWidth/2)/self.widthRatio)));
					self.Eroppos = (self.mouseLeft > (self.nzWidth - (self.nzWidth/2)/self.widthRatio-(self.options.lensBorderSize*2)));  
				}

				// if the mouse position of the slider is one of the outerbounds, then hide  window and lens
				if (self.mouseLeft < 0 || self.mouseTop < 0 || self.mouseLeft > self.nzWidth || self.mouseTop > self.nzHeight ) {				          
					self.setElements("hide");
					return;
				}
				//else continue with operations
				else {


					//lens options
					if(self.options.showLens) {
						//		self.showHideLens("show");
						//set background position of lens
						self.lensLeftPos = String(Math.floor(self.mouseLeft - self.zoomLens.width() / 2));
						self.lensTopPos = String(Math.floor(self.mouseTop - self.zoomLens.height() / 2));


					}
					//adjust the background position if the mouse is in one of the outer regions 

					//Top region
					if(self.Etoppos){
						self.lensTopPos = 0;
					}
					//Left Region
					if(self.Eloppos){
						self.windowLeftPos = 0;
						self.lensLeftPos = 0;
						self.tintpos=0;
					}     
					//Set bottom and right region for window mode
					if(self.options.zoomType == "window") {
						if(self.Eboppos){
							self.lensTopPos = Math.max( (self.nzHeight)-self.zoomLens.height()-(self.options.lensBorderSize*2), 0 );
						} 
						if(self.Eroppos){
							self.lensLeftPos = (self.nzWidth-(self.zoomLens.width())-(self.options.lensBorderSize*2));
						}  
					}  
					//Set bottom and right region for inner mode
					if(self.options.zoomType == "inner") {
						if(self.Eboppos){
							self.lensTopPos = Math.max( ((self.nzHeight)-(self.options.lensBorderSize*2)), 0 );
						} 
						if(self.Eroppos){
							self.lensLeftPos = (self.nzWidth-(self.nzWidth)-(self.options.lensBorderSize*2));
						}  

					}
					//if lens zoom
					if(self.options.zoomType == "lens") {  
						self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomLens.width() / 2) * (-1));   
						self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomLens.height() / 2) * (-1));

						self.zoomLens.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });

						if(self.changeBgSize){  

							if(self.nzHeight>self.nzWidth){  
								if(self.options.zoomType == "lens"){       
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
								}   

								self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
							}
							else{     
								if(self.options.zoomType == "lens"){       
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });
								}   
								self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            
							}
							self.changeBgSize = false;
						}    

						self.setWindowPostition(e);  
					}
					//if tint zoom   
					if(self.options.tint && self.options.zoomType != "inner") {
						self.setTintPosition(e);

					}
					//set the css background position 
					if(self.options.zoomType == "window") {
						self.setWindowPostition(e);   
					}
					if(self.options.zoomType == "inner") {
						self.setWindowPostition(e);   
					}
					if(self.options.showLens) {

						if(self.fullwidth && self.options.zoomType != "lens"){
							self.lensLeftPos = 0;

						}
						self.zoomLens.css({ left: self.lensLeftPos + 'px', top: self.lensTopPos + 'px' })  
					}

				} //end else



			},
			showHideWindow: function(change) {
				var self = this;              
				if(change == "show"){      
					if(!self.isWindowActive){
						if(self.options.zoomWindowFadeIn){
							self.zoomWindow.stop(true, true, false).fadeIn(self.options.zoomWindowFadeIn);
						}
						else{self.zoomWindow.show();}
						self.isWindowActive = true;
					}            
				}
				if(change == "hide"){
					if(self.isWindowActive){
						if(self.options.zoomWindowFadeOut){
							self.zoomWindow.stop(true, true).fadeOut(self.options.zoomWindowFadeOut, function () {
								if (self.loop) {
									//stop moving the zoom window when zoom window is faded out
									clearInterval(self.loop);
									self.loop = false;
								}
							});
						}
						else{self.zoomWindow.hide();}
						self.isWindowActive = false;        
					}      
				}
			},
			showHideLens: function(change) {
				var self = this;              
				if(change == "show"){      
					if(!self.isLensActive){
						if(self.options.lensFadeIn){
							self.zoomLens.stop(true, true, false).fadeIn(self.options.lensFadeIn);
						}
						else{self.zoomLens.show();}
						self.isLensActive = true;
					}            
				}
				if(change == "hide"){
					if(self.isLensActive){
						if(self.options.lensFadeOut){
							self.zoomLens.stop(true, true).fadeOut(self.options.lensFadeOut);
						}
						else{self.zoomLens.hide();}
						self.isLensActive = false;        
					}      
				}
			},
			showHideTint: function(change) {
				var self = this;              
				if(change == "show"){      
					if(!self.isTintActive){

						if(self.options.zoomTintFadeIn){
							self.zoomTint.css({opacity:self.options.tintOpacity}).animate().stop(true, true).fadeIn("slow");
						}
						else{
							self.zoomTint.css({opacity:self.options.tintOpacity}).animate();
							self.zoomTint.show();


						}
						self.isTintActive = true;
					}            
				}
				if(change == "hide"){      
					if(self.isTintActive){ 

						if(self.options.zoomTintFadeOut){
							self.zoomTint.stop(true, true).fadeOut(self.options.zoomTintFadeOut);
						}
						else{self.zoomTint.hide();}
						self.isTintActive = false;        
					}      
				}
			},
			setLensPostition: function( e ) {


			},
			setWindowPostition: function( e ) {
				//return obj.slice( 0, count );
				var self = this;

				if(!isNaN(self.options.zoomWindowPosition)){

					switch (self.options.zoomWindowPosition) { 
					case 1: //done         
						self.windowOffsetTop = (self.options.zoomWindowOffety);//DONE - 1
						self.windowOffsetLeft =(+self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;
					case 2:
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin

							self.windowOffsetTop = ((self.options.zoomWindowHeight/2)-(self.nzHeight/2))*(-1);
							self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						}
						else{ //negative margin

						}
						break;
					case 3: //done        
						self.windowOffsetTop = (self.nzHeight - self.zoomWindow.height() - (self.options.borderSize*2)); //DONE 3,9
						self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;      
					case 4: //done  
						self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
						self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;
					case 5: //done  
						self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
						self.windowOffsetLeft =(self.nzWidth-self.zoomWindow.width()-(self.options.borderSize*2)); //DONE - 5,15
						break;
					case 6: 
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin
							self.windowOffsetTop = (self.nzHeight);  //DONE - 4,5,6,7,8

							self.windowOffsetLeft =((self.options.zoomWindowWidth/2)-(self.nzWidth/2)+(self.options.borderSize*2))*(-1);  
						}
						else{ //negative margin

						}


						break;
					case 7: //done  
						self.windowOffsetTop = (self.nzHeight);  //DONE - 4,5,6,7,8
						self.windowOffsetLeft = 0; //DONE 7, 13
						break;
					case 8: //done  
						self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 9:  //done  
						self.windowOffsetTop = (self.nzHeight - self.zoomWindow.height() - (self.options.borderSize*2)); //DONE 3,9
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 10: 
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin

							self.windowOffsetTop = ((self.options.zoomWindowHeight/2)-(self.nzHeight/2))*(-1);
							self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						}
						else{ //negative margin

						}
						break;
					case 11: 
						self.windowOffsetTop = (self.options.zoomWindowOffety);
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 12: //done  
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 13: //done  
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(0); //DONE 7, 13
						break;
					case 14: 
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin
							self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16

							self.windowOffsetLeft =((self.options.zoomWindowWidth/2)-(self.nzWidth/2)+(self.options.borderSize*2))*(-1);  
						}
						else{ //negative margin

						}

						break;
					case 15://done   
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(self.nzWidth-self.zoomWindow.width()-(self.options.borderSize*2)); //DONE - 5,15
						break;
					case 16:  //done  
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;            
					default: //done  
						self.windowOffsetTop = (self.options.zoomWindowOffety);//DONE - 1
					self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
					} 
				} //end isNAN
				else{
					//WE CAN POSITION IN A CLASS - ASSUME THAT ANY STRING PASSED IS
					self.externalContainer = $('#'+self.options.zoomWindowPosition);
					self.externalContainerWidth = self.externalContainer.width();
					self.externalContainerHeight = self.externalContainer.height();
					self.externalContainerOffset = self.externalContainer.offset();

					self.windowOffsetTop = self.externalContainerOffset.top;//DONE - 1
					self.windowOffsetLeft =self.externalContainerOffset.left; //DONE 1, 2, 3, 4, 16

				}
				self.isWindowSet = true;
				self.windowOffsetTop = self.windowOffsetTop + self.options.zoomWindowOffety;
				self.windowOffsetLeft = self.windowOffsetLeft + self.options.zoomWindowOffetx;

				self.zoomWindow.css({ top: self.windowOffsetTop});
				self.zoomWindow.css({ left: self.windowOffsetLeft});

				if(self.options.zoomType == "inner") {
					self.zoomWindow.css({ top: 0});
					self.zoomWindow.css({ left: 0});

				}   


				self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * (-1));   
				self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * (-1));
				if(self.Etoppos){self.windowTopPos = 0;}
				if(self.Eloppos){self.windowLeftPos = 0;}     
				if(self.Eboppos){self.windowTopPos = (self.largeHeight/self.currentZoomLevel-self.zoomWindow.height())*(-1);  } 
				if(self.Eroppos){self.windowLeftPos = ((self.largeWidth/self.currentZoomLevel-self.zoomWindow.width())*(-1));}    

				//stops micro movements
				if(self.fullheight){
					self.windowTopPos = 0;

				}
				if(self.fullwidth){
					self.windowLeftPos = 0;

				}
				//set the css background position 


				if(self.options.zoomType == "window" || self.options.zoomType == "inner") {

					if(self.zoomLock == 1){
						//overrides for images not zoomable
						if(self.widthRatio <= 1){

							self.windowLeftPos = 0;
						}
						if(self.heightRatio <= 1){ 
							self.windowTopPos = 0;
						}
					}
					// adjust images less than the window height

					if (self.options.zoomType == "window") {
						if (self.largeHeight < self.options.zoomWindowHeight) {

							self.windowTopPos = 0;
						}
						if (self.largeWidth < self.options.zoomWindowWidth) {
							self.windowLeftPos = 0;
						}
					}

					//set the zoomwindow background position
					if (self.options.easing){

						//     if(self.changeZoom){
						//           clearInterval(self.loop);
						//           self.changeZoom = false;
						//           self.loop = false;

						//            }
						//set the pos to 0 if not set
						if(!self.xp){self.xp = 0;}
						if(!self.yp){self.yp = 0;}  
						//if loop not already started, then run it 
						if (!self.loop){           
							self.loop = setInterval(function(){                
								//using zeno's paradox    

								self.xp += (self.windowLeftPos  - self.xp) / self.options.easingAmount; 
								self.yp += (self.windowTopPos  - self.yp) / self.options.easingAmount;
								if(self.scrollingLock){


									clearInterval(self.loop);
									self.xp = self.windowLeftPos;
									self.yp = self.windowTopPos            

									self.xp = ((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * (-1);
									self.yp = (((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * (-1));                         

									if(self.changeBgSize){    
										if(self.nzHeight>self.nzWidth){  
											if(self.options.zoomType == "lens"){      
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
											}   
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
										}
										else{   
											if(self.options.zoomType != "lens"){      
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
											}            
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            

										}

										/*
             if(!self.bgxp){self.bgxp = self.largeWidth/self.newvalue;}
						if(!self.bgyp){self.bgyp = self.largeHeight/self.newvalue ;}  
                 if (!self.bgloop){   
                 	self.bgloop = setInterval(function(){   

                 self.bgxp += (self.largeWidth/self.newvalue  - self.bgxp) / self.options.easingAmount; 
								self.bgyp += (self.largeHeight/self.newvalue  - self.bgyp) / self.options.easingAmount;

           self.zoomWindow.css({ "background-size": self.bgxp + 'px ' + self.bgyp + 'px' });


                  }, 16);

                 }
										 */
										self.changeBgSize = false;
									}

									self.zoomWindow.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });
									self.scrollingLock = false;
									self.loop = false;

								}
								else if (Math.round(Math.abs(self.xp - self.windowLeftPos) + Math.abs(self.yp - self.windowTopPos)) < 1) {
									//stops micro movements
									clearInterval(self.loop);
									self.zoomWindow.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });
									self.loop = false;
								}
								else{
									if(self.changeBgSize){    
										if(self.nzHeight>self.nzWidth){ 
											if(self.options.zoomType == "lens"){      
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
											}         
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
										}
										else{                 
											if(self.options.zoomType != "lens"){     
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });
											}      
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            
										}
										self.changeBgSize = false;
									}                   

									self.zoomWindow.css({ backgroundPosition: self.xp + 'px ' + self.yp + 'px' });
								}       
							}, 16);
						}
					}   
					else{    
						if(self.changeBgSize){  
							if(self.nzHeight>self.nzWidth){  
								if(self.options.zoomType == "lens"){      
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
								} 

								self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
							}
							else{     
								if(self.options.zoomType == "lens"){      
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });
								} 
								if((self.largeHeight/self.newvaluewidth) < self.options.zoomWindowHeight){ 

									self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            
								}
								else{

									self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });   
								}

							}
							self.changeBgSize = false;
						}     

						self.zoomWindow.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });       
					}
				} 
			},
			setTintPosition: function(e){
				var self = this;
				self.nzOffset = self.$elem.offset();
				self.tintpos = String(((e.pageX - self.nzOffset.left)-(self.zoomLens.width() / 2)) * (-1)); 
				self.tintposy = String(((e.pageY - self.nzOffset.top) - self.zoomLens.height() / 2) * (-1));	
				if(self.Etoppos){
					self.tintposy = 0;
				}
				if(self.Eloppos){
					self.tintpos=0;
				}     
				if(self.Eboppos){
					self.tintposy = (self.nzHeight-self.zoomLens.height()-(self.options.lensBorderSize*2))*(-1);
				} 
				if(self.Eroppos){
					self.tintpos = ((self.nzWidth-self.zoomLens.width()-(self.options.lensBorderSize*2))*(-1));
				}    
				if(self.options.tint) {
					//stops micro movements
					if(self.fullheight){
						self.tintposy = 0;

					}
					if(self.fullwidth){ 
						self.tintpos = 0;

					}   
					self.zoomTintImage.css({'left': self.tintpos+'px'});
					self.zoomTintImage.css({'top': self.tintposy+'px'});
				}
			},

			swaptheimage: function(smallimage, largeimage){
				var self = this;
				var newImg = new Image(); 

				if(self.options.loadingIcon){
					self.spinner = $('<div style="background: url(\''+self.options.loadingIcon+'\') no-repeat center;height:'+self.nzHeight+'px;width:'+self.nzWidth+'px;z-index: 2000;position: absolute; background-position: center center;"></div>');
					self.$elem.after(self.spinner);
				}

				self.options.onImageSwap(self.$elem);

				newImg.onload = function() {
					self.largeWidth = newImg.width;
					self.largeHeight = newImg.height;
					self.zoomImage = largeimage;
					self.zoomWindow.css({ "background-size": self.largeWidth + 'px ' + self.largeHeight + 'px' });
					self.swapAction(smallimage, largeimage);
					return;              
				}          
				newImg.src = largeimage; // this must be done AFTER setting onload

			},
			swapAction: function(smallimage, largeimage){


				var self = this;    

				var newImg2 = new Image(); 
				newImg2.onload = function() {
					//re-calculate values
					self.nzHeight = newImg2.height;
					self.nzWidth = newImg2.width;
					self.options.onImageSwapComplete(self.$elem);

					self.doneCallback();  
					return;      
				}          
				newImg2.src = smallimage; 

				//reset the zoomlevel to that initially set in options
				self.currentZoomLevel = self.options.zoomLevel;
				self.options.maxZoomLevel = false;

				//swaps the main image
				//self.$elem.attr("src",smallimage);
				//swaps the zoom image     
				if(self.options.zoomType == "lens") {
					self.zoomLens.css({ backgroundImage: "url('" + largeimage + "')" }); 
				}
				if(self.options.zoomType == "window") {
					self.zoomWindow.css({ backgroundImage: "url('" + largeimage + "')" }); 
				}
				if(self.options.zoomType == "inner") {
					self.zoomWindow.css({ backgroundImage: "url('" + largeimage + "')" }); 
				} 



				self.currentImage = largeimage;

				if(self.options.imageCrossfade){
					var oldImg = self.$elem;
					var newImg = oldImg.clone();         
					self.$elem.attr("src",smallimage)
					self.$elem.after(newImg);
					newImg.stop(true).fadeOut(self.options.imageCrossfade, function() {
						$(this).remove();         
					});

					//       				if(self.options.zoomType == "inner"){
					//remove any attributes on the cloned image so we can resize later
					self.$elem.width("auto").removeAttr("width");
					self.$elem.height("auto").removeAttr("height");
					//   }

					oldImg.fadeIn(self.options.imageCrossfade);

					if(self.options.tint && self.options.zoomType != "inner") {

						var oldImgTint = self.zoomTintImage;
						var newImgTint = oldImgTint.clone();         
						self.zoomTintImage.attr("src",largeimage)
						self.zoomTintImage.after(newImgTint);
						newImgTint.stop(true).fadeOut(self.options.imageCrossfade, function() {
							$(this).remove();         
						});



						oldImgTint.fadeIn(self.options.imageCrossfade);


						//self.zoomTintImage.attr("width",elem.data("image"));

						//resize the tint window
						self.zoomTint.css({ height: self.$elem.height()});
						self.zoomTint.css({ width: self.$elem.width()});
					}    

					self.zoomContainer.css("height", self.$elem.height());
					self.zoomContainer.css("width", self.$elem.width());

					if(self.options.zoomType == "inner"){ 
						if(!self.options.constrainType){
							self.zoomWrap.parent().css("height", self.$elem.height());
							self.zoomWrap.parent().css("width", self.$elem.width());

							self.zoomWindow.css("height", self.$elem.height());
							self.zoomWindow.css("width", self.$elem.width());
						}
					} 

					if(self.options.imageCrossfade){  
						self.zoomWrap.css("height", self.$elem.height());
						self.zoomWrap.css("width", self.$elem.width());
					} 
				}
				else{
					self.$elem.attr("src",smallimage); 
					if(self.options.tint) {
						self.zoomTintImage.attr("src",largeimage);
						//self.zoomTintImage.attr("width",elem.data("image"));
						self.zoomTintImage.attr("height",self.$elem.height());
						//self.zoomTintImage.attr('src') = elem.data("image");
						self.zoomTintImage.css({ height: self.$elem.height()}); 
						self.zoomTint.css({ height: self.$elem.height()});

					}
					self.zoomContainer.css("height", self.$elem.height());
					self.zoomContainer.css("width", self.$elem.width());

					if(self.options.imageCrossfade){  
						self.zoomWrap.css("height", self.$elem.height());
						self.zoomWrap.css("width", self.$elem.width());
					} 
				}              
				if(self.options.constrainType){     

					//This will contrain the image proportions
					if(self.options.constrainType == "height"){ 

						self.zoomContainer.css("height", self.options.constrainSize);
						self.zoomContainer.css("width", "auto");

						if(self.options.imageCrossfade){  
							self.zoomWrap.css("height", self.options.constrainSize);
							self.zoomWrap.css("width", "auto"); 
							self.constwidth = self.zoomWrap.width();


						}
						else{                  
							self.$elem.css("height", self.options.constrainSize);
							self.$elem.css("width", "auto");
							self.constwidth = self.$elem.width();
						} 

						if(self.options.zoomType == "inner"){

							self.zoomWrap.parent().css("height", self.options.constrainSize);
							self.zoomWrap.parent().css("width", self.constwidth);   
							self.zoomWindow.css("height", self.options.constrainSize);
							self.zoomWindow.css("width", self.constwidth);    
						}        
						if(self.options.tint){
							self.tintContainer.css("height", self.options.constrainSize);
							self.tintContainer.css("width", self.constwidth);
							self.zoomTint.css("height", self.options.constrainSize);
							self.zoomTint.css("width", self.constwidth);
							self.zoomTintImage.css("height", self.options.constrainSize);
							self.zoomTintImage.css("width", self.constwidth); 
						} 

					}
					if(self.options.constrainType == "width"){       
						self.zoomContainer.css("height", "auto");
						self.zoomContainer.css("width", self.options.constrainSize);

						if(self.options.imageCrossfade){
							self.zoomWrap.css("height", "auto");
							self.zoomWrap.css("width", self.options.constrainSize);
							self.constheight = self.zoomWrap.height();
						}
						else{            
							self.$elem.css("height", "auto");
							self.$elem.css("width", self.options.constrainSize); 
							self.constheight = self.$elem.height();              
						} 
						if(self.options.zoomType == "inner"){
							self.zoomWrap.parent().css("height", self.constheight);
							self.zoomWrap.parent().css("width", self.options.constrainSize);   
							self.zoomWindow.css("height", self.constheight);
							self.zoomWindow.css("width", self.options.constrainSize);    
						} 
						if(self.options.tint){
							self.tintContainer.css("height", self.constheight);
							self.tintContainer.css("width", self.options.constrainSize);
							self.zoomTint.css("height", self.constheight);
							self.zoomTint.css("width", self.options.constrainSize);
							self.zoomTintImage.css("height", self.constheight);
							self.zoomTintImage.css("width", self.options.constrainSize); 
						}   

					}        


				}

			},
			doneCallback: function(){

				var self = this;
				if(self.options.loadingIcon){
					self.spinner.hide();     
				}   

				self.nzOffset = self.$elem.offset();
				self.nzWidth = self.$elem.width();
				self.nzHeight = self.$elem.height();

				// reset the zoomlevel back to default
				self.currentZoomLevel = self.options.zoomLevel;

				//ratio of the large to small image
				self.widthRatio = self.largeWidth / self.nzWidth;
				self.heightRatio = self.largeHeight / self.nzHeight; 

				//NEED TO ADD THE LENS SIZE FOR ROUND
				// adjust images less than the window height
				if(self.options.zoomType == "window") {

					if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
						lensHeight = self.nzHeight;  

					}
					else{
						lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
					}

					if(self.options.zoomWindowWidth < self.options.zoomWindowWidth){
						lensWidth = self.nzWidth;
					}       
					else{
						lensWidth =  (self.options.zoomWindowWidth/self.widthRatio);
					}


					if(self.zoomLens){

						self.zoomLens.css('width', lensWidth);    
						self.zoomLens.css('height', lensHeight); 


					}
				}
			},
			getCurrentImage: function(){
				var self = this;  
				return self.zoomImage; 
			}, 
			getGalleryList: function(){
				var self = this;   
				//loop through the gallery options and set them in list for fancybox
				self.gallerylist = [];
				if (self.options.gallery){ 


					$('#'+self.options.gallery + ' a').each(function() {

						var img_src = '';
						if($(this).data("zoom-image")){
							img_src = $(this).data("zoom-image");
						}
						else if($(this).data("image")){
							img_src = $(this).data("image");
						}			
						//put the current image at the start
						if(img_src == self.zoomImage){
							self.gallerylist.unshift({
								href: ''+img_src+'',
								title: $(this).find('img').attr("title")
							});	
						}
						else{
							self.gallerylist.push({
								href: ''+img_src+'',
								title: $(this).find('img').attr("title")
							});
						}


					});
				}                                                       
				//if no gallery - return current image
				else{
					self.gallerylist.push({
						href: ''+self.zoomImage+'',
						title: $(this).find('img').attr("title")
					}); 
				}
				return self.gallerylist;

			},
			changeZoomLevel: function(value){
				var self = this;   

				//flag a zoom, so can adjust the easing during setPosition     
				self.scrollingLock = true;   

				//round to two decimal places
				self.newvalue = parseFloat(value).toFixed(2);
				newvalue = parseFloat(value).toFixed(2);




				//maxwidth & Maxheight of the image
				maxheightnewvalue = self.largeHeight/((self.options.zoomWindowHeight / self.nzHeight) * self.nzHeight);     
				maxwidthtnewvalue = self.largeWidth/((self.options.zoomWindowWidth / self.nzWidth) * self.nzWidth);   	




				//calculate new heightratio
				if(self.options.zoomType != "inner")
				{
					if(maxheightnewvalue <= newvalue){
						self.heightRatio = (self.largeHeight/maxheightnewvalue) / self.nzHeight;
						self.newvalueheight = maxheightnewvalue;
						self.fullheight = true;

					}
					else{
						self.heightRatio = (self.largeHeight/newvalue) / self.nzHeight; 
						self.newvalueheight = newvalue;
						self.fullheight = false;

					}


//					calculate new width ratio

					if(maxwidthtnewvalue <= newvalue){
						self.widthRatio = (self.largeWidth/maxwidthtnewvalue) / self.nzWidth;
						self.newvaluewidth = maxwidthtnewvalue;
						self.fullwidth = true;

					}
					else{
						self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
						self.newvaluewidth = newvalue;
						self.fullwidth = false;

					}
					if(self.options.zoomType == "lens"){
						if(maxheightnewvalue <= newvalue){
							self.fullwidth = true;
							self.newvaluewidth = maxheightnewvalue;

						} else{
							self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
							self.newvaluewidth = newvalue;

							self.fullwidth = false;
						}}
				}



				if(self.options.zoomType == "inner")
				{
					maxheightnewvalue = parseFloat(self.largeHeight/self.nzHeight).toFixed(2);     
					maxwidthtnewvalue = parseFloat(self.largeWidth/self.nzWidth).toFixed(2);      
					if(newvalue > maxheightnewvalue){
						newvalue = maxheightnewvalue;
					}
					if(newvalue > maxwidthtnewvalue){
						newvalue = maxwidthtnewvalue;
					}      


					if(maxheightnewvalue <= newvalue){


						self.heightRatio = (self.largeHeight/newvalue) / self.nzHeight; 
						if(newvalue > maxheightnewvalue){
							self.newvalueheight = maxheightnewvalue;
						}else{
							self.newvalueheight = newvalue;
						}
						self.fullheight = true;


					}
					else{



						self.heightRatio = (self.largeHeight/newvalue) / self.nzHeight; 

						if(newvalue > maxheightnewvalue){

							self.newvalueheight = maxheightnewvalue;
						}else{
							self.newvalueheight = newvalue;
						}
						self.fullheight = false;
					}




					if(maxwidthtnewvalue <= newvalue){   

						self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
						if(newvalue > maxwidthtnewvalue){

							self.newvaluewidth = maxwidthtnewvalue;
						}else{
							self.newvaluewidth = newvalue;
						}

						self.fullwidth = true;


					}
					else{  

						self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
						self.newvaluewidth = newvalue;
						self.fullwidth = false;
					}        


				} //end inner
				scrcontinue = false;

				if(self.options.zoomType == "inner"){

					if(self.nzWidth >= self.nzHeight){
						if( self.newvaluewidth <= maxwidthtnewvalue){
							scrcontinue = true;
						}
						else{

							scrcontinue = false;
							self.fullheight = true;
							self.fullwidth = true;
						}
					}
					if(self.nzHeight > self.nzWidth){     
						if( self.newvaluewidth <= maxwidthtnewvalue){
							scrcontinue = true;
						}
						else{
							scrcontinue = false;  

							self.fullheight = true;
							self.fullwidth = true;
						}
					}
				}

				if(self.options.zoomType != "inner"){
					scrcontinue = true;
				}

				if(scrcontinue){



					self.zoomLock = 0;
					self.changeZoom = true;

					//if lens height is less than image height


					if(((self.options.zoomWindowHeight)/self.heightRatio) <= self.nzHeight){


						self.currentZoomLevel = self.newvalueheight; 
						if(self.options.zoomType != "lens" && self.options.zoomType != "inner") {
							self.changeBgSize = true;

							self.zoomLens.css({height: String((self.options.zoomWindowHeight)/self.heightRatio) + 'px' }) 
						}
						if(self.options.zoomType == "lens" || self.options.zoomType == "inner") {  
							self.changeBgSize = true;  
						}	


					} 




					if((self.options.zoomWindowWidth/self.widthRatio) <= self.nzWidth){



						if(self.options.zoomType != "inner"){
							if(self.newvaluewidth > self.newvalueheight)   {
								self.currentZoomLevel = self.newvaluewidth;                 

							}
						}

						if(self.options.zoomType != "lens" && self.options.zoomType != "inner") {
							self.changeBgSize = true;

							self.zoomLens.css({width: String((self.options.zoomWindowWidth)/self.widthRatio) + 'px' })
						}
						if(self.options.zoomType == "lens" || self.options.zoomType == "inner") {  
							self.changeBgSize = true;
						}	

					}
					if(self.options.zoomType == "inner"){
						self.changeBgSize = true;  

						if(self.nzWidth > self.nzHeight){
							self.currentZoomLevel = self.newvaluewidth;
						}
						if(self.nzHeight > self.nzWidth){
							self.currentZoomLevel = self.newvaluewidth;
						}
					}

				}      //under

				//sets the boundry change, called in setWindowPos
				self.setPosition(self.currentLoc);
				//
			},
			closeAll: function(){
				if(self.zoomWindow){self.zoomWindow.hide();}
				if(self.zoomLens){self.zoomLens.hide();}
				if(self.zoomTint){self.zoomTint.hide();}
			},
			changeState: function(value){
      	var self = this;
				if(value == 'enable'){self.options.zoomEnabled = true;}
				if(value == 'disable'){self.options.zoomEnabled = false;}

			}

	};




	$.fn.elevateZoom = function( options ) {
		return this.each(function() {
			var elevate = Object.create( ElevateZoom );

			elevate.init( options, this );

			$.data( this, 'elevateZoom', elevate );

		});
	};

	$.fn.elevateZoom.options = {
			zoomActivation: "hover", // Can also be click (PLACEHOLDER FOR NEXT VERSION)
      zoomEnabled: true, //false disables zoomwindow from showing
			preloading: 1, //by default, load all the images, if 0, then only load images after activated (PLACEHOLDER FOR NEXT VERSION)
			zoomLevel: 1, //default zoom level of image
			scrollZoom: false, //allow zoom on mousewheel, true to activate
			scrollZoomIncrement: 0.1,  //steps of the scrollzoom
			minZoomLevel: false,
			maxZoomLevel: false,
			easing: false,
			easingAmount: 12,
			lensSize: 200,
			zoomWindowWidth: 400,
			zoomWindowHeight: 400,
			zoomWindowOffetx: 0,
			zoomWindowOffety: 0,
			zoomWindowPosition: 1,
			zoomWindowBgColour: "#fff",
			lensFadeIn: false,
			lensFadeOut: false,
			debug: false,
			zoomWindowFadeIn: false,
			zoomWindowFadeOut: false,
			zoomWindowAlwaysShow: false,
			zoomTintFadeIn: false,
			zoomTintFadeOut: false,
			borderSize: 0,
			showLens: true,
			borderColour: "#888",
			lensBorderSize: 1,
			lensBorderColour: "#000",
			lensShape: "square", //can be "round"
			zoomType: "window", //window is default,  also "lens" available -
			containLensZoom: false,
			lensColour: "white", //colour of the lens background
			lensOpacity: 0.4, //opacity of the lens
			lenszoom: false,
			tint: false, //enable the tinting
			tintColour: "#333", //default tint color, can be anything, red, #ccc, rgb(0,0,0)
			tintOpacity: 0.4, //opacity of the tint
			gallery: false,
			galleryActiveClass: "zoomGalleryActive",
			imageCrossfade: false,
			constrainType: false,  //width or height
			constrainSize: false,  //in pixels the dimensions you want to constrain on
			loadingIcon: false, //http://www.example.com/spinner.gif
			cursor:"default", // user should set to what they want the cursor as, if they have set a click function
			responsive:true,
			onComplete: $.noop,
      onDestroy: function() {},
			onZoomedImageLoaded: function() {},
			onImageSwap: $.noop,
			onImageSwapComplete: $.noop
	};

})( jQuery, window, document );




$(function(){

				
		$('.styled').styler();
		$(".box-scroll").mCustomScrollbar();
		$('.with-drop').click(function(){$(this).parent().find('.open-block-filter').slideToggle(), $(this).toggleClass('active'); return false;});
		
		$('.mini-img-card li a').click(function(){
            srcBig=$(this).attr('data-big');
            $(this).parents('.card-left').find('.img-card-big img').attr('src',srcBig);			
			$(this).parents('.card-left').find('.mini-img-card li.active').removeClass('active');
			$(this).parent().addClass('active');			
            return false;
        });
		
		
		$("#slider_price").slider({
		  min: 0,
		  max: 80000,
		  step:100,
		  values: [10000,40000],
		  range: true,
		  stop: function(event, ui) {
		   jQuery("input#min_cost_1").val(jQuery("#slider_price").slider("values",0));
		   jQuery("input#max_cost_1").val(jQuery("#slider_price").slider("values",1));
		  },
		  slide: function(event, ui){
		   jQuery("input#min_cost_1").val(jQuery("#slider_price").slider("values",0));
		   jQuery("input#max_cost_1").val(jQuery("#slider_price").slider("values",1));
		  }
		 });
		
		
		//initiate the plugin and pass the id of the div containing gallery images
		$("#zoom_03").elevateZoom({constrainType:"height", constrainSize:274, zoomType: "lens", containLensZoom: true, gallery:'gallery_01', cursor: 'pointer', galleryActiveClass: "active"}); 
		
		//pass the images to Fancybox
		$("#zoom_03").bind("click", function(e) {  
		  var ez =   $('#zoom_03').data('elevateZoom');	
			
		  return false;
		});
		
		$( ".fieldInputPrice" ).appendTo( ".ui-slider-range" );
		
});

var handler2 = function(){
  
  var hh = $(window).height();
  
  	/*var heightProducts = $('.list-product').height();
	$('.column-list-collection').height(heightProducts-34);*/
  
  
 }
 
 $(window).bind('load', handler2);
 $(window).bind('resize', handler2);
 
 /*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
!function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);

$('#widget').draggable();