function add_EEA_settings() {
    //Accordion settings
    $('#facetview_trees')
        .addClass('eea-accordion-panels collapsed-by-default non-exclusive');
    $('.facetview_filter').addClass('eea-accordion-panel');
    $('.facetview_showtree').addClass('notoc eea-icon-right-container');
    $('.facetview_arrow_right').addClass('eea-icon eea-icon-right');
    //Remove results button
    $('.facetview_howmany').hide();
    //Remove facetview help
    $('.facetview_learnmore').hide();
    //Remove share button
    $('.facetview_sharesave').hide();
    //replace share icon
    $('.icon-share-alt').addClass('eea-icon eea-icon-share-alt');
    $('.eea-icon-share-alt').removeClass('icon-share-alt');
    $('.share-icon').addClass('eea-icon eea-icon-share-alt');
    //replace remove icon
    $('.icon-remove').addClass('eea-icon eea-icon-times');
    $('.eea-icon-times').removeClass('icon-remove');
    //change pagination
    $('.pagination').addClass('paginator listingBar');
    //Change top pagination
    var results = $($('.pagination').find('.active')[0]).text(); //x-y of z
    var split = results.split(' of ');
    if (split.length === 2) {
      var html = [
        '<span>Results ',
        split[0],
        ' of <strong>',
        split[1],
        '</strong></span>'
        ].join('');
    $('.top-pagination').html(html);
    } else {
      $('.top-pagination').html('');
    }
}

function buildFacets(mapping_facets){
    var range_facets = [];
    var geo_facets = [];
    var facets = [];
    for (var i = 0; i < mapping_facets.length; i++){
        var facet = mapping_facets[i];
        if (facet.type === 'range'){
            range_facets.push(field_base + facet.name);
            facet.size = 10000000;
        }
        if (facet.type === 'geo'){
            geo_facets.push(field_base + facet.name);
            facet.size = 2;
        }
        var facet_obj = {
            field: field_base + facet.name,
            display: facet.title,
            size: facet.size,
            order: facet.order,
            facet_display_options: facet.facet_display_options,
        };
        if (facet.operator !== undefined){
            facet_obj.operator = facet.operator
        }
        facets.push(facet_obj);

    }
    return {range_facets: range_facets, geo_facets: geo_facets, facets: facets};
}

function buildListing(mapping_listing){
    var result_display = [];
    for (var i = 0; i < mapping_listing.length; i++){
        var listing = mapping_listing[i];
        var display = {
            pre : '<td>',
            field : field_base + listing.name,
            post: '</td>'
        }
        if (listing.display !== undefined){
            display = listing.display;
            display.field = field_base + display.field;
        }
        result_display.push(display);
    }
    return result_display;
}

function buildHeaders(mapping_listing){
    var headers = "";
    for (var i = 0; i < mapping_listing.length; i++){
        var listing = mapping_listing[i];
        if ((listing.title !== "") && (listing.title !== undefined)){
            var header_width = ""
            if ((listing.width !== "") && (listing.width !== undefined)) {
                header_width = "style  = 'width:" + listing.width + "'";
            }
            headers += "<th  title='" + listing.title + "'><div "+ header_width+" >" + listing.title + "</div></th>";
        }
    }
    return headers;
}

function addHeaders(element){
    var headers = buildHeaders(eea_mapping.listing);

    $(element).append("<thead><tr>" + headers +  "</tr></thead>");

    $.each($(element).find("th div"), function(idx, header){
        while (true){
            var visibleWidth = $(header).width();
            var visibleHeight = $(header).height();
            var scrollWidth = $(header)[0].scrollWdith;
            var scrollHeight = $(header)[0].scrollHeight;

            if ((scrollHeight > visibleHeight) || (scrollWidth > visibleWidth)){
                $(header).text($(header).text().substr(0, $(header).text().length - 4) + "...")
                continue;
            }
            else {
                break;
            }
        }
    });
}

function eea_facetview(element, options){
    var mapping_facets = eea_mapping.facets;
    var mapping_listing = eea_mapping.listing;

    facets = buildFacets(mapping_facets);
    listing = buildListing(mapping_listing);
    options.facets = facets.facets;
    options.rangefacets = facets.range_facets;
    options.geofacets = facets.geo_facets;

    options.result_display = [listing];
    $('.facet-view-simple').facetview(options);
}
