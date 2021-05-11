import mu from 'mu';
const targetGraph = "http://mu.semte.ch/application";

const getDocumentNamesForAgendaitem = async (uuid) => {
  const query = `
  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
  PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX dossier: <https://data.vlaanderen.be/ns/dossier#>
  PREFIX pav:  <http://purl.org/pav/>
  PREFIX besluitvorming:  <http://data.vlaanderen.be/ns/besluitvorming#>
  
  SELECT ?documentContainer ?documentName WHERE {
    GRAPH <${targetGraph}> { 
      ?agendaitem mu:uuid "${uuid}" ;
        besluitvorming:geagendeerdStuk ?documents .
      ?documentContainer dossier:collectie.bestaatUit ?documents .
      ?documents dct:title ?documentName .
      FILTER NOT EXISTS { ?hasNewerVersion pav:previousVersion ?documents . }
  } }  GROUP BY ?documentContainer
  `

  let data = await mu.query(query);
  return data.results.bindings.map((binding) => {
    return binding.documentName.value;
  });
}

const getFileExtensions = async () => {
  const query = `
  PREFIX nfo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
  PREFIX  dbpedia:  <http://dbpedia.org/ontology/>
  SELECT DISTINCT ?extension WHERE {
    GRAPH <${targetGraph}> { 
        ?file a nfo:FileDataObject.
        ?file dbpedia:fileExtension ?extension.
    }
  }`;

  const data = await mu.query(query);
  return data.results.bindings.map((binding) => {
    return binding.extension.value;
  });
};

const parseSparqlResults = (data) => {
    const vars = data.head.vars;
    return data.results.bindings.map(binding => {
        let obj = {};
        vars.forEach(varKey => {
            if (binding[varKey]) {
                obj[varKey] = binding[varKey].value;
            }
        });
        return obj;
    })
};

module.exports = {
  getDocumentNamesForAgendaitem,
  getFileExtensions,
};
