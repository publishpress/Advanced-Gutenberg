(function ( wpI18n, wpBlocks, wpElement, wpEditor, wpComponents, wpData, lodash, wpHtmlEntities, wpDate ) {
    const { __ } = wpI18n;
    const { Component, Fragment } = wpElement;
    const { registerBlockType } = wpBlocks;
    const { InspectorControls, BlockControls } = wpEditor;
    const { PanelBody, RangeControl, ToggleControl, QueryControls, Spinner, Toolbar, Placeholder } = wpComponents;
    const { withSelect } = wpData;
    const { pickBy, isUndefined } = lodash;
    const { decodeEntities } = wpHtmlEntities;
    const { moment } = wpDate;

    const advRecentPostsBlockIcon = (
        <svg width="20" height="20" viewBox="2 2 22 22">
            <path fill="none" d="M0,0h24v24H0V0z"/>
            <rect x="13" y="7.5" width="5" height="2"/>
            <rect x="13" y="14.5" width="5" height="2"/>
            <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z"/>
            <path d="M11,6H6v5h5V6z M10,10H7V7h3V10z"/>
            <path d="M11,13H6v5h5V13z M10,17H7v-3h3V17z"/>
        </svg>
    );

    class RecentPostsEdit extends Component {
        constructor() {
            super( ...arguments );
        }

        render() {
            const { attributes, setAttributes, recentPosts, categoriesList } = this.props;
            const {
                postView,
                order,
                orderBy,
                category,
                numberOfPosts,
                columns,
                displayFeaturedImage,
                displayAuthor,
                displayDate,
                displayExcerpt,
                displayReadMore,
            } = attributes;

            const inspectorControls = (
                <InspectorControls>
                    <PanelBody title={ __( 'Block Settings' ) }>
                        <QueryControls
                            { ...{ order, orderBy } }
                            categoriesList={ categoriesList }
                            selectedCategoryId={ category }
                            numberOfItems={ numberOfPosts }
                            onOrderChange={ ( value ) => setAttributes( { order: value } ) }
                            onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
                            onCategoryChange={ ( value ) => setAttributes( { category: value !== '' ? value : undefined } ) }
                            onNumberOfItemsChange={ (value) => setAttributes( { numberOfPosts: value } ) }
                        />
                        {postView === 'grid' &&
                        <RangeControl
                            label={ __( 'Columns' ) }
                            value={ columns }
                            min={ 1 }
                            max={ 4 }
                            onChange={ (value) => setAttributes( { columns: value } ) }
                        />
                        }
                        <ToggleControl
                            label={ __( 'Display Featured Image' ) }
                            checked={ displayFeaturedImage }
                            onChange={ () => setAttributes( { displayFeaturedImage: !displayFeaturedImage } ) }
                        />
                        <ToggleControl
                            label={ __( 'Display Post Author' ) }
                            checked={ displayAuthor }
                            onChange={ () => setAttributes( { displayAuthor: !displayAuthor } ) }
                        />
                        <ToggleControl
                            label={ __( 'Display Post Date' ) }
                            checked={ displayDate }
                            onChange={ () => setAttributes( { displayDate: !displayDate } ) }
                        />
                        <ToggleControl
                            label={ __( 'Display Post Excerpt' ) }
                            checked={ displayExcerpt }
                            onChange={ () => setAttributes( { displayExcerpt: !displayExcerpt } ) }
                        />
                        <ToggleControl
                            label={ __( 'Display Read More Link' ) }
                            checked={ displayReadMore }
                            onChange={ () => setAttributes( { displayReadMore: !displayReadMore } ) }
                        />
                    </PanelBody>
                </InspectorControls>
            );

            const hasPosts = Array.isArray( recentPosts ) && recentPosts.length;

            // If no posts found we show this notice
            if (!hasPosts) {
                return (
                    <Fragment>
                        { inspectorControls }
                        <Placeholder
                            icon={ advRecentPostsBlockIcon }
                            label={ __( 'ADVGB Recent Posts Block' ) }
                        >
                            { ! Array.isArray( recentPosts ) ?
                                <Spinner /> :
                                __( 'No posts found! Try to change category or publish posts.' )
                            }
                        </Placeholder>
                    </Fragment>
                )
            }

            const postViewControls = [
                {
                    icon: 'grid-view',
                    title: __( 'Grid View' ),
                    onClick: () => setAttributes( { postView: 'grid' } ),
                    isActive: postView === 'grid',
                },
                {
                    icon: 'list-view',
                    title: __( 'List View' ),
                    onClick: () => setAttributes( { postView: 'list' } ),
                    isActive: postView === 'list',
                },
                {
                    icon: 'slides',
                    title: __( 'Slider View' ),
                    onClick: () => setAttributes( { postView: 'slider' } ),
                    isActive: postView === 'slider',
                },
            ];

            const blockClassName = [
                'advgb-recent-posts',
                postView === 'grid' && 'columns-' + columns,
                postView === 'grid' && 'grid-view',
                postView === 'list' && 'list-view',
                postView === 'slider' && 'slider-view',
            ].filter( Boolean ).join( ' ' );

            return (
                <Fragment>
                    { inspectorControls }
                    <BlockControls>
                        <Toolbar controls={ postViewControls } />
                    </BlockControls>
                    <div className={ blockClassName }>
                        {recentPosts.map( ( post, index ) => (
                            <article key={ index } className="advgb-recent-post" >
                                {displayFeaturedImage && post.featured_image_src && (
                                    <div className="advgb-post-thumbnail">
                                        <a href={ post.link } target="_blank">
                                            <img src={ post.featured_image_src } alt={ __( 'Post Image' ) } />
                                        </a>
                                    </div>
                                ) }
                                <div className={ 'advgb-post-wrapper' }>
                                    <h2 className="advgb-post-title">
                                        <a href={ post.link } target="_blank">{ decodeEntities( post.title.rendered ) }</a>
                                    </h2>
                                    <div className="advgb-post-info">
                                        {displayAuthor && (
                                            <a href={ post.author_info.author_link }
                                               target="_blank"
                                               className="advgb-post-author"
                                            >
                                                { post.author_info.display_name }
                                            </a>
                                        ) }
                                        {displayDate && (
                                            <span className="advgb-post-date" >
                                                { moment( post.date_gmt ).local().format( 'DD MMMM, Y' ) }
                                            </span>
                                        ) }
                                    </div>
                                    <div className="advgb-post-content">
                                        {displayExcerpt && (
                                            <div className="advgb-post-excerpt" dangerouslySetInnerHTML={ { __html: post.excerpt.rendered } } />
                                        ) }
                                        {displayReadMore && (
                                            <div className="advgb-post-readmore">
                                                <a href={ post.link } target="_blank">{ __( 'Read More' ) }</a>
                                            </div>
                                        ) }
                                    </div>
                                </div>
                            </article>
                        ) ) }
                    </div>
                </Fragment>
            )
        }
    }

    registerBlockType( 'advgb/recent-posts', {
        title: __( 'Recent Posts' ),
        description: __( 'Display your recent posts in slider or grid view with beautiful styles.' ),
        icon: {
            src: advRecentPostsBlockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined,
        },
        category: 'widgets',
        keywords: [ __( 'latest posts' ), __( 'posts slide' ), __( 'posts grid' ) ],
        edit: withSelect( ( select, props ) => {
            const { getEntityRecords } = select( 'core' );
            const { category, order, orderBy, numberOfPosts } = props.attributes;

            const recentPostsQuery = pickBy( {
                categories: category,
                order,
                orderby: orderBy,
                per_page: numberOfPosts,
            }, ( value ) => !isUndefined( value ) );

            const categoriesListQuery = {
                per_page: 99,
            };

            return {
                recentPosts: getEntityRecords( 'postType', 'post', recentPostsQuery ),
                categoriesList: getEntityRecords( 'taxonomy', 'category', categoriesListQuery ),
            }
        } )( RecentPostsEdit ),
        save: function () { // Render in PHP
            return null;
        },
    } )
})( wp.i18n, wp.blocks, wp.element, wp.editor, wp.components, wp.data, lodash, wp.htmlEntities, wp.date );