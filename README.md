# lazy-loading-service
Service for getting specific datasets to reduce loading

Some of the views of the Kaleidos frontend are very load heavy.
This service will help shorten the loading times and reduce the strain on the backend by providing endpoints to get specific sets of data.

Calling "/documentNames" with a uuid of a model that has documents will return a list of document names.
each name is the name of last version of a document of a document-container.
