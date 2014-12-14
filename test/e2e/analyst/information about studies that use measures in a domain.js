'use strict';

var domains = require('../../domains')
var studies = require('../../studies')
var utils = require('../../utils')

describe("Lindsey's Project", function(){

  beforeEach(function() {
    browser.get('')
  });

  var studies_with = {} //studies_with[measure]
  for (var study in studies){
    var measures = studies[study]['measures']
    for (var i=0; i<measures.length; i++){
      var measure = measures[i]
      if (measure in studies_with){
        studies_with[measure].push(study)
      }else{
        studies_with[measure] = [study]
      }
    }
  }

  var domain_elements = element.all(
    by.repeater('(domain_name, measures) in domains'))

  it('enumerates all domains for selection', function(){
    var domain_tab_names = domain_elements.map(function(tab_element){
      var tab_name = tab_element.element(by.binding('domain_name')).getText()
      return tab_name
    })
    domain_tab_names.then(function(domain_tab_names){
      domain_tab_names.sort()
      expect(domain_tab_names).toEqual(Object.keys(domains).sort())
    })
  })

  it('lists all measures in a selected domain', function(){
    //expect each domain element to have correct list of measures
  });

  it('lists all studies in a selected measure', function(){
    //expect each measure to have correct list of studies
  });

});
