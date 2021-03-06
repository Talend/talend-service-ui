/*
 * Copyright 2016 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/epam/ReportPortal
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */
define(function (require) {
    'use strict';

    var $ = require('jquery');
    var Epoxy = require('backbone-epoxy');
    var SingletonMarkdownObject = require('components/markdown/SingletonMarkdownObject');

    var MainBreadcrumbsComponent = Epoxy.View.extend({
        className: 'markdown-viewer',
        events: {
        },

        initialize: function (options) {
            this.simpleMDE = new SingletonMarkdownObject();
            this.update(options.text);
        },
        update: function (text) {
            var html;
            var doc = document.createElement('div');
            var self = this;
            var newText;
            var re = /<(.*?)\|(.*?)>/g;
            var subst = '<a href="$1" target="_blank">$2</a>';

            if (text) {

                text = text.replace(re, subst);

                newText = text.indentSpases();
                console.log(newText);

                newText = newText.replace(/:heavy_check_mark:/g, '<img src="../../../../img/icons/heavy_check_mark.png" style="width:16px;height=16px;" />');
                newText = newText.replace(/:heavy_exclamation_mark:/g, '<img src="../../../../img/icons/heavy_exclamation_mark.png" style="width:16px;height=16px;" />');


                html = this.simpleMDE.markdown(newText);
                doc.innerHTML = html;
                $('img', doc).each(function () {
                    this.onload = function () {
                        self.trigger('load');
                    };
                });
                $('a', doc).each(function () {
                    $(this).attr({ target: '_blank' });
                });
                $('code', doc).each(function () {
                    $(this).html($(this).text());
                });
                this.$el.html(doc.innerHTML);
            } else {
                this.$el.html('');
            }
        }
    });


    return MainBreadcrumbsComponent;
});
