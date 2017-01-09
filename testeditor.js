'use strict';

$(document).ready(function () {

    var createStandoff = function () {

        // create the default mapping in Knora
        var fd = new FormData();

        var params = {
            resource_id: "http://data.knora.org/a-thing",
            property_id: "http://www.knora.org/ontology/anything#hasText",
            project_id: "http://data.knora.org/projects/anything",
            mapping_id: "http://data.knora.org/projects/anything/mappings/StandardMapping" // put the IRI of the mapping to be used here after running createMapping.sh
        };

        var content = CKEDITOR.instances.editor1.getData();

        var xml = '<?xml version="1.0" encoding="UTF-8"?><text documentType="ckeditor">\n' + content + "</text>"

        console.log(xml);

        fd.append('json', JSON.stringify(params));
        fd.append('xml', xml);

        function make_base_auth(user, password) {
            var tok = "anything-user" + ':' + "test";
            var hash = btoa(tok);
            return 'Basic ' + hash;
        }


        var readTextValue = function (id) {

            $.get('http://localhost:3333/v1/standoff/' + encodeURIComponent(id), function (data) {
                console.log("result: ");
                console.log(data.xml);
            }, 'json');

        };

        $.ajax({
            url: "http://localhost:3333/v1/standoff",
            data: fd,
            cache: false,
            processData: false,
            contentType: false,
            type: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', make_base_auth('anything-user', 'test'));
            },
            success: function (data, status, req) {

                console.log(data);


                readTextValue(data.id);


            },
            error: function (req, status, error) {
                console.log(req.responseJSON);
            }
        });


    };

    // specify allowed elements, attributes, and classes
    // this must conform to the mapping to be used
    var filter = ' p em strong strike u sub sup; a[!href](salsah-link)';

    var config = {
        //extraPlugins: 'footnotes',
        extraPlugins: 'sourcearea,removeformat',
        language: 'en', // customize language
        allowedContent: filter,
        pasteFilter: filter,
        on: {
            instanceReady: function (event) {

                event.editor.setData('<p>This is a very stupid test</p>');

            }
        },
        //mathJaxLib : '//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS_HTML',
        //toolbar: [[ 'Source' ], [ 'footnotes' ]]
        /*toolbar: [
         ['Source', '-', 'NewPage', 'Preview', '-', 'Templates'],
         ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
         '/', ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat', 'Link', 'Unlink']
         ]*/
        // configuration for toolbar buttons
        toolbar: [
            ['Source', 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat', 'Link', 'Unlink', 'footnotes']
        ]
    };

    // Replace the <textarea id="editor1"> with a CKEditor
    // instance, using default configuration.
    CKEDITOR.replace('editor1', config);


    var button = $("<button>").text("Send").on("click", function () {


        createStandoff();

    }).appendTo($("div"));

});
