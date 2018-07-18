'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function (wpI18n, wpHooks, wpEditor, wpComponents) {
    var addFilter = wpHooks.addFilter;
    var __ = wpI18n.__;
    var InspectorControls = wpEditor.InspectorControls,
        ColorPalette = wpEditor.ColorPalette;
    var SelectControl = wpComponents.SelectControl,
        PanelColor = wpComponents.PanelColor,
        PanelBody = wpComponents.PanelBody,
        RangeControl = wpComponents.RangeControl;

    // Register extra attributes to separator blocks

    addFilter('blocks.registerBlockType', 'advgb/registerExtraSeparatorAttrs', function (settings) {
        if (settings.name === 'core/separator') {
            settings.attributes = _extends(settings.attributes, {
                borderColor: {
                    type: 'string'
                },
                borderSize: {
                    type: 'number'
                },
                borderStyle: {
                    type: 'string'
                },
                borderWidth: {
                    type: 'number'
                }
            });
        }

        return settings;
    });

    // Add option to select styles for separator
    addFilter('editor.BlockEdit', 'advgb/customSeparatorStyles', function (BlockEdit) {
        return function (props) {
            if (props.name === "core/separator") {
                var isSelected = props.isSelected,
                    attributes = props.attributes,
                    setAttributes = props.setAttributes,
                    id = props.id;
                var borderColor = attributes.borderColor,
                    borderSize = attributes.borderSize,
                    borderStyle = attributes.borderStyle,
                    borderWidth = attributes.borderWidth;


                return [React.createElement(BlockEdit, _extends({ key: 'block-edit-custom-separator' }, props)), isSelected && React.createElement(
                    InspectorControls,
                    { key: 'inspector-custom-separator' },
                    React.createElement(
                        PanelBody,
                        { title: __('Separator Settings') },
                        React.createElement(
                            PanelColor,
                            { title: __('Color'), colorValue: borderColor, initialOpen: false },
                            React.createElement(ColorPalette, {
                                value: borderColor,
                                onChange: function onChange(value) {
                                    return setAttributes({ borderColor: value });
                                }
                            })
                        ),
                        React.createElement(SelectControl, {
                            label: __('Styles'),
                            value: borderStyle,
                            options: [{ label: __('Solid'), value: 'solid' }, { label: __('Dotted'), value: 'dotted' }, { label: __('Dashed'), value: 'dashed' }, { label: __('Double'), value: 'double' }],
                            onChange: function onChange(value) {
                                return setAttributes({ borderStyle: value });
                            }
                        }),
                        React.createElement(RangeControl, {
                            label: __('Thick'),
                            value: borderWidth,
                            min: 1,
                            max: 20,
                            onChange: function onChange(value) {
                                return setAttributes({ borderWidth: value });
                            }
                        }),
                        React.createElement(RangeControl, {
                            label: __('Width'),
                            value: borderSize,
                            min: 50,
                            max: 1000,
                            onChange: function onChange(value) {
                                return setAttributes({ borderSize: value });
                            }
                        })
                    )
                ), React.createElement(
                    'style',
                    { key: 'custom-separator-styles' },
                    '#block-' + id + ' hr {\n                        border-bottom-color: ' + borderColor + ';\n                        border-bottom-style: ' + borderStyle + ';\n                        border-bottom-width: ' + borderWidth + 'px;\n                        max-width: ' + borderSize + 'px;\n                    }'
                )];
            }

            return React.createElement(BlockEdit, props);
        };
    });

    // Apply custom styles on front-end
    addFilter('blocks.getSaveContent.extraProps', 'advgb/saveSeparatorStyles', function (extraProps, blockType, attributes) {
        if (blockType.name === 'core/separator') {
            var borderColor = attributes.borderColor,
                borderSize = attributes.borderSize,
                borderStyle = attributes.borderStyle,
                borderWidth = attributes.borderWidth;


            extraProps = _extends(extraProps, {
                style: {
                    borderBottomColor: borderColor,
                    borderBottomWidth: borderWidth ? borderWidth + 'px' : undefined,
                    borderBottomStyle: borderStyle,
                    maxWidth: borderSize ? borderSize + 'px' : undefined
                }
            });
        }

        return extraProps;
    });
})(wp.i18n, wp.hooks, wp.editor, wp.components);