(function ( wpI18n, wpBlocks, wpElement, wpEditor, wpComponents ) {
    const { __ } = wpI18n;
    const { Component, Fragment } = wpElement;
    const { registerBlockType } = wpBlocks;
    const { InspectorControls, PanelColorSettings, MediaUpload } = wpEditor;
    const { PanelBody, RangeControl, ToggleControl , SelectControl, TextControl, TextareaControl, IconButton, Button, Placeholder, Tooltip } = wpComponents;
    const $ = jQuery;

    const imageSliderBlockIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 2 22 22" className="editor-block-icon">
            <path fill="none" d="M0 0h24v24H0V0z"/>
            <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM9.88 4h4.24l1.83 2H20v12H4V6h4.05"/>
            <path d="M15 11H9V8.5L5.5 12 9 15.5V13h6v2.5l3.5-3.5L15 8.5z"/>
        </svg>
    );

    class AdvImageSlider extends Component {
        constructor() {
            super( ...arguments );
            this.state = {
                currentSelected: null,
            };
        }

        updateImagesData(data) {
            const { currentSelected } = this.state;
            if (typeof currentSelected !== 'number') {
                return null;
            }

            const { attributes, setAttributes } = this.props;
            const { images } = attributes;

            const newImages = images.map( (image, index) => {
                if (index === currentSelected) {
                    image = { ...image, ...data };
                }

                return image;
            } );

            setAttributes( { images: newImages } );
        }

        render() {
            const { attributes, setAttributes, isSelected } = this.props;
            const { currentSelected } = this.state;
            const {
                images,
                actionOnClick,
                fullWidth,
                autoHeight,
                width,
                height,
                hoverColor,
                titleColor,
                textColor,
                hAlign,
                vAlign,
            } = attributes;

            if (images.length === 0) {
                return (
                    <Placeholder
                        icon={ imageSliderBlockIcon }
                        label={ __( 'Image Slider Block' ) }
                        instructions={ __( 'No images selected. Adding images to start using this block.' ) }
                    >
                        <MediaUpload
                            allowedTypes={ ['image'] }
                            value={ null }
                            multiple
                            onSelect={ (image) => {
                                const imgInsert = image.map( (img) => ( {
                                    url: img.url,
                                    id: img.id,
                                } ) );

                                setAttributes( {
                                    images: [
                                        ...images,
                                        ...imgInsert,
                                    ]
                                } )
                            } }
                            render={ ( { open } ) => (
                                <Button className="button button-large button-primary" onClick={ open }>
                                    { __( 'Add images' ) }
                                </Button>
                            ) }
                        />
                    </Placeholder>
                )
            }

            return (
                <Fragment>
                    <InspectorControls>
                        <PanelBody title={ __( 'Image Settings' ) }>
                            <SelectControl
                                label={ __( 'Action on click' ) }
                                value={ actionOnClick }
                                options={ [
                                    { label: __( 'None' ), value: '' },
                                    { label: __( 'Open image in lightbox' ), value: 'lightbox' },
                                    { label: __( 'Open custom link' ), value: 'link' },
                                ] }
                                onChange={ (value) => setAttributes( { actionOnClick: value } ) }
                            />
                            <ToggleControl
                                label={ __( 'Full width' ) }
                                checked={ fullWidth }
                                onChange={ () => setAttributes( { fullWidth: !fullWidth } ) }
                            />
                            <ToggleControl
                                label={ __( 'Auto height' ) }
                                checked={ autoHeight }
                                onChange={ () => setAttributes( { autoHeight: !autoHeight } ) }
                            />
                            {!fullWidth && (
                                <RangeControl
                                    label={ __( 'Width' ) }
                                    value={ width }
                                    onChange={ (value) => setAttributes( { width: value } ) }
                                    min={ 200 }
                                    max={ 1300 }
                                />
                            ) }
                            {!autoHeight && (
                                <RangeControl
                                    label={ __( 'Height' ) }
                                    value={ height }
                                    onChange={ (value) => setAttributes( { height: value } ) }
                                    min={ 100 }
                                    max={ 1000 }
                                />
                            ) }
                        </PanelBody>
                        <PanelColorSettings
                            title={ __( 'Color Settings' ) }
                            colorSettings={ [
                                {
                                    label: __( 'Hover Color' ),
                                    value: hoverColor,
                                    onChange: ( value ) => setAttributes( { hoverColor: value } ),
                                },
                                {
                                    label: __( 'Title Color' ),
                                    value: titleColor,
                                    onChange: ( value ) => setAttributes( { titleColor: value } ),
                                },
                                {
                                    label: __( 'Text Color' ),
                                    value: textColor,
                                    onChange: ( value ) => setAttributes( { textColor: value } ),
                                },
                            ] }
                        />
                        <PanelBody title={ __( 'Text Alignment' ) } initialOpen={false}>
                            <SelectControl
                                label={ __( 'Vertical Alignment' ) }
                                value={vAlign}
                                options={ [
                                    { label: __( 'Top' ), value: 'flex-start' },
                                    { label: __( 'Center' ), value: 'center' },
                                    { label: __( 'Bottom' ), value: 'flex-end' },
                                ] }
                                onChange={ (value) => setAttributes( { vAlign: value } ) }
                            />
                            <SelectControl
                                label={ __( 'Horizontal Alignment' ) }
                                value={hAlign}
                                options={ [
                                    { label: __( 'Left' ), value: 'flex-start' },
                                    { label: __( 'Center' ), value: 'center' },
                                    { label: __( 'Right' ), value: 'flex-end' },
                                ] }
                                onChange={ (value) => setAttributes( { hAlign: value } ) }
                            />
                        </PanelBody>
                    </InspectorControls>
                    <div className="advgb-image-slider-block">
                        <div className="advgb-image-slider">
                            {images.map( (image, index) => (
                                <div className="advgb-image-slider-item" key={index}>
                                    <img src={ image.url }
                                         className="advgb-image-slider-img"
                                         alt={ __( 'Slider image' ) }
                                         style={ {
                                             width: fullWidth ? '100%' : width,
                                             height: autoHeight ? 'auto' : height,
                                         } }
                                    />
                                    <div className="advgb-image-slider-item-info"
                                         style={ {
                                             justifyContent: vAlign,
                                             alignItems: hAlign,
                                         } }
                                    >
                                        <span className="advgb-image-slider-overlay"
                                              style={ { backgroundColor: hoverColor } }
                                        />
                                        <h4 className="advgb-image-slider-title"
                                            style={ { color: titleColor } }
                                        >
                                            { image.title }
                                        </h4>
                                        <p className="advgb-image-slider-text"
                                           style={ { color: textColor } }
                                        >
                                            { image.text }
                                        </p>
                                    </div>
                                </div>
                            ) ) }
                        </div>
                        {isSelected && (
                        <div className="advgb-image-slider-controls">
                            <div className="advgb-image-slider-control">
                                <TextControl
                                    label={ __( 'Title' ) }
                                    value={ images[currentSelected] ? images[currentSelected].title || '' : '' }
                                    onChange={ (value) => this.updateImagesData( { title: value || '' } ) }
                                />
                            </div>
                            <div className="advgb-image-slider-control">
                                <TextareaControl
                                    label={ __( 'Text' ) }
                                    value={ images[currentSelected] ? images[currentSelected].text || '' : '' }
                                    onChange={ (value) => this.updateImagesData( { text: value || '' } ) }
                                />
                            </div>
                            <div className="advgb-image-slider-control">
                                <TextControl
                                    label={ __( 'Link' ) }
                                    value={ images[currentSelected] ? images[currentSelected].link || '' : '' }
                                    onChange={ (value) => this.updateImagesData( { link: value || '' } ) }
                                />
                            </div>
                            <div className="advgb-image-slider-image-list">
                                {images.map( (image, index) => (
                                    <div className="advgb-image-slider-image-list-item" key={index}>
                                        <img src={ image.url }
                                             className="advgb-image-slider-image-list-img"
                                             onClick={ () => this.setState( { currentSelected: index } ) }
                                        />
                                        <Tooltip text={ __( 'Remove image' ) }>
                                            <IconButton
                                                className="advgb-image-slider-image-list-item-remove"
                                                icon="no"
                                                onClick={ () => {
                                                    if (index === currentSelected) this.setState( { currentSelected: null } );
                                                    setAttributes( { images: images.filter( (img, idx) => idx !== index ) } )
                                                } }
                                            />
                                        </Tooltip>
                                    </div>
                                ) ) }
                                <div className="advgb-image-slider-add-item">
                                    <MediaUpload
                                        allowedTypes={ ['image'] }
                                        value={ currentSelected }
                                        onSelect={ (image) => setAttributes( {
                                            images: [...images, { id: image.id, url: image.url, } ],
                                        } ) }
                                        render={ ( { open } ) => (
                                            <IconButton
                                                label={ __( 'Add image' ) }
                                                icon="plus"
                                                onClick={ open }
                                            />
                                        ) }
                                    />
                                </div>
                            </div>
                        </div>
                        ) }
                    </div>
                </Fragment>
            )
        }
    }

    registerBlockType( 'advgb/image-slider', {
        title: __( 'Image Slider' ),
        description: __( 'Display your images in a slider.' ),
        icon: {
            src: imageSliderBlockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined,
        },
        category: 'formatting',
        keywords: [ __( 'slide' ), __( 'gallery' ), __( 'photos' ) ],
        attributes: {
            images: {
                type: 'array',
                default: [],
            },
            actionOnClick: {
                type: 'string',
            },
            fullWidth: {
                type: 'boolean',
                default: true,
            },
            autoHeight: {
                type: 'boolean',
                default: true,
            },
            width: {
                type: 'number',
                default: 700,
            },
            height: {
                type: 'number',
                default: 500,
            },
            hoverColor: {
                type: 'string',
            },
            titleColor: {
                type: 'string',
            },
            textColor: {
                type: 'string',
            },
            vAlign: {
                type: 'string',
                default: 'center',
            },
            hAlign: {
                type: 'string',
                default: 'center',
            },
            changed: {
                type: 'boolean',
                default: false,
            }
        },
        edit: AdvImageSlider,
        save: function ( { attributes } ) {
            return <div>123</div>;
        },
    } );
})( wp.i18n, wp.blocks, wp.element, wp.editor, wp.components );