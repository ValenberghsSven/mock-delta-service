import mu from 'mu';
const targetGraph = "http://mu.semte.ch/application";

const getDocumentNamesForAgendaitem = async (uuid) => {

  const query = `
  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
  PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX dossier: <https://data.vlaanderen.be/ns/dossier#>
  PREFIX pav:  <http://purl.org/pav/>
  
  SELECT ?documentContainer ?documentName WHERE {
    GRAPH <${targetGraph}> { 
      ?agendaitem mu:uuid "${uuid}" ;
        ext:bevatAgendapuntDocumentversie ?documents .
      ?documentContainer dossier:collectie.bestaatUit ?documents .
      ?documents dct:title ?documentName .
      FILTER NOT EXISTS { ?hasNewerVersion pav:previousVersion ?documents . }
  } }  GROUP BY ?documentContainer
  `

  const data = await mu.query(query).catch(err => {
    console.error(err)
  });
  return data.results.bindings.map((binding) => {
    return binding.documentName.value;
  });
}

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
  getDocumentNamesForAgendaitem
};
