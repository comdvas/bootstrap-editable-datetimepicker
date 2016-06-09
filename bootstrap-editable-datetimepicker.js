/**
 Bootstrap-datetimepicker.
 Description and examples: http://eonasdan.github.io/bootstrap-datetimepicker/

 @class datetime2
 @extends abstractinput
 @final
 @example
 **/
(function ($) {
    "use strict";

    var Date = function (options) {
        this.init('datetime2', options, Date.defaults);
        this.initPicker(options, Date.defaults);
    };

    $.fn.editableutils.inherit(Date, $.fn.editabletypes.abstractinput);

    $.extend(Date.prototype, {
        dateValue: null,
        initPicker: function (options, defaults) {
            //'format' is set directly from settings or data-* attributes

            //try parse datetimepicker config defined as json string in data-datetimepicker
            options.datetimepicker = $.fn.editableutils.tryParseJson(options.datetimepicker, true);

            //overriding datetimepicker config (as by default jQuery extend() is not recursive)
            this.options.datetimepicker = $.extend({}, defaults.datetimepicker, options.datetimepicker, {
                format: this.options.format
            });

        },

        render: function () {
            var self = this;
            this.$input.datetimepicker(this.options.datetimepicker);

            //"clear" link
            if (this.options.clear) {
                this.$clear = $('<a href="#"></a>').html(this.options.clear).click($.proxy(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.clear();
                }, this));

                this.$tpl.parent().append($('<div class="editable-clear">').append(this.$clear));
            }
        },

        value2html: function (value, element) {
            var text = this.value2str(value);
            Date.superclass.value2html.call(this, text, element);
        },

        html2value: function (html) {
            return this.parseDate(html, this.options.format);
        },

        value2str: function (value) {
        	return value ? moment(value, this.options.format).format(this.options.format) : '';
        },

        str2value: function (str) {
            return this.parseDate(str, this.options.format);
        },

        value2submit: function (value) {
            return this.value2str(value);
        },

        value2input: function (value) {
        	if (!value) {
        		value = moment();
        	}
        	var new_date = moment(value, this.options.format);
            this.$input.data("DateTimePicker").date(new_date);
        },

        input2value: function () {
        	var date = this.$input.data("DateTimePicker").date();
        	return date ? date.format(this.options.format) : '';
        },

        activate: function () {
        },

        clear: function () {
            this.$input.data("DateTimePicker").clear();
        },

        autosubmit: function () {
        	// not implemented yet
        },

        /*
         For incorrect date bootstrap-datepicker returns current date that is not suitable
         for datefield.
         This function returns null for incorrect date.
         */
        parseDate: function (str, format) {
            var date = null, formattedBack;
            if (str) {
            	date = moment(str, format).format(format);
                if (typeof str === 'string') {
                    formattedBack = moment(date, format).format(format);
                    if (str !== formattedBack) {
                        date = null;
                    }
                }
            }
            return date;
            
        }

    });

    Date.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        /**
         @property tpl
         @default <div></div>
         **/
        tpl: '<div class="editable-date well"></div>',
        
        /**
         Format used for sending value to server. Also applied when converting date from <code>data-value</code> attribute.<br>
         more info: http://momentjs.com/docs/#/displaying/format/

         @property format
         @type string
         @default YYYY-MM-DD
         **/
        format: 'YYYY-MM-DD',
        /**
         Configuration of datetimepicker.
         Full list of options: http://eonasdan.github.io/bootstrap-datetimepicker/Options/

         @property datetimepicker
         @type object
         @default {
            inline: true,
        }
         **/
        datetimepicker: {
            inline: true,
        },
        /**
         Text shown as clear date button.
         If <code>false</code> clear button will not be rendered.

         @property clear
         @type boolean|string
         @default 'x clear'
         **/
        clear: '&times; clear'
    });

    $.fn.editabletypes.datetime2 = Date;

}(window.jQuery));
