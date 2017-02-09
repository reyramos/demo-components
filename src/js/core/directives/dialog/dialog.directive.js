/**
 * Created by reyra on 1/4/2017.
 */


module.exports = function (app) {

	'use strict';
	function toPix(v) {
		return v.toFixed(3) + 'px';
	}

	app
	/**
	 * @ngdoc directive
	 * @name eqDialog
	 * @module eq.components.dialog
	 *
	 * @requires ngController provided by $eqDialog
	 *
	 * @restrict E
	 *
	 * @description
	 * `<eq-dialog>` - The dialog's template must be inside this element.
	 *
	 * ## CSS
	 * - `.eq-dialog` - class that sets min-height, and width of content dialog
	 *
	 *
	 * @usage
	 * ### Dialog template
	 * <hljs lang="html">
	 * <eq-dialog aria-label="List dialog">
	 *   <div>
	 *       <!-- YOUR HTML CONTENT FOR DIALOG-->
	 *   </div>
	 * </eq-dialog>
	 * </hljs>
	 */
		.component('eqDialog', {
			require: {
				ngController: '^'
			},
			controller: ['$scope', '$element', function ($scope, $element) {

				var _this = this,
					container = angular.element("<eq-dialog-container></eq-dialog-container>"),
					ctrl, parent, TimeOutElement, event;

				this.$onInit = function () {
					ctrl = angular.isDefined(_this.ngController.parent) ? _this.ngController : $element.data('$eqCompiler');
					parent = angular.isDefined(ctrl.parent) ? ctrl.parent : document.body;
					$element.addClass('eq-dialog');

					if (ctrl.target) event = ctrl.target.originalEvent || ctrl.target;
				};

				this.$postLink = function () {
					$element.css({
						position: 'absolute',
						visibility: 'hidden'
					});


					TimeOutElement = setTimeout(function (e) {
						container.append($element);
						angular.element(parent).append(container);

						var pos = isBound();
						$element.css({
							visibility: 'visible',
							top: toPix(pos.top),
							left: toPix(pos.left)
						});
						OnTop(e);
					}, 1);
				};


				function isBound() {
					if (!event)return position($element);
					var elePos = getPosition(event.target),
						wW = parent.clientWidth,
						pW = event.target.clientWidth,
						pH = event.target.clientHeight,
						ulW = $element[0].clientWidth;


					var out = elePos.left + ulW > wW;
					var offset = 0,
						result = out ? (wW - (wW - elePos.left + ulW) + pW) + offset : elePos.left - offset;

					return {top: elePos.top + pH, left: result};

				}

				function getPosition(ele) {
					var rect = null;
					var pT = null;

					try {
						rect = ele.getBoundingClientRect();
						pT = parent.getBoundingClientRect();
					} catch (e) {
						rect = ele[0].getBoundingClientRect();
						pT = parent[0].getBoundingClientRect();
					}


					var rT = rect.top + window.pageYOffset - pT.top,
						rL = rect.left + window.pageXOffset - pT.left;

					return {top: rT, left: rL};
				}

				/**
				 * TODO: remove this function
				 * @param ele
				 * @returns {{left: number, top: number}}
				 */
				function position(ele) {
					var eh = ele[0].clientHeight,
						ew = ele[0].clientWidth,
						w = parent.clientWidth,
						h = parent.clientHeight,
						left = (w - ew) / 2,
						top = (h - eh) / 2 + window.pageYOffset;


					return {
						left: left,
						top: top
					};
				}

				function OnTop(e) {
					var parent = angular.element($element[0].parentNode),
						ch = parent.children(),
						index = -1;

					angular.forEach(ch, function (c, i) {
						if ($element.is(c)) index = i;
					});

					if (index !== ch.length - 1) parent.append(ch[index]);

				}


				this.$onDestroy = function () {
					clearTimeout(TimeOutElement);
					container.remove();
				}
			}]
		});
};
